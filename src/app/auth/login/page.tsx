'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FileText, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('rajesh@apexinfotech.in');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'user', 'pro');
    confetti({ particleCount: 30, spread: 40 });
    router.push('/dashboard');
  };

  const handleQuickLogin = (demoEmail: string, role: 'user' | 'admin', plan: 'free' | 'pro' | 'business') => {
    login(demoEmail, role, plan);
    confetti({ particleCount: 40, spread: 50 });
    router.push(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to BizTools India</h1>
          <p className="text-xs text-slate-500">Access your saved invoices, client quotations, and business profiles.</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block text-center">
            🚀 1-Click Instant Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rajesh@apexinfotech.in', 'user', 'pro')}
              className="p-2 rounded-xl bg-white hover:bg-blue-100/50 border border-blue-200 text-blue-900 font-bold text-[11px] text-center transition shadow-2xs"
            >
              MSME Owner (Pro)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@biztools.in', 'admin', 'business')}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] text-center transition shadow-2xs"
            >
              Admin Master
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link href="/auth/forgot-password" className="text-[11px] font-bold text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-bold text-blue-600 hover:underline">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}
