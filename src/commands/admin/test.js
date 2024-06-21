const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Colors, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'test',
    description: '(⚙️) Admin',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    const row = new ActionRowBuilder() 
    .addComponents(
        new ButtonBuilder()
            .setCustomId('new_event')
            .setLabel("Nouveau atelier")
            .setStyle(ButtonStyle.Primary)
    )
    
    interaction.reply({
        content: `Event Manager`,
        components: [ row ]
    })
    }
}