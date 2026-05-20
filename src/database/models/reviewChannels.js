const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'reviewChannels',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING }
    }
});