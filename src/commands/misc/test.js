const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const config = require('../../../config/config.json')
const fs = require('fs')

require('../../utils/extendedMessage')

/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "test",
    category: "Misc",
    description: "Testing Command",
    usage: "\`PREFIXtest\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        // let userId = args[0]

        // let results = await client.users.fetch(userId)
        // console.log(results)
        // message.channel.send(results.displayAvatarURL({dynamic: true}))

        if (message.author.id !== '751606134938402866') return;

        const x = `\`\`\``
        let directory = `src\\commands`

        let files = fs.readdirSync(directory)

        console.log(files)

        // message.inlineReply('testing')
    }
}
