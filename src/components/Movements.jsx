import React, { useEffect, useState } from 'react'
import { apiGet } from '../db'
import { format } from 'date-fns'

export default function Movements(){
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [productId, setProductId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(()=>{ loadProducts(); loadMovements() }, [])

  async function loadProducts(){ try{ setProducts(await apiGet('products')) }catch(e){ alert(e.message) } }
  async function loadMovements(){
    try{
      const qs = new URLSearchParams()
      if(productId) qs.set('productId', productId)
      if(from) qs.set('from', from)
      if(to) qs.set('to', to)
      const list = await apiGet('movements?' + qs.toString())
      setMovements(list)
    }catch(e){ alert(e.message) }
  }

  return (
    <div>
      <h3>Histórico de Movimentações</h3>
      <div className="filter-row">
        <select className="input" value={productId} onChange={e=>setProductId(e.target.value)}>
          <option value="">Todos os produtos</option>
          {products.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <button className="btn" onClick={loadMovements}>Filtrar</button>
      </div>

      <div className="list">
        {movements.length === 0 && <div className="small">Nenhuma movimentação encontrada</div>}
        {movements.map(m=> (
          <div key={m.id} className="list-item">
            <div>
              <div style={{fontWeight:600}}>{m.product_name} {m.type === 'IN' ? '(Entrada)' : '(Saída)'}</div>
              <div className="small">Qtd: {m.qty} • Vendedor: {m.seller_name} • CPF: {m.cpf_cliente || '-'} </div>
            </div>
            <div className="small">{format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
