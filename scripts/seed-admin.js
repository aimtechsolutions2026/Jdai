const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

function loadEnv() {
  if (process.env.MONGODB_URI) return;
  const envPath = path.resolve(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function seedAdmin() {
  loadEnv();

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ Error: MONGODB_URI is not defined in .env or environment variables.");
    process.exit(1);
  }

  const ADMIN_EMAIL = "admin@codifypro.ai";
  const ADMIN_PASSWORD = "admin123";
  const ADMIN_NAME = "CodifyPro Admin";
  const ADMIN_PHONE = "+91 9999999999";

  console.log("==========================================");
  console.log("🌱 CodifyPro Admin Seeder");
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log(`Role:     admin`);
  console.log("==========================================");
  console.log("Connecting to MongoDB...");

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log("✅ Successfully connected to MongoDB.");

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Check if user already exists
    const usersCollection = mongoose.connection.collection("users");
    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`Found existing user with email ${ADMIN_EMAIL}. Updating credentials and promoting to admin...`);
      await usersCollection.updateOne(
        { _id: existingAdmin._id },
        {
          $set: {
            role: "admin",
            passwordHash,
            name: existingAdmin.name || ADMIN_NAME,
            isVerified: true,
            isActive: true,
            updatedAt: new Date(),
          },
        }
      );
      console.log("✅ Admin user credentials updated successfully in MongoDB!");
    } else {
      console.log(`Creating new admin account for ${ADMIN_EMAIL}...`);
      const now = new Date();
      await usersCollection.insertOne({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "admin",
        phone: ADMIN_PHONE,
        isVerified: true,
        isActive: true,
        deletionRequested: false,
        deletionReason: "",
        createdAt: now,
        updatedAt: now,
      });
      console.log("✅ Admin user created successfully in MongoDB!");
    }

    console.log("------------------------------------------");
    console.log("🎉 Seeding complete. You can now log in at /login with:");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("------------------------------------------");
  } catch (error) {
    console.error("❌ MongoDB connection or seeding failed:");
    console.error(error.message || error);
    if (error.message && error.message.includes("whitelist")) {
      console.error("\n👉 Tip: Make sure your current IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).");
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
