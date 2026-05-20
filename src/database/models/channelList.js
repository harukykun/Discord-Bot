const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'channellist',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channels: { type: DataTypes.JSONB, defaultValue: [] }
    }
});