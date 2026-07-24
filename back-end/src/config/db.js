const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // If already connected, return the cached connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // If currently connecting, wait for the connection to open
  if (mongoose.connection.readyState === 2) {
    console.log("MongoDB connection in progress... awaiting 'connected' event.");
    await new Promise((resolve, reject) => {
      const onConnected = () => {
        mongoose.connection.removeListener("error", onError);
        resolve();
      };
      const onError = (err) => {
        mongoose.connection.removeListener("connected", onConnected);
        reject(err);
      };
      mongoose.connection.once("connected", onConnected);
      mongoose.connection.once("error", onError);
    });
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
    
    // Double check that we are connected, otherwise wait for connected event
    if (mongoose.connection.readyState !== 1) {
      console.log("MongoDB connect resolved but readyState is not 1. Awaiting 'connected' event.");
      await new Promise((resolve, reject) => {
        const onConnected = () => {
          mongoose.connection.removeListener("error", onError);
          resolve();
        };
        const onError = (err) => {
          mongoose.connection.removeListener("connected", onConnected);
          reject(err);
        };
        mongoose.connection.once("connected", onConnected);
        mongoose.connection.once("error", onError);
      });
    }

    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host || "established"}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;