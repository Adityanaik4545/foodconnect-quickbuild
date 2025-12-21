"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validations"
import { signIn } from "@/lib/auth-client"
import { Router } from "next/router"
import Image from "next/image"

export default function LoginForm({className, ...props}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, 
    } = useForm({
    resolver: zodResolver(loginSchema),
  })

    const onSubmit = async (data) => {
  try {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      console.log("Login error:", result.error);
      alert(result.error.message || "Login failed");
      return;
    }

    // Login successful - redirect to role selection or original destination
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");

    // If admin → go directly to admin dashboard
if (result?.data?.user?.email === "admin@foodconnect.com") {
  window.location.href = "/admin/dashboard";
  return;
}
    
    if (redirect) {
      window.location.href = redirect;
    } else {
      window.location.href = "/role";
    }
    
  } catch (err) {
    console.error("Login failed:", err);
    alert("Something went wrong");
  }
  };
  return (
        <div className={cn("flex flex-col gap-6 min-h-screen items-center justify-center", className)} {...props}>
      <Card className="overflow-hidden p-0 w-full max-w-3xl mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form method="POST" onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your foodConnect account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input id="email" type="email" placeholder="enter your email" {...register("email")} />

                  <p className="text-red-500 text-sm min-h-5">{errors.email?.message}</p>


              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input type="password" {...register("password")} />

                  <p className="text-red-500 text-sm min-h-5">
                    {errors.password?.message}
                  </p>

              </Field>

              <Field>
                <Button disabled={isSubmitting} type="submit" className="bg-green-800 text-white border border-green-500 hover:bg-green-100 hover:text-black  hover:shadow-lg hover:shadow-green-600/40
                transition-colors transition-shadow duration-500 ease-in-out
                active:scale-95">
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field className="flex justify-center" >
                <Button variant="outline" type="button" className="border border-green-600">
                  <Image src="/assets/icons/google.svg" width={22} height={22} alt="google"/>

                  <span className="sr-only">Login with Google</span>
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?   <Link href="/register">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="assets/image/Gemini_Generated_Image_qdm6keqdm6keqdm6.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
