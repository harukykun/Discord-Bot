const Discord = require('discord.js');
const { getSequelize } = require('../../database/connect');

module.exports = async (client, interaction, args) => {
    client.simpleEmbed({
        desc: `${client.emotes.animated.loading} Calculating ping...`,
        type: 'editreply'
    }, interaction).then(async (resultMessage) => {
        const ping = Math.floor(resultMessage.createdTimestamp - interaction.createdTimestamp);

        // Measure database latency
        const dbStart = Date.now();
        try {
            const sequelize = getSequelize();
            await sequelize.query('SELECT 1');
        } catch (e) { }
        const dbPing = Date.now() - dbStart;

        var dbSeconds = ((dbPing % 60000) / 1000);
        var pingSeconds = ((ping % 60000) / 1000);
        var apiSeconds = ((client.ws.ping % 60000) / 1000);

        client.embed({
            title: `${client.emotes.normal.pong}・Pong`,
            desc: `Check out how fast our bot is`,
            fields: [
                {
                    name: "🤖┆Bot latency",
                    value: `${ping}ms (${pingSeconds}s)`,
                    inline: true,
                },
                {
                    name: "💻┆API Latency",
                    value: `${client.ws.ping}ms (${apiSeconds}s)`,
                    inline: true,
                },
                {
                    name: "📂┆Database Latency",
                    value: `${dbPing}ms (${dbSeconds}s)`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction)
    })
}