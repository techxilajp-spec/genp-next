"use client"

import { useState, useMemo } from "react"
import { Plus, Search, CreditCard, Calendar, MoreHorizontal, Edit, Trash2, CheckCircle, AlertCircle, Clock, Users, JapaneseYenIcon as Yen } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvancedFilters, FilterState } from "@/components/advanced-filters"

// Mock users data
const mockUsers = [
  {
    user_id: "1",
    username: "john_doe",
    email: "john@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    is_active: true,
    monthly_payment_amount: 50000, // ¥50,000
    payment_start_date: "2024-01-01",
    payment_required: true
  },
  {
    user_id: "2",
    username: "jane_smith",
    email: "jane@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    is_active: true,
    monthly_payment_amount: 50000, // ¥50,000
    payment_start_date: "2024-01-01",
    payment_required: true
  },
  {
    user_id: "3",
    username: "bob_wilson",
    email: "bob@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    is_active: true,
    monthly_payment_amount: 50000, // ¥50,000
    payment_start_date: "2024-01-01",
    payment_required: true
  },
  {
    user_id: "4",
    username: "alice_brown",
    email: "alice@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    is_active: true,
    monthly_payment_amount: 75000, // ¥75,000 (admin rate)
    payment_start_date: "2024-01-01",
    payment_required: true
  },
  {
    user_id: "5",
    username: "charlie_davis",
    email: "charlie@startup.com",
    user_photo: "/placeholder.svg?height=40&width=40",
    is_active: false,
    monthly_payment_amount: 50000, // ¥50,000
    payment_start_date: "2024-01-01",
    payment_required: false // Inactive users don't pay
  }
]

// Mock support payments data
const mockSupportPayments = [
  {
    id: 1,
    user_id: "1",
    username: "john_doe",
    amount: 50000,
    support_month: "2024-01-01",
    paid_at: "2024-01-05T10:00:00",
    note: "Monthly contribution for January",
    status: "paid",
    payment_method: "bank_transfer"
  },
  {
    id: 2,
    user_id: "2",
    username: "jane_smith",
    amount: 50000,
    support_month: "2024-01-01",
    paid_at: "2024-01-03T14:30:00",
    note: "January support payment",
    status: "paid",
    payment_method: "credit_card"
  },
  {
    id: 3,
    user_id: "3",
    username: "bob_wilson",
    amount: 50000,
    support_month: "2024-01-01",
    paid_at: null,
    note: "Pending January payment",
    status: "pending",
    payment_method: null
  },
  {
    id: 4,
    user_id: "1",
    username: "john_doe",
    amount: 50000,
    support_month: "2024-02-01",
    paid_at: "2024-02-02T09:15:00",
    note: "February contribution",
    status: "paid",
    payment_method: "bank_transfer"
  },
  {
    id: 5,
    user_id: "4",
    username: "alice_brown",
    amount: 75000,
    support_month: "2024-01-01",
    paid_at: "2024-01-01T12:00:00",
    note: "January admin payment",
    status: "paid",
    payment_method: "bank_transfer"
  },
  {
    id: 6,
    user_id: "2",
    username: "jane_smith",
    amount: 50000,
    support_month: "2024-02-01",
    paid_at: null,
    note: "February payment pending",
    status: "overdue",
    payment_method: null
  }
]

