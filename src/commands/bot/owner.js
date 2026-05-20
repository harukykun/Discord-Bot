const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    client.embed({
        title: `📘・Owner information`,
        desc: `____________________________`,
        thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
        fields: [{
            name: "👑┆Owner name",
            value: `Mashiro`,
            inline: true,
        },
        {
            name: "🏷┆Discord tag",
            value: `Pizza Dứa Nè#9683`,
            inline: true,
        },
        {
            name: "🏢┆Organization",
            value: `TiemPizzaPhiaBacRinascita`,
            inline: true,
        },
        {
            name: "🌐┆Facebook",
            value: `[https://www.facebook.com/TiemPizzaNhoORinascita](https://www.facebook.com/TiemPizzaNhoORinascita)`,
            inline: true,
        }],
        type: 'editreply'
    }, interaction)
}

 