import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { Option } from "@/app/components/ui/multi-async-select";
import { fetchBloggersByIds } from "@/app/lib/services/blogger.service";

interface UseFetchMissingBloggersOptions {
  selectedIds: string[]; // For single select, pass [id] or []
  loadedOptionIds: Set<string>;
  searchString: string;
  isPending: boolean;
  data: { data: Array<{ _id: string }> } | undefined;
}

export const useFetchMissingBloggers = ({
  selectedIds,
  loadedOptionIds,
  searchString,
  isPending,
  data,
}: UseFetchMissingBloggersOptions) => {
  // Track which IDs we've already fetched/loaded to avoid re-fetching
  const fetchedIdsRef = useRef<Set<string>>(new Set());
  const initialLoadDoneRef = useRef(false);
  // Store fetched missing options in state so they persist across search changes
  const [fetchedMissingOptions, setFetchedMissingOptions] = useState<Option[]>(
    [],
  );

  // Update fetchedIdsRef when data loads (add all loaded IDs to the set)
  if (data?.data) {
    data.data.forEach((blogger) => {
      fetchedIdsRef.current.add(blogger._id);
    });
  }

  // Fetch missing selected IDs ONLY on initial load (when searchString is empty)
  // Don't re-fetch IDs that are already in fetchedIdsRef
  const missingIds = (() => {
    // Only calculate missing IDs on initial load (empty search)
    if (!data || searchString !== "" || initialLoadDoneRef.current) return [];

    // Handle empty selectedIds array
    if (selectedIds.length === 0) return [];

    // Find IDs that are selected but not in loaded data AND not already fetched
    return selectedIds.filter(
      (id) => !loadedOptionIds.has(id) && !fetchedIdsRef.current.has(id),
    );
  })();

  const { data: missingData, isPending: isFetchingMissing } = useQuery({
    queryKey: [
      "bloggers-by-ids",
      [...selectedIds].sort((a, b) => a.localeCompare(b)).join(","),
    ], // Use stable key
    queryFn: async () => {
      const result = await fetchBloggersByIds(missingIds);
      // Mark these IDs as fetched
      missingIds.forEach((id) => {
        fetchedIdsRef.current.add(id);
      });
      initialLoadDoneRef.current = true;
      return result;
    },
    // Only fetch when:
    // 1. Main query has completed (data is available)
    // 2. We're on initial load (searchString is empty)
    // 3. There are actually missing IDs
    // 4. We're not currently loading the main query
    // 5. We haven't already done the initial fetch
    enabled:
      !isPending &&
      !!data &&
      searchString === "" &&
      missingIds.length > 0 &&
      !initialLoadDoneRef.current,
    // Keep the data even when query is disabled
    staleTime: Infinity,
    gcTime: Infinity, // Previously cacheTime
  });

  // Update fetchedMissingOptions when missingData loads
  if (missingData?.data && missingData.data.length > 0) {
    const newOptions = missingData.data.map((blogger) => ({
      label: blogger.name,
      value: blogger._id,
    }));
    // Only update if we don't already have these options
    if (
      newOptions.length !== fetchedMissingOptions.length ||
      !newOptions.every((opt) =>
        fetchedMissingOptions.some((f) => f.value === opt.value),
      )
    ) {
      setFetchedMissingOptions(newOptions);
    }
  }

  return {
    fetchedMissingOptions,
    isFetchingMissing,
  };
};
