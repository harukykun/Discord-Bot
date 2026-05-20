const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'customCommands',
    fields: {
        Guild: { type: DataTypes.STRING },
        Name: { type: DataTypes.STRING },
        Responce: { type: DataTypes.TEXT }
    }
});