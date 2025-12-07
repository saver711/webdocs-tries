// app/bloggers/page.tsx

import { BloggersTable } from "./components/bloggers-table";

export const revalidate = false;

export const metadata = {
  title: "Bloggers",
  description: "View all bloggers",
};

export default async function BloggersPage() {
  return (
    <div className="container mx-auto py-10">
      <BloggersTable />
    </div>
  );
}
