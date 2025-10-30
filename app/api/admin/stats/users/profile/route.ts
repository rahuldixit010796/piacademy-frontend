import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import cloudinary from "cloudinary";

// ✅ Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Extract fields
    const { email, avatar, name, className, contact, favoriteSubject, dream } =
      body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const updateData: any = {
      ...(name && { name }),
      ...(className && { className }),
      ...(contact && { contact }),
      ...(favoriteSubject && { favoriteSubject }),
      ...(dream && { dream }),
    };

    // If new avatar provided
    if (avatar && avatar.startsWith("data:image")) {
      const uploadRes = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        overwrite: true,
      });
      updateData.avatar = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    // Update user in DB
    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("❌ Profile update failed:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
