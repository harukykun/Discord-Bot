const Discord = require('discord.js');
require('dotenv').config();
const connect = require('../src/database/connect');
const Schema = require('../src/database/models/functions');

(async () => {
    // Connect to database
    await connect();

    const guildId = '1446031714173587510'; // Test guild ID

    console.log('--- TEST 1: Find one ---');
    let data = await Schema.findOne({ Guild: guildId });
    console.log('Result found:', data ? data.toJSON() : 'null');

    if (data) {
        console.log('--- TEST 2: Update existing ---');
        data.Levels = true;
        console.log('Setting data.Levels to true...');
        await data.save();
        console.log('Saved! Checking database again...');
        let updatedData = await Schema.findOne({ Guild: guildId });
        console.log('Database value now:', updatedData ? updatedData.toJSON() : 'null');
    } else {
        console.log('--- TEST 2: Create new ---');
        console.log('Creating new entry with Levels = true...');
        let newData = await Schema.create({
            Guild: guildId,
            Levels: true
        });
        console.log('Created! Database value now:', newData ? newData.toJSON() : 'null');
    }

    process.exit(0);
})();
