import React, { useState } from 'react'

import logo from '../assets/logo.svg'
import api from '../services/api'

export default function Login({ history }) {
   const [username, setUser] = useState('')

   async function handleSubmit(e) {
      e.preventDefault()
      const response = await api.post('/devs', { username })
      const { _id } = response.data
      return history.push(`/dev/${_id}`)
   }

   return (
      <section className="d-flex justify-content-center align-items-center flex-column mx-auto" style={{ height: "100%" }}>
         <div style={{ maxWidth: 350 }} className="w-100">
            <form className="form-group rounded py-5" onSubmit={handleSubmit}>
               <div className="d-flex justify-content-center mb-5">
                  <img src={logo} alt="Tindev" className="img-fluid" />
               </div>
               <div className="col mb-3">
                  <label>Usuário</label>
                  <input type="text" value={username} onChange={e => setUser(e.target.value)} className="form-control" placeholder="Insira o seu usuário do GitHub" />
               </div>
               <div className="col mb-3">
                  <button type="submit" className="btn btn-block text-white font-weight-bold" style={{ background: "#df4723" }} disabled={!username ? true : false}>
                     Enviar
                  </button>
               </div>
            </form>
         </div>
      </section>
   )
}