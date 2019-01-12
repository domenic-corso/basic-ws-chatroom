# Basic Websocket Chatroom

## Project Information

> Basic Web Socket Chatroom using NPM Module 'ws' example

## Running Locally

### Configure the database

- Run the create.sql file in the config folder to generate the database and tables

### Run the server

You should see a success message on successful connection to database

```bash
    cd server
    npm install
```

### Run the client (Development)

You may use any web server to run the client as long as the port number is different from the web socket server to ensure ws connects successfully. For simplicity, we are using the PHP built in web server

```bash
    php -S localhost:<PORT_NUMBER>
```