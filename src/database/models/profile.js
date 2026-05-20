const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'Profile',
    fields: {
        User: { type: DataTypes.STRING },
        Gender: { type: DataTypes.STRING, defaultValue: '' },
        Age: { type: DataTypes.STRING, defaultValue: '' },
        Orgin: { type: DataTypes.STRING, defaultValue: '' },
        Pets: { type: DataTypes.JSONB, defaultValue: [] },
        Songs: { type: DataTypes.JSONB, defaultValue: [] },
        Movies: { type: DataTypes.JSONB, defaultValue: [] },
        Actors: { type: DataTypes.JSONB, defaultValue: [] },
        Artists: { type: DataTypes.JSONB, defaultValue: [] },
        Food: { type: DataTypes.JSONB, defaultValue: [] },
        Hobbys: { type: DataTypes.JSONB, defaultValue: [] },
        Status: { type: DataTypes.STRING, defaultValue: '' },
        Aboutme: { type: DataTypes.TEXT, defaultValue: '' },
        Color: { type: DataTypes.STRING, defaultValue: '' },
        Birthday: { type: DataTypes.STRING, defaultValue: '' }
    }
});