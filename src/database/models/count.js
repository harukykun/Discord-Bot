const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'count',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        Count: { type: DataTypes.INTEGER }
    }
});