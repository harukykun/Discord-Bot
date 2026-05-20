const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'radios',
    fields: {
        Guild: { type: DataTypes.STRING },
        Name: { type: DataTypes.STRING },
        Url: { type: DataTypes.TEXT }
    }
});