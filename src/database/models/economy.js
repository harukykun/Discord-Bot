const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'economy',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        Money: { type: DataTypes.FLOAT, defaultValue: 0 },
        Bank: { type: DataTypes.FLOAT, defaultValue: 0 }
    }
});