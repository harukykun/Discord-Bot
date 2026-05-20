const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'badges',
    fields: {
        User: { type: DataTypes.STRING },
        FLAGS: { type: DataTypes.JSONB, defaultValue: [] }
    }
});