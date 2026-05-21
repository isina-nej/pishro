import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdminUser() {
  try {
    const adminEmail = "admin@pishro.com";
    const testPassword = "Admin@123";
    
    // Hash the password
    const passwordHash = await bcrypt.hash(testPassword, 10);
    
    // Delete existing admin user
    await prisma.adminUser.deleteMany({
      where: { email: adminEmail }
    });
    console.log("✅ Deleted existing admin user");

    // Create new admin user
    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "مدیر سیستم",
        role: "ADMIN",
        status: "ACTIVE",
      }
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${testPassword}`);
    console.log(`ID: ${admin.id}`);
    
    // Verify it works
    const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
    console.log(`\n🔐 Password verification: ${isValid ? "✅ VALID" : "❌ INVALID"}`);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminUser();
