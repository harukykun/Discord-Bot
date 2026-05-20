const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'stickymessages',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING },
        Content: { type: DataTypes.TEXT },
        LastMessage: { type: DataTypes.STRING }
    }
});