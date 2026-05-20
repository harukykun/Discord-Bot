const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'messageRewards',
    fields: {
        Guild: { type: DataTypes.STRING },
        Messages: { type: DataTypes.INTEGER },
        Role: { type: DataTypes.STRING }
    }
});