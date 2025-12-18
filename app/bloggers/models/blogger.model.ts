import type { SortOrder } from "@/app/models/api.model";

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

export interface BloggersTableParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  name?: string;
  bio?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
