// commands/awwww.js
import { getRedditUrl } from "../functions/reddit.js";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";

export const command = {
    name: "awwww",
    description: "Get a cute animal pic",
    handler: async (interaction, env) => {
        let cuteUrl = await getRedditUrl();
        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: cuteUrl },
        };
    },
};
