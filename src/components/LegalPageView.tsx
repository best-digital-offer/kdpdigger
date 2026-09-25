import React from 'react';
import { ArrowLeft, Mail, ShieldCheck, FileText, RefreshCcw, Scale } from 'lucide-react';

type LegalPage = 'terms' | 'privacy' | 'refund' | 'contact';

interface LegalPageViewProps {
  page: LegalPage;
  onBack: () => void;
}

const pageMeta: Record<LegalPage, { title: string; icon: React.ReactNode; intro: string }> = {
  terms: {
    title: 'Terms & Conditions',
    icon: <Scale className="w-5 h-5" />,
    intro: 'These Terms & Conditions govern your use of KDP Digger, an online research and validation service for independent authors.'
  },
  privacy: {
    title: 'Privacy Policy',
    icon: <ShieldCheck className="w-5 h-5" />,
    intro: 'This Privacy Policy explains what information KDP Digger collects, how it is used, and the choices available to you.'
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    icon: <RefreshCcw className="w-5 h-5" />,
    intro: 'This policy explains cancellation and refund treatment for KDP Digger digital research credits and subscription plans.'
  },
  contact: {
    title: 'Contact Us',
    icon: <Mail className="w-5 h-5" />,
    intro: 'For account, billing, research, privacy, refund, or other support questions, contact our support team by email.'
  }
};

