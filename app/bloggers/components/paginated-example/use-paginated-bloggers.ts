import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { Option } from "@/app/components/ui/multi-async-select";
import { fetchBloggers } from "@/app/lib/services/blogger.service";

const PER_PAGE = 8;

export const usePaginatedBloggers = (queryKey: string) => {
  const [searchString, setSearchString] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: [queryKey, searchString],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchBloggers({
        name: searchString,
        page: pageParam,
        perPage: PER_PAGE,
      });
    },
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination.currentPage < pagination.pageCount) {
        return pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: true,
  });

  // Flatten all pages into a single array of options
  const OPTIONS: Option[] =
    data?.pages.flatMap((page) =>
      page.data.map((blogger) => ({
        label: blogger.name,
        value: blogger._id,
      })),
    ) || [];

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchString(value);
  }, 300);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    OPTIONS,
    data,
    isPending,
    error,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    handleSearch,
    handleLoadMore,
    searchString,
    loadedOptionIds: new Set(
      data?.pages.flatMap((page) => page.data.map((blogger) => blogger._id)) ||
        [],
    ),
  };
};
