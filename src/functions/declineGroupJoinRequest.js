/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */
import { GroupsApi } from "openblox/cloud";
import { getUserIdByUserName } from "./userNametoUserId";

export async function declineUserJoinRequest(groupId, userName) {
    try {
        let userId = await getUserIdByUserName(userName);
        const { data: declineuserdata } = await GroupsApi.declineGroupJoinRequest({
        groupId: groupId,
        userId:  userId,
        });

        return {success: true, declineuserdata}
    } catch (err) {
       return {success: false, err}
    }
    
}