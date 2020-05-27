//Quando há muitas rotas, utilizar um arquivo isolado
const express = require('express')

const DevController = require('./controllers/DevController')
const LikeController = require('./controllers/LikeController')
const DislikeController = require('./controllers/DislikeController')

const routes = express.Router()

routes.get('/devs', DevController.index) //listar os devs que não receberam likes ou dislikes do dev logado
routes.post('/devs', DevController.store) //cadastrar um dev
routes.post('/devs/:devId/likes', LikeController.store) //dar like no dev
routes.post('/devs/:devId/dislikes', DislikeController.store) //dar dislike no dev

module.exports = routes