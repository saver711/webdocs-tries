// app/bloggers/hooks/use-bloggers-deletion.ts
import { useState } from "react"
import type { Blogger } from "../models/blogger.model"

export const useBloggersDeletion = (data: Blogger[]) => {
  const [filteredData, setFilteredData] = useState(data)
  const [selectedBloggers, setSelectedBloggers] = useState<Blogger[]>([])

  const handleDelete = (id: string) =>
    setFilteredData(prev => prev.filter(b => b.id !== id))

  const handleBulkDelete = () => {
    const selectedIds = selectedBloggers.map(b => b.id)
    setFilteredData(prev => prev.filter(b => !selectedIds.includes(b.id)))
    setSelectedBloggers([])
  }

  return {
    filteredData,
    setFilteredData,
    selectedBloggers,
    setSelectedBloggers,
    handleDelete,
    handleBulkDelete
  }
}
