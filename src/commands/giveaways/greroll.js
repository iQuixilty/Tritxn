const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { MessageEmbed } = require('discord.js')

const ms = require('ms')

module.exports = {
    name: "greroll",
    category: "Giveaways",
    aliases: ['reroll', 'rerollgaw', 'gre'],
    description: "Rerolls a existing giveaway for new winners",
    usage: "To reroll a giveaway use: \`PREFIXgreroll [giveaway ID]\` Giveways will be deleted from the database after 60 minutes",
    perms: ['MANAGE_GUILD'],
    examples: "\`PREFIXgreroll 791130961475141642\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        const GIVEEMBED = new Discord.MessageEmbed()
        let messageID = args[0];
        if (!messageID) {
            return message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription('**No message ID provided**'))
        }

        client.giveaways.reroll(messageID).then(() => {

            message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription("**Success! Giveaway rerolled!**"));
        }).catch((_err) => {

            message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription("**No giveaway found for " + messageID + ", please check and try again**"));
        });
    }
}