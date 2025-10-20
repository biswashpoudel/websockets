const websocket = require("ws")
const wss =  new websocket.Server({port:8000})

let allSockets = [] //socket1, socket2, socket 3

wss.on("connection", function(socket){
    console.log("User connected")
    allSockets.push(socket)
    socket.on("message", (message)=>{
       for(let i=0;i<allSockets.length; i++){
        let s = allSockets[i]
        s.send(message.toString())
       }
    })
})