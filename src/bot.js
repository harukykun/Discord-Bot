const Discord = require('discord.js');

// Monkey patch WebhookClient to prevent crash when webhooks are empty/missing
const originalWebhookClient = Discord.WebhookClient;
Discord.WebhookClient = class extends originalWebhookClient {
    constructor(options) {
        if (!options || !options.id || !options.token) {
            return {
                send: async () => { },
                destroy: () => { }
            };
        }
        super(options);
    }

    async send(...args) {
        try {
            return await super.send(...args);
        } catch (err) {
            // Quietly catch webhook errors to prevent process crash
            console.log(`[Webhook Warning] Failed to send webhook: ${err.message || err}`);
        }
    }
}

const fs = require('fs');



// Discord client
const client = new Discord.Client({
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ],
        repliedUser: true
    },
    disabledEvents: [
        "TYPING_START"
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent
    ],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.MessageContent
    ],
    restTimeOffset: 0
});


// Connect to database
const connectDB = require("./database/connect");

// Client settings
client.config = require('./config/bot');
client.changelogs = require('./config/changelogs');
client.emotes = require("./config/emojis.json");
client.webhooks = require("./config/webhooks.json");
const webHooksArray = ['startLogs', 'shardLogs', 'errorLogs', 'dmLogs', 'voiceLogs', 'serverLogs', 'serverLogs2', 'commandLogs', 'consoleLogs', 'warnLogs', 'voiceErrorLogs', 'creditLogs', 'evalLogs', 'interactionLogs'];
// Check if .env webhook_id and webhook_token are set
if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN) {
    for (const webhookName of webHooksArray) {
        client.webhooks[webhookName].id = process.env.WEBHOOK_ID;
        client.webhooks[webhookName].token = process.env.WEBHOOK_TOKEN;
    }
}

client.commands = new Discord.Collection();
client.playerManager = new Map();
client.triviaManager = new Map();
client.queue = new Map();

// Webhooks
const consoleLogs = new Discord.WebhookClient({
    id: client.webhooks.consoleLogs.id,
    token: client.webhooks.consoleLogs.token,
});

const warnLogs = new Discord.WebhookClient({
    id: client.webhooks.warnLogs.id,
    token: client.webhooks.warnLogs.token,
});

// Load handlers and login
(async () => {
    try {
        await connectDB();
    } catch (err) {
        console.error("Failed to connect to database during startup:", err);
    }

    fs.readdirSync('./src/handlers').forEach((dir) => {
        fs.readdirSync(`./src/handlers/${dir}`).forEach((handler) => {
            require(`./handlers/${dir}/${handler}`)(client);
        });
    });

    client.login(process.env.DISCORD_TOKEN);
})();

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    try {
        const errorStr = error ? String(error).slice(0, 950) : 'Unknown error';
        const stackStr = (error && error.stack) ? String(error.stack).slice(0, 950) : 'No stack trace';
        const embed = new Discord.EmbedBuilder()
            .setTitle(`🚨・Unhandled promise rejection`)
            .addFields([
                {
                    name: "Error",
                    value: Discord.codeBlock(errorStr),
                },
                {
                    name: "Stack error",
                    value: Discord.codeBlock(stackStr),
                }
            ])
            .setColor(client.config.colors.normal)
        consoleLogs.send({
            username: 'Bot Logs',
            embeds: [embed],
        }).catch(() => {
            console.log('Error sending unhandledRejection to webhook')
        })
    } catch (handlerErr) {
        console.error('Error in unhandledRejection handler:', handlerErr);
    }
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・New warning found`)
        .addFields([
            {
                name: `Warn`,
                value: `\`\`\`${warn}\`\`\``,
            },
        ])
        .setColor(client.config.colors.normal)
    warnLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending warning to webhook')
        console.log(warn)
    })
});

client.on(Discord.ShardEvents.Error, error => {
    console.error('Shard error:', error);
    try {
        const errorStr = error ? String(error).slice(0, 950) : 'Unknown error';
        const stackStr = (error && error.stack) ? String(error.stack).slice(0, 950) : 'No stack trace';
        const embed = new Discord.EmbedBuilder()
            .setTitle(`🚨・A websocket connection encountered an error`)
            .addFields([
                {
                    name: `Error`,
                    value: Discord.codeBlock(errorStr),
                },
                {
                    name: `Stack error`,
                    value: Discord.codeBlock(stackStr),
                }
            ])
            .setColor(client.config.colors.normal)
        consoleLogs.send({
            username: 'Bot Logs',
            embeds: [embed],
        }).catch(() => {
            console.log('Error sending shard error to webhook');
        });
    } catch (handlerErr) {
        console.error('Error in ShardEvents.Error handler:', handlerErr);
    }
});

// Catch uncaught exceptions to prevent silent crashes
process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    try {
        const errorStr = error ? String(error).slice(0, 950) : 'Unknown error';
        const stackStr = (error && error.stack) ? String(error.stack).slice(0, 950) : 'No stack trace';
        const embed = new Discord.EmbedBuilder()
            .setTitle(`💀・Uncaught Exception`)
            .addFields([
                { name: `Error`, value: Discord.codeBlock(errorStr) },
                { name: `Stack`, value: Discord.codeBlock(stackStr) }
            ])
            .setColor('#FF0000')
        consoleLogs.send({
            username: 'Bot Logs',
            embeds: [embed],
        }).catch(() => {});
    } catch (handlerErr) {
        console.error('Error in uncaughtException handler:', handlerErr);
    }
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});
