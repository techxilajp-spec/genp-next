import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { DepartmentDetail } from "@/types/api/admin/departments";

/**
 * @swagger
 * /api/admin/departments/{id}/status:
 *   patch:
 *     tags:
 *       - Departments
 *     summary: Update department status
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Department status updated successfully
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
 *                     department_id:
 *                       type: string
 *                       description: ID of the updated department
 *                 example:
 *                   success: true
 *                   message: "Department status updated successfully"
 *                   data:
 *                     department_id: "1"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "Department status update failed"
 */
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const body = await req.json();
  const departmentId = String((await params).id);

  const { data, error } = await supabase
    .from("departments")
    .update({ status: body.status })
    .eq("department_id", departmentId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.UPDATE_STATUS_FAILED,
      500
    );
  }

  return successResponse(
    data as unknown as DepartmentDetail,
    MESSAGES.DEPARTMENTS.UPDATE_STATUS_SUCCESS
  );
};
