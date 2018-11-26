class User {
    constructor (ws, roomHelper, messageHelper) {
        this.ws = ws;
        this.roomHelper = roomHelper;
        this.messageHelper = messageHelper;

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
                        }));
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
    
            console.log(`Name: ${this.name}`);
            console.log(`Color: ${this.color}`);
        } catch(e) {}
    }

    c_sendMessage (message) {
        this.messageHelper.insert(message);
    }
}

module.exports = User;
