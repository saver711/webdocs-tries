"use client";

import type { PopoverContentProps } from "@radix-ui/react-popover";
import { CheckIcon, ChevronDown, Loader, Minus, X } from "lucide-react";
import * as React from "react";
import { useEffect, useImperativeHandle, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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

interface Props
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
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
   * In single select mode (multiple=false), this is a string, null, or undefined.
   * In multi select mode (multiple=true), this is an array of strings.
   * In async mode when all is selected, this can be a string (the selectAllValue).
   * Optional, defaults to undefined.
   */
  value?: string[] | string | null;

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
      (val: string[] | string | undefined | null): string[] => {
        if (val === undefined || val === null) return [];
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
      searchValue ?? "",
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
      // Always sync with the value prop, even if it's undefined or null
      // This ensures that when value is cleared (undefined/null), we show empty state
      setSelectedValues(normalizeValue(value));
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
              "flex min-h-10 w-full min-w-[160px] items-center justify-between rounded-md border border-input bg-background px-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              selectedValues.length > 0 ? "py-1.5" : "py-2",
              className,
            )}
          >
            {selectedValues.length > 0 || isAllSelected ? (
              <div className="flex w-full items-center justify-between">
                {multiple ? (
                  <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
                    {isAllSelected ? (
                      <div className="flex h-[26px] items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
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
                              className="flex h-[26px] items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-zinc-600 hover:border-zinc-400 hover:text-primary dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-primary"
                              key={value}
                            >
                              <div className="flex max-w-[100px] items-center gap-1 truncate text-xs">
                                {option?.label ?? value}
                              </div>
                              <X
                                className={cn(
                                  "box-content h-3 w-3 shrink-0 rounded-full p-1 text-zinc-500",
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
                            modal={false}
                          >
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  "inline-flex cursor-pointer items-center rounded-md border border-zinc-200 px-1.5 py-0.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-zinc-700 dark:text-zinc-400",
                                  disabled && "cursor-not-allowed opacity-50",
                                )}
                                onClick={(event) => {
                                  if (disabled) return;
                                  event.stopPropagation();
                                  event.preventDefault();
                                  // Close main popover when opening overflow popover
                                  setIsPopoverOpen(false);
                                  setIsOverflowPopoverOpen((prev) => !prev);
                                }}
                                onPointerDown={(event) => {
                                  if (disabled) return;
                                  event.stopPropagation();
                                }}
                                onMouseDown={(event) => {
                                  if (disabled) return;
                                  event.stopPropagation();
                                }}
                              >
                                <span>{`+ ${selectedValues.length - maxCount}`}</span>
                                <X
                                  className={cn(
                                    "ml-2 box-content h-3 w-3 shrink-0 rounded-full p-1 text-zinc-300 dark:text-zinc-500",
                                    disabled
                                      ? "cursor-not-allowed opacity-50"
                                      : "cursor-pointer hover:bg-zinc-100 hover:text-primary dark:hover:bg-zinc-800",
                                  )}
                                  onClick={(event) => {
                                    if (disabled) return;
                                    event.stopPropagation();
                                    event.preventDefault();
                                    setIsOverflowPopoverOpen((prev) => !prev);
                                  }}
                                  onPointerDown={(event) => {
                                    if (disabled) return;
                                    event.stopPropagation();
                                  }}
                                  onMouseDown={(event) => {
                                    if (disabled) return;
                                    event.stopPropagation();
                                  }}
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-64 p-2"
                              align="start"
                              onEscapeKeyDown={() =>
                                setIsOverflowPopoverOpen(false)
                              }
                              onInteractOutside={(event) => {
                                // Prevent closing when clicking inside the main popover
                                const target = event.target as HTMLElement;
                                if (target.closest('[role="dialog"]')) {
                                  event.preventDefault();
                                }
                              }}
                              onClick={(event) => {
                                // Prevent clicks inside overflow popover from opening main popover
                                event.stopPropagation();
                              }}
                              onPointerDown={(event) => {
                                // Prevent pointer events from propagating to main popover trigger
                                event.stopPropagation();
                              }}
                              onMouseDown={(event) => {
                                // Prevent mouse events from propagating to main popover trigger
                                event.stopPropagation();
                              }}
                            >
                              <div className="space-y-2">
                                <div className="px-2 py-1 text-sm font-semibold">
                                  Selected Items ({selectedValues.length})
                                </div>
                                <div className="max-h-[200px] space-y-1 overflow-y-auto">
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
                                        className="group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
                                      >
                                        <div className="flex min-w-0 flex-1 items-center gap-2">
                                          <div className="truncate text-xs">
                                            {option?.label ??
                                              value ??
                                              "Loading..."}
                                          </div>
                                        </div>
                                        <X
                                          className={cn(
                                            "box-content h-3 w-3 shrink-0 rounded-full p-1 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100",
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
                                <div className="border-t pt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleClear();
                                      setIsOverflowPopoverOpen(false);
                                    }}
                                    className={cn(
                                      "w-full rounded-md px-2 py-1.5 text-center text-xs text-destructive hover:bg-accent",
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
                  <div className="flex max-w-full flex-1 items-center gap-1">
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
                        <div className="flex h-[26px] max-w-full items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                          <div className="flex items-center gap-1 truncate text-xs">
                            {option?.label ?? selectedValue ?? "Loading..."}
                          </div>
                          <X
                            className={cn(
                              "box-content h-3 w-3 shrink-0 rounded-full p-1 text-zinc-500",
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
                  {selectedValues.length > 0 && (
                    <>
                      <X
                        className={cn(
                          "ml-2 box-content h-4 w-4 shrink-0 rounded-full p-1 text-zinc-300 dark:text-zinc-500",
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
                        className="mx-2 flex h-full min-h-6"
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
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="text-sm font-normal text-zinc-500">
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
            className: cn(
              "w-auto p-0 max-w-[380px]",
              popoverOptions?.className,
            ),
            align: "start",
            portal: popoverOptions?.portal,
          }}
        >
          <Command shouldFilter={!async && !onSearch}>
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
                <div className="p-4 text-center text-destructive">
                  {error.message}
                </div>
              )}
              {async && loading && options.length === 0 && (
                <div className="flex h-full items-center justify-center py-6">
                  <Loader
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
                  <div className="pb-4 pt-6 text-center text-xs">{`No result found.`}</div>
                )
              ) : (
                <CommandEmpty>{`No result found.`}</CommandEmpty>
              )}
              {/* Select all - always first, outside options group */}
              {!hideSelectAll &&
                multiple &&
                options.length > 0 &&
                // Hide select all in async mode when there's a search value
                !(async && searchValueState.trim() !== "") && (
                  <CommandGroup>
                    <CommandItem
                      key="all"
                      onSelect={() => {
                        if (disabled) return;
                        toggleAll();
                      }}
                      className={
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "max-w-full cursor-pointer text-wrap"
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
                              "shadow-xs mr-1 flex size-4 items-center justify-center rounded-[4px] border border-primary outline-none transition-shadow",
                              checkboxState === "checked" ||
                                checkboxState === "indeterminate"
                                ? "border-primary bg-primary text-primary-foreground"
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
                  </CommandGroup>
                )}
              <CommandGroup>
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
                          ? "cursor-not-allowed text-xs opacity-50"
                          : "cursor-pointer text-xs",
                        !multiple &&
                          isSelected &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      {multiple ? (
                        <div
                          className={cn(
                            "shadow-xs mr-1 flex size-4 items-center justify-center rounded-[4px] border border-primary outline-none transition-shadow",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
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
                      <Loader
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiAsyncSelect.displayName = "MultiAsyncSelect";
