const { GiveawaysManager } = require("discord-giveaways");
const Discord = require("discord.js");
const fs = require('fs');

const giveawayModel = require("../../database/models/giveaways");

module.exports = (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            const results = await giveawayModel.find({}).lean().exec();
            // PostgreSQL BIGINT returns strings; discord-giveaways expects numbers
            return results.map(g => {
                if (g.startAt != null) g.startAt = Number(g.startAt);
                if (g.endAt != null) g.endAt = Number(g.endAt);
                return g;
            });
        }

        async saveGiveaway(messageId, giveawayData) {
            await giveawayModel.create(giveawayData);
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            const existing = await giveawayModel.findOne({ messageId });
            if (existing) {
                for (const [key, value] of Object.entries(giveawayData)) {
                    if (value !== undefined) {
                        existing[key] = value;
                    }
                }
                await existing.save();
            }
            return true;
        }

        async deleteGiveaway(messageId) {
            await giveawayModel.deleteOne({ messageId });
            return true;
        }

        async refreshStorage() {
            return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
        }
    };

    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: client.config.colors.normal,
            embedColorEnd: client.config.colors.error,
            reaction: '🥳'
        }
    }, true);

    client.giveawaysManager = manager;

    const events = fs.readdirSync(`./src/events/giveaway`).filter(files => files.endsWith('.js'));

    for (const file of events) {
        const event = require(`../../events/giveaway/${file}`);
        manager.on(file.split(".")[0], event.bind(null, client)).setMaxListeners(0);
    };
}