////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor;
const { MessageEmbed, DiscordAPIError } = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "channels",
    category: "Utility",
    aliases: ["chan"],
    usage: "- \`PREFIXchannels\` to display all currently disabled channels\n- \`PREFIXchannels [#channel] [disable/enable]\` to disable/enable channels.",
    canNotDisable: true,
    ignoreDisabledChannels: true,
    description: "Allows you to disable and enable channels",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let guildInfo = client.guildInfoCache.get(message.guild.id);
        let disabledChannels = guildInfo.disabledChannels;

        const channelEmbed = new MessageEmbed()
            .setTimestamp()

        if (!args[0]) {
            channelEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle('Disabled Channels')
                .setDescription(disabledChannels.length === 0 ? 'There are no disabled channels in this server!' : '<#' + disabledChannels.join('>, <#') + '>')

            return message.channel.send(channelEmbed)
        }

        if (!args[0]) return message.channel.send(channelEmbed.setDescription('**Please specify a channel to disable.**'));

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) return message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**The channel ${args[0]} does not exist.**`))
        if (channel.type !== 'text') return message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**You can only disable text channels.**`))

        setCooldown(client, this, message);
        switch (args[1]) {
            case 'disable':
                if (disabledChannels.includes(channel.id)) return message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**The channel ${channel} is already disabled.**`))

                await client.DBGuild.findByIdAndUpdate(message.guild.id, { $push: { disabledChannels: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildInfo.disabledChannels.push(channel.id)
                client.guildInfoCache.set(message.guild.id, guildInfo)

                message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**The channel ${channel} has been disabled.**`))
                break;
            case 'enable':
                if (!disabledChannels.includes(channel.id)) return message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**The channel ${channel} is already enabled.**`))

                guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $pull: { disabledChannels: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildInfoCache.set(message.guild.id, guildInfo)

                message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**The channel ${channel} has been enabled.**`))
                break;
            default:
                message.channel.send(channelEmbed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                break;
        }
    }
}
