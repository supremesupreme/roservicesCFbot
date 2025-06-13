import { updateGroupMemberRole } from "../functions/updateGroupMemberRole";
import { isPremiumCodeValid } from "../functions/isPremiumCodeValid";
import { databaseFetch } from "../functions/databaseFetch";
import { UsersApi } from "openblox/cloud";
import {
    InteractionResponseType,
    InteractionResponseFlags,
    InteractionType,
} from "discord-interactions";
import { GroupsApi } from "openblox/cloud";
import { getUserIdByUserName } from "../functions/userNametoUserId";

export const command = {
    name: "setRank",
    description: "Set a user rank within linked roblox group",
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

            if (focused.name === "rank") {
                try {
                    let roles = [];

                    for await (const {
                        data: rolesData,
                    } of await GroupsApi.groupRoles({
                        groupId,
                        limit: 20,
                    })) {
                        roles.push(...rolesData);
                    }

                    const inputNorm = rawInput
                        .replace(/\s+/g, " ")
                        .replace(/[^\w\s\[\]]/gi, "");

                    const filtered = roles
                        .filter((r) => {
                            if (
                                !r.displayName ||
                                typeof r.displayName !== "string"
                            )
                                return false;
                            const displayNorm = r.displayName
                                .toLowerCase()
                                .trim()
                                .replace(/\s+/g, " ")
                                .replace(/[^\w\s\[\]]/gi, "");

                            return (
                                displayNorm.includes(inputNorm) ||
                                r.displayName.toLowerCase().includes(rawInput)
                            );
                        })
                        .slice(0, 25);

                    const choices = filtered.map((r) => ({
                        name: `${r.displayName} (Rank ${r.rank})`,
                        value: `${r.id}|${r.displayName}`,
                    }));

                    return {
                        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                        data: { choices },
                    };
                } catch (err) {
                    console.error("Autocomplete error (rank):", err);
                    return {
                        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                        data: {
                            choices: [
                                { name: "Error loading roles", value: "error" },
                            ],
                        },
                    };
                }
            }

            if (focused.name === "username") {
                try {
                    const allMembers = [];
                    for await (const {
                        data: members,
                    } of await GroupsApi.groupMembers({
                        groupId,
                        limit: 100,
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

        // --------------------- Main Command Handler ------------------------
        const db = await databaseFetch(interaction.guild.id, "setupData");
        const { rankPermsRole, premiumCode, groupId } = db.res || {};

        const valid = await isPremiumCodeValid(
            premiumCode,
            interaction.guild.id,
        );
        if (!valid.success) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content:
                        "🔒 Premium required — purchase at https://sewpreme.xyz/payment",
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        const memberPerms = BigInt(interaction.member.permissions || 0n);
        const hasAdmin = (memberPerms & 0x20n) === 0x20n;
        const hasRolePerm =
            rankPermsRole && Array.isArray(interaction.member.roles)
                ? interaction.member.roles.includes(rankPermsRole)
                : false;

        if (!hasAdmin && !hasRolePerm) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content:
                        "🔒 You need the Manage Server permission or the rankPermsRole.",
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        let robloxUsername = interaction.data.options.find(
            (o) => o.name === "username",
        )?.value;
        const rankValue = interaction.data.options.find(
            (o) => o.name === "rank",
        )?.value;
        const [roleId, displayName] = (rankValue || "").split("|");

        if (!Number.isInteger(Number(robloxUsername)))
            robloxUsername = await getUserIdByUserName(robloxUsername);

        const result = await updateGroupMemberRole(
            interaction.guild.id,
            groupId,
            robloxUsername,
            roleId,
        );
        if (!result?.success) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `❌ Failed to set rank: ${JSON.stringify(result?.reason || result?.err || result?.usrError)}`,
                    flags: InteractionResponseFlags.EPHEMERAL,
                },
            };
        }

        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                embeds: [
                    {
                        title: `${result.userNameData[robloxUsername].name} Rank Updated`,
                        description: `> <:icons_Correct:1063605864323362897> ${result.userNameData[robloxUsername].name} rank has been changed to **${displayName}**`,
                        color: 11654809,
                        footer: { text: "Powered by Roblox OAuth2 API" },
                    },
                ],
            },
        };
    },
};
