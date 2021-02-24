const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "setleave",
    category: "Utility",
    aliases: ["setl", "sl", "leave"],
    description: "Sets a leave message for your server. Supported variables are `{user}`, `{username}`, `{usertag}`, `{membercount}`, `{guild}`, `{creation}`",
    usage: "\`PREFIXsetleave [text]\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute: async function (client, message, args) {
        
        const setLe = new Discord.MessageEmbed()

        let guildSettings = client.guildSettingsCache.get(message.guild.id)
        let leaveText = guildSettings.leaveChannelText
        let leaveChannel = guildSettings.leaveChannelId

        const channel =  client.channels.cache.get(leaveChannel)
        
        if (args.length < 1) {
           return message.channel.send(setLe
            .setColor(message.guild.me.displayColor)
            .setTitle('Leave Channel Text')
            .setDescription(leaveText === undefined ? 'You have not set a leave text channel for this server yet' : leaveText)
            .setTimestamp()
            .setFooter(channel === undefined ? 'None' : channel.name))

        }

        const channelId = message.channel.id
        let text = args.join(' ')

        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { leaveChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { leaveChannelText: text } }, { new: true, upsert: true, setDefaultsOnInsert: true })

        guildSettings.leaveChannelId = channelId
        guildSettings.leaveChannelText = text
        client.guildSettingsCache.set(message.guild.id, guildSettings)

        message.channel.send(setLe.setColor(message.guild.me.displayColor).setTitle("Your Leave Message Has Been Set").setDescription(text))

    }
}
