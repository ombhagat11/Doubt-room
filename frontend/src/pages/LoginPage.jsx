import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft, Info } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-primary-50 to-transparent pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full mx-auto relative z-10"
            >
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h1>
                    <p className="text-slate-500 font-medium">Continue your learning journey with DoubtRoom</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600 flex items-center gap-3"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="input-modern pl-11"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="block text-sm font-bold text-slate-700">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="input-modern pl-11"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary-600/20"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign in <LogIn className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            New to DoubtRoom?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100/50 flex gap-4">
                    <div className="flex-shrink-0">
                        <Info className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-900 mb-1">Testing DoubtRoom?</h4>
                        <p className="text-xs text-amber-700 leading-relaxed font-medium">Use <span className="font-bold">student@test.com</span> or <span className="font-bold">mentor@test.com</span> with password <span className="font-bold">password123</span>.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;

