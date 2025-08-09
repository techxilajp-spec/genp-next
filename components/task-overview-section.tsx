"use client"

import { TrendingUp, Users, CheckCircle, BarChart3 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

// Mock data for charts
const dailyTaskData = [
  { day: "Mon", completed: 45, target: 50 },
  { day: "Tue", completed: 52, target: 50 },
  { day: "Wed", completed: 38, target: 50 },
  { day: "Thu", completed: 61, target: 50 },
  { day: "Fri", completed: 48, target: 50 },
  { day: "Sat", completed: 23, target: 30 },
  { day: "Sun", completed: 18, target: 25 }
]

const categoryData = [
  { name: "Development", value: 45, color: "#3b82f6" },
  { name: "Meetings", value: 25, color: "#8b5cf6" },
  { name: "Documentation", value: 15, color: "#10b981" },
  { name: "Testing", value: 10, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#ef4444" }
]

const userProductivityData = [
  { user: "Jane", tasks: 48, productivity: 96 },
  { user: "John", tasks: 35, productivity: 92 },
  { user: "Alice", tasks: 41, productivity: 91 },
  { user: "Bob", tasks: 22, productivity: 78 }
]

const weeklyTrendData = [
  { week: "Week 1", completed: 285, average: 71.25 },
  { week: "Week 2", completed: 312, average: 78 },
  { week: "Week 3", completed: 298, average: 74.5 },
  { week: "Week 4", completed: 335, average: 83.75 }
]

export function TaskOverviewSection() {
  const totalTasksCompleted = 1230
  const totalActiveUsers = 4
  const avgTasksPerUser = Math.round(totalTasksCompleted / totalActiveUsers)
  const completionRate = 87

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Task Analytics</h1>
          <p className="text-sm lg:text-base text-slate-600">Comprehensive overview of team task completion and productivity</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Total Completed</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold text-slate-900">{totalTasksCompleted.toLocaleString()}</div>
            <p className="text-xs text-slate-600">All time tasks</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Active Users</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold text-slate-900">{totalActiveUsers}</div>
            <p className="text-xs text-slate-600">Contributing users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Avg per User</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold text-slate-900">{avgTasksPerUser}</div>
            <p className="text-xs text-slate-600">Tasks per user</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Completion Rate</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold text-slate-900">{completionRate}%</div>
            <p className="text-xs text-slate-600">Overall rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily" className="cursor-pointer">Daily Tasks</TabsTrigger>
          <TabsTrigger value="categories" className="cursor-pointer">Categories</TabsTrigger>
          <TabsTrigger value="users" className="cursor-pointer">User Performance</TabsTrigger>
          <TabsTrigger value="trends" className="cursor-pointer">Weekly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg text-slate-900">Daily Task Completion</CardTitle>
              <CardDescription className="text-sm text-slate-600">Tasks completed vs targets for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: {
                    label: "Completed",
                    color: "hsl(var(--chart-1))",
                  },
                  target: {
                    label: "Target",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTaskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" />
                    <Bar dataKey="target" fill="var(--color-target)" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg text-slate-900">Task Categories Distribution</CardTitle>
              <CardDescription className="text-sm text-slate-600">Breakdown of completed tasks by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartContainer
                  config={{
                    development: { label: "Development", color: "#3b82f6" },
                    meetings: { label: "Meetings", color: "#8b5cf6" },
                    documentation: { label: "Documentation", color: "#10b981" },
                    testing: { label: "Testing", color: "#f59e0b" },
                    other: { label: "Other", color: "#ef4444" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.value}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg text-slate-900">User Performance Comparison</CardTitle>
              <CardDescription className="text-sm text-slate-600">Tasks completed and productivity scores by user</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  tasks: {
                    label: "Tasks Completed",
                    color: "hsl(var(--chart-1))",
                  },
                  productivity: {
                    label: "Productivity Score",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="tasks" fill="var(--color-tasks)" name="Tasks Completed" />
                    <Bar dataKey="productivity" fill="var(--color-productivity)" name="Productivity Score" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg text-slate-900">Weekly Task Trends</CardTitle>
              <CardDescription className="text-sm text-slate-600">Task completion trends over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: {
                    label: "Total Completed",
                    color: "hsl(var(--chart-1))",
                  },
                  average: {
                    label: "Daily Average",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="var(--color-completed)" 
                      strokeWidth={3}
                      name="Total Completed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="var(--color-average)" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Daily Average"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
