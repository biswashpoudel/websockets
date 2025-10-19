//Importing websocket from npm

const websocket = require("ws");

const wss = new websocket.Server({port: 8000})

//event handler

wss.on("connection", function(socket){
    console.log("User connected! ")

    socket.on("message", (e)=>{

        if(e.toString() === "ping"){
            console.log(e.toString())
            socket.send("pong")
        }
    })
})

//Again commit