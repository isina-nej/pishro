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

export async function createSkyRoomClass(data: {
  meetingLink: string;
  published: boolean;
}): Promise<SkyRoomClass> {
  try {
    const id = `sky_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO SkyRoomClass (id, meetingLink, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
      [id, data.meetingLink, data.published ? 1 : 0, now, now]
    );

    return { id, ...data, createdAt: now, updatedAt: now };
  } catch (error) {
    console.error("Error creating skyroom class:", error);
    throw error;
  }
}

export async function updateSkyRoomClass(
  classId: string,
  data: Partial<{ meetingLink: string; published: boolean }>
): Promise<SkyRoomClass | null> {
  try {
    const now = new Date().toISOString();
    const updates: string[] = [];
    const params: any[] = [];

    if (data.meetingLink !== undefined) {
      updates.push("meetingLink = ?");
      params.push(data.meetingLink);
    }
    if (data.published !== undefined) {
      updates.push("published = ?");
      params.push(data.published ? 1 : 0);
    }

    updates.push("updatedAt = ?");
    params.push(now);
    params.push(classId);

    await query(
      `UPDATE SkyRoomClass SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    return getSkyRoomClassById(classId);
  } catch (error) {
    console.error("Error updating skyroom class:", error);
    throw error;
  }
}

export async function deleteSkyRoomClass(classId: string): Promise<boolean> {
  try {
    await query(`DELETE FROM SkyRoomClass WHERE id = ?`, [classId]);
    return true;
  } catch (error) {
    console.error("Error deleting skyroom class:", error);
    throw error;
  }
}
