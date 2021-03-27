const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')

module.exports = {
    name: "fetchbrain",
    category: "Misc",
    aliases: ["fb"],
    description: "Fetches your brain",
    usage: "\`PREFIXfetchbrain\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let answers = ["[▘] Fetched brain...",
            "[▘] Fetched brain...",
            "[▘] Fetched brain...",
            "Error: Brain not found"]

        let answer = answers[Math.floor(Math.random() * answers.length)];

        message.channel
            .send(`Fetching your brain now...`)
            .then(async (msg) => {
                setTimeout(async function () {
                    await msg.edit(`[▘] Running through your house..`);
                }, 2000);
                setTimeout(async function () {
                    await msg.edit('[▝] Retrieving 1st cell...')
                }, 4000);
                setTimeout(async function () {
                    await msg.edit('[▖] Retrieving 2nd cell...')
                }, 4000);
                setTimeout(async function () {
                    await msg.edit(answer)
                }, 5000)
            })

    }
}