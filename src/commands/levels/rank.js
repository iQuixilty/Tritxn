const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const canvacord = require('canvacord')

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "rank",
    category: "Levels",
    aliases: ["r"],
    description: "Displays what rank you are",
    usage: "\`PREFIXrank [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        const target = message.mentions.users.first() || message.author;

        const user = await Levels.fetch(target.id, message.guild.id, true);

        if (!user) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription("**This user has not amassed any XP yet.**"));

        const neededXp = Levels.xpFor(parseInt(user.level) + 1)
        
        const rank = new canvacord.Rank()
            .setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setLevel(user.level)
            .setRequiredXP(neededXp)
            .setProgressBar(message.guild.me.displayHexColor, "COLOR")
            .setUsername(target.username)
            .setDiscriminator(target.discriminator)
            .setRank(user.position)

        rank.build()
        .then(data => {
            const attachment = new Discord.MessageAttachment(data, 'rank.png')
            message.channel.send(attachment)
        })


    }
}