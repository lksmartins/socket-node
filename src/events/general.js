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

module.exports = {

    clicked_on_poi(socket, poiId){
        //console.log(`clicked-on-poi: ${socket.id}`, poiId)
        PeopleAnalytics.store( { 
            action_type: 'clicked-on-poi', 
            ref_id: poiId, 
            action: 'example', 
            player_id: '1', 
            room_id: '1' 
        } )
    },

    tried_password(socket, poiId, password){
        //console.log(`tried_password: ${socket.id}`, poiId, password)
        PeopleAnalytics.store( { 
            action_type: 'tried-password', 
            ref_id: poiId, 
            action: password, 
            player_id: '1', 
            room_id: '1' 
        } )
    }

}