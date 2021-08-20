'use strict';

const config    = require('dotenv').config;
const server    = require('./server');
const logging   = require('./utils/logging.js');

const port = config.APPLICATION_PORT || 3000;

server.listen(port);
logging.LogSuccess("Server listening at port: " + port);

server.on("error", err => {
    logging.LogDanger(err);
});