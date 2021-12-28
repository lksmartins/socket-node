const GroupService = require('../services/GroupService')

module.exports = {

    async index(req, res){
        
        const groups = await Group.findAll()

        return res.json(groups)

    },

    async findById(req, res){
        
        const groupId = req.params.groupId ? req.params.groupId : 2

        try{
            const group = await GroupService.findById(groupId)
            return res.json(group)
        }
        catch(e){
            return res.status(400).json({ status: 400, message: e.message });
        }

    },

    async store(req, res){
        /*
        const {name, email, password} = req.body

        const user = await Session.create( { name, email, password } )

        return res.json(user)
        */
        return res.json('test')

    }

}