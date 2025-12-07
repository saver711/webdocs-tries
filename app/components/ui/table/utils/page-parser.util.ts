// app/components/ui/table/utils/page-parser.util.ts
import { createParser } from "nuqs";

// Maps pageIndex 0 tp page number 1 and vice versa.
export const pageParser = createParser<number>({
  // FROM URL TO STATE
  parse: (queryValue: string) => {
    const pageNumber = parseInt(queryValue, 10);
    return Number.isNaN(pageNumber) || pageNumber < 1 ? 0 : pageNumber - 1;
  },
  // FROM STATE TO URL
  serialize: (value: number): string => {
    return (value + 1).toString();
  },
  // eq is optional but recommended for comparing default state
  eq: (a: number, b: number): boolean => a === b,
});
