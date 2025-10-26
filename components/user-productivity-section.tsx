"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, CheckCircle, Calendar, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { AdvancedFilters, FilterState } from "@/components/advanced-filters";
import { useUserProductivity } from "@/hooks/admin/users";
import { UserProductivity } from "../types/api/admin/users/index";

export function UserProductivitySection() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateRange: { from: undefined, to: undefined },
    sortBy: "productivity_score",
    sortOrder: "desc" as const,
    status: [],
    priority: [],
    category: [],
    user: [],
  });

  const { data: users, isLoading } = useUserProductivity(); // Fetch department summary

  const filterOptions = {
    sortOptions: [
      { value: "username", label: "Name" },
      { value: "productivity_score", label: "Productivity Score" },
      { value: "tasks_completed_today", label: "Tasks Today" },
      { value: "tasks_completed_week", label: "Tasks This Week" },
      { value: "tasks_completed_month", label: "Tasks This Month" },
      { value: "avg_completion_rate", label: "Completion Rate" },
      { value: "last_login", label: "Last Login" },
      { value: "registration_date", label: "Registration Date" },
    ],
    statusOptions: [
      {
        value: "active",
        label: "Active",
        count: users?.filter((u) => u.is_active).length,
      },
      {
        value: "inactive",
        label: "Inactive",
        count: users?.filter((u) => !u.is_active).length,
      },
    ],
    categoryOptions: [
      {
        value: "Development",
        label: "Development",
        count: users?.filter((u) => u.department === "Development").length,
      },
      {
        value: "Design",
        label: "Design",
        count: users?.filter((u) => u.department === "Design").length,
      },
      {
        value: "Marketing",
        label: "Marketing",
        count: users?.filter((u) => u.department === "Marketing").length,
      },
      {
        value: "Management",
        label: "Management",
        count: users?.filter((u) => u.department === "Management").length,
      },
    ],
    priorityOptions: [
      {
        value: "excellent",
        label: "Excellent (90%+)",
        count: users?.filter((u) => u.productivity_score >= 90).length,
      },
      {
        value: "good",
        label: "Good (80-89%)",
        count: users?.filter(
          (u) => u.productivity_score >= 80 && u.productivity_score < 90
        ).length,
      },
      {
        value: "average",
        label: "Average (70-79%)",
        count: users?.filter(
          (u) => u.productivity_score >= 70 && u.productivity_score < 80
        ).length,
      },
      {
        value: "needs_improvement",
        label: "Needs Improvement (<70%)",
        count: users?.filter((u) => u.productivity_score < 70).length,
      },
    ],
  };

  // replace your current useMemo with this:
  const filteredAndSortedUsers = useMemo(() => {
    const data = users ?? []; // ensure array
    const filtered = data.filter((user) => {
      // --- your existing filtering logic, unchanged ---
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
      if (filters.status.length > 0) {
        const userStatus = user.is_active ? "active" : "inactive";
        if (!filters.status.includes(userStatus)) return false;
      }
      if (filters.category.length > 0) {
        if (!filters.category.includes(user.department)) return false;
      }
      if (filters.priority.length > 0) {
        let productivityLevel = "";
        if (user.productivity_score >= 90) productivityLevel = "excellent";
        else if (user.productivity_score >= 80) productivityLevel = "good";
        else if (user.productivity_score >= 70) productivityLevel = "average";
        else productivityLevel = "needs_improvement";
        if (!filters.priority.includes(productivityLevel)) return false;
      }
      if (filters.dateRange.from || filters.dateRange.to) {
        const userDate = new Date(user.registration_date);
        if (filters.dateRange.from && userDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && userDate > filters.dateRange.to)
          return false;
      }
      return true;
    });

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a];
        let bValue = b[filters.sortBy as keyof typeof b];
        if (
          filters.sortBy === "last_login" ||
          filters.sortBy === "registration_date"
        ) {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        return filters.sortOrder === "asc"
          ? (aValue as any) < (bValue as any)
            ? -1
            : (aValue as any) > (bValue as any)
            ? 1
            : 0
          : (aValue as any) > (bValue as any)
          ? -1
          : (aValue as any) < (bValue as any)
          ? 1
          : 0;
      });
    }

    return filtered;
  }, [users, filters]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-48'>
        <span className='text-sm text-slate-500'>
          Loading user productivity...
        </span>
      </div>
    );
  }

  const totalTasksToday = (filteredAndSortedUsers ?? []).reduce(
    (sum, u) => sum + Number(u.tasks_completed_today ?? 0),
    0
  );

  const totalTasksWeek = (filteredAndSortedUsers ?? []).reduce(
    (sum, u) => sum + Number(u.tasks_completed_week ?? 0),
    0
  );
  const avgProductivityScore =
    (filteredAndSortedUsers ?? []).length > 0
      ? Math.round(
          (filteredAndSortedUsers ?? []).reduce(
            (sum, u) => sum + Number(u.productivity_score ?? 0),
            0
          ) / (filteredAndSortedUsers ?? []).length
        )
      : 0;

  const getProductivityBadge = (score: number) => {
    if (score >= 90)
      return (
        <Badge className='bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0'>
          Excellent
        </Badge>
      );
    if (score >= 80)
      return (
        <Badge className='bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0'>
          Good
        </Badge>
      );
    if (score >= 70)
      return (
        <Badge className='bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0'>
          Average
        </Badge>
      );
    return (
      <Badge className='bg-gradient-to-r from-red-500 to-red-600 text-white border-0'>
        Needs Improvement
      </Badge>
    );
  };

  return (
    <div className='space-y-4 lg:space-y-6'>
      <div className='flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0'>
        <div>
          <h1 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent'>
            User Productivity
          </h1>
          <p className='text-sm lg:text-base text-slate-600'>
            Monitor team productivity and task completion rates
          </p>
        </div>
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
        placeholder='Search users by name, email, or department...'
      />

      {/* Productivity Overview Cards */}
      <div className='grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3'>
        <Card className='border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-700'>
              Tasks Today
            </CardTitle>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
              <CheckCircle className='h-4 w-4 text-white' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-xl lg:text-2xl font-bold text-slate-900'>
              {totalTasksToday}
            </div>
            <p className='text-xs text-slate-600'>
              From {filteredAndSortedUsers ? filteredAndSortedUsers.length : 0}{" "}
              users
            </p>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-700'>
              This Week
            </CardTitle>
            <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center'>
              <Calendar className='h-4 w-4 text-white' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-xl lg:text-2xl font-bold text-slate-900'>
              {totalTasksWeek}
            </div>
            <p className='text-xs text-slate-600'>Weekly completion total</p>
          </CardContent>
        </Card>

        <Card className='border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-700'>
              Avg Productivity
            </CardTitle>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <TrendingUp className='h-4 w-4 text-white' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-xl lg:text-2xl font-bold text-slate-900'>
              {avgProductivityScore}%
            </div>
            <p className='text-xs text-slate-600'>Filtered users average</p>
          </CardContent>
        </Card>
      </div>

      <Card className='border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300'>
        <CardHeader className='border-b border-slate-100'>
          <div className='flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0'>
            <div>
              <CardTitle className='text-base lg:text-lg text-slate-900'>
                Team Productivity Overview
              </CardTitle>
              <CardDescription className='text-sm text-slate-600'>
                Showing{" "}
                {filteredAndSortedUsers ? filteredAndSortedUsers.length : 0} of{" "}
                {users?.length} users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-[200px]'>User</TableHead>
                  <TableHead className='min-w-[100px]'>Department</TableHead>
                  <TableHead className='min-w-[80px]'>Status</TableHead>
                  <TableHead className='min-w-[100px]'>Today</TableHead>
                  <TableHead className='min-w-[100px]'>This Week</TableHead>
                  <TableHead className='min-w-[100px]'>This Month</TableHead>
                  <TableHead className='min-w-[120px]'>
                    Completion Rate
                  </TableHead>
                  <TableHead className='min-w-[120px]'>Productivity</TableHead>
                  <TableHead className='text-right min-w-[80px]'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers &&
                  filteredAndSortedUsers.map((user) => (
                    <TableRow
                      key={user.user_id}
                      className='hover:bg-slate-50/50'
                    >
                      <TableCell className='min-w-[200px]'>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='h-8 w-8 lg:h-10 lg:w-10'>
                            <AvatarImage
                              src={user.user_photo || "/placeholder.svg"}
                            />
                            <AvatarFallback className='text-xs lg:text-sm'>
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0'>
                            <div className='font-medium text-sm lg:text-base truncate'>
                              {user.username}
                            </div>
                            <div className='text-xs lg:text-sm text-muted-foreground truncate'>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[100px]'>
                        <Badge variant='outline' className='text-xs'>
                          {user.department}
                        </Badge>
                      </TableCell>
                      <TableCell className='min-w-[80px]'>
                        <Badge
                          variant={user.is_active ? "default" : "destructive"}
                          className={`text-xs ${
                            user.is_active
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className='min-w-[100px]'>
                        <div className='flex items-center space-x-2'>
                          <CheckCircle className='h-4 w-4 text-emerald-500' />
                          <span className='font-medium text-sm lg:text-base'>
                            {user.tasks_completed_today}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[100px]'>
                        <div className='font-medium text-sm lg:text-base'>
                          {user.tasks_completed_week}
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[100px]'>
                        <div className='font-medium text-sm lg:text-base'>
                          {user.tasks_completed_month}
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[120px]'>
                        <div className='space-y-1'>
                          <div className='flex items-center justify-between'>
                            <span className='text-xs font-medium'>
                              {user.completion_percentage}%
                            </span>
                          </div>
                          <Progress
                            value={user.completion_percentage}
                            className='h-2'
                          />
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[120px]'>
                        {getProductivityBadge(user.productivity_score)}
                      </TableCell>
                      <TableCell className='text-right min-w-[80px]'>
                        <Link href={`/admin/users/${user.user_id}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='hover:bg-blue-50 cursor-pointer'
                          >
                            <Eye className='h-4 w-4 mr-1' />
                            View Tasks
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
