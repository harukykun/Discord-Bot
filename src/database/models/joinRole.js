const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'joinRole',
    fields: {
        Guild: { type: DataTypes.STRING },
        Role: { type: DataTypes.STRING }
    }
});