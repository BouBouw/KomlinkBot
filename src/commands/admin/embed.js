const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ApplicationCommandOptionType } = require("discord.js");
const { EmbedGenerator, EmbedColor } = require("../../../handlers/functions/Embeds");

module.exports = {
    name: 'embed',
    description: '(⚙️) Admin',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "channel",
            description: `Salon à envoyer l'embed`,
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
    ],
execute: async (client, interaction, args, con) => {
    const channel = interaction.options.getChannel('channel');

    const row_0 = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('Embeds.Builder')
        .setPlaceholder("▶️ Choisissez une option")
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setEmoji("🎨")
            .setLabel("Modifier la couleur")
            .setValue("Embeds.Panel.SetColor"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("👤")
            .setLabel("Modifier l'auteur")
            .setValue("Embeds.Panel.SetAuthor"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🌐")
            .setLabel("Modifier l'URL")
            .setValue("Embeds.Panel.SetURL"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("✏️")
            .setLabel("Modifier le titre")
            .setValue("Embeds.Panel.SetTitle"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("📃")
            .setLabel("Modifier la description")
            .setValue("Embeds.Panel.SetDescription"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("➕")
            .setLabel("Ajouter un champs")
            .setValue("Embeds.Panel.AddFields"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("➖")
            .setLabel("Retirer un champs")
            .setValue("Embeds.Panel.RemoveFields"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🖼️")
            .setLabel("Ajouter une vignette")
            .setValue("Embeds.Panel.SetThumbnail"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("📷")
            .setLabel("Ajouter une image")
            .setValue("Embeds.Panel.SetImage"),
            new StringSelectMenuOptionBuilder()
            .setEmoji("📌")
            .setLabel("Ajouter un bas de page")
            .setValue("Embeds.Panel.SetFooter"),
        )
    )

    const row_1 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('Embeds.Panel.Confirm')
        .setLabel("Publier l'embed")
        .setStyle(ButtonStyle.Success),
    )

    interaction.reply({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [{
            title: `\u200b`
        }],
        components: [ row_0, row_1 ]
    }).then(async (msg) => {
        const filter = (i) => i.user.id === interaction.user.id;
        await Selects();

        async function Selects() {
            let collected;
            try {
                collected = await msg.awaitMessageComponent({ filter: filter });
            } catch(err) {
                if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                    return msg.delete()
                }
            }

            if(!collected.values) {
                switch(collected.customId) {
                    case 'Embeds.Panel.Confirm': {
                        collected.reply({
                            content: `Votre message **embed** vient d'être publier dans : ${channel}.`,
                            ephemeral: true
                        })

                        channel.send({
                            embeds: [ collected.message.embeds[0] ]
                        });
                        break;
                    }
                }
                return;
            }

            switch(collected.values[0]) {
                case 'Embeds.Panel.SetColor': {
                    EmbedGenerator.SetColor(collected);

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.SetURL': {
                    EmbedGenerator.SetURL(collected);

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.SetAuthor': {
                    EmbedGenerator.SetAuthor(collected);

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.SetTitle': {
                    EmbedGenerator.SetTitle(collected);

                    await Selects();
                    break;
                }
        
                case 'Embeds.Panel.SetDescription': {
                    EmbedGenerator.SetDescription(collected)

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.AddFields': {
                    EmbedGenerator.AddFields(collected)

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.RemoveFields': {
                    EmbedGenerator.RemoveFields(collected)

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.SetThumbnail': {
                    EmbedGenerator.SetThumbnail(collected);

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.SetImage': {
                    EmbedGenerator.SetImage(collected);

                    await Selects();
                    break;
                }

                case 'Embeds.Panel.SetFooter': {
                    EmbedGenerator.SetFooter(collected);

                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.White': {
                    EmbedColor.ColorWhite(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Black': {
                    EmbedColor.ColorBlack(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Red': {
                    EmbedColor.ColorRed(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Blue': {
                    EmbedColor.ColorBlue(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Brown': {
                    EmbedColor.ColorBrown(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Purple': {
                    EmbedColor.ColorPurple(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Green': {
                    EmbedColor.ColorGreen(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Yellow': {
                    EmbedColor.ColorYellow(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Orange': {
                    EmbedColor.ColorOrange(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Custom': {
                    EmbedColor.Custom(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Rest': {
                    EmbedColor.Reset(collected);
                    
                    await Selects();
                    break;
                }

                case 'Embeds.SetColor.Back': {
                    EmbedColor.Back(collected);

                    await Selects();
                    break;
                }
            }
        }
    })

    }
}