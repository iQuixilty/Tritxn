const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')

module.exports = {
    name: "kill",
    category: "Misc",
    description: "Kills a user",
    usage: "\`PREFIXkill [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        let user = message.mentions.users.first()
        const killEmbed = new Discord.MessageEmbed()

        if (!user) {
            return message.channel.send(killEmbed.setColor(message.guild.me.displayColor).setTitle("Provide a user to kill, idiot"))
        }

        let killMessages = [
            `Haha ${user.username} died to eating too many cheeseburgers, what a noob`,
            `${user.username} died with an overdose of stupidy`,
            `${user.username} was trampled by the nine year old army`,
            `Our lord and savior Tritxn strikes ${user.username} with a lighting bolt`,
            `${user.username} screams in terror as they accidentally spawn in the cthulhu while uttering random latin words. Cthulhu grabs ${user.username} by the right leg and takes them to his dimension yelling, "Honey, Dinner's ready!"`,
            `${user.username} bleeds out after trying to get on "Dumbest hillbilly moments"`,
            `After getting pushed into the ocean by ${message.author.username}, ${user.username} is eaten by a shark`,
            `${user.username} died because ${message.author.username} came in their presence`,
            `${user.username} died because ${message.author.username} decided to text a message to them`,
            `${user.username} died because they are bad at life unlike Qzxy`
        ]

        if (user === message.author) {
            return message.channel.send(killEmbed.setColor(message.guild.me.displayColor).setTitle("Ok you killed yourself, idiot, now what?"))
        }

        let answer = killMessages[Math.floor(Math.random() * killMessages.length)];

        message.channel.send(killEmbed.setColor(message.guild.me.displayColor).setTitle(answer))
    }
}