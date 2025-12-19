import React, { useState } from 'react'
import { apiPost, apiPut } from '../db'

export default function ProductForm({ product, onClose, onSaved }){
  const [name, setName] = useState(product?.name || '')
  const [sku, setSku] = useState(product?.sku || '')
  const [stock, setStock] = useState(product?.stock != null ? product.stock : 0)
  const [price, setPrice] = useState(product?.price != null ? product.price : '')

  async function save(){
    if (!name.trim()) return alert('Informe o nome')
    const p = { name: name.trim(), sku: sku.trim() || undefined, stock: Number(stock) || 0, price: price ? Number(price) : undefined }
    try{
      if (product && product.id) await apiPut(`products/${product.id}`, p)
      else await apiPost('products', p)
      onSaved && onSaved()
    }catch(err){ alert(err.message) }
  }

  return (
    <div style={{marginTop:12}}>
      <div className="card">
        <h4>{product && product.id ? 'Editar' : 'Novo'} produto</h4>
        <div className="field"><input className="input" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="field"><input className="input" placeholder="SKU (opcional)" value={sku} onChange={e=>setSku(e.target.value)} /></div>
        <div className="field"><input className="input" placeholder="Estoque inicial" type="number" value={stock} onChange={e=>setStock(e.target.value)} /></div>
        <div className="field"><input className="input" placeholder="Preço (opcional)" type="number" value={price} onChange={e=>setPrice(e.target.value)} /></div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={save}>Salvar</button>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