export function SupportPaymentsSection() {
  const [payments, setPayments] = useState(mockSupportPayments)
  const [users] = useState(mockUsers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // Current month YYYY-MM
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: { from: undefined, to: undefined },
    sortBy: 'support_month',
    sortOrder: 'desc' as const,
    status: [],
    priority: [],
    category: [],
    user: []
  })

  const filterOptions = {
    sortOptions: [
      { value: 'support_month', label: 'Payment Month' },
      { value: 'paid_at', label: 'Payment Date' },
      { value: 'amount', label: 'Amount' },
      { value: 'username', label: 'User Name' },
      { value: 'status', label: 'Status' }
    ],
    statusOptions: [
      { value: 'paid', label: 'Paid', count: payments.filter(p => p.status === 'paid').length },
      { value: 'pending', label: 'Pending', count: payments.filter(p => p.status === 'pending').length },
      { value: 'overdue', label: 'Overdue', count: payments.filter(p => p.status === 'overdue').length }
    ],
    userOptions: users.filter(u => u.payment_required).map(user => ({
      value: user.username,
      label: user.username,
      count: payments.filter(p => p.username === user.username).length
    }))
  }

  // Generate payment status for current month
  const getCurrentMonthPaymentStatus = () => {
    const currentMonth = selectedMonth + "-01"
    const activeUsers = users.filter(u => u.payment_required && u.is_active)
    
    return activeUsers.map(user => {
      const payment = payments.find(p => 
        p.user_id === user.user_id && 
        p.support_month === currentMonth
      )
      
      const isOverdue = !payment && new Date(currentMonth) < new Date()
      
      return {
        ...user,
        payment_status: payment?.status || (isOverdue ? 'overdue' : 'pending'),
        payment_amount: payment?.amount || user.monthly_payment_amount,
        paid_at: payment?.paid_at,
        payment_note: payment?.note,
        payment_method: payment?.payment_method,
        payment_id: payment?.id
      }
    })
  }

  const filteredAndSortedPayments = useMemo(() => {
    const filtered = payments.filter(payment => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!payment.username.toLowerCase().includes(searchLower) && 
            !payment.note.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(payment.status)) return false
      }

      // User filter
      if (filters.user.length > 0) {
        if (!filters.user.includes(payment.username)) return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const paymentDate = new Date(payment.support_month)
        if (filters.dateRange.from && paymentDate < filters.dateRange.from) return false
        if (filters.dateRange.to && paymentDate > filters.dateRange.to) return false
      }

      return true
    })

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof typeof a]
        let bValue = b[filters.sortBy as keyof typeof b]

        // Handle date sorting
        if (filters.sortBy === 'support_month' || filters.sortBy === 'paid_at') {
          aValue = aValue ? new Date(aValue as string).getTime() : 0
          bValue = bValue ? new Date(bValue as string).getTime() : 0
        }

        // Handle string sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        aValue = aValue || 0
        bValue = bValue || 0

        if (filters.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    return filtered
  }, [filters, payments])

  const currentMonthStatus = getCurrentMonthPaymentStatus()
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  
  const currentMonthPaid = currentMonthStatus.filter(u => u.payment_status === 'paid').length
  const currentMonthPending = currentMonthStatus.filter(u => u.payment_status === 'pending').length
  const currentMonthOverdue = currentMonthStatus.filter(u => u.payment_status === 'overdue').length
  const currentMonthTotal = currentMonthStatus.length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">Paid</Badge>
      case 'pending':
        return <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">Pending</Badge>
      case 'overdue':
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">Overdue</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) return null
    
    switch (method) {
      case 'bank_transfer':
        return <Badge variant="outline" className="text-xs">Bank Transfer</Badge>
      case 'credit_card':
        return <Badge variant="outline" className="text-xs">Credit Card</Badge>
      case 'cash':
        return <Badge variant="outline" className="text-xs">Cash</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{method}</Badge>
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Support Payments</h1>
          <p className="text-sm lg:text-base text-slate-600">Track monthly user contributions and support payments (¥)</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Record Support Payment</DialogTitle>
              <DialogDescription>Add a new support payment record</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user" className="text-right">User</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.payment_required).map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount (¥)</Label>
                <input 
                  id="amount" 
                  type="number" 
                  defaultValue="50000" 
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="support_month" className="text-right">Support Month</Label>
                <input 
                  id="support_month" 
                  type="month" 
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_method" className="text-right">Payment Method</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="note" className="text-right">Note</Label>
                <Textarea id="note" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Collected</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">¥{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-slate-600">All time payments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Pending</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">¥{totalPending.toLocaleString()}</div>
            <p className="text-xs text-slate-600">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Overdue</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">¥{totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-slate-600">Past due payments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Active Users</CardTitle>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-900">{users.filter(u => u.payment_required && u.is_active).length}</div>
            <p className="text-xs text-slate-600">Paying members</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="current-month" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current-month" className="cursor-pointer">Current Month Status</TabsTrigger>
          <TabsTrigger value="payment-history" className="cursor-pointer">Payment History</TabsTrigger>
          <TabsTrigger value="user-overview" className="cursor-pointer">User Overview</TabsTrigger>
        </TabsList>

        {/* Current Month Status Tab */}
        <TabsContent value="current-month" className="space-y-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Payment Status for {new Date(selectedMonth + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h3>
              <p className="text-sm text-slate-600">Track which users have paid for the selected month</p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="month-select" className="text-sm font-medium">Month:</Label>
              <input
                id="month-select"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Current Month Summary */}
          <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{currentMonthPaid}</div>
                <Progress value={(currentMonthPaid / currentMonthTotal) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Pending</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{currentMonthPending}</div>
                <Progress value={(currentMonthPending / currentMonthTotal) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{currentMonthOverdue}</div>
                <Progress value={(currentMonthOverdue / currentMonthTotal) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Collection Rate</CardTitle>
                <Yen className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{Math.round((currentMonthPaid / currentMonthTotal) * 100)}%</div>
                <p className="text-xs text-slate-600">{currentMonthPaid} of {currentMonthTotal} users</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Month User Status */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">User Payment Status</CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Payment status for {new Date(selectedMonth + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">User</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Payment Method</TableHead>
                      <TableHead className="min-w-[150px]">Payment Date</TableHead>
                      <TableHead className="min-w-[200px]">Note</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMonthStatus.map((user) => (
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
                          <div className="font-medium text-sm lg:text-base">¥{user.payment_amount.toLocaleString()}</div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {getStatusBadge(user.payment_status)}
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          {getPaymentMethodBadge(user.payment_method || null)}
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          {user.paid_at ? (
                            <div className="text-xs lg:text-sm">
                              <div>{new Date(user.paid_at).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {new Date(user.paid_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">Not paid</span>
                          )}
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <div className="text-xs lg:text-sm max-w-xs truncate">{user.payment_note || '-'}</div>
                        </TableCell>
                        <TableCell className="text-right min-w-[80px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.payment_status !== 'paid' && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Payment
                              </DropdownMenuItem>
                              {user.payment_id && (
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Payment
                                </DropdownMenuItem>
                              )}
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

        {/* Payment History Tab */}
        <TabsContent value="payment-history" className="space-y-4">
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
              category: false,
              user: true
            }}
            placeholder="Search payments by user or note..."
          />

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">Payment History</CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Showing {filteredAndSortedPayments.length} of {payments.length} payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[120px]">Support Month</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Payment Method</TableHead>
                      <TableHead className="min-w-[100px]">Payment Date</TableHead>
                      <TableHead className="min-w-[150px]">Note</TableHead>
                      <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="min-w-[150px]">
                          <div className="font-medium text-sm lg:text-base">{payment.username}</div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="font-medium text-sm lg:text-base">¥{payment.amount.toLocaleString()}</div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="text-xs lg:text-sm">
                            {new Date(payment.support_month).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          {getPaymentMethodBadge(payment.payment_method)}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {payment.paid_at ? (
                            <div className="text-xs lg:text-sm">
                              {new Date(payment.paid_at).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="text-xs lg:text-sm max-w-xs truncate">{payment.note}</div>
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
                              {payment.status === 'pending' && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
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

        {/* User Overview Tab */}
        <TabsContent value="user-overview" className="space-y-4">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base lg:text-lg text-slate-900">User Payment Overview</CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Complete payment history and status for each user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">User</TableHead>
                      <TableHead className="min-w-[100px]">Monthly Amount</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Total Paid</TableHead>
                      <TableHead className="min-w-[100px]">Payments Made</TableHead>
                      <TableHead className="min-w-[100px]">Last Payment</TableHead>
                      <TableHead className="min-w-[120px]">Payment Start</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.payment_required).map((user) => {
                      const userPayments = payments.filter(p => p.user_id === user.user_id)
                      const totalPaid = userPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
                      const lastPayment = userPayments
                        .filter(p => p.status === 'paid')
                        .sort((a, b) => new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime())[0]
                      
                      return (
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
                            <div className="font-medium text-sm lg:text-base">¥{user.monthly_payment_amount.toLocaleString()}</div>
                          </TableCell>
                          <TableCell className="min-w-[80px]">
                            <Badge variant={user.is_active ? 'default' : 'destructive'} className={`text-xs ${user.is_active ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'}`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <div className="font-medium text-sm lg:text-base text-emerald-600">¥{totalPaid.toLocaleString()}</div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <div className="text-sm lg:text-base">{userPayments.filter(p => p.status === 'paid').length}</div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            {lastPayment ? (
                              <div className="text-xs lg:text-sm">
                                {new Date(lastPayment.paid_at!).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">Never</span>
                            )}
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            <div className="text-xs lg:text-sm">
                              {new Date(user.payment_start_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
