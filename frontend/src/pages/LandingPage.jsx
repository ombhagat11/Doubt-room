import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Navbar from '../components/home/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    Zap, 
    Trophy, 
    Target, 
    Sparkles, 
    MessageSquare, 
    CheckCircle2, 
    Star, 
    HelpCircle, 
    Code, 
    Globe, 
    Command,
    Terminal,
    Twitter,
    Github,
    Linkedin,
    ExternalLink,
    Send
} from 'lucide-react';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const [activeDemo, setActiveDemo] = useState(0);

    const demoQuestions = [
        {
            room: 'Data Structures',
            question: 'How do I implement a Binary Search Tree in JavaScript?',
            mentor: 'Sarah Chen',
            topAnswer: 'Start with a Node class containing value, left, and right pointers. The insert method should compare values recursion-free using a while loop for efficiency...',
            votes: 128
        },
        {
            room: 'React Framework',
            question: 'When should I use useCallback vs useMemo?',
            mentor: 'Alex Kumar',
            topAnswer: 'Use useCallback for memoizing function definitions to prevent stable child re-renders. Use useMemo for result of heavy operations.',
            votes: 245
        },
        {
            room: 'System Design',
            question: 'Scaling a rate limiter for 1M+ users?',
            mentor: 'Mike Zhang',
            topAnswer: 'Distributed state via Redis is mandatory. Use the Token Bucket algorithm with Lua scripting to ensure atomic increments across multiple clusters.',
            votes: 89
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDemo((prev) => (prev + 1) % demoQuestions.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <Target className="w-6 h-6 text-primary-600" />,
            title: 'Topic Ecosystems',
            description: 'Focused spaces for DSA, React, System Design, and niche technologies. No noise, just engineering.'
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            title: 'Instant Resolution',
            description: 'Experience living conversations. Get your doubts resolved as you type with low-latency sockets.'
        },
        {
            icon: <Trophy className="w-6 h-6 text-emerald-600" />,
            title: 'Reputation Engine',
            description: 'Level up your developer status. Earn reputation points and climb the global leaderboards.'
        },
        {
            icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
            title: 'Verified Mentors',
            description: 'Connect with industry leads from FAANG and high-growth startups globally.'
        }
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative pt-36 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary-50/30 to-transparent pointer-events-none -z-10" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full -z-10 animate-pulse" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-secondary-200/20 blur-[120px] rounded-full -z-10" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-100 shadow-sm text-xs font-black text-primary-600 uppercase tracking-widest mb-10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            v3.0 Engine is Live
                        </span>
                        
                        <h1 className="text-6xl lg:text-[100px] font-[950] text-slate-900 tracking-[-0.04em] mb-8 leading-[0.9] uppercase">
                            Evolve your <br />
                            <span className="italic text-primary-600 drop-shadow-sm">knowledge</span>
                        </h1>
                        
                        <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-500 mb-12 font-medium leading-relaxed italic">
                            The elite collaborative playground for developers. Join specialized rooms, ask sharp questions, and get expert guidance instantly from the global tech elite.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="btn btn-primary h-16 px-10 text-base shadow-2xl shadow-primary-600/30 font-black uppercase tracking-widest">
                                    Access Cloud Node <Terminal className="ml-3 w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary h-16 px-10 text-base shadow-2xl shadow-primary-600/30 font-black uppercase tracking-widest">
                                        Join the Grid <ArrowRight className="ml-3 w-5 h-5" />
                                    </Link>
                                    <Link to="/login" className="px-10 py-5 text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2">
                                        Exploration Mode <Command className="w-4 h-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-slate-100/60"
                    >
                        {[
                            { val: '50K+', label: 'Active Learners' },
                            { val: '120+', label: 'Global Mentors' },
                            { val: '98%', label: 'Resolution Rate' },
                            { val: '24/7', label: 'Up-time Support' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <p className="text-3xl font-[900] text-slate-900 group-hover:text-primary-600 transition-colors uppercase italic">{stat.val}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Live Preview Window */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", damping: 20 }}
                        className="bg-slate-900 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(30,41,59,0.5)] border border-slate-800 overflow-hidden"
                    >
                        <div className="bg-slate-800/80 backdrop-blur-xl px-8 py-5 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-400/80" />
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
                            </div>
                            <div className="px-5 py-1.5 bg-slate-900/50 rounded-full border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Live Session • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </div>
                            <div className="w-16" />
                        </div>
                        
                        <div className="p-10 lg:p-20 flex flex-col lg:flex-row gap-16">
                            <div className="flex-1">
                                <span className="text-xs font-black text-primary-400 uppercase tracking-widest mb-6 block opacity-70 italic">Current Context</span>
                                <h3 className="text-4xl lg:text-5xl font-[900] text-white mb-8 tracking-tighter uppercase leading-none">
                                    {demoQuestions[activeDemo].question}
                                </h3>
                                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[32px] border border-white/5 w-fit">
                                    <div className="flex -space-x-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-xl bg-slate-700 border-4 border-slate-800 flex items-center justify-center text-[10px] font-black shadow-lg">C{i}</div>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 italic">4 experts are typing solutions...</p>
                                </div>
                            </div>
                            
                            <div className="lg:w-[450px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeDemo}
                                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[40px] p-8 border border-white/10 relative shadow-2xl"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 text-xl font-black shadow-inner">
                                                {demoQuestions[activeDemo].mentor.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-base font-black text-white">{demoQuestions[activeDemo].mentor}</div>
                                                <div className="flex items-center gap-2 text-[10px] text-primary-400 font-black uppercase tracking-widest">
                                                    Verified Principal Mentor
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 font-medium text-slate-300 leading-relaxed italic mb-8 text-sm">
                                            "{demoQuestions[activeDemo].topAnswer}"
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-primary-500 font-black text-xs uppercase italic">
                                                <Sparkles className="w-4 h-4" /> Best response
                                            </div>
                                            <div className="text-white font-[900] text-sm tabular-nums">
                                                {demoQuestions[activeDemo].votes} UPVOTES
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Feed */}
            <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
                        <div className="max-w-2xl">
                            <span className="text-xs font-black text-primary-600 uppercase tracking-[0.3em] mb-4 block">System Capabilities</span>
                            <h2 className="text-5xl lg:text-7xl font-[900] text-slate-900 leading-[0.9] tracking-tighter uppercase">
                                Engineered for the <br /><span className="text-slate-400">knowledge elite.</span>
                            </h2>
                        </div>
                        <p className="max-w-sm text-lg text-slate-500 font-medium italic">Everything you need to bypass standard learning curves and reach technical singularity.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white p-10 rounded-[40px] border border-slate-100 hover:border-primary-100 shadow-sm hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="mb-8 p-4 bg-slate-50 rounded-[24px] w-fit group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 rotate-0 group-hover:-rotate-12">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter">{feature.title}</h3>
                                <p className="text-slate-500 font-medium leading-[1.6]">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Loop */}
            <section id="how-it-works" className="py-40 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600 opacity-20 blur-[160px] rounded-full -mr-96 -mt-96 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-600 opacity-10 blur-[160px] rounded-full -ml-64 -mb-64" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-32 items-center">
                        <div className="relative">
                            <h2 className="text-6xl lg:text-8xl font-[950] mb-12 leading-[0.85] uppercase tracking-[-0.04em]">
                                Resolution <br /> in <span className="text-primary-500 italic">Minutes.</span>
                            </h2>
                            <div className="space-y-12">
                                {[
                                    { title: "Select Arena", desc: "Choose your specialized room. From LLM Architecture to Kernel optimization.", icon: <Globe className="w-6 h-6" /> },
                                    { title: "Transmit Doubt", desc: "Broadcast your challenge with context. Our engine routes it to top mentors.", icon: <Send className="w-6 h-6" /> },
                                    { title: "Receive Protocol", desc: "Collaborate via real-time code injection and live discussions.", icon: <CheckCircle2 className="w-6 h-6" /> }
                                ].map((step, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ x: 20 }}
                                        className="flex gap-8 group"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl group-hover:bg-primary-600 transition-colors">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-[900] mb-2 uppercase italic italic">{step.title}</h4>
                                            <p className="text-slate-500 font-medium text-lg leading-relaxed">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full" />
                            <div className="bg-slate-900 rounded-[48px] p-10 border border-white/10 shadow-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-20"><Code className="w-32 h-32" /></div>
                                <pre className="font-mono text-base leading-loose whitespace-pre-wrap">
                                    <code className="block text-slate-300">
                                        <span className="text-primary-400 font-black">const</span> <span className="text-blue-400">doubtNode</span> = <span className="text-amber-400">new</span> <span className="text-emerald-400">CollaborationEngine</span>({`{
    latency: 'low',
    security: 'e2ee',
    power: 'unlimited'
}`});

<span className="text-slate-500 italic">// Initializing neural link...</span>
<span className="text-primary-400 font-black">await</span> <span className="text-blue-400">doubtNode</span>.<span className="text-amber-400">connect</span>({`{
    user: 'authenticated',
    room: 'architecture'
}`});

<span className="text-emerald-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-primary-300">'Knowledge Transfer Started.'</span>);
                                    </code>
                                </pre>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Social Signal */}
            <section id="community" className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-10 block">Global Sentiment</span>
                    <h2 className="text-5xl lg:text-7xl font-[900] text-slate-900 mb-24 tracking-tighter uppercase italic leading-[0.9]">
                        Validated by the <br /> <span className="text-primary-600 italic underline underline-offset-8">global community.</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12 text-left">
                        {[
                            { name: "Priya Sharma", role: "Sr. Engineer @ Stripe", text: "DoubtRoom is the stack overflow replacement I've been dreaming of. The real-time interaction eliminates 90% of the friction in debugging." },
                            { name: "Marcus Leon", role: "Software Architect", text: "The tier of mentorship here is unmatched. It's like having a senior engineer from FAANG sitting right next to you at 2 AM." },
                            { name: "Evelyn Reed", role: "Cloud Developer", text: "Clean, ultra-fast, and highly effective. This is how technical learning should have been built from the start." }
                        ].map((t, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-slate-50 p-12 rounded-[40px] border border-slate-100 flex flex-col justify-between hover:bg-white hover:shadow-2xl transition-all duration-300"
                            >
                                <p className="text-slate-700 text-xl font-medium leading-relaxed mb-10 italic">"{t.text}"</p>
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center font-black text-slate-400">PL</div>
                                    <div>
                                        <div className="font-black text-slate-900 uppercase italic leading-none mb-1">{t.name}</div>
                                        <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[64px] p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <h2 className="text-4xl lg:text-7xl font-[950] text-white mb-12 tracking-[-0.04em] uppercase leading-none italic"> Ready to break the <br /> <span className="text-primary-500">learning barrier?</span></h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Link to="/register" className="btn btn-primary h-20 px-16 text-xl shadow-2xl shadow-primary-600/30 font-black uppercase tracking-widest">Initialization Start</Link>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Join 50k+ Engineers <br /> 100% Free Forever</p>
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="py-24 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
                        <div className="max-w-sm">
                            <Link to="/" className="flex items-center gap-3 mb-8 group">
                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30 group-hover:rotate-12 transition-transform">
                                    <HelpCircle className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-3xl font-[950] tracking-tighter text-slate-900 uppercase italic">DoubtRoom</span>
                            </Link>
                            <p className="text-lg text-slate-400 font-medium italic">Building the infrastructure for the next generation of software elite.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
                            <div>
                                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Node Network</h5>
                                <ul className="space-y-4">
                                    <li><Link to="/dashboard" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest">Global Dashboard</Link></li>
                                    <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest">Menton Registry</a></li>
                                    <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest">Protocol Docs</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Social Grid</h5>
                                <ul className="flex flex-col gap-4">
                                    <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest"><Twitter className="w-4 h-4" /> Twitter</a>
                                    <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest"><Github className="w-4 h-4" /> GitHub</a>
                                    <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest"><Linkedin className="w-4 h-4" /> LinkedIn</a>
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">System</h5>
                                <ul className="space-y-4">
                                    <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest">Security Core</a></li>
                                    <li><a href="#" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors uppercase tracking-widest">Status <ExternalLink className="w-3 h-3" /></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase italic">© 2026 DOUBTROOM INC. ALL SIGNALS SECURED.</p>
                        <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <a href="#" className="hover:text-slate-900">Privacy Protocol</a>
                            <a href="#" className="hover:text-slate-900">Terms of Exchange</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;