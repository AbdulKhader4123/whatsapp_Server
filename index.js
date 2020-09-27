require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.options('*', cors())
app.use(function (req, res, next) {
const Group = require('./models/Group');

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const debug = require('debug')('app:server')

//make connection to the DB
require('./Utilities/db.connection')


const UserRouter = require('./routes/UserRoutes')
const chatRouter = require('./routes/chatRoutes')

app.use('/api/user',UserRouter)
app.use('/api/chat',chatRouter)

const chatMessage = require('./models/message');
var clients=[];


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);;

 server.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});

io.on('connection', (socket) => {
  console.log('new connection made')

  socket.on('message', async (data) => {
    let client;
    if(data.IsGroup){
      const groups = await Group.findOne({groupId:data.recvId});

       client = clients.filter(x => groups.members.includes(x.number));
    }
    else{
      client=clients.find((client) => (client.number === data.recvId))

    }
    

    try{
    const newmessage = new chatMessage(data);
    let message=await newmessage.save();
    if(client){
      if(data.IsGroup){
        client.forEach(element => {
          if(element.number!=data.sender){
            io.to(element.socketId).emit('message', {message:message,socketId:element.socketId});
          }
        });
      }
      else{
        io.to(client.socketId).emit('message', {message:message,socketId:client.socketId});
      }
      }
    }
    catch(e){
      console.log(e)
    }
  })

  socket.on('storeClientInfo',(data)=>{
     var clientInfo = new Object();
     clientInfo.number=data.number;
     clientInfo.socketId=data.socketId;
     for (var i = clients.length - 1; i >= 0; --i) {

      if (clients[i].number == data.number) {
        clients.splice(i,1);
      }
    }
     clients.push(clientInfo);
  });

});
