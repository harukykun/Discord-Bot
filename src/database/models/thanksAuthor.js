const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'thanksAuthor',
    fields: {
        User: { type: DataTypes.STRING },
        Author: { type: DataTypes.STRING }
    }
});