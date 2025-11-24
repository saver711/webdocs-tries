// app/bloggers/page.tsx
import { BloggersTable } from "./components/bloggers-table"
import type { Blogger } from "./models/blogger.model"
import { filterBloggers } from "./utils/filter-bloggers"

export const revalidate = false

async function getData(): Promise<Blogger[]> {
  const bloggers = (await import("@/data/bloggers.json")).default
  return bloggers
}

export const metadata = {
  title: "Bloggers",
  description: "View all bloggers"
}

type PageSearchParams = {
  name?: string
  bio?: string
  dateFrom?: string
  dateTo?: string
}

export default async function BloggersPage({
  searchParams
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const values = await searchParams
  const data = await getData()

  const filteredData = filterBloggers(values, data)

  return (
    <div className="container mx-auto py-10">
      <BloggersTable data={data} filteredData={filteredData} />
    </div>
  )
}
