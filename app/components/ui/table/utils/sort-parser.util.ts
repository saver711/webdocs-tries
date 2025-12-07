// app/components/ui/table/utils/sort-parser.util.ts
import type { SortingState } from "@tanstack/react-table";
import { createParser } from "nuqs";

export const sortParser = createParser<SortingState>({
  // FROM URL TO STATE
  parse(queryValue: string) {
    // e.g. "createdAt:asc,name:desc" => [{id: "createdAt", desc: false}, {id: "name", desc: true}]
    if (!queryValue) return [];
    return queryValue.split(",").map((pair) => {
      const [id, dir] = pair.split(":");
      return { id, desc: dir === "desc" };
    });
  },
  // FROM STATE TO URL
  // e.g. [{id: "createdAt", desc: false}, {id: "name", desc: true}] => "createdAt:asc,name:desc"
  serialize(value: SortingState): string {
    if (!value || value.length === 0) return "";
    return value.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");
  },
  // eq is optional but recommended for comparing default state
  eq(a: SortingState, b: SortingState): boolean {
    if (a.length !== b.length) return false;
    return a.every((s, i) => {
      const t = b[i];
      return s.id === t.id && s.desc === t.desc;
    });
  },
});
