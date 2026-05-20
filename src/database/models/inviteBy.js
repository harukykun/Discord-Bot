const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'inviteBy',
    fields: {
        Guild: { type: DataTypes.STRING },
        inviteUser: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING }
    }
});