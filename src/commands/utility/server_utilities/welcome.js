const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "setwelcome",
    category: "Utility",
    aliases: ["setw", "sw", "welcome"],
    description: "Sets a welcome message for your server",
    usage: "\`PREFIXsetwelcome [welcome message (use <@> if you want to @ the user)]\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute: async function (client, message, args) {
        const setWe = new Discord.MessageEmbed()

        let guildSettings = client.guildSettingsCache.get(message.guild.id)

        if (args.length < 1) {
            message.channel.send(setWe.setColor(message.guild.me.displayColor).setDescription("**Please specify a welcome message**"))
            return;
        }

        const channelId = message.channel.id
        let text = args.join(' ')

        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { welcomeChannelId: channelId } }, { new: true, upsert: true, setDefaultsOnInsert: true })
        await client.DBSettings.findByIdAndUpdate(message.guild.id, { $set: { welcomeChannelText: text } }, { new: true, upsert: true, setDefaultsOnInsert: true })

        guildSettings.welcomeChannelSettings = channelId
        client.guildSettingsCache.set(message.guild.id, guildSettings)

        message.channel.send(setWe.setColor(message.guild.me.displayColor).setTitle("Your Welcome Message Has Been Set").setDescription(text))

    }
}
