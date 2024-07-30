const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");

const SetColor = (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('Embeds.SetColor')
		.setPlaceholder('▶️ Choisissez une couleur')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setEmoji("⚪")
			.setLabel('Blanc')
			.setValue('Embeds.SetColor.White'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("⚫")
			.setLabel('Noir')
			.setValue('Embeds.SetColor.Black'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🔴")
			.setLabel('Rouge')
			.setValue('Embeds.SetColor.Red'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🔵")
			.setLabel('Bleu')
			.setValue('Embeds.SetColor.Blue'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🟤")
			.setLabel('Marron')
			.setValue('Embeds.SetColor.Brown'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🟣")
			.setLabel('Violet')
			.setValue('Embeds.SetColor.Purple'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🟢")
			.setLabel('Vert')
			.setValue('Embeds.SetColor.Green'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🟡")
			.setLabel('Jaune')
			.setValue('Embeds.SetColor.Yellow'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🟠")
			.setLabel('Orange')
			.setValue('Embeds.SetColor.Orange'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("🎨")
			.setLabel('Personalisée')
			.setValue('Embeds.SetColor.Custom'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("♻️")
			.setLabel('Réinitialisée')
			.setValue('Embeds.SetColor.Reset'),
            new StringSelectMenuOptionBuilder()
            .setEmoji("⬅️")
			.setLabel('Retour')
			.setValue('Embeds.SetColor.Back'),
        )

    )

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds:[ embed ],
        components: [ row ]
    })

    return interaction.deferUpdate();
}

const SetURL = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetAuthor')
    .setTitle("Modifier l'URL")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.SetURL.URL")
    .setLabel("Quel est le lien URL ?")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);

    modal.addComponents(row_0);
    interaction.showModal(modal);
}

const SetAuthor = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetAuthor')
    .setTitle("Modifier l'auteur")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.SetAuthor.Text")
    .setLabel("Quel est le nom de l'auteur ?")
    .setMaxLength(256)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const ask_1 = new TextInputBuilder()
    .setCustomId("Embeds.SetAuthor.Image")
    .setLabel("Quelle est l'image de l'auteur ?")
    .setMaxLength(1024)
    .setRequired(false)
    .setStyle(TextInputStyle.Short)

    const ask_2 = new TextInputBuilder()
    .setCustomId("Embeds.SetAuthor.URL")
    .setLabel("Quel est le lien de l'auteur ?")
    .setRequired(false)
    .setStyle(TextInputStyle.Short)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);
    const row_1 = new ActionRowBuilder().addComponents(ask_1);
    const row_2 = new ActionRowBuilder().addComponents(ask_2);

    modal.addComponents(row_0, row_1, row_2);
    interaction.showModal(modal);
}

const SetTitle = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetTitle')
    .setTitle("Modifier le titre")

    const ask = new TextInputBuilder()
    .setCustomId("Embeds.Title.Text")
    .setLabel("Quelle est le titre de l'embed ?")
    .setMaxLength(256)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const row = new ActionRowBuilder().addComponents(ask);
    modal.addComponents(row);

    interaction.showModal(modal);
};

const SetDescription = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetDescription')
    .setTitle("Modifier la description")

    const ask = new TextInputBuilder()
    .setCustomId("Embeds.Description.Text")
    .setLabel("Quelle est la description de l'embed ?")
    .setMaxLength(4000)
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)

    const row = new ActionRowBuilder().addComponents(ask);
    modal.addComponents(row);

    interaction.showModal(modal);
}

const AddFields = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.AddFields')
    .setTitle("Ajouter un champs")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.AddFields.Text")
    .setLabel("Quelle est le titre du champs ?")
    .setMaxLength(256)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const ask_1 = new TextInputBuilder()
    .setCustomId("Embeds.AddFields.Value")
    .setLabel("Quelle est la description du champs ?")
    .setMaxLength(1024)
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);
    const row_1 = new ActionRowBuilder().addComponents(ask_1);
    modal.addComponents(row_0, row_1);

    interaction.showModal(modal);
}

const RemoveFields = (interaction) => {
    const fields = interaction.message.embeds[0].data.fields;

    function truncateString(str, maxLength) {
        if (str.length <= maxLength) {
            return str;
        }
        return str.slice(0, maxLength - 3) + '...';
    }

    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('Embeds.RemoveFields.Selects')
        .setPlaceholder("Choisissez un champs")
        .addOptions(
            fields.map((item, index) => (
                new StringSelectMenuOptionBuilder()
                .setLabel(item.name)
                .setDescription(truncateString(item.value, 100))
                .setValue(`${index}`)
            ))
        )
    )

    interaction.channel.send({
        components: [ row ]
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

            return DelFields(interaction, collected.values[0], collected);
        }
    })

    interaction.deferUpdate();
}

const SetThumbnail = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetThumbnail')
    .setTitle("Modifier la vignette")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.SetThumbnail.URL")
    .setLabel("Quel est le lien (URL) de la vignette ?")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);

    modal.addComponents(row_0);
    interaction.showModal(modal);
}

