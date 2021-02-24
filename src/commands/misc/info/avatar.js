const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "avatar",
    category: "Misc",
    aliases: ["a", "av"],
    cooldown: 1,
    description: "Displays a users avatar",
    usage: "\`PREFIXavatar\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)

        let user = args[0]

          if (!user) {
            user = message.guild.members.cache.get(message.author.id);
        } else {
            user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        }

        let png = user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        let jpg = user.user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 1024 })
        let webp = user.user.displayAvatarURL({ format: 'webp', dynamic: true, size: 1024 })

        let avatarembed = new Discord.MessageEmbed()
            .setTitle(`${user.user.username}'s Avatar`)
            .setColor(message.guild.me.displayColor)
            .setDescription(`\n**Link as:**\n[png](${png}) **|** [jpg](${jpg}) **|** [webp](${webp})`)

            .setImage(user.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setFooter(`Requested By: ${message.author.tag}`, `${message.author.displayAvatarURL()}`)
            .setTimestamp()

        return message.channel.send(avatarembed)
    }
}
