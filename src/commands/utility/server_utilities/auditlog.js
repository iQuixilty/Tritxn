const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "log",
    category: "Utility",
    aliases: ["auditlog", 'logging', 'audit'],
    description: "Allows you to set an audit log channel",
    usage: "- \`PREFIXlog\` to display the server audit log channel\n- \`PREFIXlog [#channel] [set/remove]\` to set/remove the audit log channel",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    execute: async function (client, message, args) {
        let guildSettings = client.guildSettingsCache.get(message.guild.id);
        let auditLogChannel = guildSettings.auditLogChannelId
      
        const logE = new Discord.MessageEmbed()

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        if (!channel) {
            logE
                .setColor(message.guild.me.displayColor)
                .setTitle('Audit Log Channel')
                .setDescription(auditLogChannel === undefined ? 'A audit log channel has not been set up for this server' :  '<#' + auditLogChannel + '>')
                .setTimestamp()

            return message.channel.send(logE)
        }

        let channelId = channel.id

        switch (args[1]) {
            case 'set':
                if (auditLogChannel === channelId) return message.channel.send(logE.setColor(message.guild.me.displayColor).setDescription(`**This channel is already the audit log channel**`))

                await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { auditLogChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildSettings.auditLogChannelId = channelId
                client.guildSettingsCache.set(message.guild.id, guildSettings)


                message.channel.send(logE
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${channel} will now be the audit log channel.**`)
                    .setTimestamp());

                break;
            case 'remove':
                if (auditLogChannel !== channelId) return message.channel.send(logE.setColor(message.guild.me.displayColor).setDescription(`**This channel is already not the audit log channel**`))

                guildSettings = await client.DBSettings.findByIdAndUpdate(message.guild.id, { $unset: { auditLogChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildSettingsCache.set(message.guild.id, guildSettings)


                message.channel.send(logE
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${channel} will now not be the audit log channel**`)
                    .setTimestamp());
                break;
            default:
                message.channel.send(logE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                break;
        }


        
    }
}
