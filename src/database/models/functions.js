const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'functions',
    fields: {
        Guild: { type: DataTypes.STRING },
        Levels: { type: DataTypes.BOOLEAN, defaultValue: false },
        Beta: { type: DataTypes.BOOLEAN, defaultValue: false },
        AntiAlt: { type: DataTypes.BOOLEAN, defaultValue: false },
        AntiSpam: { type: DataTypes.BOOLEAN, defaultValue: false },
        AntiCaps: { type: DataTypes.BOOLEAN, defaultValue: false },
        AntiInvite: { type: DataTypes.BOOLEAN, defaultValue: false },
        AntiLinks: { type: DataTypes.BOOLEAN, defaultValue: false },
        Prefix: { type: DataTypes.STRING },
        Color: { type: DataTypes.STRING }
    }
});