import { TrendingUp, TrendingDown, Clock, CheckCircle, Users, CreditCard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MobileHeader } from '@/components/mobile-header'

export default function DashboardPage() {
  // Mock data for overview cards
  const stats = {
    totalUsers: 24,
    activeUsers: 18,
    totalTasks: 156,
    completedTasks: 89,
    monthlyIncome: 45000,
    monthlyExpenses: 32000,
    supportPayments: 72000,
    pendingPayments: 6
  }

  return (
    <>
      <MobileHeader title="Dashboard" />
      <div className="p-4 lg:p-6">
        <div className="space-y-4 lg:space-y-6">
          <div className="hidden lg:block">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-600">Welcome to your startup management dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Total Users</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg lg:text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
                <p className="text-xs text-slate-600">
                  <span className="text-emerald-600 font-medium">{stats.activeUsers} active</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Tasks</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg lg:text-2xl font-bold text-slate-900">{stats.totalTasks}</div>
                <p className="text-xs text-slate-600">
                  <span className="text-emerald-600 font-medium">{stats.completedTasks} completed</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Monthly Income</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg lg:text-2xl font-bold text-slate-900">${stats.monthlyIncome.toLocaleString()}</div>
                <p className="text-xs text-slate-600">
                  Net: <span className="text-emerald-600 font-medium">${(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs lg:text-sm font-medium text-slate-700">Support Payments</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg lg:text-2xl font-bold text-slate-900">${stats.supportPayments.toLocaleString()}</div>
                <p className="text-xs text-slate-600">
                  <span className="text-amber-600 font-medium">{stats.pendingPayments} pending</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-base lg:text-lg text-slate-900">Recent Tasks</CardTitle>
                <CardDescription className="text-sm text-slate-600">Latest task activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4 pt-6">
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Website redesign completed</p>
                    <p className="text-xs text-slate-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Team meeting scheduled</p>
                    <p className="text-xs text-slate-600">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">Database optimization</p>
                    <p className="text-xs text-slate-600">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-base lg:text-lg text-slate-900">Financial Summary</CardTitle>
                <CardDescription className="text-sm text-slate-600">This month&apos;s financial overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4 pt-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Income</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm lg:text-base">${stats.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">Expenses</span>
                  </div>
                  <span className="font-bold text-red-600 text-sm lg:text-base">${stats.monthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm font-semibold text-slate-900">Net Profit</span>
                  <span className="font-bold text-emerald-600 text-sm lg:text-base">
                    ${(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
