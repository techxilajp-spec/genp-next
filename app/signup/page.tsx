"use client";

import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormInputComponent from "@/components/app/form-input";
import { Form } from "@/components/ui/form";
import { Suspense, useState } from "react";
import { useSignup } from "@/hooks/useAuth";
import { MESSAGES } from "@/types/messages";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import NavigationTextComponent from "@/components/app/navigation-text";

const FormSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("メールアドレスは正しく入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  confirmPassword: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

export default function SignUpPage() {
  const router = useRouter(); // Router
  const supabase = createClient(); // Create supabase client
  const { mutate: signupMutate, isPending: isSignupPending } = useSignup(); // Use signup hook

  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  /**
   * Form
   */
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Submit
   */
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    signupMutate(
      { email: data.email, password: data.password, username: data.name },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          setIsSignupSuccess(true);
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

  /**
   * Google Sign Up
   */
  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast(error.message);
    }
  };

  const handleToLogin = () => {
    router.push("/");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center h-screen">
        <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
          <div className="my-5 md:my-8 w-full text-center">
            <p className="text-xl font-bold">Create an account</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormInputComponent
                control={form.control}
                name="name"
                label="Name"
                placeholder="Name"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="email"
                label="Email"
                placeholder="test@example.com"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isSignupPending}
              >
                {isSignupPending ? "Creating..." : "Sign Up"}
              </Button>

              <div className="flex justify-center items-center gap-2">
                <p className="text-sm text-black">Already have an account?</p>
                <NavigationTextComponent
                  text="Login"
                  handleNavigation={() => router.push("/")}
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

          {/* Google Sign Up Button */}
          <div className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignUp}
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

        <Dialog open={isSignupSuccess} onOpenChange={setIsSignupSuccess}>
          <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
            <DialogHeader>
              <DialogTitle>Account Verification</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please check your email for account verification.
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={handleToLogin}
                  className="rounded-lg px-8 text-white border-white-bg cursor-pointer"
                >
                  OK
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  );
}
