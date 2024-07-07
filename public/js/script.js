const socket =io();
const login =document.querySelector('.login');
const chatApplication=document.querySelector('.chat-application');
document.querySelector('.login-btn').addEventListener('click', (ev)=>{
    ev.preventDefault()
    let username = document.querySelector('.username').value;
   
    if(username.length>0){
        socket.emit('newUser',{
            socketId: socket.id,
            username: username

        })
    }
})

socket.on("userAdded", ({msg,username,userMap,clients})=>{
    
    login.style.display = 'none';
    chatApplication.style.display = 'block';
    document.querySelector('.current-user').innerHTML = username;
    let activeUsers =document.querySelector('.active-users');
    activeUsers.innerHTML = '';
    
    clients.forEach(client =>{
       
        
        if(client.id!=socket.id){
            
            let activeUser = document.createElement('div');
            activeUser.classList.add('active-user');
            
            activeUser.innerText = client.name;
            activeUsers.appendChild(activeUser);

        }
    })    

        
});


document.querySelector('.send-button').addEventListener('click', (ev)=>{
    ev.preventDefault()
    let messageInput = document.querySelector('.message-input');
    let message = messageInput.value;
    if(message.length>0){
        messageInput.value=""
        socket.emit('newMessage',{
        socketId: socket.id,
        message: message
    })
    }
    
});

socket.on("messageReceved",({message,socketId,username})=>{
    let chats=document.querySelector('.chats')
    let chat =document.createElement('div');
    chat.classList.add('chat');
    let chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message');
    
    // messageDiv.classList.add('message-div');
    
    if(socketId===socket.id){
        chatMessage.innerText=`${message}`;
        // chat.classList.add('right-chat');
        chatMessage.classList.add('my-chat');
    }
    else{
        chatMessage.innerText=`${username} ${message}`;
        // chat.classList.add('left-chat');
        chatMessage.classList.add('another-chat');
    }
    chat.appendChild(chatMessage);
    chats.appendChild(chat);
})


socket.on("activeusers",(clients) => {
    
    let activeUsers =document.querySelector('.active-users');
    activeUsers.innerHTML = '';
    
    clients.forEach(client =>{
       
        
        if(client.id!=socket.id){
            
            let activeUser = document.createElement('div');
            activeUser.classList.add('active-user');
            
            activeUser.innerText = client.name;
            activeUsers.appendChild(activeUser);

        }
    })
})

socket.on("usersupdated",async (clients)=>{
    try{
        let activeUsers =document.querySelector('.active-users');
        activeUsers.innerHTML = '';
        
        clients.forEach((client) =>{
        
          
            if(client.id!=socket.id){
                
                let activeUser = document.createElement('div');
                activeUser.classList.add('active-user');
                
                activeUser.innerText = client.name;
                activeUsers.appendChild(activeUser);
            }     
        })
    }
    catch(err){
        console.log(err)
    }
           
})