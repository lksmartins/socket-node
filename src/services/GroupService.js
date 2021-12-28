const Group = require('../models/Group')
var moment = require('moment-timezone')

module.exports = {

    async findById(id) {

        try {
            var group = await Group.findOne({ where: { id: id } })
            return group
        } catch (e) {
            // Log Errors
            throw Error('Error on getting group by ID')
        }
    },

    async findGroupRooms(group_id) {

        try {
            const group = await Group.findByPk(group_id, {
                include: { association: 'rooms' }
            })
            return group
        } catch (e) {
            // Log Errors
            throw Error('Error on getting rooms by group ID')
        }
    },

    async updateTime( group_id, time ) {

        console.log( 'GroupService - updateTime', group_id, time )

        function addMinutes(date, minutes) {
            var dateTime = new Date(date.getTime() + minutes*60000);
            return moment(dateTime).tz("America/Sao_Paulo").format();
        }

        try {
            var group = await Group.findByPk(group_id)

            var now = new Date()
            var time_to_start = addMinutes(now, time)
            var time_to_end_minutes = parseInt(time) + 65
            console.log('time_to_end_minutes',time_to_end_minutes)
            var time_to_end = addMinutes(now, time_to_end_minutes)

            console.log('dateTime',time_to_start)
            group.time_to_start = time_to_start
            group.time_to_end = time_to_end

            await group.save()
            await group.reload()
            return group
        } catch (e) {
            // Log Errors
            return null
        }
    },

    async getMaxPlayerSize(group_id) {

        try {
            const group = await Group.findOne(group_id, {
                include: { association: 'rooms' }
            })
            return group.room_size
        } catch (e) {
            // Log Errors
            return null
        }
    },

}

    