import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json({ count: data.users?.length || 0 });
  } catch (error) {
    console.error("Error fetching users count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
