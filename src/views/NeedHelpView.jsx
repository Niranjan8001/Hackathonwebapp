import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronRight, 
  Clock, 
  Headphones, 
  HelpCircle, 
  BookOpen, 
  Calendar, 
  ExternalLink,
  ChevronDown,
  X,
  Send,
  User,
  AlertCircle,
  CheckCircle2,
  Package,
  DollarSign,
  ShieldCheck,
  Truck,
  Settings,
  RefreshCcw,
  Smartphone,
  CreditCard,
  History,
  Plus,
  Upload,
  Image as ImageIcon,
  MoreVertical,
  LifeBuoy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFarmerContext } from '../context/FarmerContext';
import { GlassLayout } from '../components/layout/GlassLayout';
import { apiService } from '../services/apiService';

// --- UI Components ---

const GlassCard = ({ children, className = "", isHoverable = true }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all ${isHoverable ? 'hover:bg-white/[0.04] hover:border-white/20' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const FAQAccordion = ({ question, answer, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-black text-green-500/40 uppercase tracking-widest">{category}</p>
          <span className="text-base font-black text-white group-hover:text-green-400 transition-colors tracking-tight">{question}</span>
        </div>
        <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-green-500 text-black rotate-180' : 'bg-white/5 text-white/20 group-hover:bg-white/10 group-hover:text-white'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-sm text-white/40 leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickHelpCard = ({ icon: Icon, title, onClick }) => (
  <button 
    onClick={onClick}
    className="group bg-white/[0.03] hover:bg-green-500/10 border border-white/5 hover:border-green-500/20 p-6 rounded-[2rem] transition-all duration-500 text-left flex flex-col gap-4"
  >
    <div className="w-12 h-12 bg-white/5 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center text-white/20 group-hover:text-green-400 transition-all">
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-xs font-black text-white group-hover:text-green-400 uppercase tracking-widest transition-colors leading-tight">
      {title}
    </span>
  </button>
);

const SupportTicket = ({ id, subject, status, date }) => {
  const statusStyles = {
    'Open': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Resolved': 'bg-green-500/10 text-green-400 border-green-500/20'
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/20">
          <History className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">ID: #{id}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusStyles[status] || statusStyles['Open']}`}>
              {status}
            </span>
          </div>
          <h4 className="text-sm font-black text-white">{subject}</h4>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export const NeedHelpView = () => {
  const navigate = useNavigate();
  const { currentUser } = useFarmerContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi! How can we help you today?", sender: 'bot', time: '10:00 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // --- Real Data State ---
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);
  
  // Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Payment Issue',
    message: ''
  });

  const categories = ['All', 'Orders', 'Payments', 'Verification', 'Delivery', 'Account'];

  const faqs = [
    { category: 'Orders', question: 'How do I track my order?', answer: 'You can track your order in real-time from the "Orders" tab in your dashboard. Each order has a status tracker and expected delivery time.' },
    { category: 'Payments', question: 'When will I receive my earnings?', answer: 'Earnings are typically processed within 24-48 hours after successful delivery confirmation. You can view your balance in the "Earnings" tab.' },
    { category: 'Verification', question: 'How long does verification take?', answer: 'Our team manually reviews all profiles. This process usually takes 1-3 business days. You will receive a notification once verified.' },
    { category: 'Delivery', question: 'What if a delivery is delayed?', answer: 'If a delivery is delayed, please contact our support team immediately. We will coordinate with the logistics partner to resolve it.' },
    { category: 'Account', question: 'How do I reset my password?', answer: 'You can reset your password from the "Settings" page under the "Security" tab. If you are locked out, use the "Forgot Password" link on the login page.' },
    { category: 'Payments', question: 'Are there any commission fees?', answer: 'FarmDirect charges a minimal 2% platform fee on each successful transaction to maintain high-quality service and support.' },
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'All' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- API Calls ---
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await apiService.getSupportTickets(token);
      if (response && response.success) {
        setTickets(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) {
      setFormFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setFormFeedback(null);
      const token = localStorage.getItem('token');
      const response = await apiService.createSupportTicket(ticketForm, token);
      
      if (response && response.success) {
        setFormFeedback({ type: 'success', message: 'Ticket submitted successfully!' });
        setTicketForm({ subject: '', category: 'Payment Issue', message: '' });
        fetchTickets(); // Refresh list
      }
    } catch (err) {
      setFormFeedback({ type: 'error', message: err.message || 'Failed to submit ticket.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { id: Date.now(), text: newMessage, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Simulated Bot Response
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: "Thanks for reaching out! A support agent will be with you shortly.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <GlassLayout>
      <div className="max-w-[1400px] mx-auto pb-20 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        
        {/* --- 1. HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 mt-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-500">
                <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                <p className="text-[11px] font-black uppercase tracking-[0.5em]">24/7 Support</p>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85]">
                Need <span className="text-green-500">Help?</span>
              </h1>
              <p className="text-lg text-white/40 font-medium max-w-md leading-relaxed">
                We're here to help you grow. Explore our guides, chat with our team, or report any issues directly.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-8 py-5 bg-green-500 hover:bg-green-400 text-black rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(34,197,94,0.2)] active:scale-95">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-xs font-black uppercase tracking-widest text-white active:scale-95"
              >
                <LifeBuoy className="w-5 h-5 text-green-500" />
                Live Chat
              </button>
              <button className="flex items-center gap-3 px-8 py-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all text-xs font-black uppercase tracking-widest text-red-400 active:scale-95">
                <AlertCircle className="w-5 h-5" />
                Report Issue
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-green-500/10 blur-[120px] rounded-full animate-pulse" />
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full aspect-square bg-white/[0.03] border border-white/10 rounded-[4rem] flex items-center justify-center shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative -translate-y-16">
                {/* Multi-layered glow effects */}
                <div className="absolute inset-0 bg-green-500/20 blur-[60px] rounded-full group-hover:bg-green-500/40 transition-all duration-1000" />
                <div className="absolute inset-0 bg-green-400/10 blur-[20px] rounded-full animate-pulse" />
                
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Headphones className="w-56 h-56 text-green-500/30 group-hover:text-green-500/60 transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]" />
                </motion.div>

                {/* Decorative particles/glows around the icon */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-green-400 rounded-full blur-sm animate-ping" />
                <div className="absolute bottom-10 right-0 w-3 h-3 bg-green-500/50 rounded-full blur-md animate-pulse delay-700" />
              </div>
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/[0.05] border border-white/10 rounded-3xl backdrop-blur-xl">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Status</span>
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                 </div>
                 <p className="text-sm font-bold text-white">All systems are operational.</p>
                 <p className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-widest">Support wait time: ~2 mins</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- 2. SEARCH SUPPORT --- */}
        <div className="mb-24">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Search Knowledge Base</h2>
              <p className="text-sm text-white/30 font-medium">Quickly find answers to your questions through our articles</p>
            </div>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-green-400 transition-colors" />
              <input 
                type="text" 
                placeholder="How do I verify my farm details?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={100}
                className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 pl-16 pr-8 text-lg font-medium text-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all shadow-2xl placeholder:text-white/10"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-50 backdrop-blur-2xl"
                  >
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 px-2">Suggestions</p>
                    <div className="space-y-2">
                      {['How to change bank details', 'Withdrawal process', 'Order dispute resolution'].map(s => (
                        <button key={s} className="w-full text-left p-3 hover:bg-white/5 rounded-2xl text-sm font-bold text-white/60 hover:text-white transition-all flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-green-500" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- 3. QUICK HELP CARDS --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24">
          <QuickHelpCard icon={RefreshCcw} title="Reset Password" />
          <QuickHelpCard icon={Smartphone} title="Update Phone" />
          <QuickHelpCard icon={CreditCard} title="Payment Issues" />
          <QuickHelpCard icon={Truck} title="Delivery Delay" />
          <QuickHelpCard icon={ShieldCheck} title="Verification" />
          <QuickHelpCard icon={LifeBuoy} title="Refunds" />
        </div>

        {/* --- 4. FAQ & CONTACT SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* FAQ Section */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
                <p className="text-sm text-white/30 font-medium">Everything you need to know about FarmDirect</p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === c ? 'bg-green-500 border-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 divide-y divide-white/5">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, i) => (
                  <FAQAccordion key={i} {...faq} />
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                     <Search className="w-8 h-8 text-white/10" />
                   </div>
                   <p className="text-sm font-bold text-white/20 uppercase tracking-widest">No matching FAQs found</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-5 space-y-10">
            <GlassCard isHoverable={false} className="p-10 lg:p-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Send a Ticket</h3>
                  <p className="text-xs text-white/30 font-medium leading-relaxed">Fill out the form below and our team will get back to you within 24 hours.</p>
                </div>

                <form onSubmit={handleTicketSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      type="text" 
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      placeholder="Summary of your issue"
                      maxLength={100}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium text-white focus:outline-none focus:border-green-500/50 transition-all" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Email</label>
                      <input type="email" disabled defaultValue={currentUser?.email} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium text-white/40 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Issue Category</label>
                      <select 
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                        className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium text-white focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option>Payment Issue</option>
                        <option>Verification</option>
                        <option>Order Problem</option>
                        <option>App Bug</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      rows={5} 
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                      maxLength={2000}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium text-white focus:outline-none focus:border-green-500/50 transition-all resize-none" 
                      placeholder="Describe your issue in detail..." 
                    />
                  </div>

                  {formFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`p-4 rounded-xl text-xs font-bold flex items-center gap-3 ${formFeedback.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
                    >
                      {formFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {formFeedback.message}
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_20px_50px_rgba(34,197,94,0.2)] active:scale-95"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                  </button>
                </form>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* --- 5. TICKET HISTORY --- */}
        <div className="mb-24">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-white tracking-tight">Support History</h2>
                <p className="text-sm text-white/30 font-medium">Review your previous conversations with our team</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
                <Plus className="w-4 h-4" />
                New Request
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Fetching your tickets...</p>
                </div>
              ) : tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <SupportTicket 
                    key={ticket._id} 
                    id={ticket._id.slice(-6)} 
                    subject={ticket.subject} 
                    status={ticket.status || 'Open'} 
                    date={new Date(ticket.createdAt).toLocaleDateString()} 
                  />
                ))
              ) : (
                <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-[2.5rem] p-16 text-center space-y-4">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                     <History className="w-8 h-8 text-white/10" />
                   </div>
                   <div className="space-y-1">
                     <p className="text-sm font-black text-white/40 uppercase tracking-widest">No Support History</p>
                     <p className="text-[10px] text-white/20 font-medium">Any tickets you raise will appear here.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- 6. DIRECT CONTACT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-8 group">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Phone Support</h4>
                <p className="text-xl font-black text-white tracking-tighter">+91 98765 43210</p>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-green-500" />
                  Mon-Sat, 9AM - 6PM
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 group">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Email Us</h4>
                <p className="text-xl font-black text-white tracking-tighter">support@farmdirect.com</p>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-green-500" />
                  Response in ~4 hours
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 bg-green-500/5 group">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <LifeBuoy className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Emergency Help</h4>
                <p className="text-xl font-black text-white tracking-tighter">Priority Assistance</p>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Dedicated line for critical issues</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* --- 7. FOOTER TRUST --- */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-white/20">
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">Secure Support</span>
            </div>
            <div className="flex items-center gap-3 text-white/20">
               <CheckCircle2 className="w-4 h-4 text-green-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">Verified Agents</span>
            </div>
          </div>
          <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest">
            © 2026 FarmDirect Agricultural Services. All rights reserved.
          </p>
        </div>

      </div>

      {/* --- LIVE CHAT UI --- */}
      <AnimatePresence>
        {isChatOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-[400px] max-w-[90vw] h-[600px] max-h-[80vh] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[200] flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Chat Header */}
            <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/20">
                    <LifeBuoy className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Live Support</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/20 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${msg.sender === 'user' ? 'bg-green-500 text-black rounded-tr-none' : 'bg-white/5 text-white rounded-tl-none border border-white/10'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-2">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/[0.02]">
              <div className="relative">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..." 
                  maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium text-white focus:outline-none focus:border-green-500/50 transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-500 hover:bg-green-400 text-black rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 w-20 h-20 bg-green-500 rounded-3xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] flex items-center justify-center text-black z-[150] group"
          >
            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <MessageCircle className="w-10 h-10 relative z-10" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-white">1</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </GlassLayout>
  );
};

export default NeedHelpView;
