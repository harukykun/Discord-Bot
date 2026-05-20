/*
 * This file adds a developer badge to a user 
 * Only use this if you want to add a badge to a user
 * If someone tells you to use this to add their id, they are lying 
 * 
 * @string member - The member you want to add the badge to
 */
const chalk = require('chalk');
if (!process.argv[2]) {
    console.log(chalk.red(`[ERROR]`), chalk.white(`>>`), chalk.red(`Developer Badge`), chalk.white(`>>`), chalk.red(`Please provide a member id!`))
    process.exit(1);
}
require('dotenv').config();
// Require database
const { Sequelize, DataTypes } = require('sequelize');
// Require the model
const model = require('./database/models/badge.js');

// Connect to the database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.DATABASE_SSL === 'false' ? false : {
            require: true,
            rejectUnauthorized: false
        }
    },
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log(chalk.green(`[SUCCESS]`), chalk.white(`>>`), chalk.green(`Developer Badge`), chalk.white(`>>`), chalk.green(`Connected to the database!`));

        // Initialize the model
        model._initModel(sequelize);
        await sequelize.sync();

        // Find the user
        const data = await model.findOne({ User: process.argv[2] });

        if (!data) {
            // Create a new document
            await model.create({
                User: process.argv[2],
                FLAGS: ["DEVELOPER"]
            });
            console.log((chalk.white(`>>`)), chalk.red(`Developer Badge`), chalk.green(`has been added to the user!`));
        } else {
            // Update the document
            const flags = data.FLAGS || [];
            flags.push("DEVELOPER");
            data.FLAGS = flags;
            await data.save();
            console.log((chalk.white(`>>`)), chalk.red(`Developer Badge`), chalk.green(`has been added to the user!`));
        }

        await sequelize.close();
        process.exit(0);
    } catch (err) {
        console.log(chalk.red(`[ERROR]`), chalk.white(`>>`), chalk.red(`Developer Badge`), chalk.white(`>>`), chalk.red(`Failed to connect to the database!`));
        console.log(err);
        process.exit(1);
    }
})();