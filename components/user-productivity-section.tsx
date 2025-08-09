"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { TrendingUp, CheckCircle, Calendar, Eye } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AdvancedFilters, FilterState } from "@/components/advanced-filters"

// Mock data with productivity metrics
const mockUsers = [
  {
    user_id: "1",
    username: "john_doe",
    email: "john@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567890",
    registration_date: "2024-01-15",
    last_login: "2024-01-20",
    user_type: "member",
    is_active: true,
    tasks_completed_today: 8,
    tasks_completed_week: 35,
    tasks_completed_month: 142,
    avg_completion_rate: 87,
    productivity_score: 92,
    department: "Development"
  },
  {
    user_id: "2",
    username: "jane_smith",
    email: "jane@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567891",
    registration_date: "2024-01-16",
    last_login: "2024-01-19",
    user_type: "member",
    is_active: true,
    tasks_completed_today: 12,
    tasks_completed_week: 48,
    tasks_completed_month: 186,
    avg_completion_rate: 94,
    productivity_score: 96,
    department: "Design"
  },
  {
    user_id: "3",
    username: "bob_wilson",
    email: "bob@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567892",
    registration_date: "2024-01-10",
    last_login: "2024-01-18",
    user_type: "member",
    is_active: true,
    tasks_completed_today: 5,
    tasks_completed_week: 22,
    tasks_completed_month: 98,
    avg_completion_rate: 73,
    productivity_score: 78,
    department: "Marketing"
  },
  {
    user_id: "4",
    username: "alice_brown",
    email: "alice@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567893",
    registration_date: "2024-01-12",
    last_login: "2024-01-20",
    user_type: "admin",
    is_active: true,
    tasks_completed_today: 10,
    tasks_completed_week: 41,
    tasks_completed_month: 165,
    avg_completion_rate: 89,
    productivity_score: 91,
    department: "Management"
  },
  {
    user_id: "5",
    username: "charlie_davis",
    email: "charlie@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    phone_number: "+1234567894",
    registration_date: "2024-01-08",
    last_login: "2024-01-17",
    user_type: "member",
    is_active: false,
    tasks_completed_today: 0,
    tasks_completed_week: 8,
    tasks_completed_month: 45,
    avg_completion_rate: 45,
    productivity_score: 52,
    department: "Development"
  }
]

