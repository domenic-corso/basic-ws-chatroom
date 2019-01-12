const App = {
    ws: null,
    e: {
        btnStartChatting: null,
        inpName: null,
        inpColor: null,
        messageInp: null,
        btnSendMessage: null,
        roomList: null,
        messageList: null
    },

    currentRoom: 0,

    init () {
        this.ws = new WebSocket('ws://localhost:5000');

        // Input fields
        this.e.inpName = document.getElementById('cwsName');
        this.e.inpColor = document.getElementById('cwsColor');

        this.e.roomList = document.getElementById('tbodyRoomList');
        this.e.messageList = document.getElementById('messageList');

        // Start Chatting - Button
        this.e.btnStartChatting = document.getElementById('btnStartChatting');
        this.e.btnStartChatting.addEventListener('click', e => {
            if (this.e.inpName.value !== '') {
                this.ws.send(JSON.stringify({
                    command: 'SET_DETAILS',
                    data: {
                        name: this.e.inpName.value,
                        color: this.e.inpColor.value
                    }
                }));

                this.listRooms();
            } else {
                document.getElementById('inpNameError').textContent = 'Name is required'
            }
        });

        // Button Send Message
        this.e.btnSendMessage = document.getElementById("btnSendMessage");
        this.e.btnSendMessage.addEventListener('click', this.sendMessage.bind(this));

        // Message Input
        this.e.messageInp = document.getElementById('messageInput');

        this.ws.onmessage = ({data}) => {
            try {
                const msgObj = JSON.parse(data);

                switch (msgObj.command) {
                    case 'ROOMS':
                        this.populateRooms(msgObj.data.rooms);
                        break;
                    case 'MESSAGES':
                        this.populateMessages(msgObj.data.room, msgObj.data.messages);
                        break;
                    case 'MESSAGE_CREATED':
                        this.createMessage(msgObj.data);
                        break;
                }

            } catch (e) {
                console.error(e);
            }
        };

        PanelSwitcher.open('register');
    },

    sendMessage () {
        if (this.e.messageInp.value !== '') {
            this.ws.send(JSON.stringify({
                command: 'SEND_MESSAGE',
                data: {
                    roomId: this.currentRoom,
                    body: this.e.messageInp.value,
                }
            }));
            this.e.messageInp.value = '';
        }
    },

    createMessage (message) {
        this.e.messageList.appendChild(this.generateMessageTemplate(message));
    },

    generateMessageTemplate (message) {
        // Message List Item
        let li = document.createElement('li');
        li.className = 'message';

        // Message Header
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message__header';

        ['Created_By', 'User_Color', 'Created_At'].forEach(
            key => {
                const span = document.createElement('span');

                if (key === 'User_Color') {
                    span.style.backgroundColor = message[key];
                } else if (key === 'Created_At') {
                    span.textContent = moment(message[key]).fromNow();
                } else {
                    span.textContent = message[key];
                }

                // Set classname based on key
                span.className = key.toLowerCase().replace('_', '-');

                messageHeader.appendChild(span);
            }
        );

        // Message Content
        const messageContent = document.createElement('div');
        messageContent.className = 'message__content';

        const messageBody = document.createElement('span')
        messageBody.textContent = message.Body;

        messageContent.appendChild(messageBody);

        // Append to message list item and to message list
        li.appendChild(messageHeader);
        li.appendChild(messageContent);

        return li;
    },

    listRooms () {
        PanelSwitcher.open('roomList');

        this.ws.send(JSON.stringify({
            command: 'REQUEST_ROOMS'
        }));
    },

    listMessages(roomId) {
        PanelSwitcher.open('messageList');

        document.getElementById('closeMessageList').addEventListener('click', e => {
            PanelSwitcher.open('roomList');
        });

        this.ws.send(JSON.stringify({
            command: 'REQUEST_MESSAGES',
            data: { roomId }
        }));
    },

    populateRooms (rooms) {
        while (this.e.roomList.firstElementChild) {
            this.e.roomList.removeChild(this.e.roomList.firstElementChild);
        }

        rooms.forEach(room => {
            const row = document.createElement('tr');

            row.addEventListener('click', () => {
                this.currentRoom = room.Room_ID;
                this.listMessages(room.Room_ID);

            });
            
            ['Name', 'Description', 'Message_Count', 'Created_By'].forEach(key => {
                const td = document.createElement('td');
                td.textContent = room[key];
                row.appendChild(td);
            });

            this.e.roomList.appendChild(row);
        });
    },

    populateMessages(room, messages) {
        while (this.e.messageList.firstElementChild) {
            this.e.messageList.removeChild(this.e.messageList.firstElementChild);
        }

        document.getElementById('roomName').textContent = `Room: ${room.Name}`;

        messages.forEach(message => this.e.messageList.appendChild(this.generateMessageTemplate(message)));
    }
}

const PanelSwitcher = {
    open (panelName) {
        const targetPanel = document.querySelector(`[data-panel-name="${panelName}"]`);
        
        if (targetPanel) {
            document.querySelectorAll('.panel').forEach(panel => {
                panel.classList.remove('panel--active');
            });

            targetPanel.classList.add('panel--active');
        }
    }
}

document.addEventListener('DOMContentLoaded', e => App.init());
