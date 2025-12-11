import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(true);

  // Verify token validity on mount and periodically
  useEffect(() => {
    const verifyToken = async () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        try {
          // Verify token with backend
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } else {
            // Token is invalid or expired
            console.log('Token expired or invalid - logging out');
            handleLogout();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          handleLogout();
        }
      }

      setLoading(false);
    };

    verifyToken();

    // Check token validity every 5 minutes
    const interval = setInterval(verifyToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Keep localStorage in sync with state
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event("user-logout"));
  };

  const logout = () => {
    handleLogout();
    window.location.href = "/login?expired=true";
  };

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};