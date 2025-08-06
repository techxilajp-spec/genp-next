"use client"

import { useState } from "react"
import { Plus, Search, Tag, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const mockTaskCategories = [
  { id: 1, name: "Development", task_count: 15 },
  { id: 2, name: "Meeting", task_count: 8 },
  { id: 3, name: "Marketing", task_count: 5 },
  { id: 4, name: "Design", task_count: 12 }
]

const mockFinancialCategories = [
  { id: 1, name: "Revenue", record_count: 25 },
  { id: 2, name: "Office Expenses", record_count: 18 },
  { id: 3, name: "Technology", record_count: 12 },
  { id: 4, name: "Marketing", record_count: 8 },
  { id: 5, name: "Travel", record_count: 3 }
]

export function CategoriesSection() {
  const [taskCategories, setTaskCategories] = useState(mockTaskCategories)
  const [financialCategories, setFinancialCategories] = useState(mockFinancialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTaskCategoryOpen, setIsAddTaskCategoryOpen] = useState(false)
  const [isAddFinancialCategoryOpen, setIsAddFinancialCategoryOpen] = useState(false)

  const filteredTaskCategories = taskCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFinancialCategories = financialCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Categories</h1>
          <p className="text-sm lg:text-base text-slate-600">Manage task and financial categories</p>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-64"
          />
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Task Categories</TabsTrigger>
          <TabsTrigger value="financial">Financial Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h2 className="text-lg lg:text-xl font-semibold">Task Categories</h2>
              <p className="text-xs lg:text-sm text-muted-foreground">Categories for organizing tasks and activities</p>
            </div>
            <Dialog open={isAddTaskCategoryOpen} onOpenChange={setIsAddTaskCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task Category
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Add Task Category</DialogTitle>
                  <DialogDescription>Create a new category for organizing tasks</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-category-name" className="text-right">Name</Label>
                    <Input id="task-category-name" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Task Categories</CardTitle>
              <CardDescription>Categories used for organizing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Category Name</TableHead>
                      <TableHead className="min-w-[120px]">Tasks Count</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTaskCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm lg:text-base">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0">{category.task_count} tasks</Badge>
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
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h2 className="text-lg lg:text-xl font-semibold">Financial Categories</h2>
              <p className="text-xs lg:text-sm text-muted-foreground">Categories for organizing income and expenses</p>
            </div>
            <Dialog open={isAddFinancialCategoryOpen} onOpenChange={setIsAddFinancialCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Financial Category
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Add Financial Category</DialogTitle>
                  <DialogDescription>Create a new category for organizing financial records</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="financial-category-name" className="text-right">Name</Label>
                    <Input id="financial-category-name" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Financial Categories</CardTitle>
              <CardDescription>Categories used for organizing financial records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Category Name</TableHead>
                      <TableHead className="min-w-[120px]">Records Count</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFinancialCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm lg:text-base">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0">{category.record_count} records</Badge>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
