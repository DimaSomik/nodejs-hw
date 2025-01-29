const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const contactsRouter = require('./routes/api/contactsRouter')
const usersRouter = require('./routes/api/usersRouter');
const connectMongoDB = require('./db');

require("dotenv").config();

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.static('public'));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' })
});

app.use((err, _, res) => {
  res.status(500).json({ message: err.message })
});

connectMongoDB();

module.exports = app
