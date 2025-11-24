// NOT IN DOCS NOW
"use server"
import { cookies } from "next/headers"
import { returnValidationErrors } from "next-safe-action"
import { actionClient } from "@/lib/safe-action"
import { API_BASE } from "../lib/consts/api.const"
import { getErrorMessage } from "../lib/utils/api/get-error-message.util"
import { type LoginFormParams, loginFormSchema } from "./login-schema"

const login = async (parsedInput: LoginFormParams) => {
  const body = JSON.stringify(parsedInput)
  const response = await fetch(`${API_BASE}/dashboard-users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  })
  const data = await response.json()
  if (!response.ok) {
    const errorMsg = getErrorMessage(data)
    return returnValidationErrors(loginFormSchema, { _errors: [errorMsg] })
  }
  const setCookieHeader = response.headers.getSetCookie()
  if (setCookieHeader.length > 0) {
    const cookieStore = await cookies()

    // Parse and set each cookie
    setCookieHeader.forEach(cookieString => {
      const [nameValue] = cookieString.split(";")
      const [name, value] = nameValue.split("=")
      cookieStore.set(name.trim(), decodeURIComponent(value))
    })
  }
  return data
}
export const loginAction = actionClient
  .inputSchema(loginFormSchema)
  .action(async ({ parsedInput }) => {
    return await login(parsedInput)
  })
