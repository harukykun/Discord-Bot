const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'levelRewards',
    fields: {
        Guild: { type: DataTypes.STRING },
        Level: { type: DataTypes.INTEGER },
        Role: { type: DataTypes.STRING }
    }
});