/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */
import { GroupsApi } from "openblox/cloud";
import { getRoleIdByName } from './roleIdToRoleName';
import { getUserIdByUserName } from "./userNametoUserId";
import { databaseFetch } from "./databaseFetch";
import { decrypt } from "./cryption";
import { getEncryptionKey } from "../runtime/encryptionkey";
import { createOpenbloxConfig } from "openblox/config";

export async function updateGroupMemberRole(guildId, groupId, userName, roleName) {
    try {
        let databaseResponse = await databaseFetch(guildId, 'setupData');
        let encryptionKey = getEncryptionKey();
        let apiKey = databaseResponse?.res?.encryptedkey?.trim().replace(/^"(.*)"$/, '$1').replace(/\s+/g, '');
        if(!apiKey) return {success:false, reason:"no apikey found"}
        var decryptedKey = await decrypt(apiKey, `${guildId}_${encryptionKey}`)
        let userId = await getUserIdByUserName(userName);
        let roleId = await getRoleIdByName(groupId, roleName);

        const { data: updateMemberRole } = await GroupsApi.updateGroupMemberRole.bind( createOpenbloxConfig({ cloudKey: `${decryptedKey}` }) )({
        groupId: groupId,
        userId:  userId,
        roleId: roleId 
        });

        return {success: true, updateMemberRole}
    } catch (err) {
       return {success: false, err}
    }
    
}