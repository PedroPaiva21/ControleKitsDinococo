import React, { useEffect, useState } from 'react'
import { apiGet, apiDelete, apiPost } from '../db'
import ProductForm from './ProductForm'

export default function Products({ session }){
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    try{ const all = await apiGet('products'); setProducts(all) }catch(err){ alert(err.message) }
  }

  function openNew(){ setEditing({}) }
  function openEdit(p){ setEditing(p) }

  async function remove(p){
    if (!confirm(`Excluir ${p.name}?`)) return
    try{ await apiDelete(`products/${p.id}`); await load() }catch(err){ alert(err.message) }
  }

  async function onChangeStock(p, isEntry){
    const input = prompt('Quantidade:', '1')
    const q = parseInt(input || '0') || 0
    if (q <= 0) return
    const delta = isEntry ? q : -q
    try{
      await apiPost('movements', { productId: p.id, delta, cpfCliente: session.cpf, sellerName: session.seller })
      await load()
      alert((isEntry ? 'Entrada' : 'Saída') + ' registrada')
    }catch(err){ alert(err.message) }
  }

  async function onSaved(){ setEditing(null); await load() }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Produtos</h3>
        <div>
          <button className="btn" onClick={openNew}>Adicionar</button>
        </div>
      </div>

      <div className="list">
        {products.length === 0 && <div className="small">Nenhum produto. Clique em Adicionar.</div>}
        {products.map(p=> (
          <div key={p.id} className="list-item">
            <div>
              <div style={{fontWeight:600}}>{p.name}</div>
              <div className="small">Estoque: {p.stock || 0} {p.sku ? '• SKU: '+p.sku : ''}</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn ghost" onClick={()=>onChangeStock(p,false)}>- Saída</button>
              <button className="btn" onClick={()=>onChangeStock(p,true)}>+ Entrada</button>
              <button className="btn ghost" onClick={()=>openEdit(p)}>Editar</button>
              <button className="btn ghost" onClick={()=>remove(p)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProductForm product={editing} onClose={()=>setEditing(null)} onSaved={onSaved} />}
    </div>
  )
}
