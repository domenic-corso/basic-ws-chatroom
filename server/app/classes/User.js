class User {
    constructor (ws, roomHelper, messageHelper, broadcast) {
        this.ws = ws;
        this.roomHelper = roomHelper;
        this.messageHelper = messageHelper;
        this.broadcast = broadcast;

        this.name = ''
        this.color = '#000000'

        this.ws.on('message', message => {
            try {
                const msgObj = JSON.parse(message);
                switch (msgObj.command) {
                    case 'SET_DETAILS':
                        this.c_setDetails(msgObj.data);
                        break;
                    case 'SEND_MESSAGE':
                        this.c_sendMessage(Object.assign({}, msgObj.data, {
                            createdBy: this.name,
                            userColor: this.color
                        })).then(messageId => {
                            this.messageHelper.getById(messageId).then(res => {
                                this.broadcast(JSON.stringify({
                                    command: 'MESSAGE_CREATED',
                                    data: res
                                }))
                            });
                        })
                        break;
                    case 'CREATE_ROOM':
                        this.c_createRoom(Object.assign({}, msgObj.data, {
                            createdBy: this.name
                        })).then(roomId => {
                            this.roomHelper.getById(roomId).then(res => {
                                this.broadcast(JSON.stringify({
                                    command: 'ROOM_CREATED',
                                    data: res
                                }))
                            })
                        });
                        break;
                    case 'REQUEST_ROOMS':
                        this.roomHelper.getAll().then(rooms => {
                            this.ws.send(JSON.stringify({
                                command: 'ROOMS',
                                data: {
                                    rooms
                                }
                            }))
                        });
                        break;
                    case 'REQUEST_MESSAGES':
                        this.roomHelper.getById(msgObj.data.roomId).then(room => {
                            this.messageHelper.getAll(msgObj.data.roomId).then(messages => {
                                this.ws.send(JSON.stringify({
                                    command: 'MESSAGES',
                                    data: {
                                        room,
                                        messages
                                    }
                                }))
                            });        
                        });
                        break;  
                }

            } catch (e) {
                console.error(e);
            }
        });
    }

    c_setDetails (details) {
        try {
            this.name = details.name || ''
            this.color = details.color || '#000000'
        } catch(e) {}
    }

    c_sendMessage (message) {
        return new Promise((resolve, reject) => {
            this.messageHelper.insert(message).then((res) => {
                if (res) {
                    resolve(res);
                }
            }).catch(err => reject(err));
        })
    }

    c_createRoom(room) {
        return new Promise((resolve, reject) => {
            this.roomHelper.insert(room).then((res) => {
                if (res) {
                    resolve(res);
                }
            }).catch(err => reject(err));
        })
    }
}

module.exports = User;
