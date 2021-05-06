/* eslint-disable no-undef */
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const ascii = require('ascii-table');
const table = new ascii("Commands");
table.setHeading("Command", "Load status");
const events = require('./events');
const path = require('path');
const Player = require('./functions/Player');
const soundcloud = require('soundcloud-scraper');
const soundClient = new soundcloud.Client('vAb6a1Ta53PoYqLYLaJjZTl5L9xGpyrh');

class DiscordClient extends Client {
    constructor(token) {
        super({
            ws: {
                intents: Intents.ALL
            },
            disableEveryone: true,
            partials: ["MESSAGE", "REACTION"]
        });
        if(!token) throw new Error('No token is provided.');
        this.lang = 'en'
        this.commands = new Collection();
        this.aliases = new Collection();
        this.soundClient = soundClient;
        this.messages = require('./config/message');
        this.player = new Player(this);
        this.queue = new Map();
        this.util = require('./functions/Util');
        events(this);
        
        const commands = fs.readdirSync(path.join(path.dirname(__dirname), 'commands')).filter(file => file.endsWith('.js'));
        
        for(let file of commands) {
            const pull = require(`../commands/${file}`)
        
            if(pull.name) {
                this.commands.set(pull.name, pull);
                table.addRow(file, `✅`);
            } else {
                table.addRow(file, `❌`);
                continue;
            }
            
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => this.aliases.set(alias, pull.name));
        }
        console.log(table.toString());
        this.login(token)
    }
}

module.exports = DiscordClient;