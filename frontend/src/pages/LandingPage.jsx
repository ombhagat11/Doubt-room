import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Navbar from '../components/home/Navbar';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const [activeDemo, setActiveDemo] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const demoQuestions = [
        {
            room: 'Data Structures',
            question: 'How do I implement a Binary Search Tree in JavaScript?',
            answers: 3,
            active: 8,
            status: 'active',
            topAnswer: 'Start with a Node class containing value, left, and right...',
            mentor: 'Sarah Chen',
            votes: 12
        },
        {
            room: 'React',
            question: 'When should I use useCallback vs useMemo?',
            answers: 5,
            active: 15,
            status: 'resolved',
            topAnswer: 'useCallback memoizes functions, useMemo memoizes values...',
            mentor: 'Alex Kumar',
            votes: 24
        },
        {
            room: 'System Design',
            question: 'How to design a rate limiter for an API?',
            answers: 7,
            active: 12,
            status: 'active',
            topAnswer: 'Consider using a token bucket algorithm with Redis...',
            mentor: 'Mike Zhang',
            votes: 18
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDemo((prev) => (prev + 1) % demoQuestions.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: '🎯',
            title: 'Topic-Based Rooms',
            description: 'Organized spaces for DSA, React, System Design, and more'
        },
        {
            icon: '⚡',
            title: 'Real-Time Answers',
            description: 'Get responses in minutes, not hours or days'
        },
        {
            icon: '🏆',
            title: 'Reputation System',
            description: 'Earn points and build credibility by helping others'
        },
        {
            icon: '✨',
            title: 'Clean Interface',
            description: 'No clutter, just focused Q&A that stays organized'
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            {/* Minimalist Hero Section */}
            <section className="relative bg-white border-b border-neutral-200 overflow-hidden">
                {/* Subtle animated background */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-float-delayed"></div>
                </div>

                <div className="relative container-custom py-24 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm font-medium text-neutral-700 mb-8 animate-fade-in">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            500+ students learning right now
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 mb-6 tracking-tight animate-slide-up" style={{ fontFamily: "'Cal Sans', system-ui, sans-serif" }}>
                            Get answers to your
                            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                coding questions
                            </span>
                            <span className="block mt-2">in real-time</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl lg:text-2xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Join focused topic rooms, ask clear questions, get expert answers instantly. No more endless scrolling through forums.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {isAuthenticated ? (
                                <Link 
                                    to="/dashboard" 
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Go to Dashboard
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        to="/register" 
                                        className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Start for free
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-xl border-2 border-neutral-200 hover:border-neutral-300 transition-all duration-300"
                                    >
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats - Minimal Design */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-neutral-200">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-neutral-900 mb-1">1,247</div>
                                <div className="text-sm text-neutral-500">Questions resolved</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-neutral-900 mb-1">2.4min</div>
                                <div className="text-sm text-neutral-500">Avg response time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-neutral-900 mb-1">50+</div>
                                <div className="text-sm text-neutral-500">Expert mentors</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section id="features" className="py-24 bg-gradient-to-b from-white to-neutral-50">
                <div className="container-custom">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-4">
                                See it in action
                            </h2>
                            <p className="text-xl text-neutral-600">
                                Watch how questions get resolved in real-time
                            </p>
                        </div>

                        {/* Live Demo Card */}
                        <div className="relative">
                            {/* Demo selector dots */}
                            <div className="flex justify-center gap-2 mb-6">
                                {demoQuestions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveDemo(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            activeDemo === index ? 'w-8 bg-neutral-900' : 'bg-neutral-300 hover:bg-neutral-400'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
                                {/* Window header */}
                                <div className="flex items-center gap-2 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 text-center text-sm text-neutral-500 font-medium">
                                        doubtroom.app/rooms/{demoQuestions[activeDemo].room.toLowerCase().replace(' ', '-')}
                                    </div>
                                </div>

                                {/* Demo content */}
                                <div className="p-8">
                                    {/* Room badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium mb-4">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                        </svg>
                                        {demoQuestions[activeDemo].room}
                                    </div>

                                    {/* Question */}
                                    <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                                        {demoQuestions[activeDemo].question}
                                    </h3>

                                    {/* Meta info */}
                                    <div className="flex items-center gap-4 mb-6 text-sm text-neutral-500">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                            {demoQuestions[activeDemo].active} active
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                            </svg>
                                            {demoQuestions[activeDemo].answers} answers
                                        </span>
                                        {demoQuestions[activeDemo].status === 'resolved' && (
                                            <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Resolved
                                            </span>
                                        )}
                                    </div>

                                    {/* Top Answer */}
                                    <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <button className="p-1 hover:bg-neutral-200 rounded transition-colors">
                                                    <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                                <span className="text-lg font-bold text-neutral-900">{demoQuestions[activeDemo].votes}</span>
                                                <button className="p-1 hover:bg-neutral-200 rounded transition-colors">
                                                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full"></div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-900">{demoQuestions[activeDemo].mentor}</div>
                                                        <div className="text-xs text-neutral-500">Senior Developer</div>
                                                    </div>
                                                    {demoQuestions[activeDemo].status === 'resolved' && (
                                                        <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                            ✓ Accepted
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-neutral-700 leading-relaxed">
                                                    {demoQuestions[activeDemo].topAnswer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Minimal */}
            <section className="py-24 bg-white">
                <div className="container-custom">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="group p-6 rounded-xl hover:bg-neutral-50 transition-all duration-300 cursor-default"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works - Visual Timeline */}
            <section id="how-it-works" className="py-24 bg-neutral-50">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-4">
                                How it works
                            </h2>
                            <p className="text-xl text-neutral-600">
                                Four simple steps to get your answers
                            </p>
                        </div>

                        <div className="space-y-12">
                            {[
                                {
                                    number: '01',
                                    title: 'Choose a room',
                                    description: 'Browse topic-based rooms like DSA, React, System Design, or Web Development. Each room is focused and organized.',
                                    color: 'from-blue-500 to-indigo-500'
                                },
                                {
                                    number: '02',
                                    title: 'Ask your question',
                                    description: 'Post a clear, structured question. Add code snippets, context, or screenshots to help mentors understand your doubt.',
                                    color: 'from-indigo-500 to-purple-500'
                                },
                                {
                                    number: '03',
                                    title: 'Get expert answers',
                                    description: 'Mentors and peers provide detailed answers. Upvote helpful responses and mark the best answer as accepted.',
                                    color: 'from-purple-500 to-pink-500'
                                },
                                {
                                    number: '04',
                                    title: 'Build your reputation',
                                    description: 'Help others by answering questions. Earn reputation points and climb the leaderboard as you contribute.',
                                    color: 'from-pink-500 to-red-500'
                                }
                            ].map((step, index) => (
                                <div key={index} className="flex gap-8 items-start group">
                                    <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {step.number}
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-neutral-600 leading-relaxed text-lg">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section id="testimonials" className="py-24 bg-white">
                <div className="container-custom">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-4">
                                Loved by students
                            </h2>
                            <p className="text-xl text-neutral-600">
                                Join hundreds who've already accelerated their learning
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    text: "Finally, a platform where I get answers in minutes instead of hours. The topic-based rooms keep everything organized.",
                                    author: "Priya Sharma",
                                    role: "CS Student"
                                },
                                {
                                    text: "The quality of answers here is incredible. Mentors actually take time to explain concepts clearly with examples.",
                                    author: "Rahul Verma",
                                    role: "Web Developer"
                                },
                                {
                                    text: "Love how clean and focused the interface is. No more scrolling through endless chat messages to find relevant doubts.",
                                    author: "Ananya Patel",
                                    role: "Bootcamp Student"
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-neutral-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-neutral-700 mb-4 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div>
                                        <div className="font-semibold text-neutral-900">{testimonial.author}</div>
                                        <div className="text-sm text-neutral-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA - Minimal */}
            <section className="py-24 bg-neutral-900 text-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                            Start getting answers today
                        </h2>
                        <p className="text-xl text-neutral-300 mb-10">
                            Join 500+ students who are learning faster with real-time help from expert mentors
                        </p>
                        {!isAuthenticated && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/register" 
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-xl hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Create free account
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white rounded-xl border-2 border-neutral-700 hover:border-neutral-500 transition-all duration-300"
                                >
                                    Sign in
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer - Clean & Minimal */}
            <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 py-12">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-white mb-1">DoubtRoom</h3>
                            <p className="text-sm">Real-time Q&A for developers</p>
                        </div>
                        <div className="text-sm text-neutral-500">
                            © 2026 DoubtRoom. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Inline Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-20px) scale(1.1); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }

                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float-delayed 18s ease-in-out infinite;
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                    opacity: 0;
                }
            `}} />
        </div>
    );
};

export default LandingPage;