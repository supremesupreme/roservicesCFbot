/**
 * Reach out to the roblox API, and get the results of userinfo from
 * oauth2 api.
 * @returns returns json data of userdata.
 */

import { getUniverseIdFromPlaceId } from "./placeIdToUniverseId";
import { parseDurationLengths } from "./parseDurationLenghts";
import { UserRestrictionsApi } from "openblox/cloud";
import { getUserIdByUserName } from "./userNametoUserId";
import { databaseFetch } from "./databaseFetch";
import { decrypt } from "./cryption";
import { getEncryptionKey } from "../runtime/encryptionkey";
import { createOpenbloxConfig } from "openblox/config";

export async function updateExperienceRestrictions(
    restrictUser,
    guildId,
    robloxUserId,
    privateReason,
    publicReason,
    durationLength,
    excludeAlts,
) {
    try {
        let databaseResponse = await databaseFetch(guildId, "setupData");
        let encryptionKey = getEncryptionKey();
        let apiKey = databaseResponse?.res?.encryptedkey
            ?.trim()
            .replace(/^"(.*)"$/, "$1")
            .replace(/\s+/g, "");
        if (!apiKey) return { success: false, reason: "no apikey found" };
        let decryptedKey = await decrypt(apiKey, `${guildId}_${encryptionKey}`);
        let ruserId = await getUserIdByUserName(robloxUserId);
        let parsedDurationLengths =
            parseDurationLengths(durationLength).toString();
        let placeid = databaseResponse?.res?.placeId;
        let universeId = await getUniverseIdFromPlaceId(placeid);

        const { data: userRestriction } =
            await UserRestrictionsApi.updateRestrictionsForUser.bind(
                createOpenbloxConfig({ cloudKey: `${decryptedKey}` }),
            )({
                universeId: universeId,
                placeId: placeid,
                userId: ruserId,
                updatedData: {
                    gameJoinRestriction: {
                        active: restrictUser,
                        ...(restrictUser && {
                            duration: parsedDurationLengths,
                            privateReason: privateReason ?? "N/A",
                            displayReason: publicReason ?? "N/A",
                            excludeAltAccounts: excludeAlts ?? false,
                        }),
                    },
                },
            });

        return { success: true, userRestriction };
    } catch (err) {
        return { success: false, err };
    }
}
