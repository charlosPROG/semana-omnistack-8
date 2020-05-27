const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const porta = 8080 || 3333
const urlConnection = 'mongodb+srv://OmniStack:omnistack@cluster0-xo99n.mongodb.net/omnistack8?retryWrites=true&w=majority' //url do banco de dados

const connectedUsers = {}

io.on('connection', socket => {
   const { user } = socket.handshake.query
   connectedUsers[user] = socket.id
})
mongoose.connect(urlConnection, { useNewUrlParser: true, useUnifiedTopology: true }) //conectar ao banco de dados

app.use((req, res, next) => {
   req.io = io
   req.connectedUsers = connectedUsers
   return next()
})
app.use(cors()) //permitir a utilização da API no ReactJS
app.use(express.json()) //pedir para que o express entenda que estou utilizando JSON
app.use(routes) //para que o meu arquivo utilize as rotas
server.listen(porta, () => console.log(`Servidor na porta ${porta}`))