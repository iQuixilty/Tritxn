const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const afkSchema = require('../../../schemas/afkschema')
const { setCooldown } = require('../../utils/utils')

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "afk",
    category: "Utility",
    ignoreDisabledChannels: true,
    description: "Set a afk message",
    usage: "\`PREFIXafk [message]\`",
    cooldown: 5,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let afkMessage = args.join(' ')
        let userId = message.author.id
        let guildId = message.guild.id

        const embed = new Discord.MessageEmbed()

        setCooldown(client, this, message)

        if (!afkMessage) {
            afkMessage = 'AFK'
        }

        await afkSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $set: {
                afk: afkMessage,
                timestamp: new Date().getTime(),
                username: message.member.nickname === null ? message.author.username : message.member.nickname
            }
        }, {
            upsert: true,
        })

        await message.member.setNickname(`[AFK] ${message.member.nickname === null ? `${message.author.username}` : `${message.member.nickname}`}`).catch((e) => {
            console.log('No Permissions')
        })

        return message.channel.send(embed
            .setColor(message.guild.me.displayColor)
            .setAuthor(`Your AFK Message Has Been Set`, message.author.displayAvatarURL())
            .setDescription(`\`${afkMessage}\``)
            .setTimestamp())
    }
}

