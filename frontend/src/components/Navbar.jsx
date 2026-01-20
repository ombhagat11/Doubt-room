import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { Command } from 'cmdk'; // Uncomment if you install cmdk

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [openSearch, setOpenSearch] = useState(false);

    // Toggle Search on Ctrl+K / Cmd+K
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpenSearch((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container-custom mx-auto px-4">
                    <div className="flex h-16 items-center">
                        
                        {/* LEFT: Logo - Wrapped in flex-1 to push center content */}
                        <div className="flex flex-1 items-center gap-8">
                            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 transition-opacity hover:opacity-80">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 shadow-sm">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                                    DoubtRoom
                                </span>
                            </Link>

                           
                        </div>

                        {/* CENTER: CMDK Trigger */}
                        <div className="flex flex-1 justify-center">
                            <button 
                                onClick={() => setOpenSearch(true)}
                                className="group flex h-9 w-full max-w-sm items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition-all hover:border-primary-300 hover:bg-white hover:shadow-sm hover:ring-2 hover:ring-primary-100 focus:outline-none"
                            >
                                <svg className="h-4 w-4 text-slate-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="flex-1 text-left">Search rooms, questions...</span>
                                <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline-block">
                                    ⌘ + K
                                </kbd>
                            </button>
                        </div>

                        {/* RIGHT: User Actions - Wrapped in flex-1 to balance layout */}
                        <div className="flex flex-1 justify-end items-center gap-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    {/* Notification Icon (Optional) */}
                                    <button className="text-slate-500 hover:text-slate-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 outline-none">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold shadow-md ring-2 ring-white">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 top-full mt-2 w-48 origin-top-right scale-95 transform opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 visible invisible group-hover:visible z-50">
                                            <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                                                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                                                </div>
                                                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                                    Profile
                                                </Link>
                                                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left w-full">
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* CMDK Modal Overlay Placeholder */}
            {openSearch && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] bg-black/20 backdrop-blur-sm" onClick={() => setOpenSearch(false)}>
                    {/* This would be your actual <Command.Dialog> content */}
                    <div 
                        className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all p-4"
                        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input 
                                autoFocus
                                placeholder="Search commands or questions..." 
                                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                            />
                            <button onClick={() => setOpenSearch(false)} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">ESC</button>
                        </div>
                        <div className="text-xs text-slate-500 font-medium px-2 py-1">SUGGESTIONS</div>
                        {/* Mock Results */}
                        <div className="space-y-1">
                            {['How to use React?', 'AuthContext Setup', 'Tailwind Grid'].map((item) => (
                                <div key={item} className="px-2 py-2 hover:bg-slate-50 rounded-lg cursor-pointer text-sm text-slate-700 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;