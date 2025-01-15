const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
const contactsRouter = require('./routes/api/contacts')

require("dotenv").config();

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, _, res) => {
  res.status(500).json({ message: err.message })
})

mongoose.connect(process.env.DB_HOST)
        .then(() => {
          console.log("Database connection successful");
        })
        .catch((error) => {
          console.log("Database connection failed: ", error);
          process.exit(1);
        });

module.exports = app
