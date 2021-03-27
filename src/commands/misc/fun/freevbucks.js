const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
const ms = require('ms')

module.exports = {
    name: "freevbucks",
    category: "Misc",
    description: "Gives you free vbucks",
    usage: "\`PREFIXfreevbucks\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let role = message.guild.roles.cache.find(role => role.name === "Muted");

        if (!role) return;
        var member = message.guild.member(message.author);
        let time = `10m`

        member.roles.add(role.id)

        setTimeout(function () {
            member.roles.remove(role.id)
        }, ms(time));

    }
}