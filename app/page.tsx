// NOT IN DOCS NOW
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type SubmitHandler, useForm } from "react-hook-form";
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
    const res = await loginAction(inputs);
    const { data, validationErrors } = res;
  };

  const onLogout = async () => {
    const res = await logoutAction();
    console.log("   Logout response:", res);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <input
            placeholder="email"
            defaultValue="super@super.com"
            {...register("email")}
          />
          {errors.email && <span>This field is required</span>}
        </div>
        <div className="flex flex-col">
          <input
            placeholder="password"
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
