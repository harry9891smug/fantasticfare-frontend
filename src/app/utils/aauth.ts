// src/utils/auth.ts

// Check if the user is an admin
export const isAuthenticated = (): boolean => {
    return localStorage.getItem("adminToken") === "admin-authenticated";
  };
  
  // Save admin token (only for the admin)
  export const login = (email: string, password: string) => {
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("adminToken", "admin-authenticated");
      return true;
    }
    return false;
  };
  
  // Remove token from localStorage (Logout function)
  export const logout = () => {
    localStorage.removeItem("adminToken");
  };
  