import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const financialCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category_type: z.string().min(1, "Category type is required"),
});

export type FinancialCategoryFormData = z.infer<typeof financialCategorySchema>;

interface FinancialCategoryFormProps {
  form: UseFormReturn<FinancialCategoryFormData>;
  onSubmit: (data: FinancialCategoryFormData) => void;
  loading?: boolean;
  submitText?: string;
}

export function FinancialCategoryForm({
  form,
  onSubmit,
  loading,
  submitText = "Save Category",
}: FinancialCategoryFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
      {/* Name Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-category-name">Name</Label>
        <Input
          id="task-category-name"
          placeholder="Enter category name"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.name.message as string}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-category-description">Description</Label>
        <Textarea
          id="task-category-description"
          placeholder="Optional description..."
          className="resize-none"
          rows={3}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.description.message as string}
          </p>
        )}
      </div>

      {/* Category Type Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-category-color">Type</Label>
        <div className="flex items-center gap-3">
          <Controller
            control={form.control}
            name="category_type"
            rules={{ required: "Category type is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {form.formState.errors.category_type && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.category_type.message}
          </p>
        )}
      </div>

      {/* Footer */}
      <DialogFooter className="pt-4">
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          {loading ? "Saving..." : submitText}
        </Button>
      </DialogFooter>
    </form>
  );
}
