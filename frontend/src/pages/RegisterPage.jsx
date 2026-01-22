import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowLeft, GraduationCap, Briefcase } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.role
        );

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
                className="max-w-xl w-full mx-auto relative z-10"
            >
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Create an account</h1>
                    <p className="text-slate-500 font-medium">Join our community of over 5,000+ developers</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600 flex items-center gap-3"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="input-modern pl-11"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="input-modern pl-11"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="input-modern pl-11"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="input-modern pl-11"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'student'})}
                                    className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                        formData.role === 'student' 
                                        ? 'bg-primary-50 border-primary-500 shadow-sm shadow-primary-200/50' 
                                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl ${formData.role === 'student' ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <span className={`text-sm font-bold ${formData.role === 'student' ? 'text-primary-900' : 'text-slate-600'}`}>Student</span>
                                    {formData.role === 'student' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-500" />}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'mentor'})}
                                    className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                        formData.role === 'mentor' 
                                        ? 'bg-primary-50 border-primary-500 shadow-sm shadow-primary-200/50' 
                                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl ${formData.role === 'mentor' ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <span className={`text-sm font-bold ${formData.role === 'mentor' ? 'text-primary-900' : 'text-slate-600'}`}>Mentor</span>
                                    {formData.role === 'mentor' && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-500" />}
                                </button>
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-4 font-medium italic">
                                {formData.role === 'mentor' 
                                    ? "Mentors can moderate rooms and verify solutions." 
                                    : "Students can join rooms and post unlimited doubts."}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-4 text-base shadow-lg shadow-primary-600/20"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create account <UserPlus className="w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            Already a member?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;

