const GroupService = require('../services/GroupService')
const RoomService = require('../services/RoomService')

module.exports = {

    getRooms(groupId){

        let groupPromise = GroupService.findGroupRooms(groupId).then( group => {
            
            console.log('')
            console.log(' -> GroupLoader -> getRooms -> inside then() ')

            if( !group.rooms.length || group.rooms.length < group.players/group.room_size ){

                let min = group.rooms.length ? group.rooms.length : 0
                let max = Math.ceil( group.players/group.room_size )
    
                console.log('min, max:', min, max)
                
                RoomService.createMultipleRooms(min, max, groupId).then(rooms => {
    
                    group.rooms = rooms
                    console.log('rooms created', group)
                    return group
    
                })
                
            }
            else{
                console.log('returning rooms')
                return group
            }

        })

        return groupPromise
        
    }
}