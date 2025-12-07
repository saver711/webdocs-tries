import type { SortOrder } from "@/app/models/api.model";
import type { BloggersUrlState } from "../hooks/use-bloggers-url-state";

export interface Blogger {
  _id: string;
  name: string;
  bio: string;
  image?: string;
  createdAt: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export interface BloggersTableParams extends BloggersUrlState {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
