// src/config/dbConnection.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        await mongoose.connect(uri, {
            autoIndex: true, // Auto build indexes in development
        });

        console.log('✅ MongoDB Connected Successfully');

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Connection Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB Disconnected');
        });
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
