// app/api/bloggers/bloggersIds/route.ts

import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/app/lib/utils/api/get-error-message.util";
import { API_BASE } from "@/lib/consts/api.const";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  try {
    const body = await request.json();
    const { bloggersIds } = body;

    if (!bloggersIds || typeof bloggersIds !== "string") {
      return NextResponse.json(
        { error: "bloggersIds is required and must be a string" },
        { status: 400 },
      );
    }

    // Make the API call to the backend
    const response = await fetch(`${API_BASE}/bloggers/bloggersIds`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bloggersIds }),
    });

    const data = await response.json();
    if (!response.ok)
      return NextResponse.json(
        { error: getErrorMessage(data) },
        { status: response.status },
      );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}


