const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setSavedCooldown } = require('../../../utils/utils')


module.exports = {
    name: "suggest",
    category: "Misc",
    savedCooldown: 60 * 5,
    description: "Suggest a feature to me",
    usage: "\`PREFIXsuggest [suggestion]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        
        const Sug = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(Sug
            .setColor(message.guild.me.displayColor)
            .setTitle("Please specify the suggestion.")
            .setDescription('Example:\n`r!suggest ticket system`'))

        if (args[0] === "suggest") return message.channel.send(Sug
            .setColor(message.guild.me.displayColor)
            .setTitle("Please specify the suggestion.")
            .setDescription('Example:\n`r!suggest ticket system`'))

        let suggest = args.slice(0).join(" ");

        setSavedCooldown(client, this, message)

        message.channel.send(Sug
            .setColor(message.guild.me.displayColor)
            .setTitle("Thanks for suggesting!"));

        client.channels.cache.get('783827773247586314')
            .send(Sug
                .setColor(message.guild.me.displayColor)
                .setTitle(`Suggestion`)
                .addField(`**${message.author.tag}** suggested:`, `\n\n\`${suggest}\`\n\n`)
                .addField(`On the server:`, `${message.guild.name}`)
                .addField(`Server ID:`, `${message.guild.id}`, true)
                .setThumbnail(message.guild.iconURL()).setTimestamp())
    }
}