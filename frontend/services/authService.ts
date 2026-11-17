
import api from "./api";

export interface Staff {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  staff: Staff;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// 1. Staff login
export const staffLogin = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/admin/auth/login",
    {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    }
  );

  const data = response.data;

  if (!data.accessToken || !data.staff) {
    throw new Error("Invalid login response from server");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("staffToken", data.accessToken);
    localStorage.setItem("staff", JSON.stringify(data.staff));
  }

  return data;
};

// 2. Get stored staff
export const getStoredStaff = (): Staff | null => {
  if (typeof window === "undefined") return null;

  try {
    const staff = localStorage.getItem("staff");
    return staff ? (JSON.parse(staff) as Staff) : null;
  } catch {
    return null;
  }
};

// 3. Verify staff authentication with backend
export const verifyStaff = async (): Promise<Staff> => {
  if (typeof window === "undefined") {
    throw new Error("Browser environment required");
  }

  const token = localStorage.getItem("staffToken");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await api.get("/admin/auth/me");

  if (!response.data.success || !response.data.staff) {
    throw new Error("Invalid staff session");
  }

  return response.data.staff as Staff;
};

// 4. Staff logout
export const staffLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staff");
  }
};
