import { databaseSetupBot } from "../functions/databaseSetup";
import { databaseFetch } from "../functions/databaseFetch";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";

export const command = {
    name: "setup",
    description: "Setup up the bot for use",
    handler: async (interaction, env) => {
        let databaseResponse = await databaseFetch(
            interaction.guild.id,
            "setupData",
        );

        let adminRoleId = databaseResponse?.res?.adminRole;

        const MANAGE_GUILD = 0x20n;
        const permissions = BigInt(interaction.member.permissions);
        const hasPermission = (permissions & MANAGE_GUILD) === MANAGE_GUILD;

        let hasRole = false;
        if (adminRoleId) {
            hasRole =
                Array.isArray(interaction.member.roles) &&
                interaction.member.roles.includes(adminRoleId);
        }

        if (adminRoleId) {
            if (!hasPermission && !hasRole) {
                return {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `You need 'Manage Server' permission or the 'adminRole' to use this command.`,
                        flags: InteractionResponseFlags.EPHEMERAL,
                    },
                };
            }
        } else {
            if (!hasPermission) {
                return {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `You need 'Manage Server' permission to use this command.`,
                        flags: InteractionResponseFlags.EPHEMERAL,
                    },
                };
            }
        }

        let apikey = interaction.data.options?.find(
            (opt) => opt.name === "apikey",
        )?.value;
        let groupId = interaction.data.options?.find(
            (opt) => opt.name === "groupid",
        )?.value;
        let adminRole = interaction.data.options?.find(
            (opt) => opt.name === "adminrole",
        )?.value;
        let rankPerms = interaction.data.options?.find(
            (opt) => opt.name === "rankpermsrole",
        )?.value;
        let moderationRole = interaction.data.options?.find(
            (opt) => opt.name === "moderationrole",
        )?.value;
        let rankLimit = interaction.data.options?.find(
            (opt) => opt.name === "ranklimit",
        )?.value;
        let placeId = interaction.data.options?.find(
            (opt) => opt.name === "placeId",
        )?.value;
        let guildId = interaction.guild.id;

        let res = await databaseSetupBot(
            guildId,
            groupId,
            adminRole,
            rankPerms,
            moderationRole,
            rankLimit,
            apikey,
            placeId,
        );

        if (res?.success === true) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Data has been logged to the database successfully!`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        } else {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Failed.. check your inputs if this error continue contact the developer.`,
                },
                flags: InteractionResponseFlags.EPHEMERAL,
            };
        }
    },
};
