"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, CheckCircle, Tag, TrendingUp, Award } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedFilters, FilterState } from "@/components/advanced-filters"

interface UserTaskDetailsProps {
  userId: string
}

// Mock user data
const mockUser = {
  user_id: "1",
  username: "john_doe",
  email: "john@startup.com",
  user_photo: "/placeholder.svg?height=40&width=40",
  tasks_completed_today: 8,
  tasks_completed_week: 35,
  tasks_completed_month: 142,
  avg_completion_rate: 87,
  productivity_score: 92
}

// Mock detailed tasks data
const mockUserTasks = [
  {
    id: 1,
    title: "Code Review - Authentication Module",
    description: "Reviewed and approved authentication system implementation",
    category: "Development",
    completed_at: "2024-01-20T14:30:00",
    duration_minutes: 45,
    priority: "high",
    difficulty: "medium",
    status: "completed"
  },
  {
    id: 2,
    title: "Database Schema Update",
    description: "Updated user table schema to include new fields",
    category: "Development",
    completed_at: "2024-01-20T11:15:00",
    duration_minutes: 90,
    priority: "high",
    difficulty: "high",
    status: "completed"
  },
  {
    id: 3,
    title: "Team Standup Meeting",
    description: "Daily standup meeting with development team",
    category: "Meeting",
    completed_at: "2024-01-20T09:00:00",
    duration_minutes: 15,
    priority: "medium",
    difficulty: "low",
    status: "completed"
  },
  {
    id: 4,
    title: "Bug Fix - Login Issue",
    description: "Fixed critical login bug affecting mobile users",
    category: "Development",
    completed_at: "2024-01-19T16:45:00",
    duration_minutes: 120,
    priority: "critical",
    difficulty: "high",
    status: "completed"
  },
  {
    id: 5,
    title: "Documentation Update",
    description: "Updated API documentation for new endpoints",
    category: "Documentation",
    completed_at: "2024-01-19T13:20:00",
    duration_minutes: 60,
    priority: "medium",
    difficulty: "low",
    status: "completed"
  },
  {
    id: 6,
    title: "UI Component Testing",
    description: "Comprehensive testing of new UI components",
    category: "Testing",
    completed_at: "2024-01-18T15:30:00",
    duration_minutes: 75,
    priority: "high",
    difficulty: "medium",
    status: "completed"
  },
  {
    id: 7,
    title: "Performance Optimization",
    description: "Optimized database queries for better performance",
    category: "Development",
    completed_at: "2024-01-17T10:20:00",
    duration_minutes: 180,
    priority: "critical",
    difficulty: "high",
    status: "completed"
  }
]

