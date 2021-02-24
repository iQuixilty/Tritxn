const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "setwelcome",
    category: "Utility",
    aliases: ["setw", "sw", "welcome"],
    description: "Sets a welcome message for your server. Supported variables are `{user}`, `{username}`, `{usertag}`, `{membercount}`, `{guild}`, `{creation}`",
    usage: "\`PREFIXsetwelcome [text]\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute: async function (client, message, args) {
        const setWe = new Discord.MessageEmbed()

        let guildSettings = client.guildSettingsCache.get(message.guild.id)
        let welcomeText = guildSettings.welcomeChannelText
        let welcomeChannel = guildSettings.welcomeChannelId

        const channel = client.channels.cache.get(welcomeChannel)

        if (args.length < 1) {
            return message.channel.send(setWe
                .setColor(message.guild.me.displayColor)
                .setTitle("Welcome Channel Text")
                .setDescription(welcomeText === undefined ? 'You have not set a welcome text channel for this server yet' : welcomeText)
                .setTimestamp()
                .setFooter(channel === undefined ? 'None' : channel.name))
        }

        const channelId = message.channel.id
        let text = args.join(' ')

        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { welcomeChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { welcomeChannelText: text } }, { new: true, upsert: true, setDefaultsOnInsert: true })

        guildSettings.welcomeChannelId = channelId
        guildSettings.welcomeChannelText = text
        client.guildSettingsCache.set(message.guild.id, guildSettings)

        message.channel.send(setWe.setColor(message.guild.me.displayColor).setTitle("Your Welcome Message Has Been Set").setDescription(text))

    }
}
