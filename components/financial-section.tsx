"use client"

import { useState } from "react"
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

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
const mockFinancialRecords = [
  {
    id: 1,
    type: "income",
    amount: 25000,
    description: "Client project payment",
    category_id: 1,
    category_name: "Revenue",
    recorded_at: "2024-01-20",
    created_by: "1",
    created_by_name: "john_doe"
  },
  {
    id: 2,
    type: "outcome",
    amount: 5000,
    description: "Office rent payment",
    category_id: 2,
    category_name: "Office Expenses",
    recorded_at: "2024-01-15",
    created_by: "1",
    created_by_name: "john_doe"
  },
  {
    id: 3,
    type: "income",
    amount: 15000,
    description: "Consulting services",
    category_id: 1,
    category_name: "Revenue",
    recorded_at: "2024-01-18",
    created_by: "2",
    created_by_name: "jane_smith"
  },
  {
    id: 4,
    type: "outcome",
    amount: 2500,
    description: "Software licenses",
    category_id: 3,
    category_name: "Technology",
    recorded_at: "2024-01-16",
    created_by: "1",
    created_by_name: "john_doe"
  }
]

const mockFinancialCategories = [
  { id: 1, name: "Revenue" },
  { id: 2, name: "Office Expenses" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "Travel" }
]

export function FinancialSection() {
  const [records, setRecords] = useState(mockFinancialRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredRecords = records.filter(record =>
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0)
  const totalOutcome = records.filter(r => r.type === 'outcome').reduce((sum, r) => sum + r.amount, 0)
  const netProfit = totalIncome - totalOutcome

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Financial Records</h1>
          <p className="text-sm lg:text-base text-slate-600">Track startup income and expenses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Add Financial Record</DialogTitle>
              <DialogDescription>Record a new income or expense transaction</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="outcome">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" type="number" className="col-span-3" />
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
                    {mockFinancialCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recorded_at" className="text-right">Date</Label>
                <Input id="recorded_at" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Income</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-emerald-600">${totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Expenses</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-red-600">${totalOutcome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Net Profit</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-xl lg:text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <CardTitle className="text-base lg:text-lg">Financial Transactions</CardTitle>
              <CardDescription className="text-sm">All income and expense records</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">Category</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Created By</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="min-w-[100px]">
                      <Badge variant={record.type === 'income' ? 'default' : 'destructive'} className={`text-xs ${record.type === 'income' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0' : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0'}`}>
                        {record.type === 'income' ? (
                          <>
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Income
                          </>
                        ) : (
                          <>
                            <TrendingDown className="mr-1 h-3 w-3" />
                            Expense
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <div className="font-medium text-sm lg:text-base">{record.description}</div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Badge variant="outline" className="text-xs">{record.category_name}</Badge>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className={`font-medium text-sm lg:text-base ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        ${record.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="text-xs lg:text-sm">
                        {new Date(record.recorded_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="text-xs lg:text-sm">{record.created_by_name}</div>
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
    </div>
  )
}
