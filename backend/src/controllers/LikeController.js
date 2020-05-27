const Dev = require('../models/Dev')

module.exports = {
   async store(req, res) {
      console.log(req.io)
      const { user } = req.headers
      const { devId } = req.params

      const loggedDev = await Dev.findById(user) //ID do dev logado
      const targetDev = await Dev.findById(devId) //ID do dev que receberá o like

      if (!targetDev) { //se o usuário não existe
         return res.status(400).json({ error: 'Dev não existe' })
      }

      if (targetDev.likes.includes(user)) { //se o dev que receber o like já tem o like alheio, 'DEU MATCH'
         const loggedSocket = req.connectedUsers[user]
         const targetSocket = req.connectedUsers[devId]

         if (loggedSocket) {
            req.io.to(loggedSocket).emit('match', targetDev) //avisando o usuário logado que deu match no dev que deu like
         }

         if (targetSocket) {
            req.io.to(targetSocket).emit('match', loggedDev) //avisando o usuário que recebeu o like que deu match com o dev logado
         }
      }
      loggedDev.likes.push(targetDev._id) //adicionando o ID do Dev logado na coluna likes

      await loggedDev.save() //salvando no banco

      return res.json(loggedDev) //retornar os dados do dev logado
   }
}