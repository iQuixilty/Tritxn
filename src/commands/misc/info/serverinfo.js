const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor


const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    category: "Misc",
    aliases: ['si'],
    description: "Displays some info on the server",
    usage: "\`PREFIXservinfo\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        const region = {
            'us-central': ':flag_us:  `US Central`',
            'us-east': ':flag_us:  `US East`',
            'us-south': ':flag_us:  `US South`',
            'us-west': ':flag_us:  `US West`',
            'europe': ':flag_eu:  `Europe`',
            'singapore': ':flag_sg:  `Singapore`',
            'japan': ':flag_jp:  `Japan`',
            'russia': ':flag_ru:  `Russia`',
            'hongkong': ':flag_hk:  `Hong Kong`',
            'brazil': ':flag_br:  `Brazil`',
            'sydney': ':flag_au:  `Sydney`',
            'southafrica': '`South Africa` :flag_za:'
        };
        const verificationLevels = {
            NONE: '`None`',
            LOW: '`Low`',
            MEDIUM: '`Medium`',
            HIGH: '`High`',
            VERY_HIGH: '`Highest`'
        };

        const notifications = {
            ALL: '`All`',
            MENTIONS: '`Mentions`'
        };

        const embed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s Information`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('ID:', `\`${message.guild.id}\``, true)
            .addField('Region:', region[message.guild.region], true)
            .addField(`Owner:`, message.guild.owner, true)
            .addField('Verification Level:', verificationLevels[message.guild.verificationLevel], true)
            .addField('Rules Channel:',
                (message.guild.rulesChannel) ? `${message.guild.rulesChannel}` : '`None`', true
            )
            .addField('System Channel:',
                (message.guild.systemChannel) ? `${message.guild.systemChannel}` : '`None`', true
            )
            .addField('AFK Channel:',
                (message.guild.afkChannel) ? `${message.guild.afkChannel.name}` : '`None`', true
            )
            .addField('AFK Timeout:',
                (message.guild.afkChannel) ?
                    `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`None`',
                true
            )
            .addField('Default Notifications:', notifications[message.guild.defaultMessageNotifications], true)
            .addField('Partnered:', `\`${message.guild.partnered}\``, true)
            .addField('Verified:', `\`${message.guild.verified}\``, true)
            .addField('Created On:', `\`${moment(message.guild.createdAt).format('MMM DD YYYY')}\``, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayColor);
        if (message.guild.description) embed.setDescription(message.guild.description);
        if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
        message.channel.send(embed);
    }
}
