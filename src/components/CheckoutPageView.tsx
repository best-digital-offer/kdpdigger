import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldCheck, CreditCard, LockKeyhole } from 'lucide-react';

type CheckoutPlan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  credits: number;
  description: string;
};

const PLANS: Record<string, CheckoutPlan> = {
  weekly: {
    id: 'plan_starter',
    name: 'Weekly',
    price: 249,
    duration: '7 days',
    credits: 15,
    description: 'A short research plan for authors testing a new KDP niche.'
  },
  monthly: {
    id: 'plan_pro',
    name: 'Monthly',
    price: 699,
    duration: '30 days',
    credits: 50,
    description: 'The standard KDP Digger research plan for active authors.'
  },
  yearly: {
    id: 'plan_publisher',
    name: 'Yearly',
    price: 4999,
    duration: '365 days',
    credits: 600,
    description: 'Long-term research access for publishers and frequent KDP users.'
  }
};

export const CheckoutPageView: React.FC<{ planKey: string }> = ({ planKey }) => {
  const plan = PLANS[planKey] || PLANS.monthly;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);

  const ready = Boolean(name.trim() && email.trim() && accepted);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft className="w-4 h-4" /> Back to KDP Digger
          </a>
          <div className="font-black text-slate-900">KDP Digger Checkout</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <CreditCard className="w-4 h-4" /> Secure Checkout
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Complete your {plan.name} plan</h1>
            <p className="text-sm text-slate-500 mt-2">Enter your details below. You will be charged in Indian Rupees (INR) during the current Paytm approval/testing phase.</p>

            <div className="mt-7 space-y-5">
              <label className="block">
                <span className="text-xs font-bold text-slate-700">Full Name</span>
                <input value={name} onChange={e => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-amber-500" placeholder="Your full name" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-700">Email Address</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-amber-500" placeholder="you@example.com" />
              </label>

              <label className="flex items-start gap-3 text-xs text-slate-600">
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-0.5" />
                <span>I agree to the <a href="/terms" className="text-blue-600 font-semibold">Terms & Conditions</a>, <a href="/privacy" className="text-blue-600 font-semibold">Privacy Policy</a>, and <a href="/refund-cancellation" className="text-blue-600 font-semibold">Refund & Cancellation Policy</a>.</span>
              </label>

              <button
                disabled={!ready}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm transition-colors"
              >
                Proceed to Paytm — ₹{plan.price.toLocaleString('en-IN')}
              </button>
              <p className="text-[11px] text-center text-slate-400">Paytm checkout integration will be connected to this button after the merchant checkout credentials/API configuration is enabled.</p>
            </div>
          </section>

          <aside className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</div>
            <h2 className="text-xl font-black mt-2">{plan.name} Plan</h2>
            <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
            <div className="mt-6 flex items-end justify-between border-b border-slate-100 pb-5">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-3xl font-black">₹{plan.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="py-5 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between"><span>Validity</span><strong>{plan.duration}</strong></div>
              <div className="flex justify-between"><span>Research credits</span><strong>{plan.credits}</strong></div>
              <div className="flex justify-between"><span>Currency</span><strong>INR (₹)</strong></div>
            </div>
            <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure payment processing</div>
              <div className="flex items-center gap-2"><LockKeyhole className="w-4 h-4 text-slate-400" /> Your payment details are handled by Paytm</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Digital service delivered to your KDP Digger account</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
