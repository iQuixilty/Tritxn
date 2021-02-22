const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { MessageEmbed } = require('discord.js')

const ms = require('ms')

module.exports = {
    name: "gdelete",
    category: "Giveaways",
    aliases: ['gdel', 'delgaw'],
    description: "Deletes a existing giveaway",
    usage: "To delete a giveaway use: \`PREFIXgdelete [giveaway ID]\` Giveways will be deleted from the database after 60 minutes",
    perms: ['MANAGE_GUILD'],
    examples: "\`PREFIXgdelete 791130961475141642\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const GIVEEMBED = new Discord.MessageEmbed()

        let messageID = args[0];
        if (!messageID) return message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription('**No message ID provided**'))

        client.giveaways.delete(messageID).then(() => {
            message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription("**Success! Giveaway deleted!**"));
        }).catch((_err) => {
            message.channel.send(GIVEEMBED.setColor(message.guild.me.displayColor).setDescription("**No giveaway found for " + messageID + ", please check and try again**"));
        });

    }
}