/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */
import { GroupsApi } from "openblox/cloud";
import { ClassicUsersApi } from "openblox/classic";

export async function acceptUserJoinRequest(groupId, userId) {
    try {
        const { data: userNameData } = await ClassicUsersApi.usersInfoFromIds({
            userIds: [userId],
        });
        const { data: acceptuserdata } = await GroupsApi.acceptGroupJoinRequest(
            {
                groupId: groupId,
                userId: userId,
            },
        );

        return { success: true, acceptuserdata, userNameData };
    } catch (err) {
        return { success: false, err };
    }
}
