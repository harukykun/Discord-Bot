const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'developers',
    fields: {
        Action: { type: DataTypes.STRING },
        Date: { type: DataTypes.STRING }
    }
});