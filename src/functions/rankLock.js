import { getRedis } from "../runtime/redis";
import { getUserIdByUserName } from "./userNametoUserId";

export async function rankLock(guildId, userId, revert = false) {
    let redis = getRedis();

    try {
        let setupDataRaw = await redis.get(`${guildId}_setupData`);
        let robloxUserId = await getUserIdByUserName(userId);

        if (!setupDataRaw.rankLockedUsers) {
            setupDataRaw.rankLockedUsers = [];
        }

        if (revert) {
            if (setupDataRaw.rankLockedUsers.includes(robloxUserId)) {
                setupDataRaw.rankLockedUsers =
                    setupDataRaw.rankLockedUsers.filter(
                        (id) => id !== robloxUserId,
                    );
            } else {
                return {
                    success: false,
                    error: "User not found in rank locked list",
                };
            }
        } else {
            if (!setupDataRaw.rankLockedUsers.includes(robloxUserId)) {
                setupDataRaw.rankLockedUsers.push(robloxUserId);
            } else {
                return { success: false, error: "User already rank locked" };
            }
        }

        await redis.set(`${guildId}_setupData`, JSON.stringify(setupDataRaw));

        return {
            success: true,
        };
    } catch (e) {
        return { success: false, error: e.message ?? e };
    }
}
