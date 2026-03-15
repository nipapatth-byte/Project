const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/events',require('./routes/events'));
app.use('/register',require('./routes/register'));
app.use('/participants',require('./routes/participants'));

app.use(require("./middlewares/error")); 

module.exports = app;