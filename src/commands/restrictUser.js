// commands/userinfo.js
import { updateExperienceRestrictions } from "../functions/restrictUser";
import { isPremiumCodeValid } from "../functions/isPremiumCodeValid";
import { databaseFetch } from "../functions/databaseFetch";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";

export const command = {
    name: "restrictuser",
    description: "Restricts a roblox user from joining an experience",
    handler: async (interaction, env) => {
        let databaseResponse = await databaseFetch(
            interaction.guild.id,
            "setupData",
        );

        let adminRoleId = databaseResponse?.res?.adminRole;
        let premiumCode = databaseResponse.res?.premiumCode;

        let isValid = await isPremiumCodeValid(
            premiumCode,
            interaction.guild.id,
        );

        if (isValid.success === false) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `> This Guild does not have premium you can purchase it at: https://sewpreme.xyz/payment`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

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

        let robloxUsername = interaction.data.options?.find(
            (opt) => opt.name === "user",
        )?.value;
        let privateReason = interaction.data.options?.find(
            (opt) => opt.name === "privatereason",
        )?.value;
        let publicReason = interaction.data.options?.find(
            (opt) => opt.name === "publicreason",
        )?.value;
        let duration = interaction.data.options?.find(
            (opt) => opt.name === "duration",
        )?.value;
        let excludeAlts = interaction.data.options?.find(
            (opt) => opt.name === "excludealts",
        )?.value;

        let res = await updateExperienceRestrictions(
            true,
            interaction.guild.id,
            robloxUsername,
            privateReason,
            publicReason,
            duration,
            excludeAlts,
        );

        if (res?.success === false) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Failed to restrict user: ${JSON.stringify(res?.reason || res?.err?.errors || res)}`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [
                    {
                        title: `${robloxUsername} got Banned.. 🥶`,
                        description: `> <:icons_Correct:1063605864323362897> ${robloxUsername} has been banned🙏`,
                        color: 11654809,
                        footer: {
                            text: "Powered by Roblox Oauth2 API",
                        },
                    },
                ],
            },
        };
    },
};
