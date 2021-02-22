// const PREFIX = require('../../../../config/config.json').PREFIX;
// const Discord = require('discord.js')

// const messageSchema = require('../../../../schemas/messageSchema')

// const { fetchCache, addToCache } = require('../../../eventHandlers/ready')

// /** 
//  * @type {import('../../../typings.d').Command}
// */

// module.exports = {
//     name: "rrmsg",
//     category: "Utility",
//     aliases: ["reactionrolemessage", 'rrm'],
//     canNotDisable: true,
//     ignoreDisabledChannels: true,
//     description: "Set up a base reaction role message for your server",
//     usage: "- \`PREFIXrrmsg [#channel] [text]\` to set up the reaction role message",
//     perms: ['MANAGE_GUILD'],
//     clientPerms: ['MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_MESSAGES'],

//     execute: async function (client, message, args) {
//         const { guild, mentions } = message
//         const { channels } = mentions
//         const targetChannel = channels.first() || message.channel

//         if (channels.first()) {
//             args.shift()
//         }

//         const text = args.join(' ')

//         const newMessage = await targetChannel.send(text)

//         if (guild.me.hasPermission('MANAGE_MESSAGES')) {
//             message.delete()
//         }

//         addToCache(guild.id, newMessage)

//         new messageSchema({
//             guildId: guild.id,
//             channelId: targetChannel.id,
//             messageId: newMessage.id,

//         })
//             .save()
//             .catch(() => {
//                 message
//                     .reply('Failed to save to the database, please report this!')
//                     .then((message) => {
//                         message.delete({
//                             timeout: 1000 * 10
//                         })
//                     })
//             })
//     }
// }
