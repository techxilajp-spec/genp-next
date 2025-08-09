"use client";

import { useEffect } from "react";
import { Plus, Search, Tag, MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useTaskCategories,
  useUpdateTaskCategory,
} from "@/hooks/admin/categories/task";
import { useFinancialCategories } from "@/hooks/admin/categories/financial";
import PaginationComponent from "./app/pagination";
import { Skeleton } from "./ui/skeleton";
import { useTableState } from "@/hooks/useTableStateHook";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModalHook";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskCategory } from "@/hooks/admin/categories/task";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const taskCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  color: z.string().min(1, "Color is required"),
});

type TaskCategoryFormData = z.infer<typeof taskCategorySchema>;

export function CategoriesSection() {
  const taskTable = useTableState(10); // default page size is 10 for task categories
  const financialTable = useTableState(10); // default page size is 10 for financial categories
  const taskModal = useModal(); // modal for task categories
  const updateTaskCategoryModal = useModal(); // modal for update task categories
  const financialModal = useModal(); // modal for financial categories

  const [taskCategoryIdToUpdate, setTaskCategoryIdToUpdate] = useState<
    number | null
  >(null);

  // state for task categories create
  const form = useForm<TaskCategoryFormData>({
    resolver: zodResolver(taskCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#000000",
    },
  });

  const updateTaskCategoryForm = useForm<TaskCategoryFormData>({
    resolver: zodResolver(taskCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#000000",
    },
  });

  const {
    data: taskCategoriesData,
    isLoading: taskCategoriesLoading,
    error: taskCategoriesError,
    isError: taskCategoriesIsError,
    refetch: taskCategoriesRefetch,
  } = useTaskCategories(taskTable.page, taskTable.pageSize, taskTable.keyword);

  const {
    data: financialCategoriesData,
    isLoading: financialCategoriesLoading,
    error: financialCategoriesError,
    isError: financialCategoriesIsError,
  } = useFinancialCategories(
    financialTable.page,
    financialTable.pageSize,
    financialTable.keyword
  );

  const {
    mutateAsync: createTaskCategory,
    isPending: createTaskCategoryLoading,
  } = useCreateTaskCategory();

  const {
    mutateAsync: updateTaskCategory,
    isPending: updateTaskCategoryLoading,
  } = useUpdateTaskCategory();

  const onSubmit = (data: TaskCategoryFormData) => {
    createTaskCategory(data, {
      onSuccess: () => {
        taskModal.setOpen(false);
        toast.success("Task category created successfully");
        taskCategoriesRefetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onUpdateTaskCategory = (data: TaskCategoryFormData) => {
    updateTaskCategory(
      {
        category_id: taskCategoryIdToUpdate || 0,
        name: data.name,
        description: data.description,
        color: data.color,
      },
      {
        onSuccess: () => {
          updateTaskCategoryModal.setOpen(false);
          toast.success("Task category updated successfully");
          taskCategoriesRefetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const openUpdateTaskCategoryModal = (
    category: { category_id: number } & TaskCategoryFormData
  ) => {
    updateTaskCategoryModal.setOpen(true);
    updateTaskCategoryForm.reset(category);
    setTaskCategoryIdToUpdate(category.category_id);
  };

  // Error handling for task and financial categories
  useEffect(() => {
    if (taskCategoriesIsError || financialCategoriesIsError) {
      toast.error(
        taskCategoriesError?.message || financialCategoriesError?.message
      );
    }
  }, [
    taskCategoriesError,
    taskCategoriesIsError,
    financialCategoriesError,
    financialCategoriesIsError,
  ]);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-sm lg:text-base text-slate-600">
            Manage task and financial categories
          </p>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Task Categories</TabsTrigger>
          <TabsTrigger value="financial">Financial Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h2 className="text-lg lg:text-xl font-semibold">
                Task Categories
              </h2>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Categories for organizing tasks and activities
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Search
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => taskTable.setKeyword(taskTable.tempKeyword)}
                />
                <Input
                  placeholder="Search categories..."
                  value={taskTable.tempKeyword}
                  onChange={(e) => {
                    taskTable.setTempKeyword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      taskTable.setKeyword(taskTable.tempKeyword);
                    }
                  }}
                  className="w-full lg:w-64"
                />
              </div>
              <Dialog open={taskModal.open} onOpenChange={taskModal.setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task Category
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Add Task Category</DialogTitle>
                    <DialogDescription>
                      Create a new category for organizing tasks
                    </DialogDescription>
                  </DialogHeader>

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
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Description Field */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="task-category-description">
                        Description
                      </Label>
                      <Textarea
                        id="task-category-description"
                        placeholder="Optional description..."
                        className="resize-none"
                        rows={3}
                        {...form.register("description")}
                      />
                      {form.formState.errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.description.message}
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
                          {form.formState.errors.color.message}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="pt-4">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        {createTaskCategoryLoading
                          ? "Creating..."
                          : "Create Category"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Task Categories</CardTitle>
              <CardDescription>
                Categories used for organizing tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">
                        Category Name
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        Tasks Count
                      </TableHead>
                      <TableHead className="text-center min-w-[120px]">
                        Task Color
                      </TableHead>
                      <TableHead className="text-right min-w-[80px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskCategoriesData?.data.data.map((category) => (
                      <TableRow key={category.category_id}>
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <Tag
                              className={`h-4 w-4 text-muted-foreground flex-shrink-0 ${
                                category.is_active
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                            <span className="font-medium text-sm lg:text-base">
                              {category.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0"
                          >
                            {category.tasks[0].count} tasks
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[80px]" align="center">
                          <div
                            className="h-4 w-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: category.color }}
                          />
                        </TableCell>
                        <TableCell className="text-right min-w-[80px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  openUpdateTaskCategoryModal({
                                    category_id: category.category_id,
                                    name: category.name,
                                    description: category.description,
                                    color: category.color,
                                  })
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {taskCategoriesLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Skeleton className="h-10 w-full bg-slate-200 rounded" />
                        </TableCell>
                      </TableRow>
                    )}
                    {taskCategoriesData?.data.data.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {taskCategoriesData &&
                taskCategoriesData?.data.data.length > 0 && (
                  <div className="flex w-full justify-end mt-4">
                    <PaginationComponent
                      currentPage={taskTable.page}
                      totalPages={taskTable.totalPages}
                      onPageChange={(newPage) => taskTable.setPage(newPage)}
                    />
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h2 className="text-lg lg:text-xl font-semibold">
                Financial Categories
              </h2>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Categories for organizing income and expenses
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Search
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() =>
                    financialTable.setKeyword(financialTable.tempKeyword)
                  }
                />
                <Input
                  placeholder="Search categories..."
                  value={financialTable.tempKeyword}
                  onChange={(e) => {
                    financialTable.setTempKeyword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      financialTable.setKeyword(financialTable.tempKeyword);
                    }
                  }}
                  className="w-full lg:w-64"
                />
              </div>
              <Dialog
                open={financialModal.open}
                onOpenChange={financialModal.setOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Financial Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Add Financial Category</DialogTitle>
                    <DialogDescription>
                      Create a new category for organizing financial records
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="financial-category-name"
                        className="text-right"
                      >
                        Name
                      </Label>
                      <Input
                        id="financial-category-name"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Financial Categories</CardTitle>
              <CardDescription>
                Categories used for organizing financial records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">
                        Category Name
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        Records Count
                      </TableHead>
                      <TableHead className="text-right min-w-[80px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialCategoriesData?.data.data.map((category) => (
                      <TableRow key={category.category_id}>
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm lg:text-base">
                              {category.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0"
                          >
                            {category.financial_records[0].count} records
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right min-w-[80px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {financialCategoriesLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Skeleton className="h-10 w-full bg-slate-200 rounded" />
                        </TableCell>
                      </TableRow>
                    )}
                    {financialCategoriesData?.data.data.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {financialCategoriesData &&
                financialCategoriesData?.data.data.length > 0 && (
                  <div className="flex w-full justify-end mt-4">
                    <PaginationComponent
                      currentPage={financialTable.page}
                      totalPages={financialTable.totalPages}
                      onPageChange={(newPage) =>
                        financialTable.setPage(newPage)
                      }
                    />
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={updateTaskCategoryModal.open}
        onOpenChange={updateTaskCategoryModal.setOpen}
      >
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Update Task Category</DialogTitle>
            <DialogDescription>
              Update a category for organizing tasks
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={updateTaskCategoryForm.handleSubmit(onUpdateTaskCategory)}
            className="space-y-6 py-4"
          >
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-category-name">Name</Label>
              <Input
                id="task-category-name"
                placeholder="Enter category name"
                {...updateTaskCategoryForm.register("name")}
              />
              {updateTaskCategoryForm.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {updateTaskCategoryForm.formState.errors.name.message}
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
                {...updateTaskCategoryForm.register("description")}
              />
              {updateTaskCategoryForm.formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {updateTaskCategoryForm.formState.errors.description.message}
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
                  {...updateTaskCategoryForm.register("color")}
                />
                <span className="text-sm text-gray-500">
                  {updateTaskCategoryForm.watch("color") || "#000000"}
                </span>
              </div>
              {updateTaskCategoryForm.formState.errors.color && (
                <p className="text-red-500 text-xs mt-1">
                  {updateTaskCategoryForm.formState.errors.color.message}
                </p>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {updateTaskCategoryLoading ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
