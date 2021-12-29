/*
-> general
clicked on poi
tried a password right/wrong
solved a puzzle
entered a room
clicked on inventory item
asked for a clue

-> custom events

*/

const clicked_on_poi = (socket, poiId)=>{
    console.log(`clicked-on-poi: ${socket.id}`, poiId)
}

const tried_password = (socket, poiId, password)=>{
    console.log(`tried_password: ${socket.id}`, poiId, password)
}

module.exports = { clicked_on_poi, tried_password }