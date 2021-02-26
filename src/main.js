const discord = require("discord.js");

const mongoose = require('mongoose')
const config = require("../config/config.json");

const { registerCommands, registerEvents } = require('./utils/registry');
const { log } = require('./utils/utils')

const { GiveawaysManager } = require('discord-giveaways');

const client = new discord.Client({
    ws: { intents: discord.Intents.ALL },
    restTimeOffset: 0,
});

const Levels = require("discord-xp");
Levels.setURL(config.MONGODB_URI); 

require('events').EventEmitter.defaultMaxListeners = 60;

(async () => {
    client.commands = new discord.Collection();
    client.categories = new discord.Collection();

    client.guildInfoCache = new discord.Collection();
    client.guildSettingsCache = new discord.Collection()
    client.guildAuditCache = new discord.Collection()

    client.snipes = new discord.Collection()
    client.esnipes = new discord.Collection()

    client.games = new discord.Collection()




    client.queue = new Map();

    client.DBGuild = require('../schemas/guildSchema');
    client.DBWarn = require('../schemas/warn-schema')
    client.DBConfig = require('../schemas/config');
    client.DBSettings = require('../schemas/guildSettingsSchema')
    client.DBAudit = require('../schemas/auditLogSchema')
    client.DBHighlight = require('../schemas/highlightSchema')

    client.serverCooldowns = new discord.Collection();
    client.globalCooldowns = new discord.Collection();

    client.muted = new Set()
    client.timeout = new Set()

    await registerEvents(client, '../eventHandlers');
    await registerCommands(client, '../commands');


    const manager = new GiveawaysManager(client, {
        storage: "./giveaways.json",
        updateCountdownEvery: 10000,
        default: {
            botsCanWin: false,
            endedGiveawaysLifetime: 3600000,
            reaction: "<a:tada:811787239494516767>"
        }
    })
    client.giveaways = manager

    manager.on('giveawayEnded', (giveaway, winners) => {
        const winEmbed = new discord.MessageEmbed()

        winners.forEach((member) => {
            member.send(winEmbed
                .setColor('GREEN')
                .setTitle(`You A Winner!`)
                .setDescription('Congratulations ' + member.user.username + ', you won ' + `[${giveaway.prize}](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) in ${giveaway.message.guild.name}`)
                .setFooter(giveaway.message.channel.name));
        });

    });

    manager.on('giveawayRerolled', (giveaway, winners) => {
        const rerollEmbed = new discord.MessageEmbed()

        winners.forEach((member) => {
            member.send(rerollEmbed
                .setColor('GREEN')
                .setTitle(`You A Winner!`)
                .setDescription('Congratulations ' + member.user.username + ', you won the reroll for ' + `[${giveaway.prize}](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) in ${giveaway.message.guild.name}`)
                .setFooter(giveaway.message.channel.name))
        });
    });


    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        const blacklistFetch = await client.DBConfig.findByIdAndUpdate('blacklist', {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        client.BlacklistCache = new Set(blacklistFetch.blacklisted);

        log("SUCCESS", "src/main.js", "Connected to the database.")
    } catch (e) {
        log("ERROR", "src/main.js", `Error connecting to the database: ${e.message}`)
        log("ERROR", "src/main.js", "As of now, the prefab heavily relies on a successful connection.\nThere is a short guide on how to setup a MongoDB cluster (online cluster, not localhost) over at https://github.com/canta-slaus/bot-prefab/wiki/Setting-up-a-cluster")
        mongoose.connection.close()
        process.exit(1)
    };

    try {
        await client.login(config.TOKEN);
        log("SUCCESS", "src/main.js", `Logged in as ${client.user.tag}`);
    } catch (e) {
        log("ERROR", "src/main.js", `Error logging in: ${e.message}`);
    };

    log("SUCCESS", "src/main.js", "Added all commands, categories, events, schemas and connected to MongoDB.");
})();


client.on('ready', () => {
    client.user.setActivity(`with my economy`, { type: 'PLAYING' }).catch(console.error);
})


