require('dotenv').config()
const express = require('express');

const server = express();
server.use(express.json());

server.listen(7070, () => {
    console.log('Server is online')
});

const { users } = require('./routes/routes.js');

server.use('/api/v1/', users);