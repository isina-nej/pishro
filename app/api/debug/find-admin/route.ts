import { queryOne } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await queryOne<any>(
      "SELECT id, phone, passwordHash, role, firstName, lastName FROM `User` WHERE phone = ?",
      ["09123456789"]
    );

    if (!user) {
      return NextResponse.json({
        status: "error",
        message: "User not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "User found",
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,
      }
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
