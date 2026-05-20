const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'ticketChannels',
    fields: {
        Guild: { type: DataTypes.STRING },
        TicketID: { type: DataTypes.INTEGER },
        channelID: { type: DataTypes.STRING },
        creator: { type: DataTypes.STRING },
        claimed: { type: DataTypes.STRING },
        resolved: { type: DataTypes.BOOLEAN, defaultValue: false }
    }
});