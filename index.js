const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
app.use(express.json());

// Initialize Discord Bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

// Health Check for UptimeRobot
app.get('/', (req, res) => {
    res.status(200).send("Proxy is Online");
});

// Security Middleware: Checks the x-proxy-auth header
const validateToken = (req, res, next) => {
    if (req.headers['x-proxy-auth'] !== process.env.PROXY_SECRET) {
        return res.status(403).json({ error: "Unauthorized: Invalid Secret Token" });
    }
    next();
};
        
// ENDPOINT 1: Create a Gamepass (Bot -> Roblox)
app.post('/create-gamepass', validateToken, async (req, res) => {
    const { universeId, name, description, price } = req.body;
    
    if (!fs.existsSync('./icon.png')) {
        return res.status(500).json({ error: "icon.png missing on server" });
    }

    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('isForSale', "true");
    form.append('price', price);
    form.append('imageFile', fs.createReadStream('./icon.png'));
    form.append('isRegionalPricingEnabled', "false");

    try {
        const response = await axios.post(
            `https://apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes`,
            form,
            { headers: { ...form.getHeaders(), 'x-api-key': process.env.ROBLOX_API_KEY_GAMEPASS } }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || error.message);
    }
});

    // Always respond with 200 to Roblox so they don't keep retrying
    res.status(200).send('OK');
});

app.listen(process.env.PORT || 10000, () => console.log("Combined Proxy is Online"));
