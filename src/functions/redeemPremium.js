import { getRedis } from "../runtime/redis";
import { databaseFetch } from "./databaseFetch";

export async function redeemPremium(guildId, premiumCode) {
    let redis = getRedis();

    try {
        let databaseResponse = await databaseFetch(guildId, "setupData");
        let premiumDataRaw = await redis.get(`premiumcode:${premiumCode}`);
        let setupDataModify = await redis.get(`${guildId}_setupData`);

        // Now you can modify the objects
        premiumDataRaw.guildId = guildId;
        premiumDataRaw.redeemedAt = new Date().toISOString();
        premiumDataRaw.redeemed = true;
        setupDataModify.premiumCode = premiumCode;

        const ttl = await redis.ttl(`premiumcode:${premiumCode}`);

        // Store the modified objects back as JSON strings
        let b = await redis.set(
            `premiumcode:${premiumCode}`,
            JSON.stringify(premiumDataRaw),
            { ex: ttl },
        );

        let d = await redis.set(
            `${guildId}_setupData`,
            JSON.stringify(setupDataModify),
        );

        return {
            success: true,
        };
    } catch (e) {
        return { success: false, error: e.message ?? e };
    }
}
