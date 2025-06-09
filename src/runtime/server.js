/**
 * The core server that runs on a Cloudflare worker.
 */
import { setGlobalConfig } from "./inital.js";
import { getRedis } from "./redis.js";
import { setDefaultOpenbloxConfig, createOpenbloxConfig } from "openblox/config";
import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
  InteractionResponseFlags
} from 'discord-interactions';
import { commands } from '../commands/index.js';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

router.get('/', (_request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post('/', async (request, env) => {
  // Initialize global configs
  setGlobalConfig(env);

  // Set up OpenBlox config
  setDefaultOpenbloxConfig(
    createOpenbloxConfig({
      cloudKey: env.ROBLOX_CLOUD_KEY,
    })
  );

  const { isValid, interaction } = await server.verifyDiscordRequest(request, env);
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const commandName = interaction.data.name.toLowerCase();
    const command = commands[commandName];

    if (!command || typeof command.handler !== 'function') {
      return new JsonResponse({ error: 'Unknown Command' }, { status: 400 });
    }

    try {
      // Optional: use Redis from global if needed here
      const redis = getRedis();
      const response = await command.handler(interaction, env);
      return new JsonResponse(response);
    } catch (e) {
      console.error('Error in command handler:', e);
      return new JsonResponse(
        {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'There was an error executing that command.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        },
        { status: 500 },
      );
    }
  }

  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;
