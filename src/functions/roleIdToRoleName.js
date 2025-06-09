import { ClassicGroupsApi } from "openblox/classic";

export async function getRoleIdByName(groupId, roleName) {
  try {

    const { data: roles } = await ClassicGroupsApi.groupRoles({ groupId: groupId }); 

    const role = roles.find(role => ((role.name).toLowerCase()) === (roleName.toLowerCase()));

    if (!role) {
      throw new Error(`Role "${roleName}" not found in group`);
    }

    return role.id;

  } catch (error) {
    console.error('Error fetching role ID:', error);
    return null;
  }
}