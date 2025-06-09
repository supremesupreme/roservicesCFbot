/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */
import { UsersApi } from "openblox/cloud";
import { getUserIdByUserName } from "./userNametoUserId";

export async function getUserInfo(userid) {
    try {
        let userId = await getUserIdByUserName(userid);
        const { data: userInfo_thumbnail } = await UsersApi.userThumbnail({ userId: userId }); 
        const { data:userInfo_cloud } = await UsersApi.userInfo({ userId: userId })
        return {success: true, userInfo_cloud, userInfo_thumbnail}
    } catch (err) {
       return {success: false, err}
    }
    
}