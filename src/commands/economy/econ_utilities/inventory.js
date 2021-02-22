const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')

const emoji = require('../../../../config/emoji.json')

const { setCooldown, paginate } = require('../../../utils/utils')

module.exports = {
    name: "inventory",
    category: "Economy",
    aliases: ["backpack", 'pack', 'inv'],
    description: "Displays what you have in your inventory",
    usage: "\`PREFIXinventory [user]\`",
    cooldown: 5,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        let target;

        if (!message.mentions.members.first()) {
            target = message.guild.members.cache.get(message.author.id);
        } else {
            target = message.mentions.members.first()
        }

        let userId = target.id



        const Rods = await economy.getInv(userId, 'fishingRod')
        const Fishs = await economy.getInv(userId, 'fish')
        const Trident = await economy.getInv(userId, 'trident')
        const TriShard = await economy.getInv(userId, 'trishard')
        const Rifle = await economy.getInv(userId, 'rifle')
        const Pick = await economy.getInv(userId, 'pickaxe')
        const Rabbits = await economy.getInv(userId, 'rabbit')
        const Raccoons = await economy.getInv(userId, 'raccoon')

        const SilverIngot = await economy.getInv(userId, 'silverIngot')
        const GoldIngot = await economy.getInv(userId, 'goldIngot')


        const bronzeLock = await economy.getInv(userId, 'bronzeLock')
        const silverLock = await economy.getInv(userId, 'silverLock')
        const goldLock = await economy.getInv(userId, 'goldLock')
        const bronzeKey = await economy.getInv(userId, 'bronzeKey')
        const silverKey = await economy.getInv(userId, 'silverKey')
        const goldKey = await economy.getInv(userId, 'goldKey')

        setCooldown(client, this, message);

        let inventoryE1 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${target.user.username}'s Inventory`)
            .setDescription(`-----------Tools-----------\n\n${Rods === 0 ? '' : `${emoji.rod} \`${Rods} fishing rod(s)\``}\n\n${Rifle === 0 ? '' : `${emoji.rifle} \`${Rifle} hunting rifle(s)\``}\n\n${Pick === 0 ? '' : `${emoji.pick} \`${Pick} pickaxe(s)\``}`)

        let inventoryE2 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${target.user.username}'s Inventory`)
            .setDescription(`-----------Animals-----------\n\n ${Fishs === 0 ? '' : `🐟 \`${Fishs} fish\``}\n\n${Rabbits === 0 ? '' : `🐇 \`${Rabbits} rabbits\``}\n\n${Raccoons === 0 ? '' : `🦝 \`${Raccoons} raccoon(s)\``}`)

        let inventoryE3 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${message.author.username}'s Inventory`)
            .setDescription(`-----------Ores-----------\n\n${SilverIngot === 0 ? '' : `${emoji.silver} \`${SilverIngot} silver ingot(s)\``}\n\n ${GoldIngot === 0 ? '' : `${emoji.gold} \`${GoldIngot} gold ingot(s)\``}`)

        let inventoryE4 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${message.author.username}'s Inventory`)
            .setDescription(`-----------Collectables-----------\n\n${bronzeLock === 0 ? '' : `${emoji.bLock} \`${bronzeLock} bronze lock(s)\``}\n\n${bronzeKey === 0 ? '' : `${emoji.bKey} \`${bronzeKey} bronze key(s)\``}\n\n${silverLock === 0 ? '' : `${emoji.sLock} \`${silverLock} silver lock(s)\``}\n\n${silverKey === 0 ? '' : `${emoji.sKey} \`${silverKey} silver key(s)\``}\n\n${goldLock === 0 ? '' : `${emoji.gLock} \`${goldLock} gold lock(s)\``}\n\n${goldKey === 0 ? '' : `${emoji.gKey} \`${goldKey} gold key(s)\``}\n\n${TriShard === 0 ? '' : `${emoji.trishard} \`${TriShard} trident shard(s)\``}\n\n${Trident === 0 ? '' : `${emoji.tri} \`${Trident} trident(s)\``}`)


        paginate(message, [inventoryE1, inventoryE2, inventoryE3, inventoryE4], { time: 1000 * 5 })
    }
}

