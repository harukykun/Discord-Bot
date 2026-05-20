const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'customCommandsAdvanced',
    fields: {
        Guild: { type: DataTypes.STRING },
        Name: { type: DataTypes.STRING },
        Responce: { type: DataTypes.TEXT },
        Action: { type: DataTypes.STRING, defaultValue: 'Normal' }
    }
});