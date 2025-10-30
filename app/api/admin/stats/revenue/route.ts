import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      cache: "no-store",
    });

    const data = await res.json();

    // Assuming each order has a `totalPrice` field
    const total = data.orders?.reduce(
      (sum: number, order: any) => sum + (order.totalPrice || 0),
      0
    ) || 0;

    return NextResponse.json({ total });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return NextResponse.json({ total: 0 }, { status: 500 });
  }
}
