"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  MapPin,
  Plus,
  Check,
} from "lucide-react";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import {
  useCreateDepartment,
  useDepartments,
  useDepartmentSummary,
  useUpdateDepartment,
  useUpdateDepartmentStatus,
} from "@/hooks/admin/departments";
import { Department } from "@/types/api/admin/departments";
import { encryptString, formatCurrency, formatPercentage } from "@/lib/utils";
import { useTableState } from "@/hooks/useTableStateHook";
import PaginationComponent from "@/components/app/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUsersNames } from "@/hooks/admin/users";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalHook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const departmentSchema = z.object({
  department_name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Code is required"),
  manager_id: z.string().min(1, "Manager is required"),
  level: z.enum(["executive", "management", "operational", "support"]),
  budget: z.number().min(0, "Budget must be a positive number"),
  description: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type DepartmentForm = z.infer<typeof departmentSchema>;

export function DepartmentsSection() {
  const { t } = useI18n();
  const router = useRouter();

  const departmentTable = useTableState(10); // default page size is 10 for departments
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null); // Selected department

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
    isError: departmentsIsError,
    refetch: refetchDepartments,
  } = useDepartments(
    departmentTable.page,
    departmentTable.pageSize,
    departmentTable.keyword
  ); // Fetch departments data

  const { data: usersNames } = useUsersNames(); // Fetch users names
  const { data: departmentSummary } = useDepartmentSummary(); // Fetch department summary

  const { mutateAsync: updateDepartment } = useUpdateDepartment(); // Update department
  const { mutateAsync: createDepartment } = useCreateDepartment(); // Create department
  const { mutateAsync: updateDepartmentStatus } = useUpdateDepartmentStatus(); // Update department status

  // Get level badge
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "executive":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            {level.toUpperCase()}
          </Badge>
        );
      case "management":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            {level.toUpperCase()}
          </Badge>
        );
      case "operational":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
            {level.toUpperCase()}
          </Badge>
        );
      case "support":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            {level.toUpperCase()}
          </Badge>
        );
      case "department":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            {level.toUpperCase()}
          </Badge>
        );
      case "team":
        return (
          <Badge className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            {level.toUpperCase()}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
            {t.common.active}
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            {t.common.inactive}
          </Badge>
        );
      case "restructuring":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            Restructuring
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Edit department form
  const editForm = useForm<DepartmentForm>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department_name: "",
      code: "",
      manager_id: "",
      level: undefined,
      budget: 0 as number,
      description: "",
      location: "",
      phone: "",
      email: "",
    },
  });

  // Add department form
  const addForm = useForm<DepartmentForm>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department_name: "",
      code: "",
      manager_id: "",
      level: undefined,
      budget: 0 as number,
      description: "",
      location: "",
      phone: "",
      email: "",
    },
  });

  // Handle edit department form submission
  const onSubmitEdit = async (data: DepartmentForm) => {
    await updateDepartment(
      {
        department_name: data.department_name,
        description: data.description || "",
        code: data.code,
        manager_id: data.manager_id,
        level: data.level,
        budget: data.budget,
        location: data.location || "",
        phone: data.phone || "",
        email: data.email || "",
        department_id: selectedDepartment?.department_id || "",
        status: selectedDepartment?.status || false,
      },
      {
        onSuccess: () => {
          toast.success("Department updated successfully");
          refetchDepartments();
          editForm.reset();
          editModal.setOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update department"
          );
        },
      }
    );
  };

  // Handle add department form submission
  const onSubmitAdd = async (data: DepartmentForm) => {
    await createDepartment(
      {
        department_name: data.department_name,
        description: data.description || "",
        code: data.code,
        manager_id: data.manager_id,
        level: data.level,
        budget: data.budget,
        location: data.location || "",
        phone: data.phone || "",
        email: data.email || "",
        status: true,
      },
      {
        onSuccess: () => {
          toast.success("Department added successfully");
          refetchDepartments();
          addForm.reset();
          addModal.setOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update department"
          );
        },
      }
    );
  };

  // Handle update department status
  const handleToUpdateStatus = async (id: string, status: boolean) => {
    await updateDepartmentStatus(
      {
        id,
        status,
      },
      {
        onSuccess: () => {
          toast.success("Department status updated successfully");
          refetchDepartments();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update department status"
          );
        },
      }
    );
  };

  // Handle navigation to a department's details page
  const handleToDepartment = (id: string) => {
    const encryptedId = encryptString(id);
    router.push(`/admin/departments/${encryptedId}`);
  };

  // Handle error for departments
  useEffect(() => {
    if (departmentsError || departmentsIsError) {
      toast.error(departmentsError?.message || "Failed to fetch departments");
    }
  }, [departmentsError, departmentsIsError]);

  return (
    <div className="space-y-6">
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              {t.departments.title}
            </h1>
            <p className="text-sm lg:text-base text-slate-600">
              {t.departments.subtitle}
            </p>
          </div>
          <Dialog open={addModal.open} onOpenChange={addModal.setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                {t.departments.addDepartment}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t.departments.addDepartment}</DialogTitle>
                <DialogDescription>
                  Create a new department for your organization
                </DialogDescription>
              </DialogHeader>

              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onSubmitAdd)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t.departments.departmentName}</Label>
                        <Input
                          placeholder="Department Name"
                          {...addForm.register("department_name")}
                        />
                        {addForm.formState.errors.department_name && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.department_name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Code</Label>
                        <Input
                          placeholder="eg: HR, DSN, IT, etc."
                          {...addForm.register("code")}
                        />
                        {addForm.formState.errors.code && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.code.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t.departments.description}</Label>
                      <Textarea
                        placeholder="Description"
                        {...addForm.register("description")}
                      />
                      {addForm.formState.errors.description && (
                        <p className="text-red-500 text-sm">
                          {addForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t.departments.manager}</Label>
                        <Controller
                          control={addForm.control}
                          name="manager_id"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Manager" />
                              </SelectTrigger>
                              <SelectContent>
                                {usersNames?.data?.map((user) => (
                                  <SelectItem
                                    key={user.user_id}
                                    value={user.user_id.toString()}
                                  >
                                    {user.username}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {addForm.formState.errors.manager_id && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.manager_id.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Level</Label>
                        <Controller
                          control={addForm.control}
                          name="level"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) =>
                                field.onChange(
                                  value as
                                    | "executive"
                                    | "management"
                                    | "operational"
                                    | "support"
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="executive">
                                  {t.departments.executiveLevel}
                                </SelectItem>
                                <SelectItem value="management">
                                  {t.departments.managementLevel}
                                </SelectItem>
                                <SelectItem value="operational">
                                  {t.departments.operationalLevel}
                                </SelectItem>
                                <SelectItem value="support">
                                  {t.departments.supportLevel}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {addForm.formState.errors.level && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.level.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Budget</Label>
                        <Input
                          placeholder="eg: 1000000"
                          type="number"
                          {...addForm.register("budget", {
                            valueAsNumber: true,
                          })}
                        />
                        {addForm.formState.errors.budget && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.budget.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="eg: New York, New York"
                          {...addForm.register("location")}
                        />
                        {addForm.formState.errors.location && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.location.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          placeholder="eg: +1234567890"
                          {...addForm.register("phone")}
                        />
                        {addForm.formState.errors.phone && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          placeholder="eg: example@example.com"
                          type="email"
                          {...addForm.register("email")}
                        />
                        {addForm.formState.errors.email && (
                          <p className="text-red-500 text-sm">
                            {addForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                {t.departments.totalDepartments}
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {departmentSummary?.data?.total_departments}
              </div>
              <p className="text-xs text-slate-600">Active departments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                {t.departments.totalEmployees}
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {departmentSummary?.data?.total_employees}
              </div>
              <p className="text-xs text-slate-600">Across all departments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                {t.departments.averageSize}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {departmentSummary?.data?.avg_employees_per_department}
              </div>
              <p className="text-xs text-slate-600">Employees per department</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                Total Budget
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(departmentSummary?.data?.total_budget || 0)}
              </div>
              <p className="text-xs text-slate-600">Annual budget allocation</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div>
                <CardTitle className="text-base lg:text-lg text-slate-900">
                  {t.departments.departmentList}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Manage your organization&apos;s departments
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search
                  className="h-4 w-4 text-slate-500"
                  onClick={() =>
                    departmentTable.setKeyword(departmentTable.tempKeyword)
                  }
                />
                <Input
                  placeholder="Search departments..."
                  value={departmentTable.tempKeyword}
                  onChange={(e) =>
                    departmentTable.setTempKeyword(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      departmentTable.setKeyword(departmentTable.tempKeyword);
                    }
                  }}
                  className="w-full lg:w-64 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Department</TableHead>
                    <TableHead className="min-w-[120px]">Manager</TableHead>
                    <TableHead className="min-w-[100px]">Employees</TableHead>
                    <TableHead className="min-w-[100px]">Level</TableHead>
                    <TableHead className="min-w-[120px]">Budget</TableHead>
                    <TableHead className="min-w-[100px]">Performance</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments?.data?.data?.map((department) => (
                    <TableRow key={department.department_id}>
                      <TableCell className="min-w-[200px]">
                        <div>
                          <div className="font-medium text-sm lg:text-base flex items-center space-x-2">
                            <span>{department.department_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {department.code}
                            </Badge>
                          </div>
                          <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                            {department.description}
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                            {department.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{department.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {department.manager_name
                                ?.slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-xs lg:text-sm font-medium truncate">
                              {department.manager_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-slate-500" />
                          <span className="text-xs lg:text-sm font-medium">
                            {department.employee_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        {getLevelBadge(department.level.toLowerCase())}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="text-xs lg:text-sm font-medium">
                          {formatCurrency(department.budget)}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="text-slate-500">Completion:</span>
                            <span className="ml-1 font-medium">
                              {formatPercentage(
                                department.department_completion_percentage
                              )}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">
                              Productivity:
                            </span>
                            <span className="ml-1 font-medium">
                              {formatPercentage(
                                department.department_productivity_percentage
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        {getStatusBadge(
                          department.status ? "active" : "inactive"
                        )}
                      </TableCell>
                      <TableCell className="text-right min-w-[80px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            align="end"
                            className="flex flex-col p-2 w-[200px]"
                          >
                            <button
                              onClick={() => {
                                setSelectedDepartment(department);
                                editForm.reset(department);
                                editModal.setOpen(true);
                              }}
                              className="flex items-center px-2 py-1 hover:bg-gray-100 text-sm"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t.common.edit}
                            </button>

                            <button
                              onClick={() =>
                                handleToDepartment(department.department_id)
                              }
                              className="flex items-center px-2 py-1 hover:bg-gray-100 text-sm"
                            >
                              <Building2 className="mr-2 h-4 w-4" />
                              {t.departments.viewDepartment}
                            </button>

                            <button
                              onClick={() => {
                                if (department.status) {
                                  setSelectedDepartment(department);
                                  deleteModal.setOpen(true);
                                } else {
                                  handleToUpdateStatus(
                                    department.department_id,
                                    !department.status
                                  );
                                }
                              }}
                              className={`flex items-center px-2 py-1 hover:bg-gray-100 text-sm ${
                                department.status
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {department.status ? (
                                <Trash2 className="mr-2 h-4 w-4" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              {department.status
                                ? t.common.terminate
                                : t.common.activate}
                            </button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                  {departmentsLoading && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <Skeleton className="h-10 w-full bg-slate-200 rounded" />
                      </TableCell>
                    </TableRow>
                  )}
                  {departments?.data.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No departments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {departments && departments?.data.data.length > 0 && (
              <div className="flex w-full justify-end mt-4">
                <PaginationComponent
                  currentPage={departmentTable.page}
                  totalPages={departmentTable.totalPages}
                  onPageChange={(newPage) => departmentTable.setPage(newPage)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={editModal.open} onOpenChange={editModal.setOpen}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.departments.editDepartment}</DialogTitle>
            <DialogDescription>Update department information</DialogDescription>
          </DialogHeader>

          {selectedDepartment && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitEdit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t.departments.departmentName}</Label>
                      <Input {...editForm.register("department_name")} />
                      {editForm.formState.errors.department_name && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.department_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Input {...editForm.register("code")} />
                      {editForm.formState.errors.code && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.code.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.departments.description}</Label>
                    <Textarea {...editForm.register("description")} />
                    {editForm.formState.errors.description && (
                      <p className="text-red-500 text-sm">
                        {editForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t.departments.manager}</Label>
                      <Controller
                        control={editForm.control}
                        name="manager_id"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {usersNames?.data?.map((user) => (
                                <SelectItem
                                  key={user.user_id}
                                  value={user.user_id.toString()}
                                >
                                  {user.username}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {editForm.formState.errors.manager_id && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.manager_id.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Level</Label>
                      <Controller
                        control={editForm.control}
                        name="level"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(
                                value as
                                  | "executive"
                                  | "management"
                                  | "operational"
                                  | "support"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="executive">
                                {t.departments.executiveLevel}
                              </SelectItem>
                              <SelectItem value="management">
                                {t.departments.managementLevel}
                              </SelectItem>
                              <SelectItem value="operational">
                                {t.departments.operationalLevel}
                              </SelectItem>
                              <SelectItem value="support">
                                {t.departments.supportLevel}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {editForm.formState.errors.level && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.level.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Budget</Label>
                      <Input
                        type="number"
                        {...editForm.register("budget", {
                          valueAsNumber: true,
                        })}
                      />
                      {editForm.formState.errors.budget && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.budget.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input {...editForm.register("location")} />
                      {editForm.formState.errors.location && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input {...editForm.register("phone")} />
                      {editForm.formState.errors.phone && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...editForm.register("email")} />
                      {editForm.formState.errors.email && (
                        <p className="text-red-500 text-sm">
                          {editForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteModal.open} onOpenChange={deleteModal.setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will terminate your department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleToUpdateStatus(
                  selectedDepartment?.department_id || "",
                  !selectedDepartment?.status
                );
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
