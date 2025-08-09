"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormInputComponent from "@/components/app/form-input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/useAuth";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { MESSAGES } from "@/types/messages";

// Form schema validation
const FormSchema = z.object({
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
  confirmPassword: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

const ChangePasswordPage = () => {
  const router = useRouter(); // Router
  const { mutate: changePasswordMutate, isPending: isChangePasswordPending } = useChangePassword(); // Change password mutation

  // Form validation
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    changePasswordMutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push("/login"); 
      },
      onError: (err: Error) => {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(
          error?.response?.data?.message || MESSAGES.COMMON.UNEXPECTED_ERROR
        );
      },
    });
  };
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center h-screen">
        <div className="w-[400px] bg-white p-6 rounded-lg shadow-lg">

          <div className="my-8 w-full">
            <p className="text-xl font-bold">
              Please enter your new password.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormInputComponent
                control={form.control}
                name="password"
                label="Password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <FormInputComponent
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="********"
                className="h-11 placeholder:text-sm"
              />
              <Button
                type="submit"
                className="bg-primary w-full text-white hover:bg-primary/80 cursor-pointer"
                disabled={isChangePasswordPending}
              >
                {isChangePasswordPending ? "Loading..." : "OK"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Suspense>
  );
};

export default ChangePasswordPage;
