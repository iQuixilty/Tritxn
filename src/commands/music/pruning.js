const { canModifyQueue } = require("../../utils/vcUtil");
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const fs = require("fs");
let config;


try {
    config = require("../../../config/config.json");
} catch (error) {
    config = null;
}

module.exports = {
    name: "pruning",
    category: "Music",
    aliases: ["prune"],
    description: "Prunes the bots messages",
    usage: "\`PREFIXpruning\`",
    perms: ['ADMINSTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK', 'CONNECT', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        if (!config) return;
        config.PRUNING = !config.PRUNING;

        const pru = new Discord.MessageEmbed()

        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
            if (err) {
                console.log(err);
                return message.channel.send(pru.setColor(message.guild.me.displayColor).setTitle("There was an error writing to the file.")).catch(console.error);
            }

            return message.channel
                .send(pru.setColor(message.guild.me.displayColor).setDescription(`Message pruning is ${config.PRUNING ? "**enabled**" : "**disabled**"}`))
                .catch(console.error);
        });
    }
};
