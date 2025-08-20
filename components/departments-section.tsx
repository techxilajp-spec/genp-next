"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  MapPin,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { useDepartments, useUpdateDepartment } from "@/hooks/admin/departments";
import { Department } from "@/types/api/admin/departments";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { useTableState } from "@/hooks/useTableStateHook";
import PaginationComponent from "@/components/app/pagination";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { useUsersNames } from "@/hooks/admin/users";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";

const editDepartmentSchema = z.object({
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

export type EditDepartmentForm = z.infer<typeof editDepartmentSchema>;

export function DepartmentsSection() {
  const { t } = useI18n();
  const departmentTable = useTableState(10); // default page size is 10 for departments

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
  );

  const { data: usersNames } = useUsersNames();
  const { mutateAsync: updateDepartment } = useUpdateDepartment();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

const editForm = useForm<EditDepartmentForm>({
  resolver: zodResolver(editDepartmentSchema),
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


  const onSubmitEdit = async (data: EditDepartmentForm) => {
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
          setIsEditDialogOpen(false);
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.departments.departmentName}</Label>
                    <Input id="name" placeholder="Enter department name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" placeholder="e.g., ENG, MKT" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t.departments.description}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Department description"
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager">{t.departments.manager}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t.departments.selectManager}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {usersNames?.data?.map((user) => (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">{t.departments.budget}</Label>
                    <Input id="budget" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t.departments.location}</Label>
                    <Input id="location" placeholder="Office location" />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.departments.phone}</Label>
                    <Input id="phone" placeholder="+81-3-1234-5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.departments.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="dept@startup.com"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{t.common.save}</Button>
              </DialogFooter>
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
              <div className="text-2xl font-bold text-slate-900">10</div>
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
              <div className="text-2xl font-bold text-slate-900">10</div>
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
              <div className="text-2xl font-bold text-slate-900">10</div>
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
                {formatCurrency(1000)}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedDepartment(department);
                                editForm.reset(department);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t.common.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              {t.departments.assignEmployee}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t.common.delete}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                        {...editForm.register("budget", { valueAsNumber: true })}
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
    </div>
  );
}
