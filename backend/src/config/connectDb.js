const mongoose = require("mongoose");
const { DB_NAME } = require("./constants");

module.exports = connectDb = async () => {
    try {
        const connectionString = process.env.MONGODB_URI + "/" + DB_NAME
        await mongoose.connect(connectionString)
        console.log("MongoDB connected")
    } catch (error) {
        console.log("MongoDB connection error", error)
        throw error
    }
}