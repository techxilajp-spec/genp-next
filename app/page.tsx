"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormInputComponent from "@/components/app/form-input";
import NavigationTextComponent from "@/components/app/navigation-text";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Suspense } from "react";
import { useLogin } from "@/hooks/useAuth";
import { MESSAGES } from "@/types/messages";
import { AxiosError } from "axios";

// Define form schema
const FormSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function LoginPage() {
  const supabase = createClient(); // Create supabase client
  const { mutate: loginMutate, isPending: isLoginPending } = useLogin(); // Use login hook
  const router = useRouter(); // Use router

  // Create form instance
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    loginMutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          router.push("/admin");
        },
        onError: (err: Error) => {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
          );
        },
      }
    );
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast(error.message || MESSAGES.COMMON.UNEXPECTED_ERROR);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center h-screen">
        <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
          <div className="my-5 md:my-8 w-full text-center">
            <p className="text-xl font-bold">Login to your account</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormInputComponent
                id="email"
                control={form.control}
                name="email"
                label="Email"
                placeholder="test@example.com"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                id="password"
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isLoginPending}
              >
                {isLoginPending ? "Loading..." : "Login"}
              </Button>

              <div className="flex justify-between">
                <NavigationTextComponent
                  text="Forgot Password?"
                  handleNavigation={() => router.push("/reset-password")}
                />
                <NavigationTextComponent
                  text="Create Account"
                  handleNavigation={() => router.push("/signup")}
                />
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-center py-5 w-full">
            <div className="flex items-center flex-1 max-w-xs">
              <div className="flex-1 h-[1px] bg-black"></div>
            </div>
            <h2 className="text-sm font-bold whitespace-nowrap px-8">OR</h2>
            <div className="flex items-center flex-1 max-w-xs">
              <div className="flex-1 h-[1px] bg-black"></div>
            </div>
          </div>

          <div className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
