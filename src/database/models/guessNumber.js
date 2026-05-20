const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'guessNumber',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING },
        Number: { type: DataTypes.STRING, defaultValue: '5126' }
    }
});