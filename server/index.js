const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
app = express();

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');


//App: Setup Middleware
app.use(morgan('combined'));
app.use(bodyParser({type: '*/*'}));
router(app);

// App: Routes


//Server: Setup Port to Listen for requests

const port = process.env.Port || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
