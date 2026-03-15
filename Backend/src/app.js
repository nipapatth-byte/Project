const express = require('express');
const cors = require('cors');
const app = express();


// Middlewares
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:8000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

//routes
app.use('/api/events',require('./routes/events'));
app.use('/api/register',require('./routes/register'));
app.use('/api/participants',require('./routes/participants'));

app.use(require("./middlewares/error")); 

module.exports = app;