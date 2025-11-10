"use server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { UserCreate } from "@/types/api/admin/users";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import crypto from "crypto"; // built-in Node.js module
import nodemailer from "nodemailer";

// Generate passowrd for create auth user
function generatePassword(length = 12) {
  //Generate random string with upper/lowercase, numbers, and symbols
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
}

export const POST = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
  const { username, email, phone_number, user_type, department, password } =
    await req.json();
  try {
    const finalPassword = password || generatePassword(14);

    // create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: finalPassword,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth Error: ", authError);
      // Detect duplicate-email error from Supabase Auth and return friendly message
      const msg = String(authError.message || "").toLowerCase();
      if (
        msg.includes("already been registered") ||
        msg.includes("already registered") ||
        msg.includes("user with this email") ||
        msg.includes("a user with this email")
      ) {
        return errorResponse(
          MESSAGES.COMMON.ERROR,
          "The email is already registered. Please try another email.",
          409
        );
      }

      return errorResponse(
        MESSAGES.COMMON.ERROR,
        authError.message || "Failed to create auth user",
        500
      );
    }

    const authUserId = authData.user.id;
    if (!authUserId) {
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        "Auth user Id not returned",
        500
      );
    }

    // Get department name by department id
    const { data: department_name, error: departError } = await supabase
      .from("departments")
      .select("name")
      .eq("department_id", department)
      .single();

    if (departError) {
      console.error("API Error :", departError);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        departError?.message || MESSAGES.DEPARTMENTS.FETCH_FAILED,
        500
      );
    }

    // Create user
    const { data, error } = await supabase
      .from("users")
      .insert({
        user_id: authUserId,
        username: username,
        email: email,
        phone_number: phone_number,
        user_type: user_type,
        department: department_name.name,
      })
      .select()
      .single();

    if (error) {
      console.error("API Error:", error);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        error.message || MESSAGES.USERS.CREATE_FAILED,
        500
      );
    }

    // Create department-user
    const { error: mapError } = await supabase.from("department_users").insert({
      user_id: authUserId,
      department_id: department,
    });

    if (mapError) {
      console.error("API Error (mapping):", mapError);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        mapError.message || MESSAGES.USERS.CREATE_FAILED,
        500
      );
    }

    //Create user permission
    const { error: roleError } = await supabase
      .from("user_permissions")
      .insert({
        user_id: authUserId,
        permission_name: "read",
      })
      .select()
      .single();

    if (roleError) {
      console.error("API Error", roleError);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        roleError.message || MESSAGES.USERS.CREATE_FAILED,
        500
      );
    }

    // Send welcome email with generated password
    let mailSent = false;
    try {
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        console.warn(
          "Skipping welcome email send: SMTP_USER or SMTP_PASS not configured. Set SMTP_USER and SMTP_PASS to enable email sending."
        );
        mailSent = false;
      } else {
        // build transporter from env - default to Gmail SMTP
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = Number(process.env.SMTP_PORT) || 465;
        // Allow override via SMTP_SECURE ("true"/"false"); otherwise treat 465 as secure
        const smtpSecureEnv = process.env.SMTP_SECURE;
        const secure =
          typeof smtpSecureEnv !== "undefined"
            ? smtpSecureEnv === "true"
            : smtpPort === 465;

        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          // when secure is false (e.g., port 587), require TLS (STARTTLS)
          requireTLS: !secure,
        });

        const appUrl = process.env.APP_URL || "http://localhost:3000";
        const from = process.env.SMTP_FROM || "techxila.jp@gmail.com";
        const loginUrl = `${appUrl.replace(/\/$/, "")}/auth/login`;

        const mailHtml = `
          <p>Hi ${username},</p>
          <p>Welcome to Techxila. Your account has been created.</p>
          <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> <code>${finalPassword}</code></p>
          <p>Please change your password after first login.</p>
          <br/>
          <p>Regards,<br/>Techxila Team</p>
        `;

        await transporter.sendMail({
          from,
          to: email,
          subject: "Welcome to Techxila - Your account details",
          text: `Welcome ${username}\nLogin: ${loginUrl}\nEmail: ${email}\nPassword: ${finalPassword}\nPlease change your password after first login.`,
          html: mailHtml,
        });

        mailSent = true;
      }
    } catch (mailErr: any) {
      // Log concise, actionable message and avoid noisy stack traces
      const code = mailErr?.code || "";
      const message = mailErr?.message || String(mailErr);
      // Include diagnostics: host/port/secure used
      const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
      const smtpPort = process.env.SMTP_PORT || "465";
      const smtpSecureEnv = process.env.SMTP_SECURE;
      const secureUsed =
        typeof smtpSecureEnv !== "undefined"
          ? smtpSecureEnv
          : String(Number(smtpPort) === 465);
      if (code === "EAUTH") {
        console.warn(
          `Welcome email not sent: SMTP authentication failed (EAUTH). Check SMTP_USER/SMTP_PASS. Host=${smtpHost} Port=${smtpPort} Secure=${secureUsed} Message=${message}`
        );
      } else if (
        message.includes("wrong version number") ||
        message.includes("ssl3_get_record")
      ) {
        console.warn(
          `Welcome email not sent: TLS/SSL mismatch. Check SMTP_HOST/SMTP_PORT and SMTP_SECURE. Host=${smtpHost} Port=${smtpPort} Secure=${secureUsed} Message=${message}`
        );
      } else {
        console.warn(
          `Welcome email not sent: Host=${smtpHost} Port=${smtpPort} Secure=${secureUsed} Message=${message}`
        );
      }
      // don't fail the whole request when email sending fails
      mailSent = false;
    }

    return successResponse(
      {
        data,
        mailSent,
      } as unknown as UserCreate,
      MESSAGES.USERS.CREATE_SUCCESS
    );
  } catch (err: any) {
    console.error("Unexpected API Error:", err);
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      err.message || "Unexpected server error",
      500
    );
  }
};
