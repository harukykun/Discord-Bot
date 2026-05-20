const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'economyStore',
    fields: {
        Guild: { type: DataTypes.STRING },
        Role: { type: DataTypes.STRING },
        Amount: { type: DataTypes.FLOAT }
    }
});