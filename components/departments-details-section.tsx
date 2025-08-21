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
  Plus,
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
import { useDepartmentDetail, useUpdateDepartment } from "@/hooks/admin/departments";
import { decryptString, formatCurrency } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { useUsersNames } from "@/hooks/admin/users";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModalHook";

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

export function DepartmentsDetailsSection() {
  const { t } = useI18n();
  const params = useParams();

  const addModal = useModal();
  const editModal = useModal();
  const [departmentId, setDepartmentId] = useState<string | null>(null); // Department id

  const {
    data: departmentDetail,
    error: departmentDetailError,
    isError: departmentDetailIsError,
    isLoading: departmentDetailLoading,
    refetch: refetchDepartmentDetail,
  } = useDepartmentDetail(departmentId ?? ""); // Fetch department employees

  const { data: usersNames } = useUsersNames(); // Fetch users names

  const { mutateAsync: updateDepartment } = useUpdateDepartment(); // Update department

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
        department_id: departmentDetail?.data?.department_id || "",
        status: departmentDetail?.data?.status || false,
      },
      {
        onSuccess: () => {
          toast.success("Department updated successfully");
          refetchDepartmentDetail();
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

  // Get department id from slug
  useEffect(() => {
    if (params.id) {
      const decryptedDepartmentId = decryptString(params.id as string);
      setDepartmentId(decryptedDepartmentId);
    }
  }, [params.id]);

  useEffect(() => {
    if (departmentDetail) {
      editForm.reset({
        department_name: departmentDetail.data.department_name,
        code: departmentDetail.data.code,
        manager_id: departmentDetail.data.manager_id,
        level: departmentDetail.data.level.toLowerCase() as
          | "executive"
          | "management"
          | "operational"
          | "support",
        budget: departmentDetail.data.budget,
        description: departmentDetail.data.description,
        location: departmentDetail.data.location,
        phone: departmentDetail.data.phone,
        email: departmentDetail.data.email,
      });
    }
  }, [departmentDetail, editForm]);

  // Handle department employees error
  useEffect(() => {
    if (departmentDetailError || departmentDetailIsError) {
      toast.error(
        departmentDetailError?.message || "Failed to fetch department detail"
      );
    }
  }, [departmentDetailError, departmentDetailIsError]);

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
                {t.departments.addEmployee}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t.departments.addEmployee}</DialogTitle>
                <DialogDescription>
                  Create a new department for your organization
                </DialogDescription>
              </DialogHeader>

              {/* <Form {...addForm}>
                <form onSubmit={() => {}}>
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
              </Form> */}
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
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search departments..."
                  value={""}
                  // onChange={(e) =>
                  //   employeeTable.setTempKeyword(e.target.value)
                  // }
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     employeeTable.setKeyword(employeeTable.tempKeyword);
                  //   }
                  // }}
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
                    <TableHead className="min-w-[200px]">
                      Employee Name
                    </TableHead>
                    <TableHead className="min-w-[120px]">Role</TableHead>
                    <TableHead className="min-w-[120px]">Join Date</TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentDetail?.data?.employees?.map((employee) => (
                    <TableRow key={employee.user_id}>
                      <TableCell className="min-w-[200px]">
                        <div>
                          <div className="font-medium text-sm lg:text-base flex items-center space-x-2">
                            <span>{employee.username}</span>
                          </div>
                          <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                            {employee.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs lg:text-sm font-medium">
                            {employee.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs lg:text-sm font-medium">
                            {employee.joined_at}
                          </span>
                        </div>
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
                              onClick={() => editModal.setOpen(true)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t.common.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Building2 className="mr-2 h-4 w-4" />
                              {t.departments.viewDepartment}
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
                  {departmentDetailLoading && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <Skeleton className="h-10 w-full bg-slate-200 rounded" />
                      </TableCell>
                    </TableRow>
                  )}
                  {departmentDetail?.data?.employees?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No employees found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
          
        </DialogContent>
      </Dialog>
    </div>
  );
}
