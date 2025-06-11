// commands/help.js
import { commands } from "./index.js";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";

export const command = {
    name: "help",
    description: "Return all the commands for the bot",
    handler: async (interaction, env) => {
        const commandFields = Object.entries(commands).map(
            ([name, command]) => ({
                name: `\`/${name}\``,
                value: `${command.description}`,
                inline: true,
            }),
        );

        const embed = {
            title: "🤖 Bot Help Menu",
            description:
                "Here are all the available commands you can use with this bot:",
            color: 11654809,
            fields: commandFields,
            footer: {
                text: `${Object.keys(commands).length} commands available • Use /help to see this menu`,
            },
            timestamp: new Date().toISOString(),
            author: {
                name: "Bot Commands",
                icon_url:
                    "https://cdn.discordapp.com/avatars/785187712646119465/0e918448bb758495a5a13717e957a9d3.png?size=1024", // Replace with actual bot avatar URL
            },
        };

        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [embed],
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        };
    },
};
