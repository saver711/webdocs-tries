// NOT IN DOCS NOW
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { loginAction } from "./actions/login.action";
import { type LoginFormParams, loginFormSchema } from "./actions/login-schema";
import { logoutAction } from "./actions/logout.action";
export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormParams>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<LoginFormParams> = async (inputs) => {
    await loginAction(inputs).then(() => {
      toast.success("Logged in successfully!");
    });
  };

  const onLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <input
            placeholder="email"
            defaultValue="super@super.com"
            className="text-black"
            {...register("email")}
          />
          {errors.email && <span>This field is required</span>}
        </div>
        <div className="flex flex-col">
          <input
            placeholder="password"
            defaultValue="123"
            className="text-black"
            {...register("password", { required: true })}
          />
          {errors.password && <span>This field is required</span>}
        </div>

        <input type="submit" value="Login" />
      </form>

      <Link href="/bloggers">Bloggers Page</Link>

      <Button type="button" onClick={onLogout}>
        Logout
      </Button>
    </>
  );
}
