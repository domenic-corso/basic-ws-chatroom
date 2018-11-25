const App = {
    ws: null,
    e: {
        btnStartChatting: null,
        inpName: null,
        inpColor: null,
        roomList: null
    },

    currentRoom: 0,

    init () {
        this.ws = new WebSocket('ws://localhost:5000');

        // Input fields
        this.e.inpName = document.getElementById('cwsName');
        this.e.inpColor = document.getElementById('cwsColor');

        this.e.roomList = document.getElementById('tbodyRoomList');

        // Start Chatting - Button
        this.e.btnStartChatting = document.getElementById('btnStartChatting');
        this.e.btnStartChatting.addEventListener('click', e => {
            this.ws.send(JSON.stringify({
                command: 'SET_DETAILS',
                data: {
                    name: this.e.inpName.value,
                    color: this.e.inpColor.value
                }
            }));

            this.listRooms();
        });

        this.ws.onmessage = ({data}) => {
            try {
                const msgObj = JSON.parse(data);

                switch (msgObj.command) {
                    case 'ROOMS':
                    this.populateRooms(msgObj.data.rooms);
                    break;
                }

            } catch (e) {
                console.error(e);
            }
        };

        PanelSwitcher.open('register');
    },

    listRooms () {
        PanelSwitcher.open('roomList');

        this.ws.send(JSON.stringify({
            command: 'REQUEST_ROOMS'
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
           });
           
           ['Name', 'Description', 'Message_Count', 'Created_By'].forEach(key => {
               const td = document.createElement('td');
               td.textContent = room[key];
               row.appendChild(td);
           });

           this.e.roomList.appendChild(row);
        });
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
