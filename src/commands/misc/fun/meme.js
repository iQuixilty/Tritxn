const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const got = require('got');

module.exports = {
    name: "meme",
    category: "Misc",
    cooldown: 3,
    description: "Sends a meme from reddit",
    usage: "\`PREFIXmeme\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);

        const meme = new Discord.MessageEmbed()
        got('https://www.reddit.com/r/memes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            let permalink = content[0].data.children[0].data.permalink;
            let memeURL = `https://reddit.com${permalink}`
            let memeImage = content[0].data.children[0].data.url;
            let memeTitle = content[0].data.children[0].data.title;
            let memeUpvotes = content[0].data.children[0].data.ups;
            let memeNumComments = content[0].data.children[0].data.num_comments;
            meme.setTitle(`${memeTitle}`)
            meme.setURL(`${memeURL}`)
            meme.setImage(memeImage)
            meme.setColor('RANDOM')
            meme.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`)
            message.channel.send(meme);
        });
    }
}