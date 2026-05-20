const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'verify',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING },
        Role: { type: DataTypes.STRING },
        Logs: { type: DataTypes.STRING }
    }
});