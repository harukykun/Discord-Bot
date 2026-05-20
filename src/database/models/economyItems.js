const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'economyItems',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        FishingRod: { type: DataTypes.BOOLEAN, defaultValue: false },
        FishingRodUsage: { type: DataTypes.INTEGER, defaultValue: 0 }
    }
});