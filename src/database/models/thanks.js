const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'thanks',
    fields: {
        User: { type: DataTypes.STRING },
        UserTag: { type: DataTypes.STRING },
        Received: { type: DataTypes.INTEGER }
    }
});