const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const BroadcastManager = require('./BroadcastManager');

class BotManager {
    constructor() {
        this.clients = [];
        this.processedMessages = new Set();
        this.commands = new Map();
        this.broadcastManager = new BroadcastManager(this);
        this.prefix = '!';
        this.loadCommands();
    }

    loadCommands() {
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            this.commands.set(command.name, command);
        }
    }

    async start() {
        const tokens = Object.keys(process.env)
            .filter(key => key.startsWith('TOKEN_'))
            .map(key => process.env[key].trim())
            .filter(Boolean)
            .slice(0, 50);

        for (const token of tokens) {
            const client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent
                ]
            });

            client.once('clientReady', () => {
                logger.info(`Bot ${client.user.tag} is now online and connected.`);
            });

            client.on('messageCreate', async message => {
                if (message.author.bot) return;
                if (!message.content.startsWith(this.prefix)) return;

                if (this.processedMessages.has(message.id)) return;
                this.processedMessages.add(message.id);
                setTimeout(() => this.processedMessages.delete(message.id), 15000);

                const args = message.content.slice(this.prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = this.commands.get(commandName);

                if (command) {
                    try {
                        await command.execute(message, args, this);
                    } catch (error) {
                        logger.error(error.message);
                    }
                }
            });

            try {
                await client.login(token);
                this.clients.push(client);
            } catch (error) {
                logger.error(`Failed to login: ${error.message}`);
            }
        }
    }
}

module.exports = BotManager;