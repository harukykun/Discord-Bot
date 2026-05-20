const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'Levels',
    fields: {
        userID: { type: DataTypes.STRING },
        guildID: { type: DataTypes.STRING },
        xp: { type: DataTypes.INTEGER, defaultValue: 0 },
        level: { type: DataTypes.INTEGER, defaultValue: 0 },
        lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }
});