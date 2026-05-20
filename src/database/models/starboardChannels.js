const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'starboardChannels',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING }
    }
});