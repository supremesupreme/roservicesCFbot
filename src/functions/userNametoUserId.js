import { ClassicUsersApi } from "openblox/classic";

export async function getUserIdByUserName(userName) {
  try {
    const { data } = await ClassicUsersApi.usersInfoFromNames({ usernames: [userName] });

    const user = data[userName];

    if (!user) {
      throw new Error(`User ${userName} not found`);
    }

    return user.id;

  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
}
