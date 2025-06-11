import { databaseFetch } from "../functions/databaseFetch";
import { isPremiumCodeValid } from "../functions/isPremiumCodeValid";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";
import { rankLock } from "../functions/rankLock";

export const command = {
    name: "unranklock",
    description: "unFreezes a user's rank",
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

        let robloxUser = interaction.data.options?.find(
            (opt) => opt.name === "username",
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

        let res = await rankLock(interaction.guild.id, robloxUser, true);

        if (res?.success === true) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    embeds: [
                        {
                            title: `${robloxUser} has been unranklocked 🥶`,
                            description: `> <:icons_Correct:1063605864323362897> ${robloxUser} rank has been unranklocked 🙏`,
                            color: 11654809,
                            footer: {
                                text: "Powered by Roblox Oauth2 API",
                            },
                        },
                    ],
                },
            };
        } else {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Failed.. check your inputs if this error continue contact the developer. Maybe the user has isn't been ranklocked. error message: ${res.error}`,
                },
                flags: InteractionResponseFlags.EPHEMERAL,
            };
        }
    },
};
