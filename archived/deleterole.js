// const PREFIX = require('../../../../config/config.json').PREFIX;
// const Discord = require('discord.js')
// ////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

// const emoji = require('../../../../config/emoji.json')

// module.exports = {
//     name: "deleterole",
//     category: "Moderation",
//     aliases: ['dr', 'removerole'],
//     description: "Deletes a role from the mentioned user; The role must be lower than the bots role to be removed successfully",
//     usage: "\`PREFIXdeleterole [user] [role]\`",
//     perms: ['ADMINISTRATOR'],
//     clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],

//     execute: async function (client, message, args) {
//         const are = new Discord.MessageEmbed()

//         let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

//         if (!user) {
//             message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${emoji.downvote} ${message.author} please mention who to remove a role from**`))
//             return;
//         }

//         let roleId = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

//         if (!roleId) {
//             return message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${emoji.downvote} ${message.author} please add what role you want to remove from the user**`))
//         }

//         let highestRole = message.member.roles.highest;
//         if (roleId.position >= highestRole.position) {
//             return message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${emoji.downvote} ${message.author} you cant remove a role higher than yourself**`));
//         }


//         user.roles.remove(roleId)

//         message.channel.send(are
//             .setColor('GREEN')
//             .setTitle(`${emoji.upvote} Role Removed Successfully`)
//             .setDescription(`Removed the ${roleId} role from ${user} successfully`))

//     }
// }