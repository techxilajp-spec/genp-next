"use client"

import { useState } from "react"
import { Plus, Search, Calendar, Clock, MoreHorizontal, Edit, Trash2, CheckCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const mockTasks = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete the new website design and implement responsive layout",
    user_id: "1",
    username: "john_doe",
    category_id: 1,
    category_name: "Development",
    start_time: "2024-01-20T09:00:00",
    end_time: "2024-01-20T17:00:00",
    created_at: "2024-01-19T10:00:00",
    status: "completed"
  },
  {
    id: 2,
    title: "Team Meeting",
    description: "Weekly team sync and project updates",
    user_id: "2",
    username: "jane_smith",
    category_id: 2,
    category_name: "Meeting",
    start_time: "2024-01-21T14:00:00",
    end_time: "2024-01-21T15:00:00",
    created_at: "2024-01-20T08:00:00",
    status: "scheduled"
  },
  {
    id: 3,
    title: "Database Optimization",
    description: "Optimize database queries and improve performance",
    user_id: "1",
    username: "john_doe",
    category_id: 1,
    category_name: "Development",
    start_time: "2024-01-19T10:00:00",
    end_time: "2024-01-19T16:00:00",
    created_at: "2024-01-18T09:00:00",
    status: "in_progress"
  }
]

const mockCategories = [
  { id: 1, name: "Development" },
  { id: 2, name: "Meeting" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Design" }
]

export function TasksSection() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">In Progress</Badge>
      case 'scheduled':
        return <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">Scheduled</Badge>
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Tasks</h1>
          <p className="text-sm lg:text-base text-slate-600">Track and manage team tasks and activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to track team activities</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_time" className="text-right">Start Time</Label>
                <Input id="start_time" type="datetime-local" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_time" className="text-right">End Time</Label>
                <Input id="end_time" type="datetime-local" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Tasks</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Completed</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">In Progress</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-slate-100">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <CardTitle className="text-base lg:text-lg text-slate-900">All Tasks</CardTitle>
              <CardDescription className="text-sm text-slate-600">Manage and track team tasks</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search tasks..."
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
                  <TableHead className="min-w-[200px]">Task</TableHead>
                  <TableHead className="min-w-[100px]">Assignee</TableHead>
                  <TableHead className="min-w-[100px]">Category</TableHead>
                  <TableHead className="min-w-[150px]">Schedule</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="min-w-[200px]">
                      <div>
                        <div className="font-medium text-sm lg:text-base">{task.title}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="text-xs lg:text-sm">{task.username}</div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Badge variant="outline" className="text-xs">{task.category_name}</Badge>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="text-xs lg:text-sm">
                        <div>{new Date(task.start_time).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {new Date(task.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {task.end_time && new Date(task.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell className="text-right min-w-[80px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
  )
}
