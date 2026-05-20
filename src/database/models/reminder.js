const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'reminder',
    fields: {
        User: { type: DataTypes.STRING },
        Text: { type: DataTypes.TEXT },
        endTime: { type: DataTypes.BIGINT }
    }
});