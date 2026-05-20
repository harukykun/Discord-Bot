const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'warnCase',
    fields: {
        Guild: { type: DataTypes.STRING },
        Case: { type: DataTypes.INTEGER }
    }
});