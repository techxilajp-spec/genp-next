"use client"

import { useState } from "react"
import { Plus, Search, CreditCard, Calendar, MoreHorizontal, Edit, Trash2, CheckCircle } from 'lucide-react'

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
const mockSupportPayments = [
  {
    id: 1,
    user_id: "1",
    username: "john_doe",
    amount: 3000,
    support_month: "2024-01-01",
    paid_at: "2024-01-05T10:00:00",
    note: "Monthly contribution for January",
    status: "paid"
  },
  {
    id: 2,
    user_id: "2",
    username: "jane_smith",
    amount: 3000,
    support_month: "2024-01-01",
    paid_at: "2024-01-03T14:30:00",
    note: "January support payment",
    status: "paid"
  },
  {
    id: 3,
    user_id: "3",
    username: "bob_wilson",
    amount: 3000,
    support_month: "2024-01-01",
    paid_at: null,
    note: "Pending January payment",
    status: "pending"
  },
  {
    id: 4,
    user_id: "1",
    username: "john_doe",
    amount: 3500,
    support_month: "2024-02-01",
    paid_at: "2024-02-02T09:15:00",
    note: "February contribution with bonus",
    status: "paid"
  }
]

const mockUsers = [
  { user_id: "1", username: "john_doe" },
  { user_id: "2", username: "jane_smith" },
  { user_id: "3", username: "bob_wilson" }
]

export function SupportPaymentsSection() {
  const [payments, setPayments] = useState(mockSupportPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredPayments = payments.filter(payment =>
    payment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.note.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const pendingCount = payments.filter(p => p.status === 'pending').length

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Support Payments</h1>
          <p className="text-sm lg:text-base text-slate-600">Track monthly user contributions and support payments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
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
                    {mockUsers.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" type="number" defaultValue="3000" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="support_month" className="text-right">Support Month</Label>
                <Input id="support_month" type="month" className="col-span-3" />
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

      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-white/80">{pendingCount} payments pending</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payments.filter(p => 
                new Date(p.support_month).getMonth() === new Date().getMonth() &&
                new Date(p.support_month).getFullYear() === new Date().getFullYear()
              ).reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All support payments and contributions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">User</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[120px]">Support Month</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Paid Date</TableHead>
                  <TableHead className="min-w-[150px]">Note</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="min-w-[100px]">
                      <div className="font-medium text-sm lg:text-base">{payment.username}</div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="font-medium text-sm lg:text-base">${payment.amount.toLocaleString()}</div>
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
                      <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'} className={`text-xs ${payment.status === 'paid' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0' : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0'}`}>
                        {payment.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {payment.paid_at ? (
                        <div className="text-xs lg:text-sm">
                          {new Date(payment.paid_at).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
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
    </div>
  )
}
