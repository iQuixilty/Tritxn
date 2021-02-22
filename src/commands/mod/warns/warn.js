const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const mongo = require('../../../../schemas/mongo')
const warnSchema = require('../../../../schemas/warn-schema')

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "warn",
    category: "Moderation",
    description: "Warns a user and stores the warning",
    usage: "\`PREFIXwarn [user] [reason]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let target =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])

        const warnE = new Discord.MessageEmbed()

        if (!target) {
            message.channel.send(warnE.setColor('RED').setDescription(`**${emoji.downvote} Please specify someone to warn**`))
            return
        }

        if (target.bot) {
            message.channel.send(warnE.setColor('RED').setDescription(`**${emoji.downvote} Bots don\'t have warnings**`))
            return
        }


        if (args.length < 2) {
            message.channel.send(warnE.setColor('RED').setDescription(`**${emoji.downvote} Please specify a user and a reason**`))
            return;
        }

        args.shift()

        const guildId = message.guild.id
        const userId = target.id
        const reason = args.join(' ')

        const warning = {
            author: message.member.id,
            timestamp: new Date().getTime(),
            reason
        }

        await warnSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $push: {
                warnings: warning
            }
        }, {
            upsert: true,
        })

        message.channel.send(warnE
            .setColor(message.guild.me.displayColor)
            .setAuthor(`New warning for: ${target.user.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**<@${userId}> has been warned for: \`${reason}\`**`)
            .setFooter(`Moderator Responsible: ${message.author.tag}`))

        target.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(`**You have been warned in ${message.guild.name} for \`${reason}\`**`))
            .catch((e) => {
                console.log(`I couldnt DM the user`)
            })


    }
}