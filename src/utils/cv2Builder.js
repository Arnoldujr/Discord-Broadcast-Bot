const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

const buildContainer = (lines) => {
    const container = new ContainerBuilder();

    if (lines.length > 0) {
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(lines[0]));
    }

    if (lines.length > 1) {
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small));
        for (let i = 1; i < lines.length; i++) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(lines[i]));
        }
    }

    return container;
};

const replyCV2 = async (message, lines) => {
    return message.reply({
        components: [buildContainer(lines)],
        flags: MessageFlags.IsComponentsV2
    });
};

const sendCV2 = async (channel, lines) => {
    return channel.send({
        components: [buildContainer(lines)],
        flags: MessageFlags.IsComponentsV2
    });
};

module.exports = { replyCV2, sendCV2 };