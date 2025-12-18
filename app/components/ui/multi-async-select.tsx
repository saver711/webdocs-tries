"use client";

import type { PopoverContentProps } from "@radix-ui/react-popover";
import { CheckIcon, ChevronDown, Minus, X } from "lucide-react";
import * as React from "react";
import { useEffect, useImperativeHandle, useRef } from "react";
import { FadeLoader } from "react-spinners";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface Option {
  label: React.ReactNode;
  value: string; // should be unique, and not empty
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * An array of objects to be displayed in the Select.Option.
   */
  options: Option[];

  /**
   * Whether the select is async. If true, the getting options should be async.
   * Optional, defaults to false.
   */
  async?: boolean;

  /**
   * Whether is fetching options. If true, the loading indicator will be shown.
   * Optional, defaults to false. Works only when async is true.
   */
  loading?: boolean;

  /**
   * The error object. If true, the error message will be shown.
   * Optional, defaults to null. Works only when async is true.
   */
  error?: Error | null;

  /**
   * The default selected values when the component mounts.
   * In single select mode (multiple=false), this is a string or undefined.
   * In multi select mode (multiple=true), this is an array of strings.
   */
  defaultValue?: string[] | string;

  /**
   * The selected values.
   * In single select mode (multiple=false), this is a string or undefined.
   * In multi select mode (multiple=true), this is an array of strings.
   * In async mode when all is selected, this can be a string (the selectAllValue).
   * Optional, defaults to undefined.
   */
  value?: string[] | string;

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Placeholder text to be displayed when the search input is empty.
   * Optional, defaults to "Search...".
   */
  searchPlaceholder?: string;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Text to be displayed when the clear button is clicked.
   * Optional, defaults to "Clear".
   */
  clearText?: string;

  /**
   * Text to be displayed when the close button is clicked.
   * Optional, defaults to "Close".
   */
  closeText?: string;

  /**
   * Whether to hide the select all option.
   * Optional, defaults to false.
   */
  hideSelectAll?: boolean;

  /**
   * Whether to clear search input when popover closes.
   * Optional, defaults to false.
   */
  clearSearchOnClose?: boolean;

  /**
   * Controlled search value. If provided, the component will use this value instead of internal state.
   * Optional, defaults to undefined.
   */
  searchValue?: string;

  /**
   * Additional options for the popover content.
   * Optional, defaults to null.
   * portal: Whether to use portal to render the popover content. !!!need to modify the popover component!!!
   */
  popoverOptions?: PopoverContentProps & {
    portal?: boolean;
  };

  /**
   * Custom label function.
   * Optional, defaults to null.
   */
  labelFunc?: (
    option: Option,
    isSelected: boolean,
    index: number,
  ) => React.ReactNode;

  /**
   * Callback function triggered when the selected values change.
   * In single select mode (multiple=false), receives a string or undefined.
   * In multi select mode (multiple=true), receives an array of strings.
   * In async mode when all is selected, receives a string (the selectAllValue).
   */
  onValueChange: (value: string[] | string | undefined) => void;

  /**
   * Callback function triggered when the search input changes.
   * Receives the search input value.
   */
  onSearch?: (value: string) => void;

  /**
   * Special value to use when "select all" is enabled in async mode.
   * This value will be sent to the backend to indicate all items are selected.
   * Optional, defaults to "__ALL__".
   */
  selectAllValue?: string;

  /**
   * Array of excluded item values when "select all" is active in async mode.
   * Optional, defaults to undefined.
   */
  excluded?: string[];

  /**
   * Callback function triggered when excluded items change.
   * Only used in async mode when "select all" is active.
   * Receives an array of excluded item values.
   */
  onExcludedChange?: (excluded: string[]) => void;

  /**
   * Whether the select component is disabled.
   * When disabled, the component cannot be interacted with and shows a disabled visual state.
   * Optional, defaults to false.
   */
  disabled?: boolean;

  /**
   * Whether multiple selections are allowed.
   * When false, only one option can be selected at a time and the popover closes on selection.
   * Optional, defaults to true.
   */
  multiple?: boolean;

  /**
   * Callback function triggered when user scrolls near the bottom of the list.
   * Used for infinite scroll/pagination. Only called when hasMore is true.
   * Optional, defaults to undefined.
   */
  onLoadMore?: () => void;

  /**
   * Whether there are more items to load (for pagination).
   * When true and user scrolls near bottom, onLoadMore will be called.
   * Optional, defaults to false.
   */
  hasMore?: boolean;

  /**
   * Whether pagination is currently loading more items.
   * Optional, defaults to false.
   */
  isLoadingMore?: boolean;
}

