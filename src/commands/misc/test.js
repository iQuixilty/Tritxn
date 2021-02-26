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

        // console.log(client.commands)

        // let commands = client.commands.sweep(c => client.commands.find(cm => cm.name === c.name).count > 1)

        // let reply = ''

        // for (let i = 0; i < client.com.size; i++) {
            // client.com.forEach((c) => {
            //     console.log(
            //     `<li class="list-group-item ${c.category}" id = "${c.name}Command" >
            //         <span class="pl-1" id="commandTitle">Name:</span>
            //         ${c.name} <br />
            //         <span class="pl-1" id="commandTitle">Description:</span>
            //         ${c.description}<br/>
            //          <span class="pl-1" id="commandTitle">Usage:</span>
            //         ${c.usage}
            //     </li >`)

              
            // })
        // }


    }
}
