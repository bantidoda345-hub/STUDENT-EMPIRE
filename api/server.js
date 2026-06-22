const express = require('express');
const cors = require('cors');

const app = express();

// परफॉर्मेंस और सिक्योरिटी सेटिंग्स
app.use(express.json());
app.use(cors());

// 1. होम रूट (यह चेक करने के लिए कि Vercel पर सर्वर चालू है)
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "Student Empire Serverless Engine is Live on Vercel! 🚀",
        performance: "Super Fast / Serverless",
        timestamp: new Date()
    });
});

// 2. हेल्थ और लोड चेक API
app.get('/api/health', (req, res) => {
    res.json({
        online: true,
        type: "Serverless Function",
        uptimeSeconds: Math.round(process.uptime())
    });
