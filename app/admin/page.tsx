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

export default function Dashboard() {
  const { t, language } = useI18n();

  // Mock data - in a real app, this would come from your API
  const stats = {
    totalUsers: 1247,
    activeTasks: 89,
    monthlyRevenue: language === "ja" ? 2450000 : 24500,
    pendingPayments: 23,
  };

  const growth = {
    users: 12.5,
    tasks: -3.2,
    revenue: 18.7,
    payments: -8.1,
  };

  const recentActivity = [
    { id: 1, user: "John Doe", action: "completed task", time: "2 hours ago" },
    { id: 2, user: "田中太郎", action: "made payment", time: "4 hours ago" },
    {
      id: 3,
      user: "Sarah Wilson",
      action: "created new task",
      time: "6 hours ago",
    },
    { id: 4, user: "佐藤花子", action: "updated profile", time: "8 hours ago" },
  ];

  const topPerformers = [
    { name: "Alice Johnson", tasks: 24, completion: 96 },
    { name: "山田次郎", tasks: 21, completion: 91 },
    { name: "Bob Smith", tasks: 19, completion: 89 },
    { name: "鈴木美咲", tasks: 18, completion: 87 },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-6 ml-12">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {t.dashboard.title}
          </h1>
          <p className="text-slate-600">{t.dashboard.subtitle}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {t.dashboard.title}
          </h1>
          <p className="text-slate-600 mt-2">{t.dashboard.subtitle}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.totalUsers}
            </CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalUsers, language)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />+{growth.users}%{" "}
              {t.dashboard.userGrowth}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.activeTasks}
            </CardTitle>
            <Calendar className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.activeTasks, language)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              {growth.tasks}% {t.dashboard.taskCompletion}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.monthlyRevenue}
            </CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlyRevenue, language)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />+{growth.revenue}%{" "}
              {t.dashboard.revenueGrowth}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {t.dashboard.pendingPayments}
            </CardTitle>
            <CreditCard className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.pendingPayments, language)}
            </div>
            <div className="flex items-center text-xs opacity-90 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              {growth.payments}% {t.dashboard.paymentCollection}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Activity className="h-5 w-5" />
              {t.dashboard.recentActivity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {activity.user}
                      </p>
                      <p className="text-sm text-slate-600">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <TrendingUp className="h-5 w-5" />
              {t.dashboard.topPerformers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {performer.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {performer.tasks} tasks
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {performer.completion}%
                    </p>
                    <Progress
                      value={performer.completion}
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <DollarSign className="h-5 w-5" />
            {t.dashboard.financialSummary}
          </CardTitle>
          <CardDescription>
            Monthly financial overview and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(language === "ja" ? 3200000 : 32000, language)}
              </div>
              <p className="text-sm text-green-700 mt-1">
                {t.financial.totalRevenue}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(language === "ja" ? 1800000 : 18000, language)}
              </div>
              <p className="text-sm text-red-700 mt-1">
                {t.financial.totalExpenses}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(language === "ja" ? 1400000 : 14000, language)}
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {t.financial.netProfit}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
