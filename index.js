// Simple Express server - deploy this on Replit, Glitch, or Render
const express = require('express');
const app = express();

app.use(express.json());

// Simple in-memory "database" (resets when server restarts)
// For production, use a real database like MongoDB, SQLite, etc.
let achievements = {};

// Endpoint for MonkeyType userscript to POST achievements
app.post('/monkeytype-webhook', (req, res) => {
    const { userId, wpm, accuracy, timestamp } = req.body;
    
    // Store achievement (you can add userId to track specific users)
    const id = userId || 'default';
    achievements[id] = {
        achieved: true,
        wpm: wpm,
        accuracy: accuracy,
        timestamp: timestamp
    };
    
    console.log(`Achievement stored for ${id}: ${wpm} WPM, ${accuracy}% accuracy`);
    
    res.json({ 
        success: true,
        message: 'Achievement recorded!' 
    });
});

// Endpoint for Roblox to check achievements
app.get('/check-achievement', (req, res) => {
    const userId = req.query.userId || 'default';
    
    if (achievements[userId]) {
        res.json(achievements[userId]);
    } else {
        res.json({ 
            achieved: false 
        });
    }
});

// Endpoint for Roblox to clear achievement after processing
app.post('/clear-achievement', (req, res) => {
    const { userId } = req.body;
    const id = userId || 'default';
    
    if (achievements[id]) {
        delete achievements[id];
        res.json({ 
            success: true,
            message: 'Achievement cleared' 
        });
    } else {
        res.json({ 
            success: false,
            message: 'No achievement to clear' 
        });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running!',
        activeAchievements: Object.keys(achievements).length
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
