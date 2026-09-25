import React, { useState } from 'react';
import { X, Check, Zap, Coins, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { PricingPlan, User } from '../types.ts';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onActivatePlan: (planId: string) => Promise<void>;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'plan_starter',
    name: 'Weekly',
    price: 249,
    durationDays: 7,
    credits: 15,
    features: [
      '10 Full AI Opportunity Reports',
      'Live Amazon Autocomplete Keyword Clusters',
      'Sub-Niche & Positioning Gaps',
      'Competitor URL/ASIN Analyzer',
      'Private Saved Research Library'
    ],
    recommended: false
  },
  {
    id: 'plan_pro',
    name: 'Monthly',
    price: 699,
    durationDays: 30,
    credits: 50,
    features: [
      '50 Full AI Opportunity Reports',
      'Full Competitor Research & Comparison',
      'Complete Keyword & Niche Research',
      'Live Amazon Autocomplete Keywords',
      'Saved Reports & Export Tools',
      'Priority processing'
    ],
    recommended: true
  },
  {
    id: 'plan_publisher',
    name: 'Yearly',
    price: 4999,
    durationDays: 365,
    credits: 600,
    features: [
      '600 Full AI Opportunity Reports',
      'Unlimited saved report access',
      'All complete research sections',
      'CSV, Markdown & report exports',
      'Priority processing & support',
      'Best value for active publishers'
    ],
    recommended: false
  }
];

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onActivatePlan
}) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const checkoutPath = (planId: string) => {
    if (planId === 'plan_starter') return '/checkout/weekly';
    if (planId === 'plan_pro') return '/checkout/monthly';
    return '/checkout/yearly';
  };

  const handleSelectPlan = (planId: string) => {
    window.location.href = checkoutPath(planId);
  };

  return (
    <div id="pricing-modal-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Micro-SaaS Fair-Use Pricing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Simple KDP Research Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Affordable subscriptions for authors who want powerful KDP research without expensive research tools.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Current Balance: <strong>{currentUser.credits} research credits</strong> ({currentUser.plan} plan)</span>
          </div>
          <span className="font-semibold text-amber-800">1 Credit = 1 Comprehensive AI Opportunity Report</span>
        </div>

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Plans Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 overflow-y-auto">
          {DEFAULT_PLANS.map((plan) => {
            const isCurrent = currentUser.plan.toLowerCase().includes(plan.name.toLowerCase().split(' ')[0]);
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  plan.recommended
                    ? 'border-2 border-amber-500 bg-amber-50/20 shadow-md relative'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-black text-slate-950">₹{plan.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-500">/ {plan.durationDays} Days</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100/70 text-amber-900 text-xs font-bold mb-4">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>{plan.credits} Research Credits</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      plan.recommended
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Checkout for ₹{plan.price.toLocaleString("en-IN")}</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-center text-slate-400 block mt-1.5">
                    Paytm secure checkout &bull; Cancel anytime
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee and Fair-Use Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fair-Use Policy: 1 research credit gives you a full multi-stage report with keyword clustering.</span>
          </div>
          <span className="font-semibold text-slate-700">No hidden fees. Cancel anytime.</span>
        </div>
      </div>
    </div>
  );
};
