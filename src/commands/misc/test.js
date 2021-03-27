const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const config = require('../../../config/config.json')
const { filterOutWords, getReply } = require('../../utils/utils')
const fetch = require('node-fetch').default
const shop = require("../../../config/shop.json")
const emoji = require("../../../config/emoji.json")
require("../../utils/extendedMessage");

/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "test",
    category: "Misc",
    description: "Testing Command",
    usage: "\`PREFIXtest\`",
    hideCommand: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
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

        if (message.channel.id !== '799332538623066142') return;
        let query = args.join(" ")
        if (!query) return message.channel.send(`No.`)

        fetch(`https://api.monkedev.com/fun/chat?msg=${query}&uid=${message.author.id}`)
            .then(response => response.json())
            .then(data => {
                message.inlineReply(data.response)
            })
            .catch(() => {
                message.channel.send("Sorry, I don't know what that means")
            })
    }
}
