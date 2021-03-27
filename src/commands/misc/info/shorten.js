const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

const shorten = require("isgd");

module.exports = {
    name: "shorten",
    category: "Misc",
    aliases: ["short", 'linkshorten', 'ls'],
    description: "Shortens a link (no spaces in the title)",
    usage: "\`PREFIXshorten [link] [title]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const guildInfo = client.guildInfoCache.get(message.guild.id)

        if (!args[0])
            return message.channel.send({
                embed: {
                    color: message.guild.me.displayColor,
                    description: `❌ **Proper Usage: \`${guildInfo.prefix}shorten [URL] [title]\`**`,
                },
            });
        if (!args[1]) {
            shorten.shorten(args[0], function (res) {
                if (res.startsWith("Error:"))
                    return message.channel.send({
                        embed: {
                            color: message.guild.me.displayColor,
                            description: "❌ **Please enter a valid URL!**",
                        },
                    });
                message.channel.send({
                    embed: {
                        color: message.guild.me.displayColor,
                        description: `**${res}**`,
                    },
                });
            });
        } else {
            shorten.custom(args[0], args[1], function (res) {
                if (res.startsWith("Error:"))
                    return message.channel.send({
                        embed: {
                            color: message.guild.me.displayColor,
                            description: `**${res}**`,
                        },
                    });
                message.channel.send({
                    embed: {
                        color: message.guild.me.displayColor,
                        description: `**${res}**`,
                    },
                });
            });
        }
    }
}