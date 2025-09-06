"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Unlock,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedFilters, FilterState } from "@/components/advanced-filters";
import { useUsersNames, useUser, useUserDepartmentNames, useCreateUser } from "@/hooks/admin/users";
import { Users, UserDepartmentResponse } from "@/types/api/admin/users";
import { useTableState } from "@/hooks/useTableStateHook";
import { Form } from "@/components/ui/form";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModalHook";
import { useI18n } from "@/lib/i18n";
// Mock data with enhanced user information
const mockUsers = [
  {
    user_id: "1",
    username: "john_doe",
    email: "john@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567890",
    registration_date: "2024-01-15",
    last_login: "2024-01-20T14:30:00",
    user_type: "admin",
    is_active: true,
    account_status: "active",
    deactivation_reason: null,
    deactivated_at: null,
    deactivated_by: null,
    login_attempts: 0,
    is_locked: false,
    locked_until: null,
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: true,
    last_password_change: "2024-01-10",
    department: "Management",
    role_permissions: ["read", "write", "delete", "admin"],
  },
  {
    user_id: "2",
    username: "jane_smith",
    email: "jane@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567891",
    registration_date: "2024-01-16",
    last_login: "2024-01-19T09:15:00",
    user_type: "member",
    is_active: true,
    account_status: "active",
    deactivation_reason: null,
    deactivated_at: null,
    deactivated_by: null,
    login_attempts: 0,
    is_locked: false,
    locked_until: null,
    email_verified: true,
    phone_verified: false,
    two_factor_enabled: false,
    last_password_change: "2024-01-16",
    department: "Design",
    role_permissions: ["read", "write"],
  },
  {
    user_id: "3",
    username: "bob_wilson",
    email: "bob@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567892",
    registration_date: "2024-01-10",
    last_login: "2024-01-18T16:45:00",
    user_type: "member",
    is_active: false,
    account_status: "deactivated",
    deactivation_reason: "Policy violation",
    deactivated_at: "2024-01-19T10:00:00",
    deactivated_by: "1",
    login_attempts: 3,
    is_locked: false,
    locked_until: null,
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    last_password_change: "2024-01-10",
    department: "Marketing",
    role_permissions: ["read"],
  },
  {
    user_id: "4",
    username: "alice_brown",
    email: "alice@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567893",
    registration_date: "2024-01-12",
    last_login: "2024-01-20T11:20:00",
    user_type: "member",
    is_active: true,
    account_status: "active",
    deactivation_reason: null,
    deactivated_at: null,
    deactivated_by: null,
    login_attempts: 1,
    is_locked: false,
    locked_until: null,
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: true,
    last_password_change: "2024-01-12",
    department: "Development",
    role_permissions: ["read", "write"],
  },
  {
    user_id: "5",
    username: "charlie_davis",
    email: "charlie@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567894",
    registration_date: "2024-01-08",
    last_login: "2024-01-17T13:10:00",
    user_type: "member",
    is_active: true,
    account_status: "suspended",
    deactivation_reason: "Temporary suspension for investigation",
    deactivated_at: "2024-01-18T15:30:00",
    deactivated_by: "1",
    login_attempts: 0,
    is_locked: true,
    locked_until: "2024-01-25T00:00:00",
    email_verified: false,
    phone_verified: false,
    two_factor_enabled: false,
    last_password_change: "2024-01-08",
    department: "Development",
    role_permissions: ["read"],
  },
];

const userSchema = z.object({ 
  username : z.string().min(1, "User name is required"),
  email : z.string().min(1, "Email is required"),
  phone_number : z.string().min(1, "Phone is required"),
  user_type : z.enum(["Member", "Admin"]),
  department : z.string().min(1, "Department is required")
})

export type UserForm = z.infer<typeof userSchema>;

const deactivationReasons = [
  "Policy violation",
  "Inactivity",
  "Security concerns",
  "User request",
  "Contract termination",
  "Temporary suspension",
  "Investigation pending",
  "Other",
];

