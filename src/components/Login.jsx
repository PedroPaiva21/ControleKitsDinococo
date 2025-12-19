import React, { useState } from 'react'

export default function Login({ onContinue }){
  const [cpf, setCpf] = useState('')
  const [seller, setSeller] = useState('')

  function submit(){
    if (!seller.trim()) return alert('Digite o nome do vendedor')
    onContinue({ cpf: cpf.trim(), seller: seller.trim() })
  }

  return (
    <div>
      <h3>Iniciar sessão</h3>
      <div className="field">
        <input className="input" placeholder="CPF do cliente (opcional)" value={cpf} onChange={e=>setCpf(e.target.value)} />
      </div>
      <div className="field">
        <input className="input" placeholder="Nome do vendedor" value={seller} onChange={e=>setSeller(e.target.value)} />
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="btn" onClick={submit}>Continuar</button>
      </div>
    </div>
  )
}
