const crypto = require('crypto')
var Room = require('../models/Room')

module.exports = {

    async findByGroupId( id ) {

        try {
            var rooms = await Room.findAll({ where: { group_id: id } })
            return rooms
        } catch (e) {
            // Log Errors
            return null
        }
    },

    async createRoom( obj ) {

        const { hash, title, group_id } = obj

        try {
            const room = await Room.create( { hash, title, group_id } )
            room.hash = crypto.createHash('sha1').update(room.id.toString()).digest('hex')
            room.title = `Sala ${room.id.toString()}`
            await room.save()
            await room.reload()
            return room
        } catch (e) {
            // Log Errors
            throw Error('Error on creating Room')
        }
    },

    async createMultipleRooms( min, max, group_id ) {

        try {
            let rooms = []
            for ( let i=min; i<max; i++ ) {
                const createdRoom = await this.createRoom( {group_id: group_id} ) // change to bulkCreate
                rooms.push(createdRoom.dataValues)
            }
            return rooms
        } catch (e) {
            // Log Errors
            throw Error('Error on creating Multiple Rooms')
        }
    },
    

    async updateName( hash, name ) {

        console.log( 'RoomService - updateName', hash, name )

        try {
            var room = await this.findRoomByHash( hash )
            room.name = name
            await room.save()
            await room.reload()
            return room
        } catch (e) {
            // Log Errors
            return null
        }
    },

    async updateRoomPlayers( hash, players ) {

        console.log('')
        console.log('--> RoomService - updateRoomPlayers', hash, players )

        try {
            var room = await this.findRoomByHash( hash )
            room.players = players
            await room.save()
            await room.reload()
            return room
        }
        catch (e) {
            // Log Errors
            return null
        }
    },

    addPlayer( hash ) {

        console.log('')
        console.log( '-> RoomService - addPlayer', hash )

        try {

            var roomThen = this.findRoomByHash( hash ).then( room => {

                if( room.players >= room.group.room_size ){
                    return room
                }
                room.players = room.players+1
                room.save().then(value => {
                    value.reload().then(value => {
                        return value
                    })
                })

            })

            return roomThen

        }
        catch (e) {
            // Log Errors
            return null
        }
    },

    removePlayer( hash ) {

        console.log('')
        console.log( '-> RoomService - removePlayer', hash )

        try {
            var roomThen = this.findRoomByHash( hash ).then( room => {

                if( room.players <= 0 ){
                    return room
                }
                room.players = room.players-1
                room.save().then(value => {
                    value.reload().then(value => {
                        return value
                    })
                })

            })

            return roomThen
            
        } 
        catch (e) {
            // Log Errors
            return null
        }
    },

    async findRoomByHash( hash ) {

        console.log('')
        console.log( '-> RoomService - findRoomByHash', hash )

        try {
            var room = await Room.findOne({ 

                where: { hash: hash },
                include: { association: 'group' }

            })

            return room
            
        } catch (e) {
            // Log Errors
            return null
        }
    },

}