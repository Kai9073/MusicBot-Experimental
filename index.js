require('dotenv').config();
const DiscordClient = require('./structure/client');
const client = new DiscordClient(process.env.TOKEN);