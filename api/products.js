const { supabaseAdmin } = require('./_supabase')

module.exports = async (req, res) => {
  try{
    const supabase = supabaseAdmin()
    if(req.method === 'GET'){
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true })
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      const body = req.body
      const payload = { name: body.name, sku: body.sku || null, stock: body.stock || 0, price: body.price || null }
      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if(error) throw error
      return res.status(201).json(data)
    }

    if(req.method === 'PUT'){
      const id = req.url.split('/').pop()
      const body = req.body
      const { data, error } = await supabase.from('products').update({ name: body.name, sku: body.sku || null, stock: body.stock || 0, price: body.price || null }).eq('id', id).select().single()
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'DELETE'){
      const id = req.url.split('/').pop()
      const { error } = await supabase.from('products').delete().eq('id', id)
      if(error) throw error
      return res.status(200).json({ success: true })
    }

    res.status(405).send('Method Not Allowed')
  }catch(err){ res.status(500).send(err.message) }
}
