// commands/userinfo.js
import { declineUserJoinRequest } from "../functions/declineGroupJoinRequest";
import { isPremiumCodeValid } from "../functions/isPremiumCodeValid";
import { databaseFetch } from "../functions/databaseFetch";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";

export const command = {
    name: "declinejoinrequest",
    description: "Declines a user join request",
    handler: async (interaction, env) => {
        let databaseResponse = await databaseFetch(
            interaction.guild.id,
            "setupData",
        );

        let rankPermRoleId = databaseResponse?.res?.rankPermsRole;
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
        if (rankPermRoleId) {
            hasRole =
                Array.isArray(interaction.member.roles) &&
                interaction.member.roles.includes(rankPermRoleId);
        }

        if (rankPermRoleId) {
            if (!hasPermission && !hasRole) {
                return {
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `You need 'Manage Server' permission or the 'rankPermRole' to use this command.`,
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

        let groupId = databaseResponse?.res?.groupId;
        let robloxUsername = interaction.data.options?.find(
            (opt) => opt.name === "username",
        )?.value;
        let res = await declineUserJoinRequest(groupId, robloxUsername);

        if (res?.success === false) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `❌ Failed to decline user: ${JSON.stringify(res.err.errors)}`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [
                    {
                        title: `${robloxUsername} request got declined...`,
                        description: `> <:icons_Correct:1063605864323362897> ${robloxUsername} has been declined 🙏`,
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
