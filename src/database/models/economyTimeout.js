const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'economytimeout',
    fields: {
        Guild: { type: DataTypes.STRING },
        User: { type: DataTypes.STRING },
        Beg: { type: DataTypes.STRING },
        Crime: { type: DataTypes.STRING },
        Daily: { type: DataTypes.STRING },
        Weekly: { type: DataTypes.STRING },
        Monthly: { type: DataTypes.STRING },
        Hourly: { type: DataTypes.STRING },
        Work: { type: DataTypes.STRING },
        Rob: { type: DataTypes.STRING },
        Fish: { type: DataTypes.STRING },
        Hunt: { type: DataTypes.STRING },
        Yearly: { type: DataTypes.STRING },
        Present: { type: DataTypes.STRING }
    }
});