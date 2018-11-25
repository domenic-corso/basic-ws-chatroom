const mysql = require('mysql');
const WebSocket = require('ws');
const RoomHelper = require('./app/classes/RoomHelper');
const MessageHelper = require('./app/classes/MessageHelper');
const User = require('./app/classes/User');

const wsServer = new WebSocket.Server({ port: 5000 });

// Connect to MySQL 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatroom'
});

const users = [];

connection.connect((err) => {
    if (err) {
        console.log(`Error connecting to mySQL: ${err}`);
        return;
    }

    console.log('Connected to mySQL!');

    const roomHelper = new RoomHelper(connection);
    const messageHelper = new MessageHelper(connection);
        
    wsServer.on('connection', (ws) => {
        const user = new User(ws, roomHelper, messageHelper);

        users.push(user);
    });
});
