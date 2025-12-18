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
    const errorData = await response.json();
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

/**
 * Fetches bloggers by their IDs.
 * This is useful for edit mode when you have IDs but need to fetch their full details.
 *
 * @param ids Array of blogger IDs to fetch
 * @returns Promise with the bloggers data in PaginatedResponse format
 */
export async function fetchBloggersByIds(
  ids: string[],
): Promise<PaginatedResponse<Blogger>> {
  if (ids.length === 0) {
    return {
      data: [],
      message: "",
      pagination: {
        total: 0,
        currentPage: 1,
        perPage: 0,
        pageCount: 0,
      },
    };
  }

  // POST request to /api/bloggers/bloggersIds
  // Body: { bloggersIds: "id1, id2, id3" } as comma-separated string
  const URL = `/api/bloggers/bloggersIds`;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bloggersIds: ids.join(", "), // Comma-separated string with space
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch bloggers by IDs");
  }

  const result = await response.json();

  // The API returns PaginatedResponse<Blogger> directly
  // Filter to ensure we only return the requested IDs (in case API returns more)
  const filteredData =
    result.data?.filter((blogger: Blogger) => ids.includes(blogger._id)) || [];

  return {
    ...result,
    data: filteredData,
    pagination: {
      ...result.pagination,
      total: filteredData.length,
    },
  };
}