export function UserTaskDetails({ userId }: UserTaskDetailsProps) {
  const [user] = useState(mockUser)
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { from: undefined, to: undefined },
    sortBy: 'completed_at',
    sortOrder: 'desc' as const,
    status: [],
    priority: [],
    category: [],
    user: []
  })

  const filterOptions = {
    sortOptions: [
      { value: 'completed_at', label: 'Completion Date' },
      { value: 'title', label: 'Task Title' },
      { value: 'duration_minutes', label: 'Duration' },
      { value: 'priority', label: 'Priority' },
      { value: 'difficulty', label: 'Difficulty' },
      { value: 'category', label: 'Category' }
    ],
    priorityOptions: [
      { value: 'critical', label: 'Critical', count: mockUserTasks.filter(t => t.priority === 'critical').length },
      { value: 'high', label: 'High', count: mockUserTasks.filter(t => t.priority === 'high').length },
      { value: 'medium', label: 'Medium', count: mockUserTasks.filter(t => t.priority === 'medium').length },
      { value: 'low', label: 'Low', count: mockUserTasks.filter(t => t.priority === 'low').length }
    ],
    categoryOptions: [
      { value: 'Development', label: 'Development', count: mockUserTasks.filter(t => t.category === 'Development').length },
      { value: 'Meeting', label: 'Meeting', count: mockUserTasks.filter(t => t.category === 'Meeting').length },
      { value: 'Documentation', label: 'Documentation', count: mockUserTasks.filter(t => t.category === 'Documentation').length },
      { value: 'Testing', label: 'Testing', count: mockUserTasks.filter(t => t.category === 'Testing').length }
    ]
  }

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = mockUserTasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!task.title.toLowerCase().includes(searchLower) && 
            !task.description.toLowerCase().includes(searchLower) &&
            !task.category.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Priority filter
      if (filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false
      }

      // Category filter
      if (filters.category.length > 0) {
        if (!filters.category.includes(task.category)) return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const taskDate = new Date(task.completed_at)
        if (filters.dateRange.from && taskDate < filters.dateRange.from) return false
        if (filters.dateRange.to && taskDate > filters.dateRange.to) return false
      }

      // Tab-specific filtering
      if (activeTab === 'today') {
        const taskDate = new Date(task.completed_at)
        const today = new Date()
        if (taskDate.toDateString() !== today.toDateString()) return false
      } else if (activeTab === 'week') {
        const taskDate = new Date(task.completed_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        if (taskDate < weekAgo) return false
      }

      return true
    })

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a]
        let bValue = b[filters.sortBy as keyof typeof b]

        // Handle date sorting
        if (filters.sortBy === 'completed_at') {
          aValue = new Date(aValue as string).getTime()
          bValue = new Date(bValue as string).getTime()
        }

        // Handle priority sorting
        if (filters.sortBy === 'priority') {
          const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 }
          aValue = priorityOrder[aValue as keyof typeof priorityOrder]
          bValue = priorityOrder[bValue as keyof typeof priorityOrder]
        }

        // Handle difficulty sorting
        if (filters.sortBy === 'difficulty') {
          const difficultyOrder = { 'high': 3, 'medium': 2, 'low': 1 }
          aValue = difficultyOrder[aValue as keyof typeof difficultyOrder]
          bValue = difficultyOrder[bValue as keyof typeof difficultyOrder]
        }

        // Handle string sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (filters.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    return filtered
  }, [filters, activeTab])

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">Critical</Badge>
      case 'high':
        return <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">High</Badge>
      case 'medium':
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">Medium</Badge>
      case 'low':
        return <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">Low</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Hard</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>
      case 'low':
        return <Badge variant="outline" className="text-xs">Easy</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>
    }
  }

  const todayTasks = filteredAndSortedTasks.filter(task => 
    new Date(task.completed_at).toDateString() === new Date().toDateString()
  )

  const weekTasks = filteredAndSortedTasks.filter(task => {
    const taskDate = new Date(task.completed_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return taskDate >= weekAgo
  })

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link href="/users">
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
              <AvatarImage src={user.user_photo || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl lg:text-2xl text-slate-900">{user.username}</CardTitle>
              <CardDescription className="text-slate-600">{user.email}</CardDescription>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">Productivity Score: {user.productivity_score}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Completion Rate: {user.avg_completion_rate}%</span>
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
            <CardTitle className="text-sm font-medium text-slate-700">Today&apos;s Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{todayTasks.length}</div>
            <p className="text-xs text-slate-600">Completed today</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">This Week&apos;s Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{weekTasks.length}</div>
            <p className="text-xs text-slate-600">Weekly total</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">All Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{filteredAndSortedTasks.length}</div>
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
          user: false
        }}
        placeholder="Search tasks by title, description, or category..."
      />

      {/* Task Details */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks ({filteredAndSortedTasks.length})</TabsTrigger>
          <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
          <TabsTrigger value="week">This Week ({weekTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">All Completed Tasks</CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Showing {filteredAndSortedTasks.length} of {mockUserTasks.length} tasks
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
                            <div className="font-medium text-sm lg:text-base">{task.title}</div>
                            <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {task.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {getPriorityBadge(task.priority)}
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          {getDifficultyBadge(task.difficulty)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs lg:text-sm">{task.duration_minutes}m</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="text-xs lg:text-sm">
                            <div>{new Date(task.completed_at).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <CardTitle className="text-base lg:text-lg text-slate-900">Today&apos;s Completed Tasks</CardTitle>
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
                            <div className="font-medium text-sm lg:text-base">{task.title}</div>
                            <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {task.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {getPriorityBadge(task.priority)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs lg:text-sm">{task.duration_minutes}m</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="text-xs lg:text-sm">
                            {new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <CardTitle className="text-base lg:text-lg text-slate-900">This Week&apos;s Tasks</CardTitle>
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
                            <div className="font-medium text-sm lg:text-base">{task.title}</div>
                            <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {task.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {getPriorityBadge(task.priority)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs lg:text-sm">{task.duration_minutes}m</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="text-xs lg:text-sm">
                            <div>{new Date(task.completed_at).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
  )
}
