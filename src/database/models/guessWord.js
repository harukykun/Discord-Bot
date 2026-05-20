const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'guessWord',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING },
        Word: { type: DataTypes.STRING, defaultValue: 'start' }
    }
});