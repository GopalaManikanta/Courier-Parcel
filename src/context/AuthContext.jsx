import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const MOCK_USERS_KEY = 'courier_users';
const CURRENT_USER_KEY = 'courier_current_user';

// Professional Default Initial Users for Enterprise Admin Portal
const DEFAULT_USERS = [
  {
    id: 'usr_1',
    name: 'Senior Logistics Administrator',
    email: 'admin@courier.com',
    password: 'password123',
    role: 'Logistics Director',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize users and current user session from LocalStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(MOCK_USERS_KEY);
      if (!storedUsers) {
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      } else {
        // Upgrade legacy 'Demo Admin' references to 'Senior Logistics Administrator'
        try {
          const parsed = JSON.parse(storedUsers);
          const updated = parsed.map((u) =>
            u.name === 'Demo Admin' ? { ...u, name: 'Senior Logistics Administrator', role: 'Logistics Director' } : u
          );
          localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updated));
        } catch {
          // fallback
        }
      }

      const activeUser = localStorage.getItem(CURRENT_USER_KEY);
      if (activeUser) {
        const parsedActive = JSON.parse(activeUser);
        if (parsedActive.name === 'Demo Admin') {
          parsedActive.name = 'Senior Logistics Administrator';
          parsedActive.role = 'Logistics Director';
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsedActive));
        }
        setUser(parsedActive);
      }
    } catch (err) {
      console.error('Failed to parse auth data from LocalStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to fetch all stored users
  const getUsers = () => {
    try {
      const usersJson = localStorage.getItem(MOCK_USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  // Register function
  const register = async (userData) => {
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (existingUser) {
      toast.error('An account with this email already exists!');
      return false;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'Logistics Admin',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers));
    toast.success('Registration successful! Please login to your account.');
    return true;
  };

  // Login function
  const login = async (email, password) => {
    const users = getUsers();
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      toast.error('Invalid email or password. Please try again!');
      return false;
    }

    // Save user session without raw password
    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name === 'Demo Admin' ? 'Senior Logistics Administrator' : foundUser.name,
      email: foundUser.email,
      role: foundUser.role || 'Logistics Director',
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    toast.success(`Welcome back, ${sessionUser.name}!`);
    return true;
  };

  // Reset Password function
  const resetPassword = async (email, newPassword) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      toast.error('No account found with this email address.');
      return false;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    toast.success('Password updated successfully! You can now login with your new password.');
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
