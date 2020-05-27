const axios = require('axios')

const Dev = require('../models/Dev')

module.exports = {
   async index(req, res) {
      const { user } = req.headers //pegar o ID do usuário no headers
      const loggedDev = await Dev.findById(user) //procura o usuário logado pelo ID
      if (!user) {
         return res.status(400).json({ error: 'Usuário não logado' })
      }
      const users = await Dev.find({ //procura todos os usuários da tabela
         $and: [ //aplicará todos os filtros de uma única vez - não deve ser o próprio usuário, e não deve conter likes e dislikes anteriores
            { _id: { $ne: user } }, //diferente do usuário logado
            { _id: { $nin: loggedDev.likes } }, //que o ID não esteja dentro da lista de likes
            { _id: { $nin: loggedDev.dislikes } }, //que o ID não esteja dentro da lista de dislikes
         ]
      })
      return res.json(users) //retornar os usuários que o usuário logado não deu like ou dislike
   },

   async store(req, res) {
      try {
         const { username } = req.body //pegar o username digitado
         const userExists = await Dev.findOne({ user: username }) //identificar se o usuário já existe
         if (userExists) { //se ele existe, retorna o próprio usuário sem cadastrá-lo
            return res.status(200).json(userExists) //retornar o usuário já cadastrado
         }
         const response = await axios.get(`https://api.github.com/users/${username}`) //requisição para o GitHub {
         const { name, bio, avatar_url: avatar } = response.data //pegar nome, bio e avatar_url
         if (name === null) { //se o nome do usuário for nulo, atribui o username a ele
            const dev = await Dev.create({ //cadastrar o usuário de acordo com as informações requisitadas da API
               name: username, //nome do usuário
               user: username, //username do usuário
               bio, //biografia do usuário
               avatar //avatar_url do usuário
            })
            return res.status(201).json(dev) //retornar o dev cadastrado
         } else {
            const dev = await Dev.create({ //cadastrar o usuário de acordo com as informações requisitadas da API
               name, //nome do usuário
               user: username, //username do usuário
               bio, //biografia do usuário
               avatar //avatar_url do usuário
            })
            return res.status(201).json(dev) //retornar o dev cadastrado
         }
      } catch (error) {
         return res.status(400).json({ error })
      }
   }
}