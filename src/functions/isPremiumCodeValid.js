import { getRedis } from "../runtime/redis";

export async function isPremiumCodeValid(premiumCode, guildId) {
    let redis = getRedis();
    try {
        let res = await redis.get(`premiumcode:${premiumCode}`);
        if (res) {
            return { success: true, res };
        } else {
            let setupDataRaw = await redis.get(`${guildId}_setupData`);
            setupDataRaw.premiumCode = "";

            await redis.set(
                `${guildId}_setupData`,
                JSON.stringify(setupDataRaw),
            );
            return { success: false };
        }
    } catch (e) {
        return { success: false, e };
    }
}
