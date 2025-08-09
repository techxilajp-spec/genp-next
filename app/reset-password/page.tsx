"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInputComponent from "@/components/app/form-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { useResetPassword } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { MESSAGES } from "@/types/messages";

// Form schema validation
const FormSchema = z.object({
  email: z.string().email("Email is required"),
});

const ResetPasswordPage = () => {
  const { mutate: resetPasswordMutate, isPending: isResetPasswordPending } =
    useResetPassword(); // Reset password mutation

  // Form instance
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    resetPasswordMutate(
      { email: data.email },
      {
        onSuccess: (res) => {
          toast.success(res.message);
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center h-screen">
        <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">
          <div className="my-8 w-full">
            <p className="text-xl font-bold">Reset Password</p>
          </div>

          <div className="my-8 w-full">
            <p className="text-sm">
              Please enter your email address to reset your password!
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormInputComponent
                control={form.control}
                name="email"
                label="Email"
                placeholder="test@example.com"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isResetPasswordPending}
              >
                {isResetPasswordPending ? "Loading..." : "Reset"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Suspense>
  );
};

export default ResetPasswordPage;
