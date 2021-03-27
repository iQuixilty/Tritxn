const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const {setCooldown} = require('../../utils/utils')
/**
 * @type {import('../../typings.d').Command}
 */


module.exports = {
    name: "blacklistchannel",
    category: "Levels",
    aliases: ["bchannel", "bchan"],
    usage: "- \`PREFIXblacklistchannel\` to display all currently blacklisted channel\n- \`PREFIXblacklistchannel [channel] [blacklist/whitelist]\` to blacklist/whitelist channel .",
    description: "Allows you to blacklist and whitelist channel so that messages sent in the blacklisted channel will not give any XP to the author",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let guildLevels = client.guildLevelsCache.get(message.guild.id);
        let blacklistedChannels = guildLevels.blacklistedChannels;

        const embed = new Discord.MessageEmbed()
            .setTimestamp()

        if (!args[0]) {
            embed
                .setColor(message.guild.me.displayColor)
                .setTitle('Blacklisted Channels')
                .setDescription(blacklistedChannels.length === 0 ? 'There are no blacklisted channels in this server!' : '<#' + blacklistedChannels.join('>\n\n <#') + '>')

            return message.channel.send(embed)
        }


        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        if (!channel) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The channel ${args[0]} does not exist.**`))
        if (channel.type !== 'text') return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**You can only disable text channels.**`))

        switch (args[1]) {
            case 'blacklist':
                if (blacklistedChannels.includes(channel.id)) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The channel **${channel}** is already blacklisted.**`))

                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $push: { blacklistedChannels: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.blacklistedChannels.push(channel.id)
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The channel **${channel}** has been blacklisted.**`))
                break;
            case 'whitelist':
                if (!blacklistedChannels.includes(channel.id)) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The channel **${channel}** is already whitelisted.**`))

                guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $pull: { blacklistedChannels: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The channel **${channel}** has been whitelisted.**`))
                break;
            default:
                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} please check the usage of the command.**`))
                break;
        }
    }
}
