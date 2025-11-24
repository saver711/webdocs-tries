// import { z } from "zod"
// import { SortOrder } from "../models/sort-order.enum"
// import { DEFAULT_TABLE_PAGE_VALUE } from "./default-table-page-value.const"
// import { DEFAULT_TABLE_PER_PAGE_VALUE } from "./default-table-per-page-value.const"

// export const DEFAULT_TABLE_SEARCH_PARAMS_SCHEMA = z.object({
//   page: z.coerce.number().min(DEFAULT_TABLE_PAGE_VALUE).default(DEFAULT_TABLE_PAGE_VALUE),
//   perPage: z.coerce
//     .number()
//     .min(1)
//     .optional()
//     .default(DEFAULT_TABLE_PER_PAGE_VALUE),
//   sortBy: z.string().optional(),
//   sortOrder: z.enum([SortOrder.asc, SortOrder.desc]).optional()
// })
