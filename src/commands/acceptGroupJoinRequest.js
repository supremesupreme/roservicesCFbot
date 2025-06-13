// commands/userinfo.js
import { acceptUserJoinRequest } from "../functions/acceptGroupJoinRequest";
import { isPremiumCodeValid } from "../functions/isPremiumCodeValid";
import { databaseFetch } from "../functions/databaseFetch";
import { GroupsApi } from "openblox/cloud";
import { UsersApi } from "openblox/cloud";
import {
    InteractionResponseType,
    InteractionResponseFlags,
    InteractionType,
} from "discord-interactions";

export const command = {
    name: "acceptjoinrequest",
    description: "Accepts a user join request",
    handler: async (interaction, env) => {
        if (
            interaction.type ===
            InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE
        ) {
            const focused = interaction.data.options?.find((o) => o.focused);
            if (!focused) {
                return {
                    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                    data: { choices: [] },
                };
            }

            const db = await databaseFetch(interaction.guild.id, "setupData");
            const groupId = db?.res?.groupId;
            if (!groupId) {
                return {
                    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                    data: {
                        choices: [
                            { name: "Group not configured", value: "no_group" },
                        ],
                    },
                };
            }

            const rawInput = (focused.value || "").toLowerCase().trim();

            if (focused.name === "username") {
                try {
                    const allMembers = [];
                    for await (const {
                        data: members,
                    } of await GroupsApi.groupJoinRequests({
                        groupId,
                        limit: 50,
                    })) {
                        allMembers.push(...members);
                    }

                    const matchedMembers = allMembers.slice(0, 25);

                    const usernames = await Promise.all(
                        matchedMembers.map(async (m) => {
                            const userId = m.user.split("/")[1];
                            try {
                                const { data: userRawData } =
                                    await UsersApi.userInfo({ userId: userId });
                                return {
                                    id: userRawData.id,
                                    username: userRawData.name,
                                };
                            } catch {
                                return null;
                            }
                        }),
                    );

                    const filtered = usernames
                        .filter(Boolean)
                        .filter((u) =>
                            u.username.toLowerCase().includes(rawInput),
                        )
                        .slice(0, 25);

                    const choices = filtered.map((u) => ({
                        name: u.username,
                        value: u.id,
                    }));

                    return {
                        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                        data: { choices },
                    };
                } catch (err) {
                    console.error("Autocomplete error (username):", err);
                    return {
                        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                        data: {
                            choices: [
                                { name: "Error loading users", value: "error" },
                            ],
                        },
                    };
                }
            }

            return {
                type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                data: { choices: [] },
            };
        }

        const databaseResponse = await databaseFetch(
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

        if (!Number.isInteger(Number(robloxUsername)))
            robloxUsername = await getUserIdByUserName(robloxUsername);

        let res = await acceptUserJoinRequest(groupId, robloxUsername);

        if (!res?.success) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `❌ Failed to accept user: ${JSON.stringify(res.err.errors)}`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [
                    {
                        title: `${res.userNameData[robloxUsername].name} Rank got change 🥶`,
                        description: `> <:icons_Correct:1063605864323362897> ${res.userNameData[robloxUsername].name} has been accepted 🙏`,
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
