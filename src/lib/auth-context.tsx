'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, BusinessProfile, UserPlan } from './types';
import { storage, DEFAULT_BUSINESS_PROFILE } from './storage';

interface AuthContextType {
  user: User | null;
  businessProfile: BusinessProfile;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role?: 'user' | 'admin', plan?: UserPlan) => void;
  signup: (name: string, email: string, phone: string, businessName: string) => void;
  logout: () => void;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  upgradePlan: (plan: UserPlan) => void;
  toggleAdminMode: () => void;
}

const DEFAULT_USER: User = {
  id: 'user-01',
  name: 'Rajesh Sharma',
  email: 'rajesh@apexinfotech.in',
  phone: '+91 98765 43210',
  role: 'user',
  plan: 'pro',
  createdAt: '2026-01-15T00:00:00.000Z',
  businessId: 'bp-demo-001',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(DEFAULT_BUSINESS_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    storage.init();
    const storedProfile = storage.getProfile();
    setBusinessProfile(storedProfile);
    
    // Check saved user session
    const savedUser = localStorage.getItem('biztools_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setMounted(true);

    const handleStorageUpdate = () => {
      setBusinessProfile(storage.getProfile());
    };

    window.addEventListener('biztools_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('biztools_storage_updated', handleStorageUpdate);
  }, []);

  const login = (email: string, role: 'user' | 'admin' = 'user', plan: UserPlan = 'pro') => {
    const loggedUser: User = {
      id: role === 'admin' ? 'admin-01' : 'user-01',
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Business Owner',
      email,
      phone: '+91 98765 43210',
      role,
      plan,
      createdAt: new Date().toISOString(),
      businessId: 'bp-demo-001',
    };
    setUser(loggedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('biztools_user_session', JSON.stringify(loggedUser));
    }
  };

  const signup = (name: string, email: string, phone: string, businessName: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      plan: 'free',
      createdAt: new Date().toISOString(),
      businessId: `bp-${Date.now()}`,
    };
    const newProfile: BusinessProfile = {
      ...DEFAULT_BUSINESS_PROFILE,
      id: `bp-${Date.now()}`,
      businessName,
      ownerName: name,
      email,
      phone,
      whatsapp: phone,
    };
    setUser(newUser);
    storage.saveProfile(newProfile);
    setBusinessProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('biztools_user_session', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('biztools_user_session');
    }
  };

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) => {
    const updated = { ...businessProfile, ...updates };
    setBusinessProfile(updated);
    storage.saveProfile(updated);
  };

  const upgradePlan = (plan: UserPlan) => {
    if (!user) return;
    const updated = { ...user, plan };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('biztools_user_session', JSON.stringify(updated));
    }
  };

  const toggleAdminMode = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const updated = { ...user, role: newRole as 'user' | 'admin' };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('biztools_user_session', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        businessProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        updateBusinessProfile,
        upgradePlan,
        toggleAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
