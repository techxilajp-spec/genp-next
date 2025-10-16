import { DashboardStatsResponse } from "@/types/api/admin/overview";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { ta } from "date-fns/locale";
import { formatActivityTime } from "@/lib/i18n/date-utils";

/**
 * @swagger
 * /api/admin/dashboard-stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics
 *     description: Returns statistics for the admin dashboard.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     activeTasks:
 *                       type: integer
 *                     monthlyRevenue:
 *                       type: number
 *                     pendingPayments:
 *                       type: integer
 *               example:
 *                 success: true
 *                 message: "Dashboard stats fetched successfully"
 *                 data:
 *                   totalUsers: 123
 *                   activeTasks: 45
 *                   monthlyRevenue: 10000
 *                   pendingPayments: 3
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Failed to fetch dashboard stats"
 */
export const GET = async (_req: NextRequest): Promise<Response> => {
    const supabase = await createClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch total users (real)
    const { count: totalUsers, error: userError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

    const { count: activeTasks, error: taskError } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .ilike("status", `%in_progress%`);

    const { data: revenueData, error: revenueError } = await supabase
        .from("support_payments")
        .select("*")
        .eq("status", "paid");

    const { data: pendingPayments, error: pendingPaymentsError } = await supabase
        .from("support_payments")
        .select("*")
        .ilike("status", `%pending%`);
    // .gte("due_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    const thisMonthPendingPayments = pendingPayments
        ?.filter(payment => !payment.paid_at && new Date(payment.due_date) >= startOfMonth)
        .length || 0;
    const lastMonthPendingPayments = pendingPayments
        ?.filter(payment => !payment.paid_at && new Date(payment.due_date) >= new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1) && new Date(payment.due_date) < startOfMonth)
        .length || 0;

    let paymentCollection = 0;
    if (lastMonthPendingPayments && lastMonthPendingPayments > 0) {
        paymentCollection = Math.round(((lastMonthPendingPayments - thisMonthPendingPayments) / lastMonthPendingPayments) * 100);
    } else if (thisMonthPendingPayments > 0) {
        paymentCollection = 100;
    }

    const { data: expenseData, error: expenseError } = await supabase
        .from("financial_records")
        .select("*")
        .eq("type", "expense");

    if (userError || taskError || revenueError || pendingPaymentsError || expenseError) {
        return errorResponse(
            MESSAGES.COMMON.ERROR,
            userError?.message || taskError?.message || revenueError?.message || pendingPaymentsError?.message || expenseError?.message || "Failed to fetch dashboard stats",
            500
        );
    }

    const { count: usersThisMonth } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

    const { count: usersLastMonth } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1).toISOString())
        .lt("created_at", startOfMonth.toISOString());

    let userGrowth = 0;
    if (usersLastMonth && usersLastMonth > 0) {
        userGrowth = Math.round((((usersThisMonth ?? 0) - usersLastMonth) / usersLastMonth) * 100);
    } else if ((usersThisMonth ?? 0) > 0) {
        userGrowth = 100;
    }

    const { count: completeTaskThisMonth } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .ilike("status", `%completed%`)
        .gte("end_time", startOfMonth.toISOString());

    const { count: completeTaskLastMonth } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .ilike("status", `%completed%`)
        .gte("end_time", new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1).toISOString())
        .lt("end_time", startOfMonth.toISOString());

    const { data: activityLogs, error: activityError } = await supabase
        .from("activity_logs")
        .select(`
            log_id,
            action,
            created_at,
            users (
                user_id,
                username
            )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

    let taskCompletion = 0;
    if (completeTaskLastMonth && completeTaskLastMonth > 0) {
        taskCompletion = Math.round((((completeTaskThisMonth ?? 0) - completeTaskLastMonth) / completeTaskLastMonth) * 100);
    } else if ((completeTaskThisMonth ?? 0) > 0) {
        taskCompletion = 100;
    }

    const monthlyRevenue = revenueData
        ?.filter(payment => payment.paid_at && new Date(payment.paid_at) >= startOfMonth)
        .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    const lastMonthRevenue = revenueData
        ?.filter(payment => payment.paid_at && new Date(payment.paid_at) >= new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() - 1, 1) && new Date(payment.paid_at) < startOfMonth)
        .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    let revenueGrowth = 0;
    if (lastMonthRevenue && lastMonthRevenue > 0) {
        revenueGrowth = Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
    } else if (monthlyRevenue > 0) {
        revenueGrowth = 100;
    }

    const toalRevenue = revenueData
        ?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    const totalExpenses = expenseData
        ?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;

    const netProfit = toalRevenue - totalExpenses;

    return successResponse({
        totalUsers: totalUsers ?? 0,
        activeTasks,
        monthlyRevenue: lastMonthPendingPayments,
        pendingPayments: thisMonthPendingPayments,
        toalRevenue,
        totalExpenses,
        netProfit,
        userGrowth,
        taskCompletion,
        revenueGrowth,
        paymentCollection,
        recentActivity: activityLogs?.map(log => ({
            id: log.log_id,
            user: log.users?.username ?? "Unknown",
            action: log.action,
            time: formatActivityTime(log.created_at),
        })) ?? [],
    } as unknown as DashboardStatsResponse
    );
}
