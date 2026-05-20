const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel("Facebook")
                .setURL("https://www.facebook.com/TiemPizzaNhoORinascita")
                .setStyle(Discord.ButtonStyle.Link),
        );

    client.embed({
        title: `🌐・Socials`,
        desc: `Follow us on our Facebook page!`,
        image: "https://cdn.discordapp.com/attachments/843487478881976381/874694194474668052/Bot_banner_invite.jpg",
        url: "https://www.facebook.com/TiemPizzaNhoORinascita",
        components: [row],
        type: 'editreply'
    }, interaction)
}
