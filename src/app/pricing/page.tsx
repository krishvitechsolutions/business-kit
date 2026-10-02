'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Check, Crown, Zap, Sparkles, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPlan } from '@/lib/types';

export default function PricingPage() {
  const { user, upgradePlan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [checkoutPlan, setCheckoutPlan] = useState<UserPlan | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeDone, setUpgradeDone] = useState(false);

  const plans = [
    {
      id: 'free' as UserPlan,
      name: 'Free Forever',
      badge: 'Starter',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Essential invoicing & calculators for micro-businesses & freelancers.',
      features: [
        'Standard GST Invoice Maker',
        'Quotation & Estimate Generator',
        'Basic Financial Calculators (GST, EMI, Profit)',
        'UPI Payment QR Code Generator',
        'Save up to 10 local documents',
        'Standard PDF downloads',
        'Community Support',
      ],
      cta: 'Current Plan',
      highlighted: false,
    },
    {
      id: 'pro' as UserPlan,
      name: 'Pro MSME',
      badge: 'Most Popular',
      priceMonthly: 199,
      priceAnnual: 1999, // ~20% off
      description: 'Unlimited documents, premium designer templates, and WhatsApp catalogues.',
      features: [
        'Everything in Free Plan',
        'Unlimited Invoices, Quotations & POs',
        'All 5 Premium Designer Templates',
        'Remove "BizTools.in" Watermark Branding',
        'Unlimited WhatsApp Product Catalogues',
        'High-Resolution Vector PDF Export',
        'Custom Business Logo on Invoices',
        'Expense Tracking & CSV Reports',
        'WhatsApp Payment Reminders',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      id: 'business' as UserPlan,
      name: 'Business Growth',
      badge: 'For Agencies & Teams',
      priceMonthly: 499,
      priceAnnual: 4999,
      description: 'Multi-business management, staff accounts, and dedicated priority support.',
      features: [
        'Everything in Pro Plan',
        'Manage Multiple Business Profiles',
        'Up to 5 Team / Staff Member Logins',
        'Bulk PDF Generation & Zip Download',
        'Advanced GST Audit Reports & Spreadsheets',
        'Automated Customer Payment Reconciliations',
        'Dedicated 24/7 WhatsApp & Phone Support',
        'API Access & Custom Webhooks (Coming Soon)',
      ],
      cta: 'Get Business Plan',
      highlighted: false,
    },
  ];

  const handleSelectPlan = (planId: UserPlan) => {
    if (planId === user?.plan) return;
    setCheckoutPlan(planId);
  };

  const handleSimulatePayment = () => {
    if (!checkoutPlan) return;
    setUpgrading(true);
    setTimeout(() => {
      upgradePlan(checkoutPlan);
      setUpgrading(false);
      setUpgradeDone(true);
      confetti({ particleCount: 60, spread: 70 });
      setTimeout(() => {
        setUpgradeDone(false);
        setCheckoutPlan(null);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <Crown className="w-3.5 h-3.5 text-blue-600" />
          <span>Transparent & Affordable Indian Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Simple Plans for Every Stage of Business
        </h1>
        <p className="text-base text-slate-600">
          Start for free, then upgrade as your billing volume grows. No hidden fees or lock-in contracts.
        </p>

        {/* Billing Cycle Switch */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-8 rounded-full bg-slate-900 p-1 transition relative cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full bg-amber-400 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-900 to-slate-900 text-white shadow-2xl ring-4 ring-blue-500/30 md:-translate-y-2'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">{plan.name}</h3>
                    {!plan.highlighted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${plan.highlighted ? 'text-blue-200' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black">
                      {price === 0 ? '₹0' : `₹${price}`}
                    </span>
                    <span className={`text-xs font-semibold ${plan.highlighted ? 'text-blue-200' : 'text-slate-500'}`}>
                      {price === 0 ? '/ forever' : billingCycle === 'annual' ? '/ year' : '/ month'}
                    </span>
                  </div>
                  {billingCycle === 'annual' && price > 0 && (
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      Equivalent to ₹{Math.round(price / 12)}/month (Billed annually)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-4 border-t border-slate-200/20">
                  <p className={`text-xs font-bold uppercase tracking-wider ${plan.highlighted ? 'text-blue-200' : 'text-slate-700'}`}>
                    Included Features:
                  </p>
                  <ul className="space-y-2.5 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span className={plan.highlighted ? 'text-slate-200' : 'text-slate-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition shadow-md ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-600 cursor-default'
                      : plan.highlighted
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Simulation Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Upgrade to {checkoutPlan.toUpperCase()}</h3>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Selected Plan:</span>
                <span className="uppercase text-blue-700">{checkoutPlan}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Billing Frequency:</span>
                <span className="capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between font-black text-slate-950 text-sm pt-2 border-t border-blue-200">
                <span>Total Amount:</span>
                <span className="text-blue-700">
                  ₹{checkoutPlan === 'pro' ? (billingCycle === 'annual' ? 1999 : 199) : billingCycle === 'annual' ? 4999 : 499}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800">Simulated Payment Gateway (UPI / Cards):</p>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="font-mono font-bold">UPI / GPay / Netbanking</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Test Sandbox
                </span>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={upgrading || upgradeDone}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition"
            >
              {upgradeDone ? 'Plan Upgraded! 🎉' : upgrading ? 'Processing Mock Payment...' : 'Confirm & Activate Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