interface MultiAsyncSelectRef {
  setIsPopoverOpen: (open: boolean) => void;
  setSearchValue: (value: string) => void;
}

export const MultiAsyncSelect = React.forwardRef<MultiAsyncSelectRef, Props>(
  (
    {
      options,
      value,
      className,
      defaultValue = [],
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      clearText = "Clear",
      closeText = "Close",
      maxCount = 3,
      modalPopover = false,
      loading = false,
      async = false,
      error = null,
      hideSelectAll = false,
      popoverOptions,
      labelFunc,
      onValueChange,
      onSearch,
      clearSearchOnClose = false,
      searchValue,
      selectAllValue = "__ALL__",
      excluded,
      onExcludedChange,
      disabled = false,
      multiple = true,
      onLoadMore,
      hasMore = false,
      isLoadingMore = false,
    },
    ref,
  ) => {
    // Normalize value to array format for internal state
    // For single select, we still use array internally but convert on output
    const normalizeValue = React.useCallback(
      (val: string[] | string | undefined): string[] => {
        if (val === undefined) return [];
        if (typeof val === "string") return [val];
        return val;
      },
      [],
    );

    const [selectedValues, setSelectedValues] = React.useState<string[]>(() =>
      normalizeValue(defaultValue),
    );
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isOverflowPopoverOpen, setIsOverflowPopoverOpen] =
      React.useState(false);
    const [searchValueState, setSearchValueState] = React.useState(
      searchValue || "",
    );
    const [reserveOptions, setReserveOptions] = React.useState<
      Record<string, Option>
    >({});
    const [excludedState, setExcludedState] = React.useState<string[]>(
      excluded ?? [],
    );
    const optionsRef = useRef<Record<string, Option>>({});
    const isInit = useRef(false);
    const commandListRef = useRef<HTMLDivElement>(null);

    // Check if we're in "all selected" mode (async mode with selectAllValue)
    const isAllSelected =
      async &&
      selectedValues.length === 1 &&
      selectedValues[0] === selectAllValue;

    // Get the actual excluded items (controlled or internal state)
    const currentExcluded = excluded ?? excludedState;

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (
        event.key === "Backspace" &&
        !event.currentTarget.value &&
        multiple
      ) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (optionValue: string) => {
      // Store current option in reserve
      const currentOption = options.find((opt) => opt.value === optionValue);
      if (currentOption) {
        reserveOptions[optionValue] = currentOption;
      }

      // If isAllSelected in async mode, manage excluded items
      if (async && isAllSelected) {
        const newExcluded = currentExcluded.includes(optionValue)
          ? currentExcluded.filter((v) => v !== optionValue)
          : [...currentExcluded, optionValue];

        setExcludedState(newExcluded);
        onExcludedChange?.(newExcluded);
        return;
      }

      // Single select mode: replace selection and close popover
      if (!multiple) {
        const newSelectedValues = selectedValues.includes(optionValue)
          ? []
          : [optionValue];
        setSelectedValues(newSelectedValues);
        // Return string or undefined for single select mode
        onValueChange(
          newSelectedValues.length === 0 ? undefined : newSelectedValues[0],
        );
        // Close popover after selection in single mode
        if (newSelectedValues.length > 0) {
          setIsPopoverOpen(false);
          if (clearSearchOnClose) {
            setSearchValueState("");
            onSearch?.("");
          }
        }
        return;
      }

      // Multi select mode: toggle selection
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue];

      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      // Return appropriate type based on multiple mode
      onValueChange(multiple ? [] : undefined);
      if (async) {
        setExcludedState([]);
        onExcludedChange?.([]);
      }
    };

    const toggleAll = () => {
      if (async) {
        // Async mode: use selectAllValue pattern
        if (isAllSelected) {
          // Check if we're in indeterminate state (some excluded)
          if (currentExcluded.length > 0) {
            // Indeterminate: select all remaining (clear excluded)
            setExcludedState([]);
            onExcludedChange?.([]);
            // Keep the __ALL__ state
          } else {
            // All selected with no excluded: deselect all
            setSelectedValues([]);
            onValueChange([]);
            setExcludedState([]);
            onExcludedChange?.([]);
          }
        } else {
          // Not all selected, select all (including future items)
          // Return string value instead of array
          setSelectedValues([selectAllValue]);
          onValueChange(selectAllValue);
          // Clear excluded when selecting all
          setExcludedState([]);
          onExcludedChange?.([]);
        }
      } else {
        // Sync mode: select/deselect current visible options
        const currentOptions = options;
        const currentOptionValues = currentOptions.map(
          (option) => option.value,
        );

        // Check selection state
        const selectedCount = currentOptionValues.filter((value) =>
          selectedValues.includes(value),
        ).length;
        const allCurrentSelected = selectedCount === currentOptionValues.length;

        if (allCurrentSelected) {
          // All selected: deselect only the current options
          // Keep other selected values that are not in current options
          const newSelectedValues = selectedValues.filter(
            (value) => !currentOptionValues.includes(value),
          );
          setSelectedValues(newSelectedValues);
          onValueChange(newSelectedValues);
        } else {
          // Empty or indeterminate: select all current options
          // Merge with existing selections
          const newSelectedValues = [
            ...new Set([...selectedValues, ...currentOptionValues]),
          ];
          setSelectedValues(newSelectedValues);
          onValueChange(newSelectedValues);
        }
      }
    };

    useEffect(() => {
      const temp = options.reduce(
        (acc, option) => {
          acc[option.value] = option;
          return acc;
        },
        {} as Record<string, Option>,
      );
      if (async) {
        if (isInit.current === false) {
          // On first init, add all current options plus any selected values that match
          const selectedOptions = selectedValues.reduce(
            (acc, value) => {
              const option = temp[value];
              if (option) {
                acc[value] = option;
              }
              return acc;
            },
            {} as Record<string, Option>,
          );
          optionsRef.current = { ...temp, ...selectedOptions };
          setReserveOptions({ ...temp, ...selectedOptions });
          isInit.current = true;
        } else {
          // Also add any selected values that are now in the new options
          const temp2 = selectedValues.reduce(
            (acc, value) => {
              // First check if we already have it in reserve
              const existingOption = optionsRef.current[value];
              if (existingOption) {
                acc[value] = existingOption;
              } else {
                // Check if it's in the new options
                const newOption = temp[value];
                if (newOption) {
                  acc[value] = newOption;
                }
              }
              return acc;
            },
            {} as Record<string, Option>,
          );
          optionsRef.current = {
            ...temp,
            ...temp2,
            ...optionsRef.current, // Preserve existing reserve options
          };
          setReserveOptions((prev) => ({
            ...temp,
            ...temp2,
            ...prev, // Preserve existing reserve options
          }));
        }
      }
    }, [async, options, selectedValues]);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(normalizeValue(value));
      } else {
        // For both single and multi select, undefined means no selection
        setSelectedValues([]);
      }
    }, [value, normalizeValue]);

    useEffect(() => {
      if (excluded !== undefined) {
        setExcludedState(excluded);
      }
    }, [excluded]);

    useEffect(() => {
      if (searchValue !== undefined) {
        setSearchValueState(searchValue);
      }
    }, [searchValue]);

    // Auto-load more when content fits in container and hasMore is true
    useEffect(() => {
      if (!onLoadMore || !hasMore || isLoadingMore || !isPopoverOpen) return;

      const checkAndLoadMore = () => {
        const list = commandListRef.current;
        if (!list) return;

        const scrollHeight = list.scrollHeight;
        const clientHeight = list.clientHeight;

        // If content fits within container (no scrollbar needed) and we have more to load
        if (scrollHeight <= clientHeight && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      };

      // Check after DOM updates - use requestAnimationFrame for better timing
      let timeoutId: NodeJS.Timeout;
      const rafId = requestAnimationFrame(() => {
        // Small delay to ensure all content is rendered
        timeoutId = setTimeout(checkAndLoadMore, 50);
      });

      return () => {
        cancelAnimationFrame(rafId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [hasMore, isLoadingMore, isPopoverOpen, onLoadMore]);

    useImperativeHandle(ref, () => ({
      setIsPopoverOpen,
      setSearchValue: setSearchValueState,
    }));

    return (
      <Popover
        open={disabled ? false : isPopoverOpen}
        onOpenChange={(open) => {
          if (disabled) return;
          setIsPopoverOpen(open);
          if (!open && clearSearchOnClose) {
            setSearchValueState("");
            onSearch?.("");
          }
        }}
        modal={modalPopover}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <div
            className={cn(
              "flex h-auto min-h-[36px] w-full min-w-[160px] items-center justify-between rounded-md border border-input bg-background px-2 py-0.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              className,
            )}
          >
            {selectedValues.length > 0 || isAllSelected ? (
              <div className="flex justify-between items-center w-full">
                {multiple ? (
                  <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
                    {isAllSelected ? (
                      <div className="h-[26px] flex items-center gap-1 rounded-md px-2 py-0.5 border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                        <div className="flex items-center gap-1 truncate text-xs">
                          All selected
                          {currentExcluded.length > 0 && (
                            <span className="text-muted-foreground">
                              ({currentExcluded.length} excluded)
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {selectedValues.slice(0, maxCount).map((value) => {
                          let option: Option | undefined;
                          if (async) {
                            option = reserveOptions[value];
                          } else {
                            option = options.find(
                              (option) => option.value === value,
                            );
                          }
                          return (
                            <div
                              className="h-[26px] flex items-center gap-1 rounded-md px-2 py-0.5 border border-zinc-200 text-zinc-600 hover:text-primary dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-primary hover:border-zinc-400 dark:hover:border-zinc-600"
                              key={value}
                            >
                              <div className="flex items-center gap-1 truncate text-xs max-w-[100px] ">
                                {option?.label || value}
                              </div>
                              <X
                                className={cn(
                                  "h-3 w-3 p-1 box-content shrink-0 text-zinc-500 rounded-full",
                                  disabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800",
                                )}
                                onClick={(event) => {
                                  if (disabled) return;
                                  event.stopPropagation();
                                  toggleOption(value);
                                }}
                              />
                            </div>
                          );
                        })}
                        {selectedValues.length > maxCount && (
                          <Popover
                            open={isOverflowPopoverOpen}
                            onOpenChange={setIsOverflowPopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "cursor-pointer",
                                  disabled && "cursor-not-allowed opacity-50",
                                )}
                                onClick={(event) => {
                                  if (disabled) return;
                                  event.stopPropagation();
                                  setIsOverflowPopoverOpen(true);
                                }}
                              >
                                <span>{`+ ${selectedValues.length - maxCount}`}</span>
                                <X
                                  className={cn(
                                    "ml-2 h-3 w-3 p-1 box-content shrink-0 text-zinc-300 dark:text-zinc-500 rounded-full",
                                    disabled
                                      ? "cursor-not-allowed opacity-50"
                                      : "cursor-pointer hover:bg-zinc-100 hover:text-primary dark:hover:bg-zinc-800",
                                  )}
                                  onClick={(event) => {
                                    if (disabled) return;
                                    event.stopPropagation();
                                    setIsOverflowPopoverOpen(true);
                                  }}
                                />
                              </Badge>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-64 p-2"
                              align="start"
                              onEscapeKeyDown={() =>
                                setIsOverflowPopoverOpen(false)
                              }
                            >
                              <div className="space-y-2">
                                <div className="text-sm font-semibold px-2 py-1">
                                  Selected Items ({selectedValues.length})
                                </div>
                                <div className="max-h-[200px] overflow-y-auto space-y-1">
                                  {selectedValues.map((value) => {
                                    let option: Option | undefined;
                                    if (async) {
                                      option = reserveOptions[value];
                                    } else {
                                      option = options.find(
                                        (opt) => opt.value === value,
                                      );
                                    }
                                    return (
                                      <div
                                        key={value}
                                        className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent group"
                                      >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <div className="text-xs truncate">
                                            {option?.label ||
                                              value ||
                                              "Loading..."}
                                          </div>
                                        </div>
                                        <X
                                          className={cn(
                                            "h-3 w-3 p-1 box-content shrink-0 text-zinc-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                                            disabled
                                              ? "cursor-not-allowed"
                                              : "cursor-pointer hover:bg-zinc-100 hover:text-primary dark:hover:bg-zinc-800",
                                          )}
                                          onClick={(event) => {
                                            if (disabled) return;
                                            event.stopPropagation();
                                            toggleOption(value);
                                            // Close popover if no more overflow items
                                            if (
                                              selectedValues.length - 1 <=
                                              maxCount
                                            ) {
                                              setIsOverflowPopoverOpen(false);
                                            }
                                          }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="pt-2 border-t">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleClear();
                                      setIsOverflowPopoverOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-xs text-center py-1.5 px-2 rounded-md hover:bg-accent text-destructive",
                                      disabled &&
                                        "cursor-not-allowed opacity-50",
                                    )}
                                    disabled={disabled}
                                  >
                                    Clear All
                                  </button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {(() => {
                      const selectedValue = selectedValues[0];
                      let option: Option | undefined;
                      if (async) {
                        option = reserveOptions[selectedValue];
                      } else {
                        option = options.find(
                          (opt) => opt.value === selectedValue,
                        );
                      }
                      return (
                        <div className="h-[26px] flex items-center gap-1 rounded-md px-2 py-0.5 border border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                          <div className="flex items-center gap-1 truncate text-xs">
                            {option?.label || selectedValue || "Loading..."}
                          </div>
                          <X
                            className={cn(
                              "h-3 w-3 p-1 box-content shrink-0 text-zinc-500 rounded-full",
                              disabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800",
                            )}
                            onClick={(event) => {
                              if (disabled) return;
                              event.stopPropagation();
                              handleClear();
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  {multiple && selectedValues.length > 0 && (
                    <>
                      <X
                        className={cn(
                          "ml-2 h-4 w-4 p-1 box-content shrink-0 text-zinc-300 dark:text-zinc-500 rounded-full",
                          disabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-zinc-100 hover:text-primary dark:hover:bg-zinc-800",
                        )}
                        onClick={(event) => {
                          if (disabled) return;
                          event.stopPropagation();
                          handleClear();
                        }}
                      />
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full mx-2"
                      />
                    </>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 text-zinc-300 dark:text-zinc-500",
                      disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:text-primary",
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-[12px] font-normal text-zinc-500">
                  {placeholder}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 text-zinc-300 dark:text-zinc-500",
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                  )}
                />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          onEscapeKeyDown={() => {
            setIsPopoverOpen(false);
            if (clearSearchOnClose) {
              setSearchValueState("");
              onSearch?.("");
            }
          }}
          {...{
            ...popoverOptions,
            className: cn("w-auto p-0", popoverOptions?.className),
            align: "start",
            portal: popoverOptions?.portal,
          }}
        >
          <Command shouldFilter={!async}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValueState}
              disabled={disabled}
              onValueChange={(value: string) => {
                if (disabled) return;
                setSearchValueState(value);
                if (onSearch) {
                  onSearch(value);
                }
              }}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList
              ref={commandListRef}
              onScroll={(e) => {
                // Handle infinite scroll/pagination
                if (!onLoadMore || !hasMore || isLoadingMore) return;

                const target = e.currentTarget;
                const scrollTop = target.scrollTop;
                const scrollHeight = target.scrollHeight;
                const clientHeight = target.clientHeight;

                // Trigger load more when user scrolls within 100px of bottom
                const threshold = 100;
                if (scrollHeight - scrollTop - clientHeight < threshold) {
                  onLoadMore();
                }
              }}
            >
              {async && error && (
                <div className="p-4 text-destructive text-center">
                  {error.message}
                </div>
              )}
              {async && loading && options.length === 0 && (
                <div className="flex justify-center py-6 items-center h-full">
                  <FadeLoader
                    color="#ffa500"
                    style={{
                      transform: "scale(0.38)",
                      position: "relative",
                      top: "-1px",
                    }}
                  />
                </div>
              )}
              {async ? (
                !loading &&
                !error &&
                options.length === 0 && (
                  <div className="pt-6 pb-4 text-center text-xs">
                    {`No result found.`}
                  </div>
                )
              ) : (
                <CommandEmpty>{`No result found.`}</CommandEmpty>
              )}
              <CommandGroup>
                {!hideSelectAll &&
                  multiple &&
                  options.length > 0 &&
                  // Hide select all in async mode when there's a search value
                  !(async && searchValueState.trim() !== "") && (
                    <CommandItem
                      key="all"
                      onSelect={() => {
                        if (disabled) return;
                        toggleAll();
                      }}
                      className={
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                    >
                      {(() => {
                        // Calculate checkbox state: 'empty', 'checked', or 'indeterminate'
                        let checkboxState:
                          | "empty"
                          | "checked"
                          | "indeterminate";
                        let showIcon: boolean;
                        let IconComponent = CheckIcon;

                        if (async && isAllSelected) {
                          // In async mode with all selected
                          if (currentExcluded.length === 0) {
                            checkboxState = "checked";
                            showIcon = true;
                          } else {
                            checkboxState = "indeterminate";
                            showIcon = true;
                            IconComponent = Minus;
                          }
                        } else {
                          // Sync mode or async mode without all selected
                          const currentOptionValues = options.map(
                            (option) => option.value,
                          );
                          const selectedCount = currentOptionValues.filter(
                            (value) => selectedValues.includes(value),
                          ).length;

                          if (selectedCount === 0) {
                            checkboxState = "empty";
                            showIcon = false;
                          } else if (
                            selectedCount === currentOptionValues.length
                          ) {
                            checkboxState = "checked";
                            showIcon = true;
                          } else {
                            checkboxState = "indeterminate";
                            showIcon = true;
                            IconComponent = Minus;
                          }
                        }

                        return (
                          <div
                            className={cn(
                              "mr-1 size-4 flex items-center justify-center rounded-[4px] border border-primary shadow-xs transition-shadow outline-none",
                              checkboxState === "checked" ||
                                checkboxState === "indeterminate"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "opacity-50 [&_svg]:invisible",
                            )}
                          >
                            {showIcon && (
                              <IconComponent className="size-3.5 text-white dark:text-black" />
                            )}
                          </div>
                        );
                      })()}
                      <span>Select all</span>
                    </CommandItem>
                  )}
                {options.map((option, index) => {
                  // In async mode with all selected, check if item is NOT excluded
                  // In normal mode, check if item is in selectedValues
                  const isSelected = isAllSelected
                    ? !currentExcluded.includes(option.value)
                    : selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (disabled) return;
                        toggleOption(option.value);
                      }}
                      className={cn(
                        disabled
                          ? "cursor-not-allowed opacity-50 text-xs"
                          : "cursor-pointer text-xs",
                        !multiple &&
                          isSelected &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      {multiple ? (
                        <div
                          className={cn(
                            "mr-1 size-4 flex items-center justify-center rounded-[4px] border border-primary shadow-xs transition-shadow outline-none",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className="size-3.5 text-white dark:text-black" />
                        </div>
                      ) : (
                        isSelected && (
                          <CheckIcon className="mr-1 size-4 text-primary" />
                        )
                      )}

                      {labelFunc ? (
                        labelFunc(option, isSelected, index)
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {hasMore && (
                <CommandGroup>
                  <div className="flex justify-center py-2">
                    {isLoadingMore ? (
                      <FadeLoader
                        color="#ffa500"
                        style={{
                          transform: "scale(0.38)",
                          position: "relative",
                          top: "-1px",
                        }}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Scroll for more...
                      </span>
                    )}
                  </div>
                </CommandGroup>
              )}
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                      >
                        {clearText}
                      </CommandItem>
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full"
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full"
                  >
                    {closeText}
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiAsyncSelect.displayName = "MultiAsyncSelect";
