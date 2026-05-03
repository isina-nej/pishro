import { query } from "@/lib/db";

interface SkyRoomClass {
  id: string;
  meetingLink: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getSkyRoomMeetingLink(): Promise<string | null> {
  try {
    // Set a timeout for database query (5 seconds)
    const classes = await Promise.race([
      query<SkyRoomClass>(
        `SELECT meetingLink FROM SkyRoomClass WHERE published = 1 LIMIT 1`,
        []
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 5000)
      ),
    ]);

    return (classes?.[0]?.meetingLink) || null;
  } catch (error) {
    console.error("Error fetching skyroom meeting link:", error);
    // Return null instead of throwing to prevent page crash
    return null;
  }
}

export async function getSkyRoomClassById(classId: string): Promise<SkyRoomClass | null> {
  try {
    const classes = await query<SkyRoomClass>(
      `SELECT * FROM SkyRoomClass WHERE id = ? LIMIT 1`,
      [classId]
    );
    return classes[0] || null;
  } catch (error) {
    console.error("Error fetching skyroom class by ID:", error);
    return null;
  }
}

export async function getAllSkyRoomClassesForAdmin(): Promise<SkyRoomClass[]> {
  try {
    const classes = await query<SkyRoomClass>(
      `SELECT * FROM SkyRoomClass ORDER BY createdAt DESC`,
      []
    );
    return classes;
  } catch (error) {
    console.error("Error fetching skyroom classes for admin:", error);
    return [];
  }
}
