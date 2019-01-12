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

    getById(roomId) {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.query(`
            SELECT r.Room_ID
                ,Name
                ,Description
                ,r.Created_By
                ,r.Created_At
                ,COUNT(m.Message_ID) AS Message_Count
            FROM room r
            LEFT JOIN message m ON m.Room_ID = r.Room_ID
            WHERE r.Room_ID = ?
            `, [roomId], (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(Object.assign({}, res[0]));
                })
        });
    }

    getAll () {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.query(`
            SELECT r.Room_ID
                ,Name
                ,Description
                ,r.Created_By
                ,r.Created_At
                ,COUNT(m.Message_ID) AS Message_Count
            FROM room r
            LEFT JOIN message m ON m.Room_ID = r.Room_ID
            GROUP BY r.Room_ID
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
