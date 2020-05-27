import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'

import api from '../services/api'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsmatch from '../assets/itsamatch.png'

export default function Main({ match }) {
   const [users, setUser] = useState([])
   const [matchDev, setMatchDev] = useState(null)

   useEffect(() => {
      async function loadUsers() {
         const response = await api.get('/devs', {
            headers: { user: match.params.id }
         })
         setUser(response.data)
      }
      loadUsers()
   }, [match.params.id])

   useEffect(() => {
      const socket = io('http://localhost:8080', {
         query: { user: match.params.id }
      })

      socket.on('match', dev => setMatchDev(dev))
   }, [match.params.id])

   async function handleLike(id) {
      await api.post(`/devs/${id}/likes`, null, {
         headers: { user: match.params.id }
      })
      setUser(users.filter(res => res._id !== id))
   }

   async function handleDisike(id) {
      await api.post(`/devs/${id}/dislikes`, null, {
         headers: { user: match.params.id }
      })
      setUser(users.filter(res => res._id !== id))
   }

   return (
      <section className="container mt-3">
         <div className="p-3">
            <Link to="/">
               <div className="d-flex justify-content-center">
                  <img src={logo} alt="Tindev" style={{ maxWidth: "100%" }} className="w-25" />
               </div>
            </Link>
            <hr />
            <div className="col mt-5 main">
               {users.length > 0 ? (
                  <ul className="mx-auto">
                     {users.map(res => (
                        <li className="text-center d-flex flex-column" key={res._id}>
                           <img src={res.avatar} alt={res.name} className="img-fluid w-100" />
                           <footer className="text-left">
                              <strong>{res.name}</strong>
                              <p className="mt-2">{res.bio}</p>
                           </footer>

                           <div className="mt-3">
                              <button type="button" className="btn btn-white" onClick={() => handleDisike(res._id)}>
                                 <img src={dislike} alt="Dislike" />
                              </button>
                              <button type="button" className="btn btn-white" onClick={() => handleLike(res._id)}>
                                 <img src={like} alt="Like" />
                              </button>
                           </div>
                        </li>
                     ))}
                  </ul>
               ) :
                  <h1 className="text-center font-weight-bold mt-5">Acabou!!</h1>
               }
            </div>
            {matchDev && (
               <div className="match">
                  <img src={itsmatch} alt="It's a Match" />
                  <img src={matchDev.avatar} alt="Avatar" className="avatar" />
                  <strong className="text-white">{matchDev.name}</strong>
                  <p className="mt-2">{matchDev.bio}</p>

                  <button type="button" className="btn font-weight-bold mt-3 text-white" onClick={() => setMatchDev(null)}>
                     FECHAR
                  </button>
               </div>
            )}
         </div>
      </section>
   )
}