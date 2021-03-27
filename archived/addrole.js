// const PREFIX = require('../config/config.json').PREFIX;
// const Discord = require('discord.js')

// const emoji = require('../config/emoji.json')

// /** 
//  * @type {import('../src/typings.d').Command}
// */

// module.exports = {
//     name: "addrole",
//     category: "Moderation",
//     aliases: ['ar'],
//     description: "Adds a role to the mentioned user; The role must be lower than the bots role to be added successfully",
//     usage: "\`PREFIXaddrole [user] [role]\`",
//     perms: ['ADMINISTRATOR'],
//     clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],

//     execute: async function (client, message, args) {
//         const are = new Discord.MessageEmbed()

//         let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

//         if (!user) {
//             message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${message.author} please mention who to add a role too**`))
//             return;
//         }

//         let roleId = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

//         if (!roleId) {
//             return message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${message.author} please add what role you want to add to the user**`))
//         }

        
//         let botHighestRole = message.guild.me.roles.highest;
//         if (roleId.position >= botHighestRole.position) {
//             return message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${message.author} that role is higher than my own**`));
//         }
        

//         let highestRole = message.member.roles.highest;
//         if (roleId.position >= highestRole.position) {
//             return message.channel.send(are
//                 .setColor('RED')
//                 .setDescription(`**${emoji.downvote} ${message.author} you cant add a role higher than yourself**`));
//         }


//         user.roles.add(roleId)

//         message.channel.send(are
//             .setColor('GREEN')
//             .setTitle(`${emoji.upvote} Role Added Successfully`)
//             .setDescription(`Added the ${roleId} role to ${user} successfully`))

//     }
// }