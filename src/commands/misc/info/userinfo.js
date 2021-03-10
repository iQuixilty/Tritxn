const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const moment  = require('moment')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "userinfo",
    category: "Misc",
    aliases: ["ui"],
    description: "Displays info about a user.",
    usage: "\`PREFIXuserinfo [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let userINFO =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;


        const userinfo = new Discord.MessageEmbed()
            .setTitle(`Heres some Info About ${userINFO.user.username}`)
            .setThumbnail(userINFO.user.displayAvatarURL())
            .setAuthor(`Info On ${userINFO.user.username}`, userINFO.user.displayAvatarURL())
            .addField("**Username:**", `${userINFO.user.username}`, true)
            .addField("**Tag:**", `${userINFO.user.discriminator}`, true)
            .addField("**ID:**", `${userINFO.user.id}`, false)
            .addField("**Created At:**", `${moment(userINFO.user.createdAt).format("MMM Do YYYY")}`, true)
            .addField("**Joined Server:**", `${moment(userINFO.joinedAt).format("MMM Do YYYY")}`, true)
            .addField("**Highest Role:**", `${message.guild.member(userINFO).roles.highest}`)
            .addField('**Roles:**', message.member.roles.cache.size > 30 ? 'Too Many' : `<@&${message.guild.member(userINFO)._roles.join('> <@&')}>`)
            .setFooter(`Tritxn Bot`, client.user.avatarURL())
            .setTimestamp()
            .setColor(message.guild.me.displayColor)
        message.channel.send(userinfo)
    }
}
