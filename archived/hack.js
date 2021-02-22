
// const PREFIX = require('../../../../config/config.json').PREFIX;
// const Discord = require('discord.js')
// ////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

// const darkemail = require('random-email');
// const darkpassword = require('generate-password');

// module.exports = {
//     name: "hack",
//     category: "Misc",
//     description: "Hacks into a users account",
//     usage: "\`PREFIXhack [user]\`",
//     clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

//     execute: async function (client, message, args) {

//         const hacke = new Discord.MessageEmbed()

//         const user = message.mentions.users.first();
//         if (!user) {
//             return message.channel.send(hacke.setColor(message.guild.me.displayColor).setTitle(`Woaaah slow down, who are we hacking?`));
//         }
//         const impostorpassword = darkpassword.generate({
//             length: 10,
//             numbers: true,
//         });
//         const member = message.guild.member(user);
//         const mostCommon = ["bloop", "beep", "boop", "dick", "nerd", "sexy"];
//         const lastdm = [
//             "yeah she goes to another school",
//             "send nudes",
//             "i saw you naked last night",
//             "your pepe is small",
//             "yea i'm telling my mommy",
//         ];
//         message.channel
//             .send(hacke.setColor(message.guild.me.displayColor).setTitle(`Hacking ${member.user.username} now...`))
//             .then(async (msg) => {
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(`[▘] Finding discord login... (2fa bypassed)`));
//                 }, 1000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(
//                         `[▝] Email: \`${darkemail({
//                             domain: "haxor.com",
//                         })}\`\nPassword: \`${impostorpassword}\``
//                     ));
//                 }, 3000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(
//                         `[▖] Last DM: "${lastdm[Math.floor(Math.random() * lastdm.length)]}"`
//                     ));
//                 }, 7000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(`[▘] Finding most common word...`));
//                 }, 9000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(
//                         `[▝] "${mostCommon[Math.floor(Math.random() * mostCommon.length)]
//                         }"`
//                     ));
//                 }, 6000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(`[▗] Finding IP address...`));
//                 }, 21000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(
//                         `[▖] IP address: \`127.0.0.1:5\``
//                     ));
//                 }, 23000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(`[▘] Selling data to the Government...`));
//                 }, 25000);
//                 setTimeout(async function () {
//                     await msg.edit(hacke.setColor(message.guild.me.displayColor).setTitle(`[▝] Reporting account to discord for breaking ToS...`));
//                 }, 27000);
//                 setTimeout(async function () {
//                     await message.channel.send(hacke.setColor(message.guild.me.displayColor).setTitle(
//                         `The *totally*  real and dangerous hack is complete`
//                     ));
//                 }, 34000);
//             });
//     }
// }