const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'tempban',
    fields: {
        guildId: { type: DataTypes.STRING },
        userId: { type: DataTypes.STRING },
        expires: { type: DataTypes.DATE }
    }
});