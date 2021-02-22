const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const warnSchema = require('../../../../schemas/warn-schema')

const emoji = require('../../../../config/emoji.json')
const moment = require('moment')

module.exports = {
    name: "warnings",
    category: "Moderation",
    description: "Displays the warnings of a user",
    aliases: ['lw', 'listwarns', 'listwarnings'],
    usage: "\`PREFIXwarnings [user]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;
        const guildId = message.guild.id
        const userId = target.id


        const warningE = new Discord.MessageEmbed()

        if (!target) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Please specify a user to check the warnings for**`))
            return
        }

        if (target.bot) {
            message.channel.send(warningE.setColor('RED').setDescription(`**${emoji.downvote} Bots don\'t have warnings**`))
            return
        }


        const results = await warnSchema.findOne({
            guildId,
            userId,
        })

        if (results === null) {
            message.channel.send(warningE
                .setColor('RED')
                .setDescription(`**${emoji.downvote} There are no warnings for this user**`))
            return;
        }



        let reply = ``

        for (let i = 0; i < results.warnings.length; i++) {
            const { author, timestamp, reason } = results.warnings[i]

            reply += `${i}. **Warning** \nIssued By: <@${author}> **|** Issued At: **${moment(timestamp).format("MMM DD YYYY")}** \nReason: \`${reason}\`\n\n`
        }

        message.channel.send(warningE.setColor(message.guild.me.displayColor)
            .setAuthor(`Previous warnings for ${target.user.username}`, target.user.displayAvatarURL())
            .setDescription(reply))


    }
}