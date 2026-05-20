const Discord = require('discord.js');

const Schema = require("../../database/models/levelMessages");

module.exports = async (client, interaction, args) => {
    const perms = await client.checkUserPerms({
        flags: [Discord.PermissionsBitField.Flags.ManageMessages],
        perms: [Discord.PermissionsBitField.Flags.ManageMessages]
    }, interaction)

    if (perms == false) return;

    const message = interaction.options.getString('message');

    if (message.toUpperCase() == "HELP") {
        return client.embed({
            title: `ℹ️・Level message options`,
            desc: `These are the level message name options: \n
            \`{user:username}\` - User's username
            \`{user:discriminator}\` - User's discriminator
            \`{user:tag}\` - User's tag
            \`{user:mention}\` - Mention a user

            \`{user:level}\` - Users's level
            \`{user:xp}\` - Users's xp`,
            type: 'editreply'
        }, interaction)
    }

    if (message.toUpperCase() == "DEFAULT") {
        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            await Schema.findOneAndDelete({ Guild: interaction.guild.id });
            client.succNormal({ 
                text: `Level message deleted!`,
                type: 'editreply'
            }, interaction);
        }
    }
    else {
        const data = await Schema.findOne({ Guild: interaction.guild.id });
        if (data) {
            data.Message = message;
            await data.save();
        }
        else {
            await Schema.create({
                Guild: interaction.guild.id,
                Message: message
            });
        }

        client.succNormal({
            text: `The level message has been set successfully`,
            fields: [
                {
                    name: `💬┆Message`,
                    value: `${message}`,
                    inline: true
                },
            ],
            type: 'editreply'
        }, interaction)
    }
}

 