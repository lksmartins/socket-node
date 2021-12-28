require('dotenv').config()

const express = require('express')
const http = require("http")
const app = express()

const server = http.createServer(app)

const options = {
    cors: {
        origin: [
          "http://escapelive.com.br",
          "https://escapelive.com.br",
          "ws://escapelive.com.br",
          "wss://escapelive.com.br",
          "https://escapelive.chavemestra.net", 
          "ws://escapelive.chavemestra.net", 
          "https://desafiosap.com.br", 
          "ws://desafiosap.com.br",
          "https://chave-mestra.net",
          "ws://chave-mestra.net",
          "http://escapelive-env-1.eba-ajxupiff.us-east-1.elasticbeanstalk.com",
          "ws://escapelive-env-1.eba-ajxupiff.us-east-1.elasticbeanstalk.com",
          "pixelspace.app.br",
          "http://pixelspace.app.br",
          "https://pixelspace.app.br",
          "ws://pixelspace.app.br",
          "wss://pixelspace.app.br",
          "https://dev.escapelive.com.br",
          "http://dev.escapelive.com.br",
          "ws://dev.escapelive.com.br",
          "wss://dev.escapelive.com.br"
      ],
      credentials: true,
      methods: ["GET", "POST"]
    }
}

const io = require('socket.io')(server, options)

require('./src/database')

const groupId = 29
const GroupService = require('./src/services/GroupService')
const RoomService = require('./src/services/RoomService')
const groupLoader = require('./src/loaders/GroupLoader')

let infos = []
let group = {}
let rooms = []
let socketsToIgnoreRemovePlayer = []

process.on('unhandledRejection', (err) => { 
    console.error(err);
    process.exit(1);
})

/*
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get('/sala/:hash', async (req, res) => {
    
    let hashParam = req.params.hash
    let thisRoomReq = await RoomService.findRoomByHash( hashParam )

    group = thisRoomReq.group

    res.render('pre-game.ejs',{
        hash: hashParam,
        room: JSON.stringify( thisRoomReq ),
        group: JSON.stringify( thisRoomReq.group )
    })
    
})

app.get('/adm', async (req, res) => {

    let groupReq = await groupLoader.getRooms(groupId)

    group = groupReq.toJSON()
    
    res.render('adm.ejs',{
        group: JSON.stringify( groupReq )
    })
})

app.use('/', async (req, res) => {

    let thisGroupReq = await groupLoader.getRooms(groupId)

    group = thisGroupReq

    res.render('index.ejs',{
        group: JSON.stringify( thisGroupReq )
    })
    
})
*/

function getRoom(hash){
    for( room of rooms ){
        if( room.hash == hash ){
            return room
        }
    }
}

function updateRoom(hash, thisRoom){
    for( room of rooms ){
        if( room.hash == hash ){
            room = thisRoom
        }
    }
}

async function checkRoom( hash ){

    var room = await RoomService.findRoomByHash( hash )

    if( room != null ){
        return room
    }
    else{
        return null
    }

}

async function checkPlayers( io, socket, state ){

    console.log('--')
    console.log( socket.handshake )
    console.log('--')

    var origin
    var roomHash

    if( socket.handshake.headers.referer == undefined ){
        console.log(socket.handshake.headers.origin)
        if( socket.handshake.query.roomHash == undefined ){
            origin = socket.handshake.headers.origin
        }
        else{
            origin = socket.handshake.query.roomHash
        }
    }
    else{
        console.log('referer',socket.handshake.headers.referer)
        origin = socket.handshake.headers.referer
    }

    var room
    roomHash = origin.split("/")
    roomHash = roomHash[roomHash.length-1]

    //check se adiciona a sala
    if( origin.includes('/sala/') ){
        console.log('É SALA')

        var ioRooms = io.sockets.adapter.rooms
        var thisIoRoom = ioRooms.get(roomHash)

        console.log(ioRooms, thisIoRoom)

        room = await checkRoom(roomHash)

        if( thisIoRoom != undefined ){

            if( state == 'in' ){

                console.log('')
                console.log('-> in')

                // não entra
                if( thisIoRoom.size >= room.group.room_size ){
                    socket.emit('leaveRoom')
                    console.log('-> NOT Joining room:', roomHash, thisIoRoom.size )
                }
                else{
                    socket.join(roomHash)
                    ioRooms = io.sockets.adapter.rooms
                    thisIoRoom = ioRooms.get(roomHash)
                    console.log('-> Joining room:', roomHash, thisIoRoom.size )

                    room = await RoomService.updateRoomPlayers( roomHash, thisIoRoom.size )
                    io.to(roomHash).emit('updatingRoom', room)
                }
            }
            else if( state == 'out' ){

                console.log('')
                console.log('-> out')
                
                socket.leave(roomHash)

                ioRooms = io.sockets.adapter.rooms
                thisIoRoom = ioRooms.get(roomHash)

                if( thisIoRoom==undefined || thisIoRoom.size == undefined ){
                    room = await RoomService.updateRoomPlayers( roomHash, '0' )   
                }
                else{
                    room = await RoomService.updateRoomPlayers( roomHash, thisIoRoom.size )
                }

                io.to(roomHash).emit('updatingRoom', room)

            }
            
        }
        else{

            if( state == 'in' ){

                socket.join(roomHash)
                console.log('-> FIRST to Join room:', roomHash )

                room = await RoomService.updateRoomPlayers( roomHash, '1' )
                io.to(roomHash).emit('updatingRoom', room)

            }
        }

        console.log('Players:', room.players)

        ioRooms = io.sockets.adapter.rooms
        thisIoRoom = ioRooms.get(roomHash)

        console.log('-- io rooms --')
        console.log(ioRooms)

        // para atualize o lobby
        var rooms_group = await GroupService.findGroupRooms(groupId)
        io.emit('sendingRooms', rooms_group)

    }
    else{
        console.log('Ñ É SALA')
    }

}

