// NOT IN DOCS NOW
import z from "zod"

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(3, "Password must be at least 6 characters long")
})

export type LoginFormParams = z.infer<typeof loginFormSchema>
