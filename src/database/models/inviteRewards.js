const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'inviteRewards',
    fields: {
        Guild: { type: DataTypes.STRING },
        Invites: { type: DataTypes.INTEGER },
        Role: { type: DataTypes.STRING }
    }
});