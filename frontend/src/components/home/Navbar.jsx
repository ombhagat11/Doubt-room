import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Settings, LogOut, LayoutDashboard, HelpCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) return null;

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Mentors', href: '#testimonials' },
    ];

    const scrollToSection = (e, href) => {
        if (href.startsWith('#') && location.pathname === '/') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                const offset = 100;
                const elementPosition = element.offsetTop - offset;
                window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            }
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
                isScrolled ? 'py-3' : 'py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`relative flex items-center justify-between transition-all duration-500 p-2.5 rounded-[24px] ${
                    isScrolled 
                    ? 'bg-white/80 backdrop-blur-2xl border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' 
                    : 'bg-transparent border border-transparent'
                }`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 pl-3 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-[10deg] shadow-lg shadow-primary-600/30 group-hover:shadow-primary-600/50">
                            <HelpCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-[900] tracking-tighter text-slate-900 group-hover:text-primary-600 transition-colors">
                            DoubtRoom
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-50/50 rounded-2xl border border-slate-100">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all duration-300 active:scale-95"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth & Utility Section */}
                    <div className="flex items-center gap-3 pr-2">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 border-2 border-white rounded-full"></span>
                                </button>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center gap-3 p-1 padding-right-4 bg-white border border-slate-200 rounded-[18px] hover:border-primary-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[14px] flex items-center justify-center text-white text-base font-[900] shadow-inner shadow-black/10">
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <div className="hidden sm:block text-left mr-1">
                                            <p className="text-[13px] font-bold text-slate-900 leading-none mb-0.5">{user?.name?.split(' ')[0]}</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{user?.role}</p>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 mr-2 text-slate-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180 text-primary-500' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                    className="absolute right-0 mt-4 w-64 bg-white rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-20 overflow-hidden"
                                                >
                                                    <div className="p-5 bg-slate-50 border-b border-slate-100">
                                                        <p className="text-[11px] font-[900] text-slate-400 uppercase tracking-widest mb-2">My Profile</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl font-[900] text-primary-600">
                                                                {user?.name?.charAt(0)}
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-sm font-extrabold text-slate-900 truncate">{user?.name}</p>
                                                                <p className="text-xs font-bold text-slate-500 truncate">{user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-2.5">
                                                        <Link to="/dashboard" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                                                            <LayoutDashboard className="w-4.5 h-4.5" />
                                                            Dashboard
                                                        </Link>
                                                        <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                                                            <User className="w-4.5 h-4.5" />
                                                            Profile Overview
                                                        </Link>
                                                        <Link to="/settings" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                                                            <Settings className="w-4.5 h-4.5" />
                                                            Settings
                                                        </Link>
                                                    </div>
                                                    <div className="p-2.5 border-t border-slate-100 italic">
                                                        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-[900] text-red-500 hover:bg-red-50 rounded-2xl transition-all group">
                                                            <LogOut className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-900 px-5 py-2.5 transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn btn-primary h-11 px-6 text-sm font-[900] shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)]">
                                    Join for Free
                                </Link>
                            </div>
                        )}
                        
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden ml-2 p-2.5 text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 right-0 mt-2 px-4"
                    >
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_24px_48px_rgba(0,0,0,0.12)] p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className="block px-6 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!isAuthenticated ? (
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                    <Link to="/login" className="btn btn-secondary border-slate-200 rounded-2xl">Log in</Link>
                                    <Link to="/register" className="btn btn-primary rounded-2xl">Sign up</Link>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-slate-100">
                                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 font-bold text-slate-700 hover:bg-slate-50 rounded-2xl">
                                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                                    </Link>
                                    <button onClick={logout} className="flex items-center gap-4 px-6 py-4 font-bold text-red-500 w-full text-left hover:bg-red-50 rounded-2xl italic">
                                        <LogOut className="w-5 h-5" /> Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

