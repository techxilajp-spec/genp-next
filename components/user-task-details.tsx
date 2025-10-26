"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Tag,
  TrendingUp,
  Award,
} from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedFilters, FilterState } from "@/components/advanced-filters";
import {
  useUserTasksDetail,
  useUserTasksData,
  useUserProductivity,
} from "@/hooks/admin/users";

interface UserTaskDetailsProps {
  userId: string;
}

// ---- Types & utils ----
type Task = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  priority?: "critical" | "high" | "medium" | "low" | string | null;
  difficulty?: "high" | "medium" | "low" | string | null;
  duration_minutes?: number | null;
  completed_at: string; // ISO string
  productivityScore?: number;
  completionRate?: number;
};

const text = (v: unknown) => (typeof v === "string" ? v : "") as string;
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export function UserTaskDetails({ userId }: UserTaskDetailsProps) {
  const {
    data: userTasksDetailData,
    error: userTasksDetailError,
    isError: userTasksDetailIsError,
    isLoading: userTasksDetailLoading,
  } = useUserTasksDetail(userId ?? "");

  const tasks: Task[] = useMemo(() => {
    const arr = Array.isArray(userTasksDetailData)
      ? userTasksDetailData
      : (userTasksDetailData as any)?.data ?? [];

    return arr.map(
      (t: any): Task => ({
        id: String(t.id),
        title: t.title ?? null,
        description: t.description ?? null,
        category: t.category ?? null,
        priority: t.priority ?? null,
        difficulty: t.difficulty ?? null,
        duration_minutes: t.duration_minutes ?? null,
        completed_at:
          typeof t.completed_at === "string"
            ? t.completed_at
            : new Date(t.completed_at).toISOString(),
      })
    );
  }, [userTasksDetailData]);

  const { data: userTotalsData } = useUserTasksData(userId ?? "");

  const { data: allUsers } = useUserProductivity();
  const [activeTab, setActiveTab] = useState<"all" | "today" | "week">("all");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateRange: { from: undefined, to: undefined },
    sortBy: "completed_at",
    sortOrder: "desc" as const,
    status: [],
    priority: [],
    category: [],
    user: [],
  });
  const userFromAll = useMemo(
    () => (allUsers ?? []).find((u: any) => u.user_id === userId),
    [allUsers, userId]
  );

  const userFromTotals =
    (userTotalsData as any)?.data?.[0] ?? (userTotalsData as any)?.data ?? null;

  const headerUser = {
    username: userFromAll?.username ?? userFromTotals?.username ?? "—",
    email: userFromAll?.email ?? userFromTotals?.email ?? "—",
    user_photo:
      userFromAll?.user_photo ??
      userFromTotals?.user_photo ??
      "/placeholder.svg?height=40&width=40",
  };

  const priorityFallbackOrder = ["critical", "high", "medium", "low"] as const;

  const prioritiesInData = useMemo(
    () =>
      Array.from(new Set(tasks.map((t) => text(t.priority)).filter(Boolean))),
    [tasks]
  );

  const categoriesInData = useMemo(
    () =>
      Array.from(new Set(tasks.map((t) => text(t.category)).filter(Boolean))),
    [tasks]
  );

  const filterOptions = useMemo(
    () => ({
      sortOptions: [
        { value: "completed_at", label: "Completion Date" },
        { value: "title", label: "Task Title" },
        { value: "duration_minutes", label: "Duration" },
        { value: "priority", label: "Priority" },
        { value: "difficulty", label: "Difficulty" },
        { value: "category", label: "Category" },
      ],
      priorityOptions: (prioritiesInData.length
        ? prioritiesInData
        : priorityFallbackOrder
      ).map((p) => ({
        value: p,
        label: p.charAt(0).toUpperCase() + p.slice(1),
        count: tasks.filter((t) => text(t.priority) === p).length,
      })),
      categoryOptions: categoriesInData.map((c) => ({
        value: c,
        label: c,
        count: tasks.filter((t) => text(t.category) === c).length,
      })),
    }),
    [tasks, prioritiesInData, categoriesInData]
  );

  const filteredAndSortedTasks = useMemo(() => {
    const now = new Date();

    const filtered = tasks.filter((task) => {
      const title = text(task.title);
      const desc = text(task.description);
      const cat = text(task.category);
      const prio = text(task.priority);
      const diff = text(task.difficulty);

      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !title.toLowerCase().includes(q) &&
          !desc.toLowerCase().includes(q) &&
          !cat.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(prio)) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(cat)) {
        return false;
      }

      // Date range (inclusive end)
      const taskDate = new Date(task.completed_at);
      if (
        filters.dateRange.from &&
        taskDate < new Date(filters.dateRange.from)
      ) {
        return false;
      }
      if (
        filters.dateRange.to &&
        taskDate > endOfDay(new Date(filters.dateRange.to))
      ) {
        return false;
      }

      if (activeTab === "today") {
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const end = endOfDay(now);
        if (taskDate < start || taskDate > end) return false;
      } else if (activeTab === "week") {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        const end = endOfDay(now);
        if (taskDate < start || taskDate > end) return false;
      }

      void diff;

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const by = filters.sortBy;

      const num = (v: unknown) => (typeof v === "number" ? v : Number(v ?? 0));
      const str = (v: unknown) => text(v).toLowerCase();

      let av: number | string = 0;
      let bv: number | string = 0;

      if (by === "completed_at") {
        av = new Date(a.completed_at).getTime();
        bv = new Date(b.completed_at).getTime();
      } else if (by === "duration_minutes") {
        av = num(a.duration_minutes ?? 0);
        bv = num(b.duration_minutes ?? 0);
      } else if (by === "priority") {
        const order: Record<string, number> = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        av = order[text(a.priority)] ?? 0;
        bv = order[text(b.priority)] ?? 0;
      } else if (by === "difficulty") {
        const order: Record<string, number> = { high: 3, medium: 2, low: 1 };
        av = order[text(a.difficulty)] ?? 0;
        bv = order[text(b.difficulty)] ?? 0;
      } else if (by === "title") {
        av = str(a.title);
        bv = str(b.title);
      } else if (by === "category") {
        av = str(a.category);
        bv = str(b.category);
      }

      const cmp =
        typeof av === "string" && typeof bv === "string"
          ? av < bv
            ? -1
            : av > bv
            ? 1
            : 0
          : (av as number) - (bv as number);

      return filters.sortOrder === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [tasks, filters, activeTab]);

  const todayTasks = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = endOfDay(now);
    return filteredAndSortedTasks.filter((t) => {
      const d = new Date(t.completed_at);
      return d >= start && d <= end;
    });
  }, [filteredAndSortedTasks]);

  const weekTasks = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    const end = endOfDay(now);
    return filteredAndSortedTasks.filter((t) => {
      const d = new Date(t.completed_at);
      return d >= start && d <= end;
    });
  }, [filteredAndSortedTasks]);
  const userTotals =
    (userTotalsData as any)?.data?.[0] ?? (userTotalsData as any)?.data ?? null;

  const totalTasksForUser = Number(
    userTotals?.total_tasks ?? tasks.length ?? 0
  );

  const completedTasksForUser = Number(
    userTotals?.completed_tasks ?? tasks.length ?? 0
  );

  // Loading / Error states
  if (userTasksDetailLoading) return <div>Loading...</div>;
  if (userTasksDetailIsError)
    return <div>Error: {userTasksDetailError?.message}</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      {/* User Profile Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={headerUser.user_photo || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {headerUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl lg:text-2xl text-slate-900">
                {headerUser.username}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {headerUser.email}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Productivity Score: {userTotals?.productivityScore ?? "-"}%
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Completion Rate: {userTotals?.completionRate ?? "-"}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Today&apos;s Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {todayTasks.length}
            </div>
            <p className="text-xs text-slate-600">Completed today</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              This Week&apos;s Tasks
            </CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {weekTasks.length}
            </div>
            <p className="text-xs text-slate-600">Weekly total</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              All Tasks
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {filteredAndSortedTasks.length}
            </div>
            <p className="text-xs text-slate-600">Total filtered</p>
          </CardContent>
        </Card>
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
          status: false,
          priority: true,
          category: true,
          user: false,
        }}
        placeholder="Search tasks by title, description, or category..."
      />

      {/* Task Details */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">
            All Tasks ({filteredAndSortedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
          <TabsTrigger value="week">This Week ({weekTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">
                All Completed Tasks
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Task</TableHead>
                      <TableHead className="min-w-[100px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Priority</TableHead>
                      <TableHead className="min-w-[80px]">Difficulty</TableHead>
                      <TableHead className="min-w-[100px]">Duration</TableHead>
                      <TableHead className="min-w-[150px]">Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="min-w-[250px]">
                          <div>
                            <div className="font-medium text-sm lg:text-base">
                              {text(task.title)}
                            </div>
                            <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                              {text(task.description)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {text(task.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {text(task.priority)}
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          {text(task.difficulty)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs lg:text-sm">
                              {task.duration_minutes ?? 0}m
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="text-xs lg:text-sm">
                            <div>
                              {new Date(task.completed_at).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(task.completed_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">
                Today&apos;s Completed Tasks
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Tasks completed today ({todayTasks.length} tasks)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Task</TableHead>
                      <TableHead className="min-w-[100px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Priority</TableHead>
                      <TableHead className="min-w-[100px]">Duration</TableHead>
                      <TableHead className="min-w-[100px]">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="min-w-[250px]">
                          <div>
                            <div className="font-medium text-sm lg:text-base">
                              {text(task.title)}
                            </div>
                            <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                              {text(task.description)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {text(task.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {text(task.priority)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs lg:text-sm">
                              {task.duration_minutes ?? 0}m
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="text-xs lg:text-sm">
                            {new Date(task.completed_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">
                This Week&apos;s Tasks
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Tasks completed in the last 7 days ({weekTasks.length} tasks)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Task</TableHead>
                      <TableHead className="min-w-[100px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Priority</TableHead>
                      <TableHead className="min-w-[100px]">Duration</TableHead>
                      <TableHead className="min-w-[150px]">Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="min-w-[250px]">
                          <div>
                            <div className="font-medium text-sm lg:text-base">
                              {text(task.title)}
                            </div>
                            <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                              {text(task.description)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {text(task.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {text(task.priority)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs lg:text-sm">
                              {task.duration_minutes ?? 0}m
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="text-xs lg:text-sm">
                            <div>
                              {new Date(task.completed_at).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(task.completed_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
