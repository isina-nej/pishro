import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    console.log("DEBUG: Starting login process");
    console.log("DEBUG: Phone:", phone);
    console.log("DEBUG: Password length:", password?.length);

    // Validation
    if (!phone || !password) {
      console.log("DEBUG: Missing phone or password");
      return NextResponse.json({
        status: "fail",
        message: "Missing credentials",
      }, { status: 400 });
    }

    // Validate phone format
    if (!/^09\d{9}$/.test(phone)) {
      console.log("DEBUG: Invalid phone format");
      return NextResponse.json({
        status: "fail",
        message: "Invalid phone format",
      }, { status: 400 });
    }

    // Validate password length
    if (password.length < 8) {
      console.log("DEBUG: Password too short");
      return NextResponse.json({
        status: "fail",
        message: "Password too short",
      }, { status: 400 });
    }

    // Find user
    console.log("DEBUG: Querying user from database");
    const user = await queryOne<any>(
      "SELECT id, phone, passwordHash, role, firstName, lastName, email, phoneVerified FROM `User` WHERE phone = ?",
      [phone]
    );

    console.log("DEBUG: User found:", !!user);
    if (!user) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid phone or password",
      }, { status: 401 });
    }

    // Verify password
    console.log("DEBUG: Checking password");
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    console.log("DEBUG: Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid phone or password",
      }, { status: 401 });
    }

    // Check if phone is verified
    console.log("DEBUG: Phone verified:", user.phoneVerified);
    if (!user.phoneVerified) {
      return NextResponse.json({
        status: "fail",
        message: "Phone not verified",
      }, { status: 403 });
    }

    // Return user data
    const userData = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null,
      email: user.email,
      phoneVerified: user.phoneVerified,
      avatarUrl: user.avatarUrl,
    };

    console.log("DEBUG: Returning success");
    return NextResponse.json({
      status: "success",
      message: "Login successful",
      data: userData,
    });
  } catch (error: any) {
    console.error("DEBUG: Error:", error);
    console.error("DEBUG: Error message:", error.message);
    console.error("DEBUG: Error stack:", error.stack);
    return NextResponse.json({
      status: "error",
      message: error.message || "Login failed",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}