export const LegalPageView: React.FC<LegalPageViewProps> = ({ page, onBack }) => {
  const meta = pageMeta[page];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft className="w-4 h-4" /> Back to KDP Digger
          </button>
          <div className="flex items-center gap-2">
            <img src="/kdp-digger-logo.svg" alt="KDP Digger" className="w-8 h-8 rounded-lg" />
            <span className="font-black text-slate-900">KDP Digger</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10">
          <div className="flex items-center gap-3 text-amber-700 mb-3">
            {meta.icon}
            <span className="text-xs font-bold uppercase tracking-wider">KDP Digger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950">{meta.title}</h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{meta.intro}</p>
          <p className="mt-2 text-xs text-slate-400">Last updated: September 25, 2026</p>

          {page === 'terms' && (
            <div className="mt-8 space-y-7 text-sm text-slate-700 leading-7">
              <section><h2 className="text-lg font-black text-slate-950">1. Acceptance</h2><p>By accessing or using KDP Digger, you agree to these Terms & Conditions. If you do not agree, please do not use the service.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">2. Service</h2><p>KDP Digger provides software tools for KDP market research, keyword discovery, niche analysis, category exploration, opportunity analysis, reports, and related exports. Research results are analytical indicators based on available data and AI processing and are not guarantees of sales, rankings, income, demand, or profitability.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">3. Accounts</h2><p>You are responsible for keeping your account credentials secure and for activity performed through your account. You must provide accurate account information and must not use another person's account without authorization.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">4. Credits, Plans and Payments</h2><p>Research credits are consumed when a research operation is successfully initiated and processed according to the plan shown at checkout. Current pricing and included credits are displayed on the Pricing page before purchase. Payment processing is handled through the payment provider selected by KDP Digger.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">5. Acceptable Use</h2><p>You must not abuse the service, attempt unauthorized access, interfere with service availability, reverse engineer security controls, scrape protected systems through KDP Digger, or use the service for unlawful activity.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">6. Intellectual Property</h2><p>KDP Digger software, branding, interface, and original service content remain the property of their respective owners. Your research outputs may be used for your own publishing and business activities, subject to applicable third-party rights.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">7. Availability</h2><p>We may update, improve, suspend, or temporarily restrict parts of the service for maintenance, security, technical reasons, or other operational needs.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">8. Disclaimer and Limitation</h2><p>KDP Digger is a research and decision-support tool. You are responsible for decisions you make using its outputs. To the extent permitted by applicable law, KDP Digger is not responsible for indirect or consequential losses arising from use of research results.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">9. Changes</h2><p>We may update these terms when the service, pricing, or legal requirements change. The current version will be published on this page.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">10. Contact</h2><p>Questions about these Terms can be sent to <a className="text-blue-600 font-semibold" href="mailto:support@kdpdigger.com">support@kdpdigger.com</a>.</p></section>
            </div>
          )}

          {page === 'privacy' && (
            <div className="mt-8 space-y-7 text-sm text-slate-700 leading-7">
              <section><h2 className="text-lg font-black text-slate-950">1. Information We Collect</h2><p>We may collect account information such as name and email address, authentication information supplied by your sign-in provider, research topics and report activity, saved reports, usage and credit information, and support communications.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">2. How We Use Information</h2><p>We use information to provide and secure the service, authenticate users, process research requests, maintain saved reports and usage records, manage credits and plans, provide customer support, prevent abuse, and improve reliability.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">3. Payments</h2><p>Payments are processed through the payment gateway selected for KDP Digger. Payment credentials are handled by the payment provider according to its policies. KDP Digger uses payment and transaction information needed to identify purchases, credits, refunds, and account status.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">4. AI and Service Providers</h2><p>Research requests may be processed by third-party infrastructure and AI providers used to operate KDP Digger. We send information needed to fulfill the requested operation and apply reasonable controls intended to protect account data.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">5. Cookies and Local Storage</h2><p>KDP Digger may use browser storage and similar technologies to maintain authentication sessions, preferences, and application state.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">6. Data Security</h2><p>We use reasonable technical and organizational measures to protect information. No internet service can guarantee absolute security.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">7. Data Retention</h2><p>Information is retained for as long as reasonably necessary to provide the service, maintain account and transaction records, resolve disputes, prevent abuse, and meet applicable legal obligations.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">8. Your Requests</h2><p>For questions or requests concerning your account information, contact <a className="text-blue-600 font-semibold" href="mailto:support@kdpdigger.com">support@kdpdigger.com</a>. We may need to verify your identity before processing an account or privacy request.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">9. Policy Changes</h2><p>We may update this policy when our practices or applicable requirements change. The current version will always be available on this page.</p></section>
            </div>
          )}

          {page === 'refund' && (
            <div className="mt-8 space-y-7 text-sm text-slate-700 leading-7">
              <section><h2 className="text-lg font-black text-slate-950">1. Digital Service</h2><p>KDP Digger provides digital research services and research credits. Because credits provide access to digital processing, a completed research operation is generally non-refundable once the credit has been consumed.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">2. Unused Credits</h2><p>If you purchased credits or a plan and have not used the purchased credits, you may contact us within 7 days of the transaction to request a refund. Eligibility may depend on the payment provider's rules and applicable law.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">3. Duplicate or Failed Charges</h2><p>Verified duplicate charges or payments collected for a transaction that did not provide the purchased service will be reviewed for correction or refund.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">4. Subscription Cancellation</h2><p>When recurring subscriptions are enabled, you may cancel future renewals through the account or billing controls made available by KDP Digger or the payment provider. Cancellation normally prevents the next renewal; it does not automatically refund a completed billing period.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">5. Refund Requests</h2><p>Send your request to <a className="text-blue-600 font-semibold" href="mailto:support@kdpdigger.com">support@kdpdigger.com</a> with the account email, transaction reference, date, amount, and reason for the request. Do not send full card numbers or passwords.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">6. Processing</h2><p>Approved refunds are sent through the original payment method where supported. Bank, card-network, UPI, or payment-provider processing times may vary.</p></section>
            </div>
          )}

          {page === 'contact' && (
            <div className="mt-8 space-y-6 text-sm text-slate-700 leading-7">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="font-black text-slate-950">N&amp;N Digitals</div>
                  <div className="text-xs text-slate-500 mt-1">KDP Digger — KDP market research and validation software</div>
                  <div className="text-xs text-slate-600 mt-2 leading-5">Sree Hemadurga Towers, 207 A Block, 2nd Floor<br />Alwin Cross, Miyapur, Hyderabad – 500049, Telangana, India</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="font-black text-slate-950">Customer Support</div>
                  <a href="mailto:support@kdpdigger.com" className="text-blue-600 font-semibold break-all">support@kdpdigger.com</a>
                  <div className="text-xs text-slate-600 mt-1">+91 91767 20224</div>
                  <div className="text-xs text-slate-500 mt-1">For account, billing, refund, privacy, and technical support</div>
                </div>
              </div>
              <section><h2 className="text-lg font-black text-slate-950">Support</h2><p>Email us with your registered account email and a clear description of the issue. For payment issues, include the transaction reference but never include your full card number, password, or authentication code.</p></section>
              <section><h2 className="text-lg font-black text-slate-950">Response</h2><p>We aim to respond to support requests as soon as reasonably possible. Complex billing, refund, or technical issues may require additional verification.</p></section>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© 2026 KDP Digger. All rights reserved.</span>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="/terms" className="hover:text-slate-900">Terms & Conditions</a>
            <a href="/privacy" className="hover:text-slate-900">Privacy Policy</a>
            <a href="/refund-cancellation" className="hover:text-slate-900">Refund & Cancellation</a>
            <a href="/contact" className="hover:text-slate-900">Contact Us</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};
