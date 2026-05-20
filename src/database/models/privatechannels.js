const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'privatechannels',
    fields: {
        Guild: { type: DataTypes.STRING },
        Category: { type: DataTypes.STRING },
        ChannelName: { type: DataTypes.STRING },
        ChannelCount: { type: DataTypes.INTEGER, defaultValue: 0 }
    }
});