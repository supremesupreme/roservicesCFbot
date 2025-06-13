/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const AWW_COMMAND = {
    name: "awwww",
    description: "Drop some cuteness on this channel.",
};

export const INVITE_COMMAND = {
    name: "invite",
    description: "Get an invite link to add the bot to your server",
};

export const BOT_COMMAND = {
    name: "help",
    description: "Return all the commands for the bot",
};

export const USER_INFO = {
    name: "userinfo",
    description: "Fetches a roblox user info",
    options: [
        {
            name: "username",
            type: 3,
            description: "Roblox username",
            required: true,
        },
    ],
};

export const SET_RANK = {
    name: "setrank",
    description: "Set a user rank within linked roblox group",
    options: [
        {
            name: "username",
            type: 3,
            description: "Roblox username",
            required: true,
            autocomplete: true,
        },
        {
            name: "rank",
            type: 3,
            description: "Roblox Rank",
            required: true,
            autocomplete: true,
        },
    ],
};

export const ACCEPT_JOIN_REQUEST = {
    name: "acceptjoinrequest",
    description: "Accepts a user join request",
    options: [
        {
            name: "username",
            type: 3,
            description: "Roblox username",
            required: true,
            autocomplete: true,
        },
    ],
};

export const DECLINE_JOIN_REQUEST = {
    name: "declinejoinrequest",
    description: "Declines a user join request",
    options: [
        {
            name: "username",
            type: 3,
            description: "Roblox username",
            required: true,
            autocomplete: true,
        },
    ],
};

export const SETUP_BOT = {
    name: "setup",
    description: "Setup up the bot for use",
    options: [
        {
            name: "groupid",
            type: 3,
            description: "Roblox groupId",
            required: false,
        },
        {
            name: "adminrole",
            type: 8,
            description: "Role responsible for administration",
            required: false,
        },
        {
            name: "rankpermsrole",
            type: 8,
            description: "Role responsible for ranking",
            required: false,
        },
        {
            name: "moderationrole",
            type: 8,
            description: "Role responsible for moderation",
            required: false,
        },
        {
            name: "ranklimit",
            type: 10,
            description: "Max the bot is allowed to rank",
            min_value: 0,
            max_value: 255,
            required: false,
        },
        {
            name: "apikey",
            type: 3,
            description: "Your roblox API KEY",
            required: false,
        },
        {
            name: "placeid",
            type: 3,
            description: "Your roblox placeId you want to manage",
            required: false,
        },
    ],
};

export const RESTRICT_USER = {
    name: "restrictuser",
    description: "Restricts a user from a experience",
    options: [
        {
            name: "user",
            type: 3,
            description: "Roblox user to restrict",
            required: true,
        },
        {
            name: "privatereason",
            type: 3,
            description: "Private reason that will not be showed to the user",
            min_value: 0,
            max_value: 1000,
            required: false,
        },
        {
            name: "publicreason",
            type: 3,
            description: "Public reason that will be showed to the user",
            min_value: 0,
            max_value: 400,
            required: false,
        },
        {
            name: "duration",
            type: 3,
            description: "Duration of the ban leave empty for permanent",
            required: false,
        },
        {
            name: "excludealts",
            type: 5,
            description: "Ban detected alt accounts",
            required: false,
        },
    ],
};

export const UN_RESTRICT_USER = {
    name: "unrestrictuser",
    description: "unRestricts a user from a experience",
    options: [
        {
            name: "user",
            type: 3,
            description: "Roblox user to restrict",
            required: true,
        },
    ],
};

export const REDEEM_PREMIUM_CODE = {
    name: "redeemcode",
    description: "redeems a premium code",
    options: [
        {
            name: "premiumcode",
            type: 3,
            description: "Code to redeem",
            required: true,
        },
    ],
};

export const RANKLOCK_USER = {
    name: "ranklock",
    description: "Freezes a user's rank",
    options: [
        {
            name: "username",
            type: 3,
            description: "User to ranklock",
            required: true,
        },
    ],
};

export const UNRANKLOCK_USER = {
    name: "unranklock",
    description: "unFreezes a user's rank",
    options: [
        {
            name: "username",
            type: 3,
            description: "User to unranklock",
            required: true,
        },
    ],
};
