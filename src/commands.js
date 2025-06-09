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
        },
        {
            name: "rank",
            type: 3,
            description: "Roblox Rank",
            required: true,
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
            required: true,
        },
        {
            name: "adminrole",
            type: 8,
            description: "Role responsible for administration",
            required: true,
        },
        {
            name: "rankpermsrole",
            type: 8,
            description: "Role responsible for ranking",
            required: true,
        },
        {
            name: "moderationrole",
            type: 8,
            description: "Role responsible for moderation",
            required: true,
        },
        {
            name: "ranklimit",
            type: 10,
            description: "Max the bot is allowed to rank",
            min_value: 0,
            max_value: 255,
            required: true,
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
