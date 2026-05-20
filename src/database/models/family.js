const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'family',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        Parent: { type: DataTypes.JSONB, defaultValue: null },
        Partner: { type: DataTypes.STRING, defaultValue: null },
        Children: { type: DataTypes.JSONB, defaultValue: null }
    }
});