const express = require('express');
const cors = require('cors');
const path = require('path');
const { pipeline } = require('node:stream/promises');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.post('/analyze', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Sentence not found, please, insert a sentence in the textfield.' });
    }

    try {
        const pythonProcess = spawn('python', ['analyze.py', text]);
        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.on('close', () => {
            res.json({ sentiment: result.trim() });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error processing the model' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
