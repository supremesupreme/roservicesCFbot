import { ClassicGroupsApi } from "openblox/classic";

export async function getRankFromRoleId(roleId) {
    try {
        const { data: roles } = await ClassicGroupsApi.groupRolesFromIds({
            roleIds: [roleId],
        });

        const rankId = roles[roleId].rank;

        if (!roles) {
            throw new Error(`Role "${roleName}" not found in group`);
        }

        return rankId;
    } catch (error) {
        console.error("Error fetching role ID:", error);
        return null;
    }
}
