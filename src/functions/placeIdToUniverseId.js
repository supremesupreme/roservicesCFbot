const fetch = require("node-fetch");

export async function getUniverseIdFromPlaceId(placeId) {
    const response = await fetch(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
    );
    const data = await response.json();
    return data.universeId;
}
