import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json({ count: data.orders?.length || 0 });
  } catch (error) {
    console.error("Error fetching orders count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
