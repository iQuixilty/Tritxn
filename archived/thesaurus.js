// const PREFIX = require('../../../../config/config.json').PREFIX;
// const Discord = require('discord.js')
// const { setCooldown } = require('../../../utils/utils')

// /** 
//  * @type {import('../../../typings.d').Command}
// */

// module.exports = {
//     name: "thesaurus",
//     category: "Misc",
//     aliases: ["thes", "syn"],
//     cooldown: 3,
//     description: "Gives synonyms and antonyms of a word",
//     usage: "\`PREFIXthesaurus [word]\`",
//     clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

//     execute: async function (client, message, args) {
//         setCooldown(client, this, message)

//         let word = args[0]

//         if (!word) return message.reply(`Specify a word`)

//         let reply = tcom.search('never')
//         console.log(reply)

//         // message.channel.send(reply)
//     }
// }
