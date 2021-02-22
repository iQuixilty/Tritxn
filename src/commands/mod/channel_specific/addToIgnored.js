const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

module.exports = {
    name: "addtoignored",
    category: "Moderation",
    aliases: ['atig', 'addtig'],
    description: "Adds the channel to a ignored set where if a server lock is in place, permissions for those channels will not be touched.",
    usage: "- \`PREFIXaddtoignored\` to display all currently ignored channels\n- \`PREFIXaddtoignored [#channel] [set/remove]\` to set/remove channels.",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const atigE = new Discord.MessageEmbed()

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        let guildSettings = client.guildSettingsCache.get(message.guild.id);
        let ignoredChannelSetting = guildSettings.ignoreChannelId
      
        if (!channel) {
            return message.channel.send(atigE
                .setTimestamp()
                .setColor(message.guild.me.displayColor)
                .setTitle('Ignored Channels')
                .setDescription(ignoredChannelSetting.length === 0 ? 'There are no ignored channels in this server!' : '<#' + ignoredChannelSetting.join('>\n\n <#') + '>'))
        }

        const channelId = channel.id

        switch (args[1]) {
            case 'set':
                if (ignoredChannelSetting.includes(channelId)) return message.channel.send(atigE.setColor(message.guild.me.displayColor).setDescription(`**This channel is already going to be ignored in the event of a lockdown**`))

                await client.DBSettings.findByIdAndUpdate(message.guild.id, { $push: { ignoreChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildSettings.ignoreChannelId.push(channelId)
                client.guildSettingsCache.set(message.guild.id, guildSettings)


                message.channel.send(atigE
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${channel} will now be ignored in the event of a server lockdown.**`)
                    .setTimestamp());

                break;
            case 'remove':
                if (!ignoredChannelSetting.includes(channelId)) return message.channel.send(atigE.setColor(message.guild.me.displayColor).setDescription(`**This channel is already not going to be ignored in the event of a lockdown**`))

                guildSettings = await client.DBSettings.findByIdAndUpdate(message.guild.id, { $pull: { ignoreChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildSettingsCache.set(message.guild.id, guildSettings)


                message.channel.send(atigE
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${channel} will now not be ignored in the event of a server lockdown.**`)
                    .setTimestamp());
                break;
            default:
                message.channel.send(atigE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                break;
        }
    }
}