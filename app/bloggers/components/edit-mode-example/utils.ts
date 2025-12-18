import type { Option } from "@/app/components/ui/multi-async-select";

/**
 * Merges loaded options with fetched missing options.
 * Only includes fetched missing options on initial load (empty search)
 * so they get added to the component's reserveOptions.
 * When searching, only shows search results.
 */
export const mergeOptions = (
  loadedOptions: Option[],
  fetchedMissingOptions: Option[],
  searchString: string,
): Option[] => {
  let OPTIONS: Option[] = loadedOptions;

  // On initial load (no search), include fetched missing options so they're stored in reserveOptions
  // When searching, only show search results
  if (searchString === "" && fetchedMissingOptions.length > 0) {
    const optionsMap = new Map<string, Option>();

    // First add loaded options
    loadedOptions.forEach((option) => {
      optionsMap.set(option.value, option);
    });

    // Then add fetched missing options (only if not already present)
    fetchedMissingOptions.forEach((option) => {
      if (!optionsMap.has(option.value)) {
        optionsMap.set(option.value, option);
      }
    });

    OPTIONS = Array.from(optionsMap.values());
  }

  return OPTIONS;
};

