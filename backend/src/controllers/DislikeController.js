const Dev = require('../models/Dev')

module.exports = {
   async store(req, res) {
      const { user } = req.headers
      const { devId } = req.params

      const loggedDev = await Dev.findById(user) //ID do dev logado
      const targetDev = await Dev.findById(devId) //ID do dev que receberá o dislike

      if (!targetDev) { //se o usuário não existe
         return res.status(400).json({ error: 'Dev não existe' })
      }

      loggedDev.dislikes.push(targetDev._id) //adicionando o ID do Dev logado na coluna dislikes

      await loggedDev.save() //salvando no banco

      return res.json(loggedDev) //retornar os dados do dev logado
   }
}