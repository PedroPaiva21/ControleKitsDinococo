const { supabaseAdmin } = require('./_supabase')

module.exports = async (req, res) => {
  try{
    const supabase = supabaseAdmin()
    if(req.method === 'GET'){
      const qs = new URL(req.url, 'http://localhost')
      const productId = qs.searchParams.get('productId')
      const from = qs.searchParams.get('from')
      const to = qs.searchParams.get('to')
      let query = supabase.from('movements').select('*')
      if(productId) query = query.eq('product_id', productId)
      if(from) query = query.gte('timestamp', from)
      if(to) query = query.lte('timestamp', to)
      const { data, error } = await query.order('timestamp', { ascending: false })
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      // used to register movement and update product stock
      const body = req.body
      const productId = body.productId
      const delta = Number(body.delta || 0)
      const cpfCliente = body.cpfCliente || null
      const sellerName = body.sellerName || null
      if(!productId) return res.status(400).send('productId required')

      // fetch product
      const { data: prod, error: prodErr } = await supabase.from('products').select('*').eq('id', productId).single()
      if(prodErr) throw prodErr
      const newStock = Math.max(0, (prod.stock || 0) + delta)

      // update product
      const { error: updErr } = await supabase.from('products').update({ stock: newStock }).eq('id', productId)
      if(updErr) throw updErr

      const movement = {
        product_id: productId,
        product_name: prod.name,
        type: delta >= 0 ? 'IN' : 'OUT',
        qty: Math.abs(delta),
        timestamp: new Date().toISOString(),
        cpf_cliente: cpfCliente,
        seller_name: sellerName
      }
      const { data: mv, error: mvErr } = await supabase.from('movements').insert(movement).select().single()
      if(mvErr) throw mvErr
      return res.status(201).json(mv)
    }

    res.status(405).send('Method Not Allowed')
  }catch(err){ res.status(500).send(err.message) }
}
