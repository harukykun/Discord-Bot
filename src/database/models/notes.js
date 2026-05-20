const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'notes',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        Code: { type: DataTypes.STRING },
        Note: { type: DataTypes.TEXT }
    }
});