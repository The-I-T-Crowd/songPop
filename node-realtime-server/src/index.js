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
const ytdl = require("ytdl-core");
const Discord = require('discord.js');
const client = new Discord.Client();
const guild = client.guilds // new Discord.Guild(client);c

const TOKEN = process.env.TOKEN;
const CHANNEL_ID_VOICE = process.env.CHANNEL_ID_VOICE;
const CHANNEL_ID_TEXT = process.env.CHANNEL_ID_TEXT;
let voiceChannel;
let textChannel;

client.login(TOKEN);

client.on('ready', () => {
  voiceChannel = client.channels.resolve(CHANNEL_ID_VOICE);
  textChannel = client.channels.resolve(CHANNEL_ID_TEXT);

  // textChannel.send('hi')
  // muteAllPlayers(true);
  sendSong();
  console.info(`Logged in as ${client.user.tag}!`);
  createServer();
});

client.on('message', (message) => {
  if (message.content == 'start game') {
    console.log('/start game');
  }
});

app.post('/mutePlayers', (req, res) => {
  muteAllPlayers(true);
  res.end();
});

app.post('/unmutePlayers', (req, res) => {
  muteAllPlayers(false)
  res.end();
});

function startGame() {

}

function muteAllPlayers(shouldMute) {
  if (!guild) {
    console.error('no guild found');
  } else {

    for (let member of voiceChannel.members) {
      member[1].fetch()
        .then(member => {
          member.voice.setMute(shouldMute);
        })
        .catch(console.error);
    }
  }

}

async function sendSong() {
  if (!voiceChannel) {
    console.error('no voice channel found');
  } else {
    const connection = await voiceChannel.join();
    const dispatcher = connection.play('./music/test.mp3');

    dispatcher.on('start', () => {
      console.log('./music/test.mp3 is now playing!');
    });

    dispatcher.on('finish', () => {
      console.log('./music/test.mp3 has finished playing!');
    });

    dispatcher.on('error', console.error);
  }
}


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
  res.json([...usersConnected.keys()]);
});

app.get('/admin', (req, res) => {
  res.json(adminUser);
});



io.on('connection', (socket) => {

  console.log()

  usersChanged = () => {
    console.log('users-changed ', [...usersConnected.keys()])
    socket.broadcast.emit('users-changed', [...usersConnected.keys()]);
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
    const userName = data.userName;

    if (usersConnected.get(userName) === 'PLACEHOLDER') {
      usersConnected.set(userName, socket.id);
      socket.emit('confirm-name', true);
      usersChanged();
    } else {
      forceDisconnect('error, username -> map duplicate')
    }
  });

  socket.on('set-admin', (data) => {
    const newAdmin = data.userName;
    if (!adminUser) {
      adminChange(newAdmin);
    } else {
      socket.emit('invald', 'admin already exists: ' + adminUser);
    }
  });

  socket.on('start-game', (data) => {
    const users = [...usersConnected.keys()];
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

  // function getByValue(map, searchValue) {
  //   for (let [key, value] of map.entries()) {
  //     if (value === searchValue)
  //       return key;
  //   }
  // }
}