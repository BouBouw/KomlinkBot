const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Colors, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const request = require('request');

module.exports = {
    name: 'test',
    description: '(⚙️) Admin',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    const row = new ActionRowBuilder() 
    .addComponents(
        new ButtonBuilder()
        .setURL("https://discord.com/channels/1256978162819272825/1256982625906720851/1256996571879444590")
        .setLabel("Vérification")
        .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
        .setURL("https://discord.com/channels/1256978162819272825/1257003491080142858/1257004077922123791")
        .setLabel("Support")
        .setStyle(ButtonStyle.Link),
    )

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://imgur.com/tMae3zl.png');

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const applyText = (canvas, text) => {
        const context = canvas.getContext('2d');
        let fontSize = 50;
    
        do {
            context.font = `${fontSize -= 10}px sans-serif`;
        } while (context.measureText(text).width > canvas.width - 300);
        return context.font;
    };

    console.log(canvas.width, canvas.height)

    context.font = '42px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Bienvenue', 400, 75);

    context.font = 'bold 24px sans-serif';
	context.fillStyle = '#000000';
	context.fillText(`#${interaction.guild.memberCount}`, 10, 240);

	context.font = applyText(canvas, `${interaction.member.displayName}`);
	context.fillStyle = '#ffffff';
	context.fillText(`${interaction.member.displayName}`, 399, 150);

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

	const avatar = await Canvas.loadImage(await interaction.user.displayAvatarURL({ extension: 'jpg' }));

    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });
    
    interaction.reply({
        content: `Event`,
        embeds: [{
            color: Colors.Yellow,
            title: `Bienvenue ${interaction.user.username} 👋`,
            description: `Bonjour et bienvenue ${interaction.user} sur le serveur de la communauté **${interaction.guild.name}**\n...`,
            image: {
                url: 'attachment://profile-image.png',
            }
        }],
        files: [ attachment ],
        components: [ row ]
    })
    }
}