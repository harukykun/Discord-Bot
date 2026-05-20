const { DataTypes } = require('sequelize');
const { createModel } = require('../connect');

module.exports = createModel({
    name: 'boostMessage',
    fields: {
        Guild: { type: DataTypes.STRING },
        boostMessage: { type: DataTypes.TEXT },
        unboostMessage: { type: DataTypes.TEXT }
    }
});