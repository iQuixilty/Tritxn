const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "setleave",
    category: "Utility",
    aliases: ["setl", "sl", "leave"],
    description: "Sets a leave message for your server",
    usage: "\`PREFIXsetleave [leave message (use <@> if you want to @ the user)]\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute: async function (client, message, args) {
        
        const setLe = new Discord.MessageEmbed()

        let guildSettings = client.guildSettingsCache.get(message.guild.id)


        if (args.length < 1) {
            message.channel.send(setLe.setColor(message.guild.me.displayColor).setDescription("**Please specify a leave message**"))
            return;
        }

        const channelId = message.channel.id
        let text = args.join(' ')

        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { leaveChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { leaveChannelText: text } }, { new: true, upsert: true, setDefaultsOnInsert: true })

        guildSettings.leaveChannelSettings = channelId
        client.guildSettingsCache.set(message.guild.id, guildSettings)

        message.channel.send(setLe.setColor(message.guild.me.displayColor).setTitle("Your Leave Message Has Been Set").setDescription(text))

    }
}
