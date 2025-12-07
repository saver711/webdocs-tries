// lib/services/blogger.service.ts
import type {
  Blogger,
  BloggersTableParams,
} from "@/app/bloggers/models/blogger.model";
import type { PaginatedResponse } from "@/app/models/api.model";
import { API_BASE } from "@/lib/consts/api.const";

export async function fetchBloggers(
  params: BloggersTableParams,
): Promise<PaginatedResponse<Blogger>> {
  // Create query string from params
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryString.append(key, value.toString());
    }
  });

  const URL = `/api/bloggers?${queryString}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Add cache configuration if needed
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch bloggers");
  }

  return response.json();
}

export async function deleteBloggers(ids: string[]) {
  const response = await fetch(`${API_BASE}/bloggers/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) throw new Error("Failed to delete bloggers");
  return response.json();
}