export function AdminUserManagement() {
  const [users, setUsers] = useState<Users[]>([]);
  const userTable = useTableState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [departmentList, setDepartmentList] = useState<UserDepartmentResponse[]>([]);
  const addModal = useModal();
  const { t } = useI18n();
  const { 
    data : usersData,
    isLoading : userLoading, 
    error : userError, 
    isError : userIsError,
    refetch : refetchUsers,
  } = useUser(
    userTable.page,
    userTable.pageSize,
    userTable.keyword
  ); // Fetch user data

  const {
    data: departments,
  } = useUserDepartmentNames();

  const {mutateAsync : createUser} = useCreateUser();

  
  useEffect(() => { 
    console.log("User data" ,usersData);
    if(usersData?.data?.data && Array.isArray(usersData?.data?.data)) { 
      setUsers(usersData.data.data)
    }
    console.log("Department data :", departments);
    if(departments && Array.isArray(departments)) { 
      setDepartmentList(departments)
    }
  }, [usersData, departments])

  //Add user form 
  const addForm = useForm<UserForm>({ 
    resolver : zodResolver(userSchema),
    defaultValues : { 
      username : "",
      email : "",
      phone_number : "",
      user_type : undefined,
      department : ""
    }
  })

  //Handle add user form submission 
  const onSubmitAdd = async(data : UserForm) => { 
    await createUser( 
      { 
        username : data.username,
        email : data.email,
        phone_number : data.phone_number,
        user_type : data.user_type,
        department : data.department
      }, 
      { 
        onSuccess : () => { 
          toast.success("User added successfully"); 
          refetchUsers();
          addForm.reset();
          addModal.setOpen(false);
        }, 
        onError : (error) => { 
          toast.error( 
            error instanceof Error 
            ? error.message
            : "Failed to add user"
          )
        }
      }
    )
  }

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateRange: { from: undefined, to: undefined },
    sortBy: "registration_date",
    sortOrder: "desc" as const,
    status: [],
    priority: [],
    category: [],
    user: [],
  });

  const filterOptions = {
    sortOptions: [
      { value: "username", label: "Username" },
      { value: "email", label: "Email" },
      { value: "registration_date", label: "Registration Date" },
      { value: "last_login", label: "Last Login" },
      { value: "user_type", label: "User Type" },
      { value: "department", label: "Department" },
    ],
    statusOptions: [
      {
        value: "active",
        label: "Active",
        count: users.filter((u) => u.account_status === "active").length,
      },
      {
        value: "deactivated",
        label: "Deactivated",
        count: users.filter((u) => u.account_status === "deactivated").length,
      },
      {
        value: "suspended",
        label: "Suspended",
        count: users.filter((u) => u.account_status === "suspended").length,
      },
    ],
    categoryOptions: [
      {
        value: "Management",
        label: "Management",
        count: users.filter((u) => u.department === "Management").length,
      },
      {
        value: "Development",
        label: "Development",
        count: users.filter((u) => u.department === "Development").length,
      },
      {
        value: "Design",
        label: "Design",
        count: users.filter((u) => u.department === "Design").length,
      },
      {
        value: "Marketing",
        label: "Marketing",
        count: users.filter((u) => u.department === "Marketing").length,
      },
    ],
    priorityOptions: [
      {
        value: "admin",
        label: "Admin",
        count: users.filter((u) => u.user_type === "admin").length,
      },
      {
        value: "member",
        label: "Member",
        count: users.filter((u) => u.user_type === "member").length,
      },
    ],
  };

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !user.username.toLowerCase().includes(searchLower) &&
          !user.email.toLowerCase().includes(searchLower) &&
          !user.department.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(user.account_status)) return false;
      }

      // Category (Department) filter
      if (filters.category.length > 0) {
        if (!filters.category.includes(user.department)) return false;
      }

      // Priority (User Type) filter
      if (filters.priority.length > 0) {
        if (!filters.priority.includes(user.user_type)) return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const userDate = new Date(user.registration_date);
        if (filters.dateRange.from && userDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && userDate > filters.dateRange.to)
          return false;
      }

      return true;
    });

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a];
        let bValue = b[filters.sortBy as keyof typeof b];

        // Handle date sorting
        if (
          filters.sortBy === "last_login" ||
          filters.sortBy === "registration_date"
        ) {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        // Handle string sorting
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        aValue = aValue || "";
        bValue = bValue || "";

        if (filters.sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [filters, users]);

  const handleDeactivateUser = (userId: string, reason: string) => {
    setUsers(
      users.map((user) =>
        user.user_id === userId
          ? {
              ...user,
              is_active: false,
              account_status: "deactivated",
              deactivation_reason: reason,
              deactivated_at: new Date().toISOString(),
              deactivated_by: "1", // Current admin user ID
            }
          : user
      )
    );
  };

  const handleActivateUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.user_id === userId
          ? {
              ...user,
              is_active: true,
              account_status: "active",
              deactivation_reason: null,
              deactivated_at: null,
              deactivated_by: null,
              locked_until: null,
            }
          : user
      )
    );
  };

  const handleSuspendUser = (userId: string, reason: string) => {
    setUsers(
      users.map((user) =>
        user.user_id === userId
          ? {
              ...user,
              account_status: "suspended",
              deactivation_reason: reason,
              deactivated_at: new Date().toISOString(),
              deactivated_by: "1",
            }
          : user
      )
    );
  };

  const handleLockUser = (userId: string) => {
    const lockUntil = new Date();
    lockUntil.setHours(lockUntil.getHours() + 24); // Lock for 24 hours

    setUsers(
      users.map((user) =>
        user.user_id === userId
          ? {
              ...user,
              is_locked: true,
              locked_until: lockUntil.toISOString(),
              login_attempts: 0,
              deactivation_reason: "",
              deactivated_at: "",
              deactivated_by: "",
            }
          : user
      )
    );
  };

  const handleUnlockUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.user_id === userId
          ? {
              ...user,
              is_locked: false,
              locked_until: null,
              login_attempts: 0,
            }
          : user
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
            Active
          </Badge>
        );
      case "deactivated":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            Deactivated
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "admin":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "member":
        return (
          <Badge variant="outline" className="text-xs">
            Member
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const activeUsers = filteredAndSortedUsers.filter(
    (u) => u.account_status === "active"
  ).length;
  const deactivatedUsers = filteredAndSortedUsers.filter(
    (u) => u.account_status === "deactivated"
  ).length;
  const suspendedUsers = filteredAndSortedUsers.filter(
    (u) => u.account_status === "suspended"
  ).length;
  const lockedUsers = filteredAndSortedUsers.filter((u) => u.is_locked).length;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Admin User Management
          </h1>
          <p className="text-sm lg:text-base text-slate-600">
            Manage user accounts, permissions, and access control
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with appropriate permissions
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onSubmitAdd)}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input id="username" className="col-span-3" placeholder="username"
                        {...addForm.register("username")}
                      />
                      {addForm.formState.errors.username && ( 
                        <p className="text-red-500 text-sm col-span-3 col-start-2"> 
                          {addForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input id="email" type="email" className="col-span-3" placeholder="eg: example@example.co"
                        {...addForm.register("email")}
                      />
                      {addForm.formState.errors.email && ( 
                        <p className="text-red-500 text-sm col-span-3 col-start-2"> 
                          {addForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone
                      </Label>
                      <Input id="phone" placeholder="eg: +1234567890" className="col-span-3" 
                        {...addForm.register("phone_number")}
                      />
                      {addForm.formState.errors.phone_number && ( 
                        <p className="text-red-500 text-sm col-span-3 col-start-2"> 
                          {addForm.formState.errors.phone_number.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user_type" className="text-right">
                        Type
                      </Label>
                      <Controller 
                        control={addForm.control}
                        name="user_type"
                        render={({ field }) => ( 
                          <Select 
                            value={field.value}
                            onValueChange={(value) => 
                              field.onChange( 
                                value as 
                                  | "Member"
                                  | "Admin"
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select User Type"/>
                            </SelectTrigger>
                            <SelectContent> 
                              <SelectItem value="Member">
                                {t.users.member}
                              </SelectItem>
                              <SelectItem value="Admin"> 
                                {t.users.admin}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      > 
                      </Controller>
                      {addForm.formState.errors.user_type && ( 
                        <p className="text-red-500 text-sm col-span-3 col-start-2"> 
                          {addForm.formState.errors.user_type.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Controller
                          control={addForm.control}
                          name="department"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Manager" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments?.data && departments?.data.map((department) => ( 
                                  <SelectItem 
                                    key={department.department_id}
                                    value={department.department_id.toString()}
                                    >
                                      {department.name}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      {addForm.formState.errors.department && ( 
                        <p className="text-red-500 text-sm col-span-3 col-start-2"> 
                          {addForm.formState.errors.department.message}
                        </p>
                      )}
                      </div>
                  </div>
                <DialogFooter>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        options={filterOptions}
        showFilters={{
          search: true,
          dateRange: true,
          sort: true,
          status: true,
          priority: true,
          category: true,
          user: false,
        }}
        placeholder="Search users by name, email, or department..."
      />

      {/* Stats Cards */}
      <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Active Users
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {activeUsers}
            </div>
            <p className="text-xs text-slate-600">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Deactivated
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <UserX className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {deactivatedUsers}
            </div>
            <p className="text-xs text-slate-600">Deactivated accounts</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Suspended
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {suspendedUsers}
            </div>
            <p className="text-xs text-slate-600">Temporarily suspended</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Locked
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {lockedUsers}
            </div>
            <p className="text-xs text-slate-600">Account locked</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <CardTitle className="text-base lg:text-lg text-slate-900">
                User Management
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Showing {filteredAndSortedUsers.length} of {users.length} users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[100px]">Department</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Last Login</TableHead>
                  <TableHead className="min-w-[100px]">Security</TableHead>
                  <TableHead className="min-w-[150px]">
                    Deactivation Info
                  </TableHead>
                  <TableHead className="text-right min-w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.user_id} className="hover:bg-slate-50/50">
                    <TableCell className="min-w-[200px]">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                          <AvatarImage
                            src={user.user_photo || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs lg:text-sm">
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium text-sm lg:text-base truncate flex items-center">
                            {user.username}
                            {user.is_locked && (
                              <Lock className="h-3 w-3 ml-1 text-red-500" />
                            )}
                          </div>
                          <div className="text-xs lg:text-sm text-muted-foreground truncate">
                            {user.email}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {user.email_verified && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                Email ✓
                              </Badge>
                            )}
                            {user.phone_verified && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                Phone ✓
                              </Badge>
                            )}
                            {user.two_factor_enabled && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                2FA ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {getUserTypeBadge(user.user_type)}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Badge variant="outline" className="text-xs">
                        {user.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {getStatusBadge(user.account_status)}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="text-xs lg:text-sm">
                        <div>
                          {new Date(user.last_login).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(user.last_login).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="space-y-1">
                        {user.login_attempts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {user.login_attempts} failed attempts
                          </Badge>
                        )}
                        {user.is_locked && (
                          <Badge variant="destructive" className="text-xs">
                            Locked until{" "}
                            {new Date(user.locked_until!).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {user.user_deactivation_history?.reason && (
                        <div className="text-xs">
                          <div className="font-medium text-red-600">
                            {user.user_deactivation_history.reason}
                          </div>
                          {user.user_deactivation_history.performed_at && (
                            <div className="text-muted-foreground">
                              {new Date(
                                user.user_deactivation_history.performed_at
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right min-w-[120px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {user.account_status === "active" ? (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate Account
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Deactivate User Account
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will deactivate {user.username}&apos;s
                                      account. They will not be able to log in
                                      until reactivated.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="reason">
                                        Reason for deactivation
                                      </Label>
                                      <Select
                                        value={deactivationReason}
                                        onValueChange={setDeactivationReason}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {deactivationReasons.map((reason) => (
                                            <SelectItem
                                              key={reason}
                                              value={reason}
                                            >
                                              {reason}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {deactivationReason === "Other" && (
                                      <div>
                                        <Label htmlFor="custom-reason">
                                          Custom reason
                                        </Label>
                                        <Textarea
                                          id="custom-reason"
                                          value={customReason}
                                          onChange={(e) =>
                                            setCustomReason(e.target.value)
                                          }
                                          placeholder="Enter custom reason..."
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        const reason =
                                          deactivationReason === "Other"
                                            ? customReason
                                            : deactivationReason;
                                        handleDeactivateUser(
                                          user.user_id,
                                          reason
                                        );
                                        setDeactivationReason("");
                                        setCustomReason("");
                                      }}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Deactivate
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Suspend User Account
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will temporarily suspend{" "}
                                      {user.username}&apos;s account.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="suspend-reason">
                                        Reason for suspension
                                      </Label>
                                      <Select
                                        value={deactivationReason}
                                        onValueChange={setDeactivationReason}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {deactivationReasons.map((reason) => (
                                            <SelectItem
                                              key={reason}
                                              value={reason}
                                            >
                                              {reason}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        handleSuspendUser(
                                          user.user_id,
                                          deactivationReason
                                        );
                                        setDeactivationReason("");
                                      }}
                                      className="bg-orange-600 hover:bg-orange-700"
                                    >
                                      Suspend
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleActivateUser(user.user_id)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate Account
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          {user.is_locked ? (
                            <DropdownMenuItem
                              onClick={() => handleUnlockUser(user.user_id)}
                            >
                              <Unlock className="mr-2 h-4 w-4" />
                              Unlock Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleLockUser(user.user_id)}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Lock Account
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="edit-username"
                      defaultValue={selectedUser.username}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      defaultValue={selectedUser.email}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      defaultValue={selectedUser.phone_number}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-department" className="text-right">
                      Department
                    </Label>
                    <Select defaultValue={selectedUser.department}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verified</Label>
                      <p className="text-sm text-muted-foreground">
                        User&apos;s email address is verified
                      </p>
                    </div>
                    <Switch defaultChecked={selectedUser.email_verified} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Phone Verified</Label>
                      <p className="text-sm text-muted-foreground">
                        User&apos;s phone number is verified
                      </p>
                    </div>
                    <Switch defaultChecked={selectedUser.phone_verified} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for login
                      </p>
                    </div>
                    <Switch defaultChecked={selectedUser.two_factor_enabled} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Login Attempts</Label>
                    <div className="col-span-3 text-sm">
                      {selectedUser.login_attempts} failed attempts
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Last Password Change</Label>
                    <div className="col-span-3 text-sm">
                      {new Date(
                        selectedUser.last_password_change
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-user-type" className="text-right">
                      User Type
                    </Label>
                    <Select defaultValue={selectedUser.user_type}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Role Permissions</Label>
                    <div className="space-y-2">
                      {["read", "write", "delete", "admin"].map(
                        (permission) => (
                          <div
                            key={permission}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`permission-${permission}`}
                              defaultChecked={selectedUser.role_permissions.includes(
                                permission
                              )}
                              className="rounded border-gray-300"
                            />
                            <Label
                              htmlFor={`permission-${permission}`}
                              className="capitalize"
                            >
                              {permission}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
