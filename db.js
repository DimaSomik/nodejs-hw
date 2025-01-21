const mongoose = require('mongoose');
require("dotenv").config();

const connectMongoDB = () => {
    mongoose.connect(process.env.DB_HOST)
        .then(() => {
          console.log("Database connection successful");
        })
        .catch((error) => {
          console.log("Database connection failed: ", error);
          process.exit(1);
        });
};

module.exports = connectMongoDB;