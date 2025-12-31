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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/lib/validations"
import Link from "next/link"
import { authClient, signUp } from "@/lib/auth-client"
import Image from "next/image"

export default function SignupForm({ className, ...props }) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data) => {
    try {
      const result = await signUp.email({
        name: data.fullname,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        console.log("sign up error:", result.error);
        alert(result.error.message || "Sign up failed");
        return;
      }

      // Sign up successful
      window.location.href = "/login";

    } catch (err) {
      console.error("Sign up failed:", err);
      alert("Something went wrong");
    }
  };

      const handleSignIn = async() =>{
      return await authClient.signIn.social({
        provider: 'google',
        callbackURL: "/auth-redirect"
      })
    }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 min-h-screen items-center justify-center",
        className
      )}
      {...props}
    >
      <Card className="overflow p-0 w-full max-w-3xl  mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form method="POST" onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 max-h-full">
            <FieldGroup className="gap-4">
              {/* Heading */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join foodConnect and start helping the community
                </p>
              </div>

              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("fullname")}

                />

                <p className="text-red-500 text-xs min-h-5">
                  {errors.fullname?.message}
                </p>

              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />

                <p className="text-red-500 text-xs min-h-5">{errors.email?.message}</p>

              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" {...register("password")} />

                <p className="text-red-500 text-xs min-h-5">
                  {errors.password?.message}
                </p>

              </Field>

              {/* Submit */}
              <Field>
                <Button disabled={isSubmitting} type="submit" className="bg-green-800 text-white border border-green-500 hover:bg-green-100 hover:text-black  hover:shadow-lg hover:shadow-green-600/40
                transition-colors transition-shadow duration-300 ease-in-out
                active:scale-95">
                  {isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
              </Field>

              {/* Separator */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or sign up with
              </FieldSeparator>

              {/* Social Buttons */}
              <Field className="flex justify-center">

                <Button onClick={handleSignIn} variant="outline" type="button" className="border border-green-600">
                  <Image src="/assets/icons/google.svg" width={22} height={22} alt="google"/>

                  <span className="sr-only">Login with Google</span>
                </Button>

              </Field>

              {/* Link */}
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Right Side Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="assets/image/Gemini_Generated_Image_qdm6keqdm6keqdm6.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
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
