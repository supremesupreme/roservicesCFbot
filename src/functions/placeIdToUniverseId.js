/*import { ClassicUsersApi } from "openblox/classic";

export async function getUniverseIdFromPlaceId(placeId) {
  try {
    const { data } = await ClassicUsersApi.universeIdFromPlaceId({ placeId: placeId });

    const res = data;

    if (!res) {
      throw new Error(`placeId not found.`);
    }

    return res;

  } catch (error) {
    console.error('Error fetching place ID:', error);
    return null;
  }
}*/

const fetch = require('node-fetch');

export async function getUniverseIdFromPlaceId(placeId) {
  const response = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
  const data = await response.json();
  return data.universeId;
}

