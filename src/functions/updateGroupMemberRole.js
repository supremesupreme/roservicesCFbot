/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */
import { GroupsApi } from "openblox/cloud";
import { databaseFetch } from "./databaseFetch";
import { decrypt } from "./cryption";
import { getEncryptionKey } from "../runtime/encryptionkey";
import { createOpenbloxConfig } from "openblox/config";
import { getRankFromRoleId } from "./roleIdtoRank";
import { ClassicUsersApi } from "openblox/classic";

export async function updateGroupMemberRole(guildId, groupId, userId, roleId) {
    try {
        let databaseResponse = await databaseFetch(guildId, "setupData");

        let encryptionKey = getEncryptionKey();
        let apiKey = databaseResponse?.res?.encryptedkey
            ?.trim()
            .replace(/^"(.*)"$/, "$1")
            .replace(/\s+/g, "");

        if (!apiKey) return { success: false, reason: "no apikey found" };

        var decryptedKey = await decrypt(apiKey, `${guildId}_${encryptionKey}`);
        const { data: userNameData } = await ClassicUsersApi.usersInfoFromIds({
            userIds: [userId],
        });
        let roleIdRank = await getRankFromRoleId(roleId);
        let rankLimit = databaseResponse.res?.rankLimit;

        if (roleIdRank >= rankLimit)
            return {
                success: false,
                reason: `Role is higher than ${rankLimit} `,
            };

        let rankLockedUsers = databaseResponse.res?.rankLockedUsers;
        if (rankLockedUsers.includes(Number(userId)))
            return { success: false, usrError: "user rank locked..." };

        const { data: updateMemberRole } =
            await GroupsApi.updateGroupMemberRole.bind(
                createOpenbloxConfig({ cloudKey: `${decryptedKey}` }),
            )({
                groupId: groupId,
                userId: userId,
                roleId: roleId,
            });

        return { success: true, updateMemberRole, userNameData };
    } catch (err) {
        console.log(err);
        return { success: false, err };
    }
}
