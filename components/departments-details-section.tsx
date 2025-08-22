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
  Plus,
  Edit2,
  Hash,
  User,
  Mail,
  Phone,
  MapPin,
  User2,
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
import {
  useDepartmentDetail,
  useUpdateDepartment,
} from "@/hooks/admin/departments";
import {
  convertToLocaleDateTime,
  decryptString,
  formatCurrency
} from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { useUsersNames } from "@/hooks/admin/users";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/useModalHook";
import { DepartmentEmployee } from "@/types/api/admin/departments";
import { Badge } from "./ui/badge";

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
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string | null>(null); // Department id
  const [departmentEmployees, setDepartmentEmployees] = useState<
    DepartmentEmployee[]
  >([]); // Department employees
  const [employees, setEmployees] = useState<DepartmentEmployee[]>([]); // Department employees

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

  // Handle search
  const handleSearch = () => {
    const filteredEmployees = departmentEmployees.filter((employee) => {
      return employee.username
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
    });

    if (filteredEmployees) {
      setEmployees(filteredEmployees);
    } else {
      setEmployees([]);
    }
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
      setDepartmentEmployees([
        {
          user_id: departmentDetail.data.manager_id,
          username: departmentDetail.data.manager_name,
          email: departmentDetail.data.email,
          role: "Manager",
          joined_at: departmentDetail.data.created_at || "",
        },
        ...departmentDetail.data.employees,
      ]);
      setEmployees([
        {
          user_id: departmentDetail.data.manager_id,
          username: departmentDetail.data.manager_name,
          email: departmentDetail.data.email,
          role: "Manager",
          joined_at: departmentDetail.data.created_at || "",
        },
        ...departmentDetail.data.employees,
      ]);
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
              {departmentDetail?.data?.department_name} Department
            </h1>
            <p className="text-sm lg:text-base text-slate-600">
              Manage {departmentDetail?.data?.department_name} department
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => editModal.setOpen(true)}
              className="w-full lg:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Terminate
            </Button>
            <Button
              onClick={() => editModal.setOpen(true)}
              className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              {t.departments.editDepartment}
            </Button>
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
        </div>

        {/* Stats Cards */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-card-foreground">
              <Building2 className="mr-2 h-5 w-5" />
              Department Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Department Code
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Manager
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.manager_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Level
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.level}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Budget
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(departmentDetail?.data?.budget || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Location
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Phone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Total Employees
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {departmentDetail?.data?.employees?.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div>
                <CardTitle className="text-base lg:text-lg text-slate-900">
                  {t.departments.employeeList}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Manage your {departmentDetail?.data?.department_name}{" "}
                  department&apos;s employees
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search
                  className="h-4 w-4 text-slate-500 cursor-pointer"
                  onClick={handleSearch}
                />
                <Input
                  placeholder="Search employees..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
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
                  {employees?.map((employee, index) => (
                    <TableRow key={employee.user_id + index}>
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
                        {employee.user_id !==
                          departmentDetail?.data?.manager_id && (
                          <Badge className="text-xs lg:text-sm font-medium">
                            {employee.role}
                          </Badge>
                        )}
                        {employee.user_id ===
                          departmentDetail?.data?.manager_id && (
                          <Badge className="text-xs lg:text-sm font-medium bg-blue-500 text-white">
                            {employee.role.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs lg:text-sm font-medium">
                            {convertToLocaleDateTime(
                              employee.joined_at,
                              "Asia/Tokyo"
                            )}
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
                              disabled={
                                employee.user_id ===
                                departmentDetail?.data?.manager_id
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t.common.edit}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                employee.user_id ===
                                departmentDetail?.data?.manager_id
                              }
                            >
                              <User2 className="mr-2 h-4 w-4" />
                              View Employee
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              disabled={
                                employee.user_id ===
                                departmentDetail?.data?.manager_id
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
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
                  {!departmentDetailLoading && employees?.length === 0 && (
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
