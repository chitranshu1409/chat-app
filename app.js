const path = require('path');
const express = require('express');
const app = express();
const {createServer} = require('http');
const {Server} = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const PORT = 4444;

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//emit: se event ko send krte hai
//on : se event ko listen krte hai


let userMap={}
io.on("connection", (socket) => {
    socket.on("newUser",async ({socketId,username})=>{
        try{
            
            userMap[socketId]=username;
            let clients=[];
         
            let sockets =await io.fetchSockets();
            sockets.forEach((e)=>{
                if(userMap[e.id]){
                    clients.push({id:e.id,name:userMap[e.id]})
                }
                
            })
            
      
            socket.emit("userAdded",{msg:"user added succesfully",
                username:userMap[socketId],
                clients

            })
            socket.broadcast.emit("activeusers",clients)
        
        
        }
        catch(err){
            console.log(err)
        }
        
    })
    socket.on('newMessage',({socketId,message})=>{
        io.emit("messageReceved",{message,socketId:socket.id,username:userMap[socketId]})
    })   
    
    
    socket.on("disconnect",async ()=>{
        let sockets =await io.fetchSockets();
        let newUserMap = {};
        let clients = [];
        sockets.forEach((e)=>{
            if(userMap[e.id]){
                newUserMap[e.id]=userMap[e.id]
              
                
                clients.push({id:e.id,name:newUserMap[e.id]})
                
            }
        })    
        userMap=newUserMap;    
        
        io.emit("usersupdated",clients)
    })
});

httpServer.listen(PORT, () => {
    console.log(`http://localhost:` + PORT);
});