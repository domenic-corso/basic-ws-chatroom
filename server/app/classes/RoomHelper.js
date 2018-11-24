const Helper = require('./Helper');

class RoomHelper extends Helper {
    constructor (mysqlConnection) {
        super(mysqlConnection);
    }

    insert (room) {
        return new Promise((resolve, reject) => {
            // Save to DB 
            this.mysqlConnection.query(`
                INSERT INTO room
                SET ?
            `, {
                // Trim Strings
                Name: room.name.substring(0, 100),
                Description: room.description.substring(0, 200),
                Created_By: room.createdBy.substring(0, 50)
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                // return ID
                resolve(res.insertId);
            })
        });
    }

    getAll () {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.query(`
                SELECT Room_ID
                    ,Name
                    ,Description
                    ,Created_By
                    ,Created_At
                FROM room
                ORDER BY Room_ID DESC
            `, (err, res) => {
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
}

module.exports = RoomHelper;