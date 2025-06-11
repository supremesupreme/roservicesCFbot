// commands/index.js
import { command as awwCommand } from "./awwww.js";
import { command as inviteCommand } from "./invite.js";
import { command as userInfo } from "./userinfo.js";
import { command as setRank } from "./setRank.js";
import { command as acceptGroupJoinRequest } from "./acceptGroupJoinRequest.js";
import { command as declineGroupJoinRequest } from "./declineGroupJoinRequest.js";
import { command as setupBot } from "./setupBot.js";
import { command as restrictUser } from "./restrictUser.js";
import { command as unRestrictUser } from "./unRestrictUser.js";
import { command as redeemCode } from "./redeemCode.js";
import { command as botCommands } from "./botCommands.js";

export const commands = {
    [awwCommand.name.toLowerCase()]: awwCommand,
    [inviteCommand.name.toLowerCase()]: inviteCommand,
    [userInfo.name.toLocaleLowerCase()]: userInfo,
    [setRank.name.toLocaleLowerCase()]: setRank,
    [acceptGroupJoinRequest.name.toLocaleLowerCase()]: acceptGroupJoinRequest,
    [declineGroupJoinRequest.name.toLocaleLowerCase()]: declineGroupJoinRequest,
    [setupBot.name.toLocaleLowerCase()]: setupBot,
    [restrictUser.name.toLocaleLowerCase()]: restrictUser,
    [unRestrictUser.name.toLocaleLowerCase()]: unRestrictUser,
    [redeemCode.name.toLocaleLowerCase()]: redeemCode,
    [botCommands.name.toLocaleLowerCase()]: botCommands,
};
