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
        // Get existing data first
        let existingDataRaw = await redis.get(`${guildId}_setupData`);
        let existingData = {};

        if (existingDataRaw) {
            existingData = existingDataRaw;
        }

        // Handle API key encryption if provided
        let encryptedkey = existingData.encryptedkey; // Keep existing if not updating
        if (apiKey) {
            encryptedkey =
                (await encrypt(apiKey, `${guildId}_${encryptionKey}`)) ?? null;
        }

        // Merge existing data with new data (only update provided fields)
        const updatedData = {
            groupId: groupId ?? existingData.groupId,
            adminRole: adminRole ?? existingData.adminRole,
            rankPermsRole: rankPermsRole ?? existingData.rankPermsRole,
            moderationPerms: moderationPerms ?? existingData.moderationPerms,
            rankLimit: rankLimit ?? existingData.rankLimit,
            encryptedkey: encryptedkey,
            placeId: placeId ?? existingData.placeId,
        };

        let res = await redis.set(
            `${guildId}_setupData`,
            JSON.stringify(updatedData),
        );

        if (res) return { success: true, res };
    } catch (e) {
        return { success: false, e };
    }
}
