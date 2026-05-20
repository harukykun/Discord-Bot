const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'music',
    fields: {
        Guild: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING }
    }
});