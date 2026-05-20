const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'userBans',
    fields: {
        User: { type: DataTypes.STRING }
    }
});