import { supabase } from "./supabase";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "editor";
  created_at: string;
}

const DEFAULT_SUPER_ADMIN: AdminUser = {
  id: "default-super-admin",
  name: "Super Admin PPI AIU",
  email: "adm.ppi.aiu@gmail.com",
  role: "super_admin",
  created_at: new Date().toISOString(),
};

const STORAGE_KEY = "ppi_admin_users_list";
const SESSION_KEY = "ppi_admin_current_user";

// Get initial list from localStorage
export function getLocalAdminUsers(): AdminUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const users: AdminUser[] = JSON.parse(data);
      // Ensure default super admin exists
      if (!users.some((u) => u.email.toLowerCase() === DEFAULT_SUPER_ADMIN.email.toLowerCase())) {
        users.unshift(DEFAULT_SUPER_ADMIN);
      }
      return users;
    }
  } catch (e) {
    console.error("Failed to parse local admin users:", e);
  }
  return [DEFAULT_SUPER_ADMIN];
}

export function saveLocalAdminUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save local admin users:", e);
  }
}

// Fetch list of admin users
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Ensure default super admin exists
      const hasDefault = data.some((u: any) => u.email.toLowerCase() === DEFAULT_SUPER_ADMIN.email.toLowerCase());
      const usersList = hasDefault ? data : [DEFAULT_SUPER_ADMIN, ...data];
      saveLocalAdminUsers(usersList);
      return usersList;
    }
  } catch (err) {
    console.warn("Supabase admin_users table query failed, falling back to local storage:", err);
  }

  return getLocalAdminUsers();
}

// Save or Update Admin User
export async function saveAdminUser(userData: {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "editor";
}): Promise<AdminUser> {
  const users = getLocalAdminUsers();
  let updatedUser: AdminUser;

  if (userData.id) {
    // Update existing
    const index = users.findIndex((u) => u.id === userData.id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        name: userData.name,
        email: userData.email,
        role: userData.role,
        ...(userData.password ? { password: userData.password } : {}),
      };
      updatedUser = users[index];
    } else {
      throw new Error("User tidak ditemukan");
    }
  } else {
    // Create new
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("Email sudah terdaftar sebagai Admin!");
    }

    updatedUser = {
      id: "admin-" + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      created_at: new Date().toISOString(),
    };
    users.push(updatedUser);
  }

  // Sync with localStorage
  saveLocalAdminUsers(users);

  // Attempt sync with Supabase table if it exists
  try {
    await supabase.from("admin_users").upsert({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      created_at: updatedUser.created_at,
    });
  } catch (e) {
    console.warn("Supabase sync ignored:", e);
  }

  return updatedUser;
}

// Delete Admin User
export async function deleteAdminUser(id: string): Promise<boolean> {
  let users = getLocalAdminUsers();
  const target = users.find((u) => u.id === id);

  if (!target) return false;

  if (target.email.toLowerCase() === DEFAULT_SUPER_ADMIN.email.toLowerCase()) {
    throw new Error("Akun Utama Super Admin tidak dapat dihapus!");
  }

  users = users.filter((u) => u.id !== id);
  saveLocalAdminUsers(users);

  try {
    await supabase.from("admin_users").delete().eq("id", id);
  } catch (e) {
    console.warn("Supabase delete sync ignored:", e);
  }

  return true;
}

// Get Active Admin Session Profile
export function getCurrentAdminSession(): AdminUser {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to parse admin session:", e);
  }
  return DEFAULT_SUPER_ADMIN;
}

export function setCurrentAdminSession(user: AdminUser): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to set admin session:", e);
  }
}

export function clearAdminSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("supabase_session");
}