const SetImage = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetImage')
    .setTitle("Modifier la vignette")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.SetImage.URL")
    .setLabel("Quel est le lien (URL) de l'image ?")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);

    modal.addComponents(row_0);
    interaction.showModal(modal);
}

const SetFooter = (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetFooter')
    .setTitle("Ajouter un champs")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.SetFooter.Text")
    .setLabel("Quelle est le texte du bas de page ?")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const ask_1 = new TextInputBuilder()
    .setCustomId("Embeds.SetFooter.URL")
    .setLabel("Quel est l'image du bas de page ?")
    .setRequired(false)
    .setStyle(TextInputStyle.Short)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);
    const row_1 = new ActionRowBuilder().addComponents(ask_1);
    modal.addComponents(row_0, row_1);

    interaction.showModal(modal);
}

const GetURL = async (interaction) => {
    // if(interaction.fields.fields.get('Embeds.SetURL.URL') && interaction.fields.fields.get('Embeds.SetURL.URL').customId === 'Embeds.SetURL.URL') return;
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setURL(`${interaction.fields.getTextInputValue('Embeds.SetURL.URL')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const GetAuthor = async (interaction) => {
    if(interaction.fields.fields.get('Embeds.SetURL.URL') && interaction.fields.fields.get('Embeds.SetURL.URL').customId === 'Embeds.SetURL.URL') return;
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setAuthor({
        name: `${interaction.fields.getTextInputValue('Embeds.SetAuthor.Text')}`,
        iconURL: `${interaction.fields.getTextInputValue('Embeds.SetAuthor.Image')}` || null,
        url: `${interaction.fields.getTextInputValue('Embeds.SetAuthor.URL')}` || null
    });

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const GetTitle = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setTitle(`${interaction.fields.getTextInputValue('Embeds.Title.Text')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const GetDescription = async (interaction) => {
    if(interaction.fields.fields.get('Embeds.Title.Text') && interaction.fields.fields.get('Embeds.Title.Text').customId === 'Embeds.Title.Text') return;
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(`${interaction.fields.getTextInputValue('Embeds.Description.Text')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const GetFields = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).addFields({ name: `${interaction.fields.getTextInputValue('Embeds.AddFields.Text')}`, value: `${interaction.fields.getTextInputValue('Embeds.AddFields.Value')}` });

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const DelFields = async (interaction, index, collected) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).spliceFields(index, 1);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    collected.message.delete();
}

const GetThumbnail = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setThumbnail(`${interaction.fields.getTextInputValue('Embeds.SetThumbnail.URL')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const GetImage = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setImage(`${interaction.fields.getTextInputValue('Embeds.SetImage.URL')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const GetFooter = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFooter({ 
        text: `${interaction.fields.getTextInputValue('Embeds.SetFooter.Text')}`, 
        iconURL: interaction.fields.getTextInputValue('Embeds.SetFooter.URL') || null 
    });

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    return interaction.deferUpdate();
}

const ColorWhite = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.White);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorBlack = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(null);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorRed = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Red);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorBlue = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Blue);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorBrown = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.DarkOrange);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorPurple = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Purple);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorGreen = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Green);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorYellow = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Yellow);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const ColorOrange = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Orange);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const Custom = async (interaction) => {
    const modal = new ModalBuilder()
    .setCustomId('Embeds.SetColor.Custom')
    .setTitle("Ajouter une couleur")

    const ask_0 = new TextInputBuilder()
    .setCustomId("Embeds.SetColor.HexCode")
    .setLabel("Quelle est la couleur ? (HEX)")
    .setPlaceholder("#fffff, #738c10, #9bea9e, #d646b3, ...")
    .setRequired(true)
    .setStyle(TextInputStyle.Short)

    const row_0 = new ActionRowBuilder().addComponents(ask_0);
    modal.addComponents(row_0);

    interaction.showModal(modal);
}

const GetColor = async (interaction) => {
    let hex = interaction.fields.getTextInputValue('Embeds.SetColor.HexCode');
    hex = hex.replace(/^#|0x/, '');

    if(hex.length !== 6) {
        throw new Error('Le code couleur hexadécimal doit être composé de 6 caractères.');
    }

    const colorInt = parseInt(hex, 16);
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(colorInt);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const Reset = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setColor(Colors.Default);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

const Back = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: GetPanel()
    });

    return interaction.deferUpdate();
}

function GetPanel() {
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

    return [ row_0, row_1 ];
}

const EmbedColor = {
    ColorWhite,
    ColorBlack,
    ColorRed,
    ColorBlue,
    ColorBrown,
    ColorPurple,
    ColorGreen,
    ColorYellow,
    ColorOrange,
    Custom,
    Reset,
    Back
}

const EmbedGenerator = {
    SetColor,
    SetURL,
    SetAuthor,
    SetTitle,
    SetDescription,
    AddFields,
    RemoveFields,
    SetThumbnail,
    SetImage,
    SetFooter
};

const EmbedManager = {
    GetColor,
    GetURL,
    GetAuthor,
    GetTitle,
    GetDescription,
    GetFields,
    DelFields,
    GetThumbnail,
    GetImage,
    GetFooter,
}

module.exports = {
    EmbedColor,
    EmbedGenerator,
    EmbedManager
};