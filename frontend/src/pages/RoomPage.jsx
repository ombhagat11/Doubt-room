import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import Navbar from '../components/home/Navbar';
import QuestionCard from '../components/QuestionCard';
import AnswerCard from '../components/AnswerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Plus, 
    Users, 
    MessageCircle, 
    CheckCircle2, 
    TrendingUp, 
    Shield, 
    Info, 
    Image as ImageIcon, 
    X,
    Send,
    Filter,
    Activity
} from 'lucide-react';

const RoomPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ text: '', priority: 'medium', image: null });
    const [newAnswer, setNewAnswer] = useState('');
    const [filter, setFilter] = useState('pending'); // pending, resolved, all
    const [imagePreview, setImagePreview] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchRoom();
        fetchQuestions();

        try {
            const socket = getSocket();
            socketRef.current = socket;
            socket.emit('joinRoom', { roomId: id });
            socket.on('userJoined', handleUserJoined);
            socket.on('userLeft', handleUserLeft);
            socket.on('newQuestion', handleNewQuestion);
            socket.on('newAnswer', handleNewAnswer);
            socket.on('questionResolved', handleQuestionResolved);
            socket.on('questionPinned', handleQuestionPinned);
            socket.on('answerUpvoted', handleAnswerUpvoted);

            return () => {
                socket.emit('leaveRoom', { roomId: id });
                socket.off('userJoined');
                socket.off('userLeft');
                socket.off('newQuestion');
                socket.off('newAnswer');
                socket.off('questionResolved');
                socket.off('questionPinned');
                socket.off('answerUpvoted');
            };
        } catch (err) {
            console.error('Socket error:', err);
        }
    }, [id]);

    useEffect(() => {
        if (selectedQuestion) fetchAnswers(selectedQuestion._id);
    }, [selectedQuestion]);

    useEffect(() => {
        fetchQuestions();
    }, [filter]);

    const handleUserJoined = (data) => setActiveUsers(data.activeUsers || []);
    const handleUserLeft = (data) => setActiveUsers(data.activeUsers || []);
    const handleNewQuestion = () => fetchQuestions();
    const handleNewAnswer = (data) => {
        if (selectedQuestion && data.questionId === selectedQuestion._id) fetchAnswers(selectedQuestion._id);
        fetchQuestions();
    };
    const handleQuestionResolved = (data) => {
        fetchQuestions();
        if (selectedQuestion && data.questionId === selectedQuestion._id) {
            setSelectedQuestion({ ...selectedQuestion, isResolved: true });
        }
    };
    const handleQuestionPinned = () => fetchQuestions();
    const handleAnswerUpvoted = () => {
        if (selectedQuestion) fetchAnswers(selectedQuestion._id);
    };

    const fetchRoom = async () => {
        try {
            const response = await api.get(`/rooms/${id}`);
            setRoom(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch room');
        }
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const params = filter === 'all' ? {} : { resolved: filter === 'resolved' };
            const response = await api.get(`/questions/room/${id}`, { params });
            setQuestions(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnswers = async (questionId) => {
        try {
            const response = await api.get(`/answers/question/${questionId}`);
            setAnswers(response.data.data);
        } catch (err) {
            console.error('Failed to fetch answers:', err);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return setError('Image size must be less than 2MB');
            if (!file.type.startsWith('image/')) return setError('Please upload an image file');
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewQuestion({ ...newQuestion, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/questions', {
                roomId: id,
                text: newQuestion.text,
                priority: newQuestion.priority,
                image: newQuestion.image
            });
            if (socketRef.current) socketRef.current.emit('askQuestion', response.data.data);
            setNewQuestion({ text: '', priority: 'medium', image: null });
            setImagePreview(null);
            setShowQuestionForm(false);
            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post question');
        }
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!selectedQuestion) return;
        try {
            const response = await api.post('/answers', { questionId: selectedQuestion._id, text: newAnswer });
            if (socketRef.current) socketRef.current.emit('answerQuestion', { questionId: selectedQuestion._id, answer: response.data.data });
            setNewAnswer('');
            setShowAnswerForm(false);
            fetchAnswers(selectedQuestion._id);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit answer');
        }
    };

    const handleResolveQuestion = async (questionId) => {
        try {
            await api.put(`/questions/${questionId}/resolve`);
            if (socketRef.current) socketRef.current.emit('markResolved', { questionId });
            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resolve');
        }
    };

    const handlePinQuestion = async (questionId) => {
        try {
            await api.put(`/questions/${questionId}/pin`);
            if (socketRef.current) socketRef.current.emit('pinQuestion', { questionId });
            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to pin');
        }
    };

    const handleVoteAnswer = async (answerId) => {
        try {
            await api.put(`/answers/${answerId}/vote`);
            if (socketRef.current) socketRef.current.emit('upvoteAnswer', { answerId });
            fetchAnswers(selectedQuestion._id);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to vote');
        }
    };

    const handleAcceptAnswer = async (answerId) => {
        try {
            await api.put(`/answers/${answerId}/accept`);
            fetchAnswers(selectedQuestion._id);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to accept');
        }
    };

    if (!room && !loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Navbar />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-[900] text-slate-900 mb-2 tracking-tight">Room not found</h2>
                    <p className="text-slate-500 mb-8 font-medium">This room might have been deleted or is no longer accessible.</p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary px-8">Return to Dashboard</button>
                </motion.div>
            </div>
        );
    }

    const successRate = room?.totalQuestions > 0 ? Math.round((room.resolvedQuestions / room.totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                {/* Room Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                    
                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={() => navigate('/dashboard')} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                                </button>
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-200">
                                    {room?.topic}
                                </span>
                                {activeUsers.length > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{activeUsers.length} Online</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl font-[900] text-slate-900 tracking-tight mb-2 leading-none uppercase">
                                {room?.title}
                            </h1>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                                {room?.description || "Collaborative space for solving subject-specific doubts and mastering concepts together."}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="grid grid-cols-3 gap-6 pr-8 border-r border-slate-100 hidden sm:grid">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-2xl font-[900] text-slate-900">{room?.totalQuestions || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solved</p>
                                    <p className="text-2xl font-[900] text-emerald-600">{room?.resolvedQuestions || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rate</p>
                                    <p className="text-2xl font-[900] text-primary-600">{successRate}%</p>
                                </div>
                            </div>
                            <button onClick={() => setShowQuestionForm(true)} className="btn btn-primary h-14 px-8 shadow-lg shadow-primary-600/30 font-black uppercase tracking-widest text-sm">
                                <Plus className="w-5 h-5 mr-2" />
                                Ask Doubt
                            </button>
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-sm">
                        <Activity className="w-5 h-5" /> {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar (Desktop) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm sticky top-28">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filters
                            </h3>
                            <nav className="space-y-2">
                                {[
                                    { id: 'pending', label: 'Pending Doubts', icon: <MessageCircle className="w-4.5 h-4.5" />, color: 'text-amber-500' },
                                    { id: 'resolved', label: 'Resolved', icon: <CheckCircle2 className="w-4.5 h-4.5" />, color: 'text-emerald-500' },
                                    { id: 'all', label: 'All Activity', icon: <TrendingUp className="w-4.5 h-4.5" />, color: 'text-primary-500' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilter(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-sm transition-all ${
                                            filter === tab.id 
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className={filter === tab.id ? 'text-white' : tab.color}>{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-6">
                                <div>
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Presence
                                    </h3>
                                    <div className="flex -space-x-3 overflow-hidden p-1">
                                        {activeUsers.slice(0, 5).map((u, i) => (
                                            <div key={i} className="inline-block h-10 w-10 rounded-xl ring-4 ring-white bg-slate-100 flex items-center justify-center font-black text-xs text-slate-600 border border-slate-200 uppercase tracking-tighter">
                                                {u.name?.charAt(0)}
                                            </div>
                                        ))}
                                        {activeUsers.length > 5 && (
                                            <div className="flex items-center justify-center h-10 w-10 rounded-xl ring-4 ring-white bg-slate-900 text-white text-[10px] font-black">
                                                +{activeUsers.length - 5}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold mt-3 italic">
                                        {activeUsers.length} members are currently active
                                    </p>
                                </div>

                                <div className="bg-primary-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 text-primary-700 font-black text-[10px] uppercase tracking-widest mb-2">
                                        <Shield className="w-3.5 h-3.5" /> Mentor Help
                                    </div>
                                    <p className="text-[11px] text-primary-600 font-bold leading-relaxed">
                                        Mentors are online to verify solutions. Look for the crown icon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Questions Feed */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <LoadingSpinner text="Synchronizing doubts..." />
                        ) : questions.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[40px] p-16 border-2 border-dashed border-slate-200 text-center"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                                    <MessageCircle className="w-12 h-12 text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-[900] text-slate-900 mb-2 uppercase italic tracking-tighter">Silence in the room...</h3>
                                <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
                                    Everything is clear, or is it? Be the brave one to ask the first doubt!
                                </p>
                                <button onClick={() => setShowQuestionForm(true)} className="btn btn-secondary h-14 px-10">
                                    Start a Conversation
                                </button>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {questions.map((question) => (
                                        <QuestionCard
                                            key={question._id}
                                            question={question}
                                            currentUser={user}
                                            onResolve={handleResolveQuestion}
                                            onPin={handlePinQuestion}
                                            onClick={() => setSelectedQuestion(question)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Components */}
            <AnimatePresence>
                {/* Ask Question Overlay */}
                {showQuestionForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQuestionForm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 overflow-y-auto">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-3xl font-[900] text-slate-900 tracking-tight leading-none uppercase pr-10">Post a Doubt</h2>
                                        <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em] italic">Get help from 5,000+ developers</p>
                                    </div>
                                    <button onClick={() => setShowQuestionForm(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleAskQuestion} className="space-y-8">
                                    <div className="relative">
                                        <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">Problem Description</div>
                                        <textarea
                                            required
                                            className="input-modern min-h-[200px] resize-none pt-6 text-lg font-medium"
                                            placeholder="Describe what you're struggling with in detail..."
                                            value={newQuestion.text}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="relative">
                                            <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">Urgency Level</div>
                                            <select
                                                className="input-modern bg-slate-50/50 border-transparent focus:bg-white"
                                                value={newQuestion.priority}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, priority: e.target.value })}
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Standard Priority</option>
                                                <option value="high">Critical / High Priority</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="flex items-center group cursor-pointer h-full">
                                                <div className="w-full h-full flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-2xl hover:border-primary-400 hover:bg-primary-50 transition-all">
                                                    <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                                                    <span className="text-sm font-black text-slate-500 group-hover:text-primary-700">Attach Image</span>
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    {imagePreview && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                                            <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-64 object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => { setNewQuestion({ ...newQuestion, image: null }); setImagePreview(null); }}
                                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    )}

                                    <button type="submit" className="btn btn-primary w-full py-5 text-base shadow-xl shadow-primary-600/30">
                                        Post Question <Send className="w-4 h-4 ml-2" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Question Detail Overlay */}
                {selectedQuestion && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedQuestion(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-slate-50 w-full max-w-3xl h-full shadow-2xl relative flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedQuestion(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <h2 className="text-xl font-[900] text-slate-900 tracking-tight uppercase">Discussion</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400">Doubt Status:</span>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${selectedQuestion.isResolved ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {selectedQuestion.isResolved ? 'Resolved' : 'In Progress'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                                {/* The Original Question */}
                                <div className="scale-105 origin-top mb-10">
                                    <QuestionCard question={selectedQuestion} currentUser={user} onResolve={handleResolveQuestion} onPin={handlePinQuestion} onClick={() => {}} />
                                </div>

                                {/* Answers Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Info className="w-4 h-4" /> {answers.length} Solutions
                                        </h3>
                                        {!selectedQuestion.isResolved && (
                                            <button 
                                                onClick={() => setShowAnswerForm(true)} 
                                                className="btn btn-primary py-2 px-6 h-auto text-xs font-[900]"
                                            >
                                                Contribute Answer
                                            </button>
                                        )}
                                    </div>

                                    {showAnswerForm && (
                                        <motion.form 
                                            initial={{ opacity: 0, y: -10 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                            onSubmit={handleSubmitAnswer} 
                                            className="bg-white p-6 rounded-[32px] border-2 border-primary-100 shadow-xl shadow-primary-600/5 mb-8"
                                        >
                                            <textarea
                                                required
                                                className="input-modern min-h-[150px] resize-none bg-slate-50/50 border-transparent focus:bg-white mb-4"
                                                placeholder="Share your expertise to help others..."
                                                value={newAnswer}
                                                onChange={(e) => setNewAnswer(e.target.value)}
                                            />
                                            <div className="flex gap-3">
                                                <button type="submit" className="btn btn-primary flex-1">Submit Solution</button>
                                                <button type="button" onClick={() => setShowAnswerForm(false)} className="btn btn-ghost">Cancel</button>
                                            </div>
                                        </motion.form>
                                    )}

                                    <div className="space-y-6 pb-20">
                                        {answers.length === 0 ? (
                                            <div className="text-center py-20">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                                    <MessageCircle className="w-8 h-8 text-slate-100" />
                                                </div>
                                                <p className="text-slate-400 font-[900] uppercase text-[10px] tracking-widest">No solutions yet</p>
                                            </div>
                                        ) : (
                                            answers.map((answer) => (
                                                <AnswerCard
                                                    key={answer._id}
                                                    answer={answer}
                                                    currentUser={user}
                                                    questionOwnerId={selectedQuestion.userId._id}
                                                    onVote={handleVoteAnswer}
                                                    onAccept={handleAcceptAnswer}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoomPage;

