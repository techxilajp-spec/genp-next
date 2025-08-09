"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Building2, DollarSign, TrendingUp, MapPin, Phone, Mail, Calendar } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from '@/lib/i18n'

// Mock data
const mockDepartments = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development and technical operations",
    code: "ENG",
    manager_id: "user1",
    manager_name: "John Smith",
    employee_count: 25,
    budget: 500000,
    level: "operational",
    location: "Floor 3, Building A",
    phone: "+81-3-1234-5678",
    email: "engineering@startup.com",
    established_date: "2020-01-01",
    is_active: true,
    status: "active",
    performance: {
      completion_rate: 87,
      productivity_score: 92,
      efficiency_rating: 89
    }
  },
  {
    id: "2",
    name: "Marketing",
    description: "Marketing, sales, and customer acquisition",
    code: "MKT",
    manager_id: "user2",
    manager_name: "Sarah Johnson",
    employee_count: 12,
    budget: 300000,
    level: "operational",
    location: "Floor 2, Building A",
    phone: "+81-3-1234-5679",
    email: "marketing@startup.com",
    established_date: "2020-02-01",
    is_active: true,
    status: "active",
    performance: {
      completion_rate: 94,
      productivity_score: 88,
      efficiency_rating: 91
    }
  },
  {
    id: "3",
    name: "Human Resources",
    description: "People operations and talent management",
    code: "HR",
    manager_id: "user3",
    manager_name: "Mike Wilson",
    employee_count: 8,
    budget: 150000,
    level: "support",
    location: "Floor 1, Building A",
    phone: "+81-3-1234-5680",
    email: "hr@startup.com",
    established_date: "2020-01-15",
    is_active: true,
    status: "active",
    performance: {
      completion_rate: 91,
      productivity_score: 85,
      efficiency_rating: 88
    }
  },
  {
    id: "4",
    name: "Finance",
    description: "Financial planning and accounting",
    code: "FIN",
    manager_id: "user4",
    manager_name: "Lisa Chen",
    employee_count: 6,
    budget: 200000,
    level: "management",
    location: "Floor 1, Building B",
    phone: "+81-3-1234-5681",
    email: "finance@startup.com",
    established_date: "2020-01-10",
    is_active: true,
    status: "active",
    performance: {
      completion_rate: 96,
      productivity_score: 94,
      efficiency_rating: 95
    }
  }
]

const mockUsers = [
  { id: "user1", name: "John Smith", email: "john@startup.com" },
  { id: "user2", name: "Sarah Johnson", email: "sarah@startup.com" },
  { id: "user3", name: "Mike Wilson", email: "mike@startup.com" },
  { id: "user4", name: "Lisa Chen", email: "lisa@startup.com" },
  { id: "user5", name: "David Brown", email: "david@startup.com" },
]

export function DepartmentsSection() {
  const { t } = useI18n()
  const [departments, setDepartments] = useState(mockDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employee_count, 0)
  const averageSize = Math.round(totalEmployees / departments.length)
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0)

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'executive':
        return <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">{t.departments.executiveLevel}</Badge>
      case 'management':
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">{t.departments.managementLevel}</Badge>
      case 'operational':
        return <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">{t.departments.operationalLevel}</Badge>
      case 'support':
        return <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">{t.departments.supportLevel}</Badge>
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">{t.common.active}</Badge>
      case 'inactive':
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">{t.common.inactive}</Badge>
      case 'restructuring':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">Restructuring</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              {t.departments.title}
            </h1>
            <p className="text-sm lg:text-base text-slate-600">{t.departments.subtitle}</p>
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
                <DialogDescription>Create a new department for your organization</DialogDescription>
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
                  <Label htmlFor="description">{t.departments.description}</Label>
                  <Textarea id="description" placeholder="Department description" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager">{t.departments.manager}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t.departments.selectManager} />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
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
                        <SelectItem value="executive">{t.departments.executiveLevel}</SelectItem>
                        <SelectItem value="management">{t.departments.managementLevel}</SelectItem>
                        <SelectItem value="operational">{t.departments.operationalLevel}</SelectItem>
                        <SelectItem value="support">{t.departments.supportLevel}</SelectItem>
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
                    <Input id="email" type="email" placeholder="dept@startup.com" />
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
              <CardTitle className="text-sm font-medium text-slate-700">{t.departments.totalDepartments}</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{departments.length}</div>
              <p className="text-xs text-slate-600">Active departments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">{t.departments.totalEmployees}</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalEmployees}</div>
              <p className="text-xs text-slate-600">Across all departments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">{t.departments.averageSize}</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{averageSize}</div>
              <p className="text-xs text-slate-600">Employees per department</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalBudget)}</div>
              <p className="text-xs text-slate-600">Annual budget allocation</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div>
                <CardTitle className="text-base lg:text-lg text-slate-900">{t.departments.departmentList}</CardTitle>
                <CardDescription className="text-sm text-slate-600">Manage your organization&apos;s departments</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="min-w-[200px]">
                        <div>
                          <div className="font-medium text-sm lg:text-base flex items-center space-x-2">
                            <span>{department.name}</span>
                            <Badge variant="outline" className="text-xs">{department.code}</Badge>
                          </div>
                          <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{department.description}</div>
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
                            <AvatarFallback className="text-xs">{department.manager_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-xs lg:text-sm font-medium truncate">{department.manager_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-slate-500" />
                          <span className="text-xs lg:text-sm font-medium">{department.employee_count}</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        {getLevelBadge(department.level)}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="text-xs lg:text-sm font-medium">{formatCurrency(department.budget)}</div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="text-slate-500">Completion:</span>
                            <span className="ml-1 font-medium">{department.performance.completion_rate}%</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">Productivity:</span>
                            <span className="ml-1 font-medium">{department.performance.productivity_score}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        {getStatusBadge(department.status)}
                      </TableCell>
                      <TableCell className="text-right min-w-[80px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedDepartment(department)
                              setIsEditDialogOpen(true)
                            }}>
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
                </TableBody>
              </Table>
            </div>
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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{t.departments.departmentName}</Label>
                  <Input id="edit-name" defaultValue={selectedDepartment.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Code</Label>
                  <Input id="edit-code" defaultValue={selectedDepartment.code} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t.departments.description}</Label>
                <Textarea id="edit-description" defaultValue={selectedDepartment.description} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-manager">{t.departments.manager}</Label>
                  <Select defaultValue={selectedDepartment.manager_id}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Level</Label>
                  <Select defaultValue={selectedDepartment.level}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">{t.departments.executiveLevel}</SelectItem>
                      <SelectItem value="management">{t.departments.managementLevel}</SelectItem>
                      <SelectItem value="operational">{t.departments.operationalLevel}</SelectItem>
                      <SelectItem value="support">{t.departments.supportLevel}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">{t.departments.budget}</Label>
                  <Input id="edit-budget" type="number" defaultValue={selectedDepartment.budget} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">{t.departments.location}</Label>
                  <Input id="edit-location" defaultValue={selectedDepartment.location} />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">{t.departments.phone}</Label>
                  <Input id="edit-phone" defaultValue={selectedDepartment.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">{t.departments.email}</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedDepartment.email} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
