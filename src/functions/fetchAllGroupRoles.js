import { GroupsApi } from "openblox/cloud";

export async function fetchAllGroupRoles(groupId) {
    let allRoles = [];
    let nextPageToken = undefined;

    while (true) {
        const { data: response, cursors } = await GroupsApi.groupRoles({
            groupId,
            limit: 20,
            nextPageToken,
        });

        const roles = response.data || [];
        allRoles.push(...roles);

        nextPageToken = cursors?.next;

        if (!nextPageToken) break; // <--- exit loop if no next page
    }

    console.log(allRoles);

    return allRoles;
}
