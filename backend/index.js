const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./src/config/connectDb");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(() => {
        console.log("MongoDB connection error closing the server")
        process.exit(1)
    })
