// commands/userinfo.js
import { getUserInfo } from '../functions/userInfo.js';
import {
  InteractionResponseType,
  InteractionResponseFlags,
} from 'discord-interactions';

export const command = {
  name: 'userinfo',
  description: 'Fetches a roblox userinfo',
  handler: async (interaction, env) => {
    let robloxUsername = interaction.data.options?.find(opt => opt.name === 'username')?.value;
    let res = await getUserInfo(robloxUsername)
    if (res?.success === false) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `❌ Failed to fetch user info: ${JSON.stringify(res.err.errors)}`,
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [
          {
            title: `Stalked ${res.userInfo_cloud.name || robloxUsername}`,
            description: `> **About me**: ${res.userInfo_cloud.about || "No description available."}`,
            color: 11654809,
            thumbnail: {
              url: res.userInfo_thumbnail?.response?.imageUri
            },
            fields: [
              {
                name: "> Username",
                value: res.userInfo_cloud.name ?? "Unknown",
                inline: true,
              },
              {
                name: "> User ID",
                value: String(res.userInfo_cloud.id),
                inline: true,
              },
              {
                name: "> Created",
                value: new Date(res.userInfo_cloud.createTime).toLocaleDateString() || "N/A",
              },
            ],
            footer: {
              text: "Powered by Roblox Oauth2 API",
            },
          },
        ],
      },
    };

  },
};