export function UserProductivitySection() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { from: undefined, to: undefined },
    sortBy: 'productivity_score',
    sortOrder: 'desc' as const,
    status: [],
    priority: [],
    category: [],
    user: []
  })

  const filterOptions = {
    sortOptions: [
      { value: 'username', label: 'Name' },
      { value: 'productivity_score', label: 'Productivity Score' },
      { value: 'tasks_completed_today', label: 'Tasks Today' },
      { value: 'tasks_completed_week', label: 'Tasks This Week' },
      { value: 'tasks_completed_month', label: 'Tasks This Month' },
      { value: 'avg_completion_rate', label: 'Completion Rate' },
      { value: 'last_login', label: 'Last Login' },
      { value: 'registration_date', label: 'Registration Date' }
    ],
    statusOptions: [
      { value: 'active', label: 'Active', count: mockUsers.filter(u => u.is_active).length },
      { value: 'inactive', label: 'Inactive', count: mockUsers.filter(u => !u.is_active).length }
    ],
    categoryOptions: [
      { value: 'Development', label: 'Development', count: mockUsers.filter(u => u.department === 'Development').length },
      { value: 'Design', label: 'Design', count: mockUsers.filter(u => u.department === 'Design').length },
      { value: 'Marketing', label: 'Marketing', count: mockUsers.filter(u => u.department === 'Marketing').length },
      { value: 'Management', label: 'Management', count: mockUsers.filter(u => u.department === 'Management').length }
    ],
    priorityOptions: [
      { value: 'excellent', label: 'Excellent (90%+)', count: mockUsers.filter(u => u.productivity_score >= 90).length },
      { value: 'good', label: 'Good (80-89%)', count: mockUsers.filter(u => u.productivity_score >= 80 && u.productivity_score < 90).length },
      { value: 'average', label: 'Average (70-79%)', count: mockUsers.filter(u => u.productivity_score >= 70 && u.productivity_score < 80).length },
      { value: 'needs_improvement', label: 'Needs Improvement (<70%)', count: mockUsers.filter(u => u.productivity_score < 70).length }
    ]
  }

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = mockUsers.filter(user => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!user.username.toLowerCase().includes(searchLower) && 
            !user.email.toLowerCase().includes(searchLower) &&
            !user.department.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Status filter
      if (filters.status.length > 0) {
        const userStatus = user.is_active ? 'active' : 'inactive'
        if (!filters.status.includes(userStatus)) return false
      }

      // Category (Department) filter
      if (filters.category.length > 0) {
        if (!filters.category.includes(user.department)) return false
      }

      // Priority (Productivity Level) filter
      if (filters.priority.length > 0) {
        let productivityLevel = ''
        if (user.productivity_score >= 90) productivityLevel = 'excellent'
        else if (user.productivity_score >= 80) productivityLevel = 'good'
        else if (user.productivity_score >= 70) productivityLevel = 'average'
        else productivityLevel = 'needs_improvement'
        
        if (!filters.priority.includes(productivityLevel)) return false
      }

      // Date range filter (registration date)
      if (filters.dateRange.from || filters.dateRange.to) {
        const userDate = new Date(user.registration_date)
        if (filters.dateRange.from && userDate < filters.dateRange.from) return false
        if (filters.dateRange.to && userDate > filters.dateRange.to) return false
      }

      return true
    })

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a]
        let bValue = b[filters.sortBy as keyof typeof b]

        // Handle date sorting
        if (filters.sortBy === 'last_login' || filters.sortBy === 'registration_date') {
          aValue = new Date(aValue as string).getTime()
          bValue = new Date(bValue as string).getTime()
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
  }, [filters])

  const totalTasksToday = filteredAndSortedUsers.reduce((sum, user) => sum + user.tasks_completed_today, 0)
  const totalTasksWeek = filteredAndSortedUsers.reduce((sum, user) => sum + user.tasks_completed_week, 0)
  const avgProductivityScore = filteredAndSortedUsers.length > 0 
    ? Math.round(filteredAndSortedUsers.reduce((sum, user) => sum + user.productivity_score, 0) / filteredAndSortedUsers.length)
    : 0

  const getProductivityBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">Excellent</Badge>
    if (score >= 80) return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">Good</Badge>
    if (score >= 70) return <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">Average</Badge>
    return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">Needs Improvement</Badge>
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">User Productivity</h1>
          <p className="text-sm lg:text-base text-slate-600">Monitor team productivity and task completion rates</p>
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
          user: false
        }}
        placeholder="Search users by name, email, or department..."
      />

      {/* Productivity Overview Cards */}
      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Tasks Today</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">{totalTasksToday}</div>
            <p className="text-xs text-slate-600">From {filteredAndSortedUsers.length} users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">This Week</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">{totalTasksWeek}</div>
            <p className="text-xs text-slate-600">Weekly completion total</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Avg Productivity</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">{avgProductivityScore}%</div>
            <p className="text-xs text-slate-600">Filtered users average</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <CardTitle className="text-base lg:text-lg text-slate-900">Team Productivity Overview</CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Showing {filteredAndSortedUsers.length} of {mockUsers.length} users
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
                  <TableHead className="min-w-[100px]">Department</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Today</TableHead>
                  <TableHead className="min-w-[100px]">This Week</TableHead>
                  <TableHead className="min-w-[100px]">This Month</TableHead>
                  <TableHead className="min-w-[120px]">Completion Rate</TableHead>
                  <TableHead className="min-w-[120px]">Productivity</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.user_id} className="hover:bg-slate-50/50">
                    <TableCell className="min-w-[200px]">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                          <AvatarImage src={user.user_photo || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs lg:text-sm">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium text-sm lg:text-base truncate">{user.username}</div>
                          <div className="text-xs lg:text-sm text-muted-foreground truncate">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Badge variant="outline" className="text-xs">{user.department}</Badge>
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <Badge variant={user.is_active ? 'default' : 'destructive'} className={`text-xs ${user.is_active ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium text-sm lg:text-base">{user.tasks_completed_today}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="font-medium text-sm lg:text-base">{user.tasks_completed_week}</div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="font-medium text-sm lg:text-base">{user.tasks_completed_month}</div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{user.avg_completion_rate}%</span>
                        </div>
                        <Progress value={user.avg_completion_rate} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {getProductivityBadge(user.productivity_score)}
                    </TableCell>
                    <TableCell className="text-right min-w-[80px]">
                      <Link href={`/admin/users/${user.user_id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50 cursor-pointer">
                          <Eye className="h-4 w-4 mr-1" />
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
  )
}
