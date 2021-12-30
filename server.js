require('dotenv').config()

const express = require('express')
const http = require("http")
const app = express()

const server = http.createServer(app)

const options = {
    cors: {
        origin: [
            "*",
            "http://localhost",
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

process.on('unhandledRejection', (err) => { 
    console.error(err);
    process.exit(1);
})

require('./src/database')

io.on('connection', async (socket)=>{

    console.log(`socket conectado: ${socket.id}`)

    const {clicked_on_poi,tried_password,correct_password,entered_room,opened_inventory} = require('./src/events/general')

    socket.on('clicked-on-poi', async function (poiId) {
        clicked_on_poi(socket, poiId)
    })

    socket.on('tried-password', async function (poiId, password) {
        tried_password(socket, poiId, password)
    })

    socket.on('correct-password', async function (poiId, password) {
        correct_password(socket, poiId, password)
    })

    socket.on('entered-room', async function (roomName) {
        entered_room(socket, roomName)
    })

    socket.on('opened-inventory', async function (itemId) {
        opened_inventory(socket, itemId)
    })    

    socket.on('disconnecting', async function () {

        console.log('')
        console.log(`socket desconectado: ${socket.id}`)
  
    })

})

server.listen(5000)