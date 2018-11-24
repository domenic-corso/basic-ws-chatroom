const mysql = require('mysql');
const WebSocket = require('ws');
const RoomHelper = require('./app/classes/RoomHelper');
const MessageHelper = require('./app/classes/MessageHelper');

const wsServer = new WebSocket.Server({ port: 5000 });

wsServer.on('connection', (ws) => {
    ws.on('message', message => {
        try {
            const msgObj = JSON.parse(message);

            if (msgObj.command === "SEND_MESSAGE") {
                messageHelper.insert(msgObj.data);
            }
            console.log(msgObj);
        } catch (e) {
            console.error(e);
        }
    });

    const User = class {
        constructor(_ws) {
            this.ws = _ws;

            this.ws.on('message', message => {
                try {
                    const msgObj = JSON.parse(message);
                    console.log(msgObj);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    new User(ws);
})

// Connect to MySQL 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatroom'
});

connection.connect((err) => {
    if (err) {
        console.log(`Error connecting to mySQL: ${err}`);
        return;
    }

    console.log('Connected to mySQL!');

    const roomHelper = new RoomHelper(connection);
    const messageHelper = new MessageHelper(connection);
});

