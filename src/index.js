
const GroupService = require('./services/GroupService')
const RoomService = require('./services/RoomService')

const groupId = 2

async function getGroup(groupId){
    let result;

    try {
        result = await GroupService.findById(groupId)
    } catch (error) {
        handleError(error)
    }

    return setupRooms(result.dataValues)
}
getGroup(groupId)

function setupRooms( group ){

    // check if there are sessions/rooms with this groupId
    let rooms = getRooms(groupId)

    // if dont create all the rooms
    if( !rooms ){
        
    }

}

async function getRooms( groupId ){
    let result;
    try {
        result = await RoomService.findByGroupId(groupId)
    } catch (error) {
        handleError(error)
    }

    //return setupRooms(result.dataValues)
    return result.dataValues
}


function handleError(error){
    console.log(error)
}