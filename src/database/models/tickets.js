const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'tickets',
    fields: {
        Guild: { type: DataTypes.STRING },
        Category: { type: DataTypes.STRING },
        Role: { type: DataTypes.STRING },
        Channel: { type: DataTypes.STRING },
        Logs: { type: DataTypes.STRING },
        TicketCount: { type: DataTypes.INTEGER, defaultValue: 0 }
    }
});