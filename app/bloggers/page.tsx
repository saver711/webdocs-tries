import { BloggersTable } from "./components/bloggers-table";
import { BloggersTablex } from "./components/bloggers-tablex";
import type { Blogger } from "./models/blogger.model";

export const revalidate = false;

async function getData(): Promise<Blogger[]> {
  const bloggers = (await import("@/data/bloggers.json")).default;
  return bloggers;
}

export const metadata = {
  title: "Bloggers",
  description: "View all bloggers",
};

export default async function BloggersPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <BloggersTable data={data} />
      {/* <BloggersTablex data={data} /> */}
    </div>
  );
}
