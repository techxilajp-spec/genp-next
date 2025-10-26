"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatCurrency, formatNumber } from "@/lib/i18n/date-utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";

export default function Dashboard() {
  const { t, language } = useI18n();

  const { stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-slate-600">{t.common?.loading ?? "Loading"}...</span>
      </div>
    );
  }
  if (isError || !stats || !stats.data) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg text-red-600">{t.common?.error ?? "Error loading data"}</span>
      </div>
    );
  }

  const recentActivity = stats.data.recentActivity;

  const perUser = stats.data.perUserTaskStats ?? [];



  // const topPerformers = [
  //   { name: "Alice Johnson", tasks: 24, completion: 96 },
  //   { name: "山下次郎", tasks: 21, completion: 91 },
  //   { name: "Bob Smith", tasks: 19, completion: 89 },
  //   { name: "鈴木美咲", tasks: 18, completion: 87 },
  // ];

  return (
    <div className='p-4 lg:p-8 space-y-8'>
      {/* Mobile Header */}
      <div className='lg:hidden flex items-center justify-between mb-6 ml-12'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800'>
            {t.dashboard.title}
          </h1>
          <p className='text-slate-600'>{t.dashboard.subtitle}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Desktop Header */}
      <div className='hidden lg:flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>
            {t.dashboard.title}
          </h1>
          <p className='text-slate-600 mt-2'>{t.dashboard.subtitle}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium opacity-90'>
              {t.dashboard.totalUsers}
            </CardTitle>
            <Users className='h-4 w-4 opacity-90' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.data.totalUsers)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              {stats.data.userGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {stats.data.userGrowth >= 0 ? "+" : ""}
              {stats.data.userGrowth}% {t.dashboard.userGrowth}
            </div>
          </CardContent>
        </Card>
        {/* Active Tasks */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.activeTasks}
            </CardTitle>
            <Calendar className='h-4 w-4 opacity-90' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.data.activeTasks)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              {stats.data.taskCompletion >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {stats.data.taskCompletion >= 0 ? "+" : ""}
              {stats.data.taskCompletion}% {t.dashboard.taskCompletion}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.monthlyRevenue}
            </CardTitle>
            <DollarSign className='h-4 w-4 opacity-90' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.data.monthlyRevenue)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              {stats.data.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {stats.data.revenueGrowth >= 0 ? "+" : ""}
              {stats.data.revenueGrowth}% {t.dashboard.revenueGrowth}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.pendingPayments}
            </CardTitle>
            <CreditCard className='h-4 w-4 opacity-90' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.data.pendingPayments)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              {stats.data.paymentCollection >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {stats.data.paymentCollection >= 0 ? "+" : ""}
              {stats.data.paymentCollection}% {t.dashboard.paymentCollection}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Recent Activity */}
        <Card className='lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-slate-800'>
              <Activity className='h-5 w-5' />
              {t.dashboard.recentActivity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className='flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                      <span className='text-white text-xs font-semibold'>
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className='font-medium text-slate-800'>
                        {activity.user}
                      </p>
                      <p className='text-sm text-slate-600'>
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center text-xs text-slate-500'>
                    <Clock className='h-3 w-3 mr-1' />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-slate-800'>
              <TrendingUp className='h-5 w-5' />
              {t.dashboard.topPerformers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* {topPerformers.map((performer, index) => ( */}
              {perUser.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {performer.username ?? performer.userId}
                      </p>
                      <p className="text-sm text-slate-600">
                        {performer.totalTasks} tasks · {performer.completedTasks} completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {Math.round((performer.completedTasks / Math.max(1, performer.totalTasks)) * 100)}%
                    </p>
                    <Progress value={Math.round((performer.completedTasks / Math.max(1, performer.totalTasks)) * 100)} className="w-16 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-slate-800'>
            <DollarSign className='h-5 w-5' />
            {t.dashboard.financialSummary}
          </CardTitle>
          <CardDescription>Monthly financial overview and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.data.toalRevenue)}
              </div>
              <p className="text-sm text-green-700 mt-1">{t.financial.totalRevenue}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.data.totalExpenses)}
              </div>
              <p className="text-sm text-red-700 mt-1">{t.financial.totalExpenses}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.data.netProfit)}
              </div>
              <p className="text-sm text-blue-700 mt-1">{t.financial.netProfit}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
