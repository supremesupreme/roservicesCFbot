/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */
import { GroupsApi } from "openblox/cloud";
import { ClassicUsersApi } from "openblox/classic";

export async function declineUserJoinRequest(groupId, userId) {
    try {
        const { data: userNameData } = await ClassicUsersApi.usersInfoFromIds({
            userIds: [userId],
        });
        const { data: declineuserdata } =
            await GroupsApi.declineGroupJoinRequest({
                groupId: groupId,
                userId: userId,
            });

        return { success: true, declineuserdata, userNameData };
    } catch (err) {
        return { success: false, err };
    }
}
