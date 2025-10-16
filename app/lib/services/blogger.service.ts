// import type { BloggerTableFilters } from "@/app/bloggers/models/blogger.model"
// import { API_BASE } from "../consts/api.const"

// export async function fetchBloggers(params: BloggerTableFilters) {
//   const searchParams = new URLSearchParams()
//   if (params.name) searchParams.append("search", params.name)
//   searchParams.append("page", params.page.toString())
//   searchParams.append("pageSize", params.pageSize.toString())
//   if (params.sortBy) searchParams.append("sortBy", params.sortBy)
//   if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder)

//   const response = await fetch(`${API_BASE}/bloggers?${searchParams}`, {
//     method: "GET"
//   })

//   if (!response.ok) throw new Error("Failed to fetch bloggers")
//   return response.json()
// }

// export async function deleteBloggers(ids: string[]) {
//   const response = await fetch(`${API_BASE}/bloggers/delete`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ids })
//   })

//   if (!response.ok) throw new Error("Failed to delete bloggers")
//   return response.json()
// }
