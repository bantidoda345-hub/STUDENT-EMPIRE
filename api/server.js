const express = require('express');
const cors = require('cors');

const app = express();

// Performance aur Security settings
app.use(express.json());
app.use(cors());

// 1. Home Route (Yeh check karne ke liye ki Vercel par server chal raha hai)
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "Student Empire Serverless Engine is Live on Vercel! 🚀",
        performance: "Super Fast / Serverless",
        timestamp: new Date()
    });
});

// 2. Health aur Load Check API
app.get('/api/health', (req, res) => {
    res.json({
        online: true,
        type: "Serverless Function",
        uptimeSeconds: Math.round(process.uptime())
    });
});

// Sabse Important: Vercel serverless environment ke liye app ko export karna zaroori hai
module.exports = app;
