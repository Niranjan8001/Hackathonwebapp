import React, { useState } from 'react';
import { DesktopLayout } from '../components/layout/DesktopLayout';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  UserCircle,
  Truck,
  FileCheck,
  DollarSign,
  Settings,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  Clock,
  Headphones,
  HelpCircle,
  BookOpen,
  Calendar,
  ExternalLink
} from 'lucide-react';

/* ── Popular Topic Card ───────────────────────────────────────────── */
const TopicCard = ({ icon: Icon, title, description, color }) => (
  <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:border-green-400 dark:hover:border-green-500/50 transition-all group text-left w-full">
    <div className={`p-2.5 rounded-xl ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{title}</p>
      <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5 truncate">{description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-green-500 transition-colors flex-shrink-0" />
  </button>
);

/* ── FAQ Item ─────────────────────────────────────────────────────── */
const FAQItem = ({ question }) => (
  <button className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#334155] last:border-0 hover:bg-slate-50 dark:hover:bg-[#0F172A]/50 transition-colors text-left group">
    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{question}</span>
    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-green-500 flex-shrink-0 ml-3 transition-colors" />
  </button>
);

/* ── Contact Card ────────────────────────────────────────────────── */
const ContactCard = ({ icon: Icon, title, subtitle, badge, badgeColor }) => (
  <button className="flex items-center gap-4 py-3 w-full text-left group">
    <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">{title}</p>
      <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-0.5">{subtitle}</p>
    </div>
    {badge && (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor} flex items-center gap-1`}>
        {badge}
        <ChevronRight className="w-3 h-3" />
      </span>
    )}
    {!badge && (
      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
    )}
  </button>
);

export const NeedHelpView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const popularTopics = [
    { icon: Package, title: 'Managing Products', description: 'Add, edit or remove your farm products', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { icon: UserCircle, title: 'Account & Profile', description: 'Update your profile and account settings', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { icon: Truck, title: 'Orders & Deliveries', description: 'Track orders and manage deliveries', color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { icon: FileCheck, title: 'Verification & Documents', description: 'Learn about verification and documents', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { icon: DollarSign, title: 'Payments & Earnings', description: 'Get help with payments and withdrawals', color: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
    { icon: Settings, title: 'Store Settings', description: 'Manage your store and preferences', color: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  ];

  const faqs = [
    'How do I add a new product?',
    'How do I track my order?',
    'When will I receive my payment?',
    'How can I update my store information?',
  ];

  return (
    <DesktopLayout>
      <div className="px-4 md:px-8 pb-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#94A3B8] mb-2 pt-2">
          <button onClick={() => navigate('/dashboard')} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Dashboard</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-[#F8FAFC] font-medium">Need Help</span>
        </div>

        <div className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:border-green-500 dark:focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            {/* Popular Topics */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-6">
              <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-5">Popular Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {popularTopics.map((topic) => (
                  <TopicCard key={topic.title} {...topic} />
                ))}
              </div>
            </div>

            {/* Get in Touch + FAQs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Get in Touch */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-6">
                <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC] mb-1">Get in Touch</h2>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] mb-5">Can't find what you're looking for? Our support team is ready to help.</p>
                <div className="space-y-1 divide-y divide-slate-100 dark:divide-[#334155]">
                  <ContactCard
                    icon={MessageCircle}
                    title="Chat with Support"
                    subtitle="Available 9 AM – 6 PM"
                    badge="Online"
                    badgeColor="bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400"
                  />
                  <ContactCard
                    icon={Phone}
                    title="Call Us"
                    subtitle="+91 98765 43210"
                  />
                  <ContactCard
                    icon={Mail}
                    title="Email Us"
                    subtitle="support@farmdirect.com"
                  />
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-800 dark:text-[#F8FAFC]">FAQs</h2>
                  <button className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
                    View all FAQs
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  {faqs.map((q) => (
                    <FAQItem key={q} question={q} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT SIDEBAR ══════════ */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">

            {/* Help Center Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 dark:from-[#1E293B] dark:to-[#0F172A] dark:border-[#334155] rounded-xl p-6 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-xl">
                  <Headphones className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-white">Help Center</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">Find answers to common questions and learn how to make the most of FarmDirect.</p>
                </div>
              </div>
              <button className="relative z-10 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Browse Help Center
              </button>
            </div>

            {/* Need Immediate Help Card */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-6">
              <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-1">Need Immediate Help?</h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mb-4">Our support team is here for you.</p>
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 rounded-xl p-4">
                <div className="bg-green-500 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Average response time</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">Under 2 minutes</p>
                </div>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-6">
              <h3 className="font-bold text-slate-800 dark:text-[#F8FAFC] mb-4">Support Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">Monday – Saturday</p>
                    <p className="text-xs text-slate-500 dark:text-[#94A3B8]">9:00 AM – 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-[#F8FAFC]">Sunday</p>
                    <p className="text-xs text-slate-500 dark:text-[#94A3B8]">10:00 AM – 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-[#334155]">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <p className="text-xs text-slate-500 dark:text-[#94A3B8]">All times are in IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
};
