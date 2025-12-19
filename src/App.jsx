import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Products from './components/Products'
import Movements from './components/Movements'

export default function App(){
  const [session, setSession] = useState(null) // { cpf, seller }
  const [route, setRoute] = useState('products')

  useEffect(()=>{
    const s = localStorage.getItem('session')
    if(s) setSession(JSON.parse(s))
  }, [])

  function onContinue(s){
    setSession(s)
    localStorage.setItem('session', JSON.stringify(s))
  }

  function logout(){
    setSession(null)
    localStorage.removeItem('session')
    setRoute('products')
  }

  if (!session) return <div className="app"><div className="card"><Login onContinue={onContinue} /></div></div>

  return (
    <div className="app">
      <div className="header">
        <div>
          <h2>Controle de Estoque</h2>
          <div className="small">Vendedor: {session.seller} {session.cpf ? `• CPF: ${session.cpf}` : ''}</div>
        </div>
        <div>
          <button className="btn" onClick={()=>setRoute('products')}>Produtos</button>
          <button className="btn ghost" style={{marginLeft:8}} onClick={()=>setRoute('movements')}>Histórico</button>
          <button className="btn ghost" style={{marginLeft:8}} onClick={logout}>Sair</button>
        </div>
      </div>

      <div className="card">
        {route === 'products' && <Products session={session} />}
        {route === 'movements' && <Movements session={session} />}
      </div>
    </div>
  )
}
