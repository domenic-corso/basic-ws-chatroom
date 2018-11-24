const Helper = require('./Helper');

class MessageHelper extends Helper {
    constructor(mysqlConnection) {
        super(mysqlConnection);
    }

    insert (message) {
        return new Promise((resolve, reject) => {
            // Save to DB 
            this.mysqlConnection.query(`
                INSERT INTO message
                SET ?
            `, {
                // Trim Strings
                Room_ID: message.roomId,
                Created_By: message.createdBy.substring(0, 50),
                Body: message.body.substring(0, 1000),
                User_Color: message.userColor.length !== 7 ? '#000000' : message.userColor
            }, (err, res) => {
                if (err) {
                    reject(err)
                    return;
                };
                
                // return ID
                resolve(res.insertId);
            })
        });
    }

    getAll (roomId = 0) {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.query(`
                SELECT Message_ID
                    ,Room_ID
                    ,Created_By
                    ,Body
                    ,User_Color
                    ,Created_At
                FROM message m
                WHERE Room_ID = ?
            `, [roomId], (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res.map(row => {
                    return Object.assign({}, row);
                }))
            })
        });
    }
};

module.exports = MessageHelper;
