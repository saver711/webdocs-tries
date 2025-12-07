"use server";
import { cookies } from "next/headers";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { API_BASE } from "@/lib/consts/api.const";
import { actionClient } from "@/lib/safe-action";
import { getErrorMessage } from "../lib/utils/api/get-error-message.util";

const bloggerIds = z.array(z.string());

export type DeleteBloggersParams = z.infer<typeof bloggerIds>;
const deleteBloggers = async (input: DeleteBloggersParams) => {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  const response = await fetch(`${API_BASE}/bloggers`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: input }),
  });
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = getErrorMessage(data);
    returnValidationErrors(bloggerIds, { _errors: [errorMsg] });
  }

  return data;
};
export const deleteBloggersAction = actionClient
  .inputSchema(bloggerIds)
  .action(async ({ parsedInput }) => {
    return await deleteBloggers(parsedInput);
  });
