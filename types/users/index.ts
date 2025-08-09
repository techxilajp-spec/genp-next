export interface User {
    user_id: string;
    username: string;
    email: string;
    user_photo: string;
    phone_number: string;
    registration_date: string;
    last_login: string;
    user_type: string;
    is_active: boolean;
    account_status: string;
    deactivation_reason: string | null;
    deactivated_at: string | null;
    deactivated_by: string | null;
    login_attempts: number;
    is_locked: boolean;
    locked_until: string | null;
    email_verified: boolean;
    phone_verified: boolean;
    two_factor_enabled: boolean;
    last_password_change: string;
    department: string;
    role_permissions: string[];
}