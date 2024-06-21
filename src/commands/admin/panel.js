const { ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Colors, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
    name: 'panel',
    description: '(⚙️) Admin',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('panel_manager')
        .setPlaceholder("Choisissez une option")
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Ateliers")
            .setDescription("Gérer le module d'ateliers")
            .setValue("workshops"),
            new StringSelectMenuOptionBuilder()
            .setLabel("Suggestions")
            .setDescription("Gérer le module de suggestions")
            .setValue("suggestions")
        )
    )

    interaction.reply({
        embeds: [{
            color: Colors.Blue,
            title: `Panneau de configuration :`,
            fields: [
                {
                    name: `Paramètres`,
                    value: `x`
                }
            ]
        }],
        components: [ row ]
    }).then(async (msg) => {
        const filter = (interaction) => interaction.user.id === interaction.member.id && interaction.isStringSelectMenu();
        await Selects();

        async function Selects() {
            let collected;
            try {
                collected = await msg.awaitMessageComponent({ filter, time: 30000 });
            } catch(err) {
                if(err.code === 'INTERACTION_COLLECTOR_ERROR') {
                    return msg.delete();
                }
            }

            switch(collected.values[0]) {
                case 'workshops': {
                    const modal = new ModalBuilder()
                    .setCustomId('workshops_message')
                    .setTitle("Panneau de config. > Ateliers")

                    const q_1 = new TextInputBuilder()
                    .setCustomId('config.workshops_text')
                    .setLabel("Quel est le message d'accompagnement")
                    .setStyle(TextInputStyle.Paragraph)

                    const row = new ActionRowBuilder().addComponents(q_1);

                    modal.addComponents(row);
                    await collected.showModal(modal);

                    break;
                }

                case 'suggestions': {
                    const modal = new ModalBuilder()
                    .setCustomId('suggestions_message')
                    .setTitle("Panneau de config. > Suggestions")

                    const q_1 = new TextInputBuilder()
                    .setCustomId('config.suggestions_text')
                    .setLabel("Quel est le message d'accompagnement")
                    .setStyle(TextInputStyle.Paragraph)

                    const row = new ActionRowBuilder().addComponents(q_1);

                    modal.addComponents(row);
                    await collected.showModal(modal);
                    break;
                }
            }
        }
    })
    }
}