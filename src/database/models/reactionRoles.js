const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'reactionRoles',
    fields: {
        Guild: { type: DataTypes.STRING },
        Message: { type: DataTypes.STRING },
        Category: { type: DataTypes.STRING },
        Roles: { type: DataTypes.JSONB }
    }
});