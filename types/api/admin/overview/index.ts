export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    activeTasks: number;
    monthlyRevenue: number;
    pendingPayments: number;
    toalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    userGrowth: number;
    taskCompletion: number;
    revenueGrowth: number;
    paymentCollection: number;
    totalTasks: number;
    completeTasks: number;
    perUserTaskStats: {
      username: string;
      totalTasks: number;
      completedTasks: number;
    }[];
    recentActivity: {
      id: number;
      user: string;
      action: string;
      time: string;
    }[];
  };
}