const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'countChannel',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING },
        Mode: { type: DataTypes.STRING, defaultValue: 'hard' }
    }
});