async function checkTimer( io, socket ){



}

io.on('connection', async (socket)=>{

    console.log(`socket conectado: ${socket.id}`)

    //await checkPlayers( io, socket, 'in' )

    async function updateRoomPlayers( thisHash, action ){

        console.log('')
        console.log('-> updateRoomPlayers')
        console.log(thisHash, action)

        var room = await RoomService.findRoomByHash( thisHash )

        if( action == 'add' ){
            if( room.players >= room.group.room_size ){
                socket.emit('leaveRoom', room)
                socketsToIgnoreRemovePlayer.push(socket.id)
                return room
            }
            room.players+=1
        }
        if( action == 'remove' ){
            if( room.players == 0 ){
                return room
            }
            room.players-=1
        }

        console.log('  -> inside roomThen', room.players)

        // se chegou nesse ponto o banco deve ser atualizado com o novo numero de jogadores
        //return room

        var response = await RoomService.updateRoomPlayers( thisHash, room.players )

        return response

    }

    async function updatingRoom( thisHash, action ){
    
        console.log('-> updatingRoom -- before')
    
        var room = await updateRoomPlayers( thisHash, action )

        console.log('-> updatingRoom -- after')
        console.log(room.players)

        // trying to update group
    
        io.to(thisHash).emit('updatingRoom', room)

        // atualiza grupo
        io.emit('sendingRooms', room.group)
    
    }

    async function updatingGroup( group_id, time ){

        console.log('')
        console.log('->updatingGroup')
        console.log(group.time_to_start)

        const thisGroup = await GroupService.updateTime( group_id, time )
        group.time_to_start = thisGroup.time_to_start

        console.log(group.time_to_start)

        io.emit('updatingGroup',group)

    }

    socket.on('updateTimeStart', (data) => {

        console.log('updateTimeStart', data)
        updatingGroup( data.group_id, data.time )

    })

    socket.on('addInfoToSocket', (data) => {

        console.log('addInfoToSocket', data)

        infos[socket.id] = data
        rooms.push(data)

        socket.join(data.hash)

    })

    socket.on('checkVacancy', (room) => {

        console.log('')
        console.log('-> checkVacancy', room)

        /*
        if( room.players >= room.group.room_size ){
            socket.emit('leaveRoom')
        }
        else{
            console.log('-> Joining room:', room.hash)
            socket.join(room.hash)
            updatingRoom( room.hash, 'add' )
        }*/
        
        
    })

    socket.on('userTyping', (data) => {

        console.log('')
        console.log('-> userTyping', data)
        console.log(io.sockets.adapter.rooms)

        socket.to(data.hash).emit('userTyping',data)
        
    })

    socket.on('userDoneTyping', async (data) => {

        console.log('')
        console.log('-> userDoneTyping', data)

        await RoomService.updateName( data.hash, data.value )

        socket.to(data.hash).emit('userDoneTyping',data)
        
    })

    socket.on('updatingGroup', (data) => {

        console.log('')
        console.log('-> updatingGroup', data)

        // for the lobby
        io.emit('sendingRooms', data)
        
    })

    /*
    socket.on('disconnect', async function () {

        console.log('')
        console.log(`socket desconectado: ${socket.id}`)

        await checkPlayers( io, socket, 'out' )
  
    })
    */

    socket.on('disconnecting', async function () {

        console.log('')
        console.log(`socket desconectado: ${socket.id}`)

        //await checkPlayers( io, socket, 'out' )
  
    })

})

server.listen(3000)