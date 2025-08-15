import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const taskCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  color: z.string().min(1, "Color is required"),
});

export type TaskCategoryFormData = z.infer<typeof taskCategorySchema>;

interface TaskCategoryFormProps {
  form: UseFormReturn<TaskCategoryFormData>;
  onSubmit: (data: TaskCategoryFormData) => void;
  loading?: boolean;
  submitText?: string;
}

export function TaskCategoryForm({
  form,
  onSubmit,
  loading,
  submitText = "Save Category"
}: TaskCategoryFormProps) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 py-4"
    >
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

      {/* Color Picker Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-category-color">Color</Label>
        <div className="flex items-center gap-3">
          <Input
            type="color"
            id="task-category-color"
            className="w-12 h-10 p-0 border-none cursor-pointer"
            {...form.register("color")}
          />
          <span className="text-sm text-gray-500">
            {form.watch("color") || "#000000"}
          </span>
        </div>
        {form.formState.errors.color && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.color.message as string}
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
