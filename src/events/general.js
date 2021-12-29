const PeopleAnalytics = require('../services/PeopleAnalyticsService')

/*
-> general
clicked on poi
tried a password right/wrong
solved a puzzle
entered a room
clicked on inventory item
asked for a clue
*/

const storeAction = (actionType, refId, action='')=>{
    PeopleAnalytics.store( { 
        action_type: actionType, 
        ref_id: refId, 
        action: action, 
        player_id: '1', 
        room_id: '1' 
    } )
}

module.exports = {

    clicked_on_poi(socket, poiId){
        //console.log(`clicked-on-poi: ${socket.id}`, poiId)
        storeAction( 'clicked-on-poi', poiId )
    },

    tried_password(socket, poiId, password){
        //console.log(`tried_password: ${socket.id}`, poiId, password)
        storeAction( 'tried-password', poiId, password )
    },

    correct_password(socket, poiId, password){
        //console.log(`correct_password: ${socket.id}`, poiId, password)
        storeAction( 'correct-password', poiId, password )
    },

    entered_room(socket, roomName){
        //console.log(`correct_password: ${socket.id}`, poiId, password)
        storeAction( 'entered-room', roomName )
    },

}