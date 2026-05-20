const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'giveaways',
    fields: {
        messageId: { type: DataTypes.STRING },
        channelId: { type: DataTypes.STRING },
        guildId: { type: DataTypes.STRING },
        startAt: { type: DataTypes.BIGINT },
        endAt: { type: DataTypes.BIGINT },
        ended: { type: DataTypes.BOOLEAN },
        winnerCount: { type: DataTypes.INTEGER },
        prize: { type: DataTypes.STRING },
        messages: { type: DataTypes.JSONB },
        thumbnail: { type: DataTypes.STRING },
        hostedBy: { type: DataTypes.STRING },
        winnerIds: { type: DataTypes.JSONB },
        reaction: { type: DataTypes.JSONB },
        botsCanWin: { type: DataTypes.BOOLEAN },
        embedColor: { type: DataTypes.JSONB },
        embedColorEnd: { type: DataTypes.JSONB },
        exemptPermissions: { type: DataTypes.JSONB },
        exemptMembers: { type: DataTypes.TEXT },
        bonusEntries: { type: DataTypes.TEXT },
        extraData: { type: DataTypes.JSONB },
        lastChance: { type: DataTypes.JSONB },
        pauseOptions: { type: DataTypes.JSONB },
        isDrop: { type: DataTypes.BOOLEAN },
        allowedMentions: { type: DataTypes.JSONB }
    }
});