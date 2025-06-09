import { getRedis } from "../runtime/redis";

export async function redeemPremium(guildId, premiumCode) {
    let redis = getRedis();

    try {
        let premiumDataRaw = await redis.get(`premiumcode:${premiumCode}`);
        let setupDataModiify = await redis.get(`${guildId}_setupData`);

        premiumDataRaw.guildId = guildId;
        premiumDataRaw.redeemedAt = new Date().toISOString();
        premiumDataRaw.redeemed = true;
        setupDataModiify.premiumCode = premiumCode;

        const ttl = await redis.ttl(`premiumcode:${premiumCode}`);

        await redis.set(
            `premiumcode:${premiumCode}`,
            JSON.stringify(premiumDataRaw),
            { ex: ttl },
        );

        await redis.set(
            `${guildId}_setupData`,
            JSON.stringify(setupDataModiify),
        );

        return {
            success: true,
        };
    } catch (e) {
        return { success: false, error: e.message ?? e };
    }
}
