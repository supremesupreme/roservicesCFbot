import { getRedis } from "../runtime/redis";
import { getEncryptionKey } from "../runtime/encryptionkey";
import { encrypt } from "./cryption";

export async function databaseSetupBot(
    guildId,
    groupId,
    adminRole,
    rankPermsRole,
    moderationPerms,
    rankLimit,
    apiKey,
    placeId,
) {
    let redis = getRedis();
    let encryptionKey = getEncryptionKey();
    try {
        if (apiKey) {
            var encryptedkey =
                (await encrypt(apiKey, `${guildId}_${encryptionKey}`)) ?? null;
        }
        let res = await redis.set(
            `${guildId}_setupData`,
            JSON.stringify({
                groupId,
                adminRole,
                rankPermsRole,
                moderationPerms,
                rankLimit,
                encryptedkey,
                placeId,
            }),
        );
        if (res) return { success: true, res };
    } catch (e) {
        return { success: false, e };
    }
}
