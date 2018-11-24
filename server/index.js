const mysql = require('mysql');
const RoomHelper = require('./app/classes/RoomHelper');
const MessageHelper = require('./app/classes/MessageHelper');

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
