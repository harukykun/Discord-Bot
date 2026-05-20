const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'inviteMessages',
    fields: {
        Guild: { type: DataTypes.STRING },
        inviteJoin: { type: DataTypes.TEXT },
        inviteLeave: { type: DataTypes.TEXT }
    }
});