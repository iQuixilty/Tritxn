const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const got = require('got');

module.exports = {
    name: "showerthoughts",
    aliases: ['sts'],
    category: "Misc",
    cooldown: 3,
    description: "Sends a shower thought from reddit",
    usage: "\`PREFIXshowerthoughts\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);

        const ShowerthoughtsE = new Discord.MessageEmbed()
        got('https://www.reddit.com/r/Showerthoughts/random/.json').then(response => {
            let content = JSON.parse(response.body);
            let permalink = content[0].data.children[0].data.permalink;
            let memeURL = `https://reddit.com${permalink}`
            let memeTitle = content[0].data.children[0].data.title;
            let memeUpvotes = content[0].data.children[0].data.ups;
            let memeNumComments = content[0].data.children[0].data.num_comments;
            ShowerthoughtsE.setTitle(`${memeTitle}`)
            ShowerthoughtsE.setURL(`${memeURL}`)
            ShowerthoughtsE.setColor('RANDOM')
            ShowerthoughtsE.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`)
            message.channel.send(ShowerthoughtsE);
        });
    }
}