import { getRedis } from "../runtime/redis";

export async function databaseFetch(key, datatype, premiumCode, premiumType) {
    let redis = getRedis();
    try {
        if (premiumType === true) {
            let res = await redis.get(`premiumcode:${premiumCode}`);
            return { success: true, res };
        } else {
            let res = await redis.get(`${key}_${datatype}`);
            return { success: true, res };
        }
    } catch (e) {
        return { success: false, e };
    }
}
