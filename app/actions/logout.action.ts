// NOT IN DOCS NOW

"use server"
import { cookies } from "next/headers"
import { actionClient } from "@/lib/safe-action"
import { API_BASE } from "../lib/consts/api.const"
import { getErrorMessage } from "../lib/utils/api/get-error-message.util"

const logout = async () => {
  const cookiesStore = await cookies()
  const accessToken = cookiesStore.get("accessToken")?.value
  const response = await fetch(`${API_BASE}/dashboard-users/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const data = await response.json()
  if (!response.ok) {
    const errorMsg = getErrorMessage(data)
    return { error: errorMsg }
  }
  cookiesStore.delete("accessToken")
  cookiesStore.delete("refreshToken")
  return data
}
export const logoutAction = actionClient.action(async () => {
  return await logout()
})
