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

        // let results = await client.users.fetch('742609798997999677')
        // console.log(results)


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


        // .setAuthor(`Congrats ${message.author.username}!`, message.author.displayAvatarURL())
        // .setColor(message.guild.me.displayColor)
        // .setDescription(`You have leveled up to **${user.level + 1}**`)
        // .setThumbnail(message.guild.iconURL()))

        message.channel.send(`${message.author}`, {
            embed: {
                author: {
                    name: `Congrats ${message.author.username}!`,
                    iconURL: message.author.displayAvatarURL()
                },
                color: message.guild.me.displayColor,
                description: `You have leveled up to **1**`,
                thumbnail: {
                    url: message.guild.iconURL()
                },
     
            },

        })

    }
}
