const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')
const emoji = require('../../../../config/emoji.json')
const economySchema = require('../../../../schemas/economy-schema')

/**
 * @type {import('../../../typings.d').Command}
 */

module.exports = {
    name: "ecoleaderboard",
    category: "Economy",
    aliases: ["ecolb"],
    cooldown: 5,
    canNotSetCooldown: true,
    description: "Displays a list of richest users in the server",
    usage: "\`PREFIXecolb\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        setCooldown(client, this, message);
        const lbe = new Discord.MessageEmbed()

        const fetchTopUsers = async () => {
            let text = ''
            let diff = 0
        
            const results = await economySchema.find({
            }).sort({
                goldCoins: -1,
                level: -1
            }).limit(5)
        
            for (let counter = 0; counter < results.length; ++counter) {
                const { _id, goldCoins = 0, level = 0 } = results[counter]
        
                const memberCheck = message.guild.members.cache.get(_id)

                if (!memberCheck) {
                    diff--
                }
        
                if (memberCheck) {
                    text += `**${(counter + 1) + diff}. <@${_id}> (lvl ${level}) with** \n${emoji.goldCoin} \`${goldCoins} gold coins\`\n\n`
                }
            }
            return text
        }
        const topUsers = await fetchTopUsers()
        message.channel.send(lbe
            .setColor(message.guild.me.displayColor)
            .setTitle('Server Leaderboard')
            .setDescription(topUsers)
            .setFooter('This is a leaderboard of richest users in the server!')
            .setThumbnail(client.user.displayAvatarURL()))
    }
}