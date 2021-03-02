const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { version } = require('../../../../package.json');

module.exports = {
    name: "botinfo",
    category: "Misc",
    aliases: ["bi"],
    description: "Displays information about the bot",
    usage: "\`PREFIXbotinfo\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let guildPrefix = guildInfo.prefix

        let totalMembers = 0;
        for (const guild of client.guilds.cache) {
            totalMembers += (await guild[1].members.fetch()).size
        }

        const botInfo = new Discord.MessageEmbed()
            .setColor((message.guild.me.displayColor))
            .setAuthor(`Information about ${client.user.username} Bot`, client.user.displayAvatarURL())
            .addField('Bot Name:', `\`${client.user.tag}\``)
            .addField("Bot Owner:", '`Qzxy#0001`')
            .addField("Version:", `\`${version}\``)
            .addField("Prefix:", `\`${guildInfo.prefix}\``)
            .addField("Time Since Last Restart:", `\`${process.uptime().toFixed(2)}s\``)
            .addField("Server Count:", `\`${client.guilds.cache.size}\``)
            .addField("Total Members:", `\`${totalMembers}\``)
            // .addField("Total Commands:", `\`${client.commands.size}\``)
            .addField('Channels:', `\`${client.channels.cache.size.toLocaleString()}\``)

        message.channel.send(botInfo)
    }
}