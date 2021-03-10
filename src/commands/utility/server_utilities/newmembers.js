const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const config = require('../../../../config/config.json')
const { paginate } = require('../../../utils/utils')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "newmembers",
    category: "Utility",
    aliases: ['nm'],
    description: "See the newest members who joined in your server!",
    usage: "\`PREFIXnewmembers\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        const members = message.guild.members.cache
            .filter((m) => !m.user.bot)
            .sort((a, b) => b.joinedTimestamp - a.joinedTimestamp);

        const arrayOfMembers = members.array();
        const ids = [];
        arrayOfMembers.forEach((mem) => {
            ids.push(mem.user.id);
        })

        let index = 1;
        if (ids.length > 10) {
            const chunks = convertChunk(ids, 10);
            const arry = [];
            for (chunk of chunks) {
                const description = chunk.map((v) => `\`#${index++}\` \`${message.guild.members.cache.get(v).user.tag}\`\n`);
                arry.push(
                    new Discord.MessageEmbed()
                        .setTitle(`Join Leaderboard For ${message.guild.name}`)
                        .setDescription(description)
                        .setColor(message.guild.me.displayColor)
                )
            }
            paginate(message, arry)
        } else {
            const description = ids.map((v) => `\`#${index++}\` \`${message.guild.members.cache.get(v).user.tag}\`\n`);
            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle(`Join Leaderboard For ${message.guild.name}`)
                    .setDescription(description)
                    .setColor(message.guild.me.displayColor)
            )

        }
    }
}


function convertChunk(arr, size) {
    const array = [];
    for (let i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i + size))
    }
    return array;
}