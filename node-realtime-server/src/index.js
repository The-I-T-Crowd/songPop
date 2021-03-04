const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const bodyParser = require("body-parser");
const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: true,
  origins: ['*']
});

// BOT setup
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;
const CHANNEL_ID_VOICE = process.env.CHANNEL_ID_VOICE;
const CHANNEL_ID_TEXT = process.env.CHANNEL_ID_TEXT;
let voiceChannel;
let textChannel;

bot.login(TOKEN);

bot.on('ready', () => {
  voiceChannel = bot.channels.filter(channel => channel.name === CHANNEL_ID_VOICE).values().next().value;
  textChannel = bot.channels.filter(channel => channel.name === CHANNEL_ID_TEXT).values().next().value;

  // textChannel.send('hi')
  muteAllPlayers(false);
  console.info(`Logged in as ${bot.user.tag}!`);
  createServer();
});

function muteAllPlayers(shouldMute) {
  if (!voiceChannel) {
    console.error('no voice channel found');
  } else {
    const currentChannelMembers = [ ...voiceChannel.members.values() ];
    currentChannelMembers.forEach(member => {
      // member.
      console.error(member);
      member.setMute(shouldMute);
    });
  }

}
//


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const maxUsers = 13;
let adminUser = null;
let usersConnected = new Map();
let results = new Map();
let roundNumber = 0;

let scores = {};

app.get('/', (req, res) => {
  res.json({
      message: 'Hello World'
  });
});

app.get('/usersConnected', (req, res) => { 
  res.json([ ...usersConnected.keys() ]);
});

app.get('/admin', (req, res) => {
  res.json(adminUser);
});

app.post('/register', (req, res) => {
  var user_name = req.body.userName;
  console.log(usersConnected.get(user_name))
  if (usersConnected.get(user_name)) {
    res.status(405)
    res.json({
      error: 'User name already taken, please choose another.'
    });
  } else if ([ ...usersConnected.keys() ].length > maxUsers) {
    res.status(405)
    res.json({
      error: 'max users met'
    });
  } else {
    usersConnected.set(user_name, 'PLACEHOLDER');
    res.end();
  }
});


io.on('connection', (socket) => {

  console.log()

  usersChanged = () => {
    console.log('users-changed ', [ ...usersConnected.keys() ])
    socket.broadcast.emit('users-changed', [ ...usersConnected.keys() ]);
  }

  adminChange = (newAdmin) => {
    console.log('current admin: ' + adminUser + ', new admin: ' + newAdmin)
    adminUser = newAdmin;
    socket.broadcast.emit('admin-changed', newAdmin);
    socket.emit('admin-changed', newAdmin);
  }

  forceDisconnect = (message) => {
    socket.emit('force-disconnect', message);
  }

  socket.on('disconnect', (session) => {
    let userKey = getByValue(usersConnected, socket.id)
    usersConnected.delete(userKey)
    usersChanged();
    if (adminUser === userKey) {
      adminChange(null);
    } 
  });

  socket.on('send-name', (data) => {
    const userName =  data.userName;
    
    if (usersConnected.get(userName) === 'PLACEHOLDER') {
      usersConnected.set(userName, socket.id);
      socket.emit('confirm-name', true);
      usersChanged();
    } else {
      forceDisconnect('error, username -> map duplicate')
    }
  });

  socket.on('set-admin', (data) => {
    const newAdmin =  data.userName;
    if (!adminUser) {
      adminChange(newAdmin);
    } else {
      socket.emit('invald', 'admin already exists: ' + adminUser);
    }
  });

  socket.on('start-game', (data) => {
    const users = [ ...usersConnected.keys() ];
    results = new Map();
    roundNumber = 0;
    users.forEach(user => {
      results.set(user, new Map())
    });
    this.scores = {};
    socket.broadcast.emit('game-ready');
    socket.emit('game-ready');
  });



});

function createServer() {
  httpServer.listen(3000, () => {
    console.log('websocket listening on *:3000');
  });
  
  app.listen(3001, () => {
    console.log('REST listening on *:3001');
  })
  
  function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
  }
}