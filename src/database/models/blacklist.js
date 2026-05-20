const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'blacklist_words',
    fields: {
        Guild: { type: DataTypes.STRING },
        Words: { type: DataTypes.JSONB, defaultValue: [] }
    }
});