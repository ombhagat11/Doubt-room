import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-indigo-700 opacity-90"></div>

                {/* Animated Blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow animation-delay-4000"></div>

                {/* Content */}
                <div className="relative container-custom py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl lg:text-7xl font-display font-bold text-white mb-6 animate-fade-in">
                            Real-Time Doubt Resolution
                            <span className="block text-yellow-300 mt-2">Made Simple</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto animate-slide-up">
                            Join topic-based rooms, ask questions, get expert answers instantly.
                            No more waiting. No more confusion.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                                    Go to Dashboard
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn bg-white text-primary-700 hover:bg-blue-50 text-lg px-8 py-4 shadow-2xl">
                                        Get Started Free
                                    </Link>
                                    <Link to="/login" className="btn btn-outline border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white">1000+</div>
                                <div className="text-blue-200 mt-1">Questions Resolved</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white">500+</div>
                                <div className="text-blue-200 mt-1">Active Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white">50+</div>
                                <div className="text-blue-200 mt-1">Expert Mentors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Problem Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            The Problem We Solve
                        </h2>
                        <p className="text-xl text-slate-600">
                            Traditional learning platforms are slow, cluttered, and asynchronous
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Slow Responses</h3>
                            <p className="text-slate-600">Wait hours or days for answers on forums and email</p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Cluttered Interface</h3>
                            <p className="text-slate-600">Hard to find relevant doubts in messy chat groups</p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Structure</h3>
                            <p className="text-slate-600">Questions get lost in endless message threads</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            How DoubtRoom Works
                        </h2>
                        <p className="text-xl text-slate-600">
                            Structured, real-time, and collaborative doubt resolution
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Join Topic-Based Rooms</h3>
                                    <p className="text-slate-600">Choose from DSA, React, System Design, and more. Stay focused on what you're learning.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-secondary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Ask Structured Questions</h3>
                                    <p className="text-slate-600">Post clear, focused questions that stay pinned until resolved. No chat clutter.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Get Expert Answers</h3>
                                    <p className="text-slate-600">Mentors and peers provide answers. Upvote the best ones. Mark as resolved.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Build Reputation</h3>
                                    <p className="text-slate-600">Earn points for helping others. Track your learning progress.</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-glass p-8">
                            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
                                <div className="text-sm font-medium mb-2">Live Room: DSA</div>
                                <div className="text-2xl font-bold mb-4">How to reverse a linked list?</div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                        12 active
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                        3 answers
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <div className="flex items-start gap-3">
                                        <div className="text-primary-600 font-semibold">↑ 5</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900">Use three pointers...</div>
                                            <div className="text-sm text-slate-600 mt-1">by @mentor_raj</div>
                                        </div>
                                        <span className="badge badge-success">Accepted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
                <div className="container-custom text-center">
                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                        Ready to Resolve Your Doubts?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of students getting instant help from expert mentors
                    </p>
                    {!isAuthenticated && (
                        <Link to="/register" className="btn bg-white text-primary-700 hover:bg-blue-50 text-lg px-8 py-4 shadow-2xl">
                            Start Learning Now - It's Free
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="container-custom">
                    <div className="text-center">
                        <h3 className="text-2xl font-display font-bold text-white mb-2">DoubtRoom</h3>
                        <p className="text-slate-400 mb-4">Real-Time Q&A Platform for Students</p>
                        <div className="text-sm text-slate-500">
                            © 2026 DoubtRoom. Built with MERN Stack + Socket.IO
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
