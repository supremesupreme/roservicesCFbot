import { databaseFetch } from "../functions/databaseFetch";
import { redeemPremium } from "../functions/redeemPremium";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";

export const command = {
    name: "redeemcode",
    description: "redeems a premium code",
    handler: async (interaction, env) => {
        let databaseResponse = await databaseFetch(
            interaction.guild.id,
            "setupData",
        );
        let premiumCode = databaseResponse.res?.premiumCode;
        let databaseResponse2 = await databaseFetch(
            interaction.guild.id,
            "setupData",
            premiumCode,
            true,
        );

        let isRedeemed = databaseResponse2?.res?.redeemed;

        if (isRedeemed || databaseResponse2?.res?.guildId) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `> This code has already been redeemed or expired`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        let adminRoleId = databaseResponse?.res?.adminRole;
        let premiumCodeData = interaction.data.options?.find(
            (opt) => opt.name === "premiumcode",
        )?.value;

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

        let res = await redeemPremium(interaction.guild.id, premiumCodeData);

        if (res?.success === true) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Code has been redeemed successfully!`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        } else {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Failed.. check your inputs if this error continue contact the developer. Maybe the code has already been redeemed or check if you have set up the bot via /setup.`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }
    },
};
