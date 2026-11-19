const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {

    try {
        console.log("Attempting connection to MongoDB from MONGO_URL...");
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 3000
        });
        console.log("Connected successfully to configured MongoDB.");
        return;
    } catch (err) {
        console.log("Could not reach configured MONGO_URL (" + err.message + ")");
        console.log("Switching to embedded MongoDB instance for offline/lab experiment...");
    }



};

module.exports = { connectDB };
