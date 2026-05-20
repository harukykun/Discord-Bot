const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'stats',
    fields: {
        Guild: { type: DataTypes.STRING },
        Members: { type: DataTypes.STRING },
        Boost: { type: DataTypes.STRING },
        Channels: { type: DataTypes.STRING },
        Roles: { type: DataTypes.STRING },
        Emojis: { type: DataTypes.STRING },
        AnimatedEmojis: { type: DataTypes.STRING },
        NewsChannels: { type: DataTypes.STRING },
        StageChannels: { type: DataTypes.STRING },
        StaticEmojis: { type: DataTypes.STRING },
        TextChannels: { type: DataTypes.STRING },
        BoostTier: { type: DataTypes.STRING },
        VoiceChannels: { type: DataTypes.STRING },
        Time: { type: DataTypes.STRING },
        TimeZone: { type: DataTypes.STRING },
        ChannelTemplate: { type: DataTypes.STRING }
    }
});