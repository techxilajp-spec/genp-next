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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteTaskCategory,
  useTaskCategories,
  useUpdateTaskCategory,
} from "@/hooks/admin/categories/task";
import {
  useCreateFinancialCategory,
  useDeleteFinancialCategory,
  useFinancialCategories,
  useUpdateFinancialCategory,
} from "@/hooks/admin/categories/financial";
import PaginationComponent from "./app/pagination";
import { Skeleton } from "./ui/skeleton";
import { useTableState } from "@/hooks/useTableStateHook";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModalHook";
import { useCreateTaskCategory } from "@/hooks/admin/categories/task";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  TaskCategoryForm,
  TaskCategoryFormData,
  taskCategorySchema,
} from "@/components/categories/task-category-form";
import {
  FinancialCategoryForm,
  FinancialCategoryFormData,
  financialCategorySchema,
} from "@/components/categories/financial-category-form";

export function CategoriesSection() {
  const taskTable = useTableState(10); // default page size is 10 for task categories
  const financialTable = useTableState(10); // default page size is 10 for financial categories
  const taskModal = useModal(); // modal for task categories
  const updateTaskCategoryModal = useModal(); // modal for update task categories
  const deleteTaskCategoryModal = useModal(); // modal for delete task categories
  const financialModal = useModal(); // modal for financial categories
  const updateFinancialCategoryModal = useModal(); // modal for update financial categories
  const deleteFinancialCategoryModal = useModal(); // modal for delete financial categories

  const [taskCategoryIdToUpdate, setTaskCategoryIdToUpdate] = useState<
    number | null
  >(null);
  const [taskCategoryIdToDelete, setTaskCategoryIdToDelete] = useState<
    number | null
  >(null);

  const [financialCategoryIdToUpdate, setFinancialCategoryIdToUpdate] =
    useState<number | null>(null);
  const [financialCategoryIdToDelete, setFinancialCategoryIdToDelete] =
    useState<number | null>(null);

  // state for task categories create
  const createTaskCategoryForm = useForm<TaskCategoryFormData>({
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

  const createFinancialCategoryForm = useForm<FinancialCategoryFormData>({
    resolver: zodResolver(financialCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      category_type: "income",
    },
  });

  const updateFinancialCategoryForm = useForm<FinancialCategoryFormData>({
    resolver: zodResolver(financialCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      category_type: "",
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
    refetch: financialCategoriesRefetch,
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

  const {
    mutateAsync: deleteTaskCategory,
    isPending: deleteTaskCategoryLoading,
  } = useDeleteTaskCategory();

  const {
    mutateAsync: createFinancialCategory,
    isPending: createFinancialCategoryLoading,
  } = useCreateFinancialCategory();

  const {
    mutateAsync: updateFinancialCategory,
    isPending: updateFinancialCategoryLoading,
  } = useUpdateFinancialCategory();

  const {
    mutateAsync: deleteFinancialCategory,
    isPending: deleteFinancialCategoryLoading,
  } = useDeleteFinancialCategory();

  const onCreateTaskCategorySubmit = (data: TaskCategoryFormData) => {
    createTaskCategory(data, {
      onSuccess: () => {
        taskModal.setOpen(false);
        toast.success("Task category created successfully");
        createTaskCategoryForm.reset();
        taskCategoriesRefetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onUpdateTaskCategorySubmit = (data: TaskCategoryFormData) => {
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
          updateTaskCategoryForm.reset();
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

  const openDeleteTaskCategoryModal = (category_id: number) => {
    deleteTaskCategoryModal.setOpen(true);
    setTaskCategoryIdToDelete(category_id);
  };

  const onDeleteTaskCategorySubmit = () => {
    deleteTaskCategoryModal.setOpen(false);
    deleteTaskCategory(
      { category_id: taskCategoryIdToDelete || 0 },
      {
        onSuccess: () => {
          toast.success("Task category deleted successfully");
          taskCategoriesRefetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const onCreateFinancialCategorySubmit = (data: FinancialCategoryFormData) => {
    createFinancialCategory(data, {
      onSuccess: () => {
        financialModal.setOpen(false);
        toast.success("Financial category created successfully");
        createFinancialCategoryForm.reset();
        financialCategoriesRefetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onUpdateFinancialCategorySubmit = (data: FinancialCategoryFormData) => {
    updateFinancialCategory(
      {
        category_id: financialCategoryIdToUpdate || 0,
        name: data.name,
        description: data.description,
        category_type: data.category_type,
      },
      {
        onSuccess: () => {
          updateFinancialCategoryModal.setOpen(false);
          toast.success("Financial category updated successfully");
          updateFinancialCategoryForm.reset();
          financialCategoriesRefetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const openUpdateFinancialCategoryModal = (
    category: { category_id: number } & FinancialCategoryFormData
  ) => {
    updateFinancialCategoryModal.setOpen(true);
    updateFinancialCategoryForm.reset(category);
    setFinancialCategoryIdToUpdate(category.category_id);
  };

  const openDeleteFinancialCategoryModal = (category_id: number) => {
    deleteFinancialCategoryModal.setOpen(true);
    setFinancialCategoryIdToDelete(category_id);
  };

  const onDeleteFinancialCategorySubmit = () => {
    deleteFinancialCategoryModal.setOpen(false);
    deleteFinancialCategory(
      { category_id: financialCategoryIdToDelete || 0 },
      {
        onSuccess: () => {
          toast.success("Financial category deleted successfully");
          financialCategoriesRefetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
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

                  <TaskCategoryForm
                    form={createTaskCategoryForm}
                    onSubmit={onCreateTaskCategorySubmit}
                    loading={createTaskCategoryLoading}
                    submitText="Create Category"
                  />
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
                              <DropdownMenuItem
                                onClick={() =>
                                  openDeleteTaskCategoryModal(
                                    category.category_id
                                  )
                                }
                                className="text-red-600"
                              >
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

                  <FinancialCategoryForm
                    form={createFinancialCategoryForm}
                    onSubmit={onCreateFinancialCategorySubmit}
                    loading={createFinancialCategoryLoading}
                    submitText="Create Category"
                  />
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
                      <TableHead className="min-w-[120px]">
                        Type
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
                        <TableCell className="min-w-[120px]">
                          {category.category_type}
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
                                  openUpdateFinancialCategoryModal({
                                    category_id: category.category_id,
                                    name: category.name,
                                    description: category.description,
                                    category_type: category.category_type,
                                  })
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  openDeleteFinancialCategoryModal(
                                    category.category_id
                                  )
                                }
                                className="text-red-600"
                              >
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

          <TaskCategoryForm
            form={updateTaskCategoryForm}
            onSubmit={onUpdateTaskCategorySubmit}
            loading={updateTaskCategoryLoading}
            submitText="Update Category"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={updateFinancialCategoryModal.open}
        onOpenChange={updateFinancialCategoryModal.setOpen}
      >
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Update Financial Category</DialogTitle>
            <DialogDescription>
              Update a category for organizing financial records
            </DialogDescription>
          </DialogHeader>

          <FinancialCategoryForm
            form={updateFinancialCategoryForm}
            onSubmit={onUpdateFinancialCategorySubmit}
            loading={updateFinancialCategoryLoading}
            submitText="Update Category"
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTaskCategoryModal.open}
        onOpenChange={deleteTaskCategoryModal.setOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              task category and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteTaskCategorySubmit}>
              {deleteTaskCategoryLoading ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteFinancialCategoryModal.open}
        onOpenChange={deleteFinancialCategoryModal.setOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              financial category and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteFinancialCategorySubmit}>
              {deleteFinancialCategoryLoading
                ? "Deleting..."
                : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
