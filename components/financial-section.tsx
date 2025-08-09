"use client"

import { useState, useMemo } from "react"
import { TrendingUp, TrendingDown, DollarSign, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdvancedFilters, FilterState } from "@/components/advanced-filters"

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
  },
  {
    id: 5,
    type: "income",
    amount: 8000,
    description: "Product sales",
    category_id: 1,
    category_name: "Revenue",
    recorded_at: "2024-01-12",
    created_by: "3",
    created_by_name: "alice_brown"
  },
  {
    id: 6,
    type: "outcome",
    amount: 1200,
    description: "Marketing campaign",
    category_id: 4,
    category_name: "Marketing",
    recorded_at: "2024-01-10",
    created_by: "2",
    created_by_name: "jane_smith"
  }
]

const mockFinancialCategories = [
  { id: 1, name: "Revenue" },
  { id: 2, name: "Office Expenses" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "Travel" }
]

const mockUsers = [
  { id: "1", name: "john_doe" },
  { id: "2", name: "jane_smith" },
  { id: "3", name: "alice_brown" }
]

export function FinancialSection() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { from: undefined, to: undefined },
    sortBy: 'recorded_at',
    sortOrder: 'desc' as const,
    status: [],
    priority: [],
    category: [],
    user: []
  })

  const filterOptions = {
    sortOptions: [
      { value: 'recorded_at', label: 'Date' },
      { value: 'amount', label: 'Amount' },
      { value: 'description', label: 'Description' },
      { value: 'type', label: 'Type' },
      { value: 'category_name', label: 'Category' },
      { value: 'created_by_name', label: 'Created By' }
    ],
    statusOptions: [
      { value: 'income', label: 'Income', count: mockFinancialRecords.filter(r => r.type === 'income').length },
      { value: 'outcome', label: 'Expense', count: mockFinancialRecords.filter(r => r.type === 'outcome').length }
    ],
    categoryOptions: mockFinancialCategories.map(cat => ({
      value: cat.name,
      label: cat.name,
      count: mockFinancialRecords.filter(r => r.category_name === cat.name).length
    })),
    userOptions: mockUsers.map(user => ({
      value: user.name,
      label: user.name,
      count: mockFinancialRecords.filter(r => r.created_by_name === user.name).length
    }))
  }

  const filteredAndSortedRecords = useMemo(() => {
    const filtered = mockFinancialRecords.filter(record => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!record.description.toLowerCase().includes(searchLower) && 
            !record.category_name.toLowerCase().includes(searchLower) &&
            !record.created_by_name.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Status (Type) filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(record.type)) return false
      }

      // Category filter
      if (filters.category.length > 0) {
        if (!filters.category.includes(record.category_name)) return false
      }

      // User filter
      if (filters.user.length > 0) {
        if (!filters.user.includes(record.created_by_name)) return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const recordDate = new Date(record.recorded_at)
        if (filters.dateRange.from && recordDate < filters.dateRange.from) return false
        if (filters.dateRange.to && recordDate > filters.dateRange.to) return false
      }

      return true
    })

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a]
        let bValue = b[filters.sortBy as keyof typeof b]

        // Handle date sorting
        if (filters.sortBy === 'recorded_at') {
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

  const totalIncome = filteredAndSortedRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0)
  const totalOutcome = filteredAndSortedRecords.filter(r => r.type === 'outcome').reduce((sum, r) => sum + r.amount, 0)
  const netProfit = totalIncome - totalOutcome

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Financial Records</h1>
          <p className="text-sm lg:text-base text-slate-600">Track startup income and expenses</p>
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
          priority: false,
          category: true,
          user: true
        }}
        placeholder="Search by description, category, or user..."
      />

      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Income</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-emerald-600">¥{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-slate-600">From {filteredAndSortedRecords.filter(r => r.type === 'income').length} records</p>
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
            <div className="text-xl lg:text-2xl font-bold text-red-600">¥{totalOutcome.toLocaleString()}</div>
            <p className="text-xs text-slate-600">From {filteredAndSortedRecords.filter(r => r.type === 'outcome').length} records</p>
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
              ¥{netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">From filtered records</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base lg:text-lg text-slate-900">Financial Transactions</CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Showing {filteredAndSortedRecords.length} of {mockFinancialRecords.length} records
          </CardDescription>
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
                {filteredAndSortedRecords.map((record) => (
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
                        ¥{record.amount.toLocaleString()}
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
