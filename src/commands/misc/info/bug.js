const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "bug",
    category: "Misc",
    description: "Report a bug to me",
    usage: "\`PREFIXbug [bug]\`",
    cooldown: 60,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let guildInfo = client.guildInfoCache.get(message.guild.id)

        const Bug = new Discord.MessageEmbed()
        if (!args[0]) return message.channel.send(Bug
            .setColor(message.guild.me.displayColor)
            .setTitle("Please specify the bug.")
            .setDescription(`Example:\n\`${guildInfo.prefix}bug tickets commmand isnt working properly.\``))

        if (args[0] === "bug") return message.channel.send(Bug
            .setColor(message.guild.me.displayColor)
            .setTitle("Please specify the bug.")
            .setDescription(`Example:\n\`${guildInfo.prefix}bug tickets commmand isnt working properly.\``))

        let bug = args.slice(0).join(" ");

        
        setCooldown(client, this, message);

        message.channel.send(Bug
            .setColor(message.guild.me.displayColor)
            .setTitle("Thanks for submitting a bug!"));

        client.channels.cache.get('783809764337385532')
        .send(Bug
            .setColor(message.guild.me.displayColor)
            .setTitle(`Bug Report`)
            .addField(`**${message.author.tag}** reported:`, `\n\n\`${bug}\`\n\n`)
            .addField(`On the server:`, `${message.guild.name}`)
            .addField(`Server ID:`, `${message.guild.id}`, true)
            .setThumbnail(message.guild.iconURL()).setTimestamp())
    }
}