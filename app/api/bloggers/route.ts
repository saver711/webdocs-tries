// app/api/bloggers/route.ts

import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/consts/api.const";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accessToken")?.value;
    // Convert searchParams to your filter format
    const params = Object.fromEntries(searchParams.entries());

    // Make your internal API call or database query
    const response = await fetch(
      `${API_BASE}/bloggers?${new URLSearchParams(params)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error("Failed to fetch bloggers");

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bloggers:", error);
    return NextResponse.json(
      { error: "Failed to fetch bloggers" },
      { status: 500 },
    );
  }
}
