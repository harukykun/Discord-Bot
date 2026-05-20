const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'invites',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        Invites: { type: DataTypes.INTEGER },
        Total: { type: DataTypes.INTEGER },
        Left: { type: DataTypes.INTEGER }
    }
});