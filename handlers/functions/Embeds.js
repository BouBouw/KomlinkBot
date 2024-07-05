const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

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
    console.log(interaction)
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
    .setMaxLength(4096)
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

    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('Embeds.RemoveFields.Selects')
        .setPlaceholder("Choisissez un champs")
        .addOptions(
            fields.map((item, index) => (
                new StringSelectMenuOptionBuilder()
                .setLabel(item.name)
                .setDescription(item.value)
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

            if(collected.values[0]) msg.delete();
            DelFields(interaction, collected.values[0]);
        }
    })
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
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setURL(`${interaction.fields.getTextInputValue('Embeds.SetURL.URL')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const GetAuthor = async (interaction) => {
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

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const GetTitle = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setTitle(`${interaction.fields.getTextInputValue('Embeds.Title.Text')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const GetDescription = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(`${interaction.fields.getTextInputValue('Embeds.Description.Text')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const GetFields = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).addFields({ name: `${interaction.fields.getTextInputValue('Embeds.AddFields.Text')}`, value: `${interaction.fields.getTextInputValue('Embeds.AddFields.Value')}` });

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const DelFields = async (interaction, index) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).spliceFields(index, 1);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const GetThumbnail = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setThumbnail(`${interaction.fields.getTextInputValue('Embeds.SetThumbnail.URL')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const GetImage = async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setImage(`${interaction.fields.getTextInputValue('Embeds.SetImage.URL')}`);

    interaction.message.edit({
        content: `\`[PREVIEW]\` Création d'embeds`,
        embeds: [ embed ],
        components: [ interaction.message.components[0], interaction.message.components[1] ]
    });

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
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

    interaction.reply({
        content: `\u200b`,
        ephemeral: true
    })
}

const EmbedGenerator = {
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
    EmbedGenerator,
    EmbedManager
};