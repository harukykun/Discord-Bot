const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'votecredits',
    fields: {
        User: { type: DataTypes.STRING },
        Credits: { type: DataTypes.INTEGER },
        Unlimited: { type: DataTypes.BOOLEAN }
    }
});