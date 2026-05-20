const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'ticketMessage',
    fields: {
        Guild: { type: DataTypes.STRING },
        openTicket: { type: DataTypes.TEXT },
        dmMessage: { type: DataTypes.TEXT }
    }
});