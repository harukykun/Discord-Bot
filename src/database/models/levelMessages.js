const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'levelmessage',
    fields: {
        Guild: { type: DataTypes.STRING },
        Message: { type: DataTypes.TEXT }
    }
});