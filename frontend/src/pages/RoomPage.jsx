import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import AnswerCard from '../components/AnswerCard';
import LoadingSpinner from '../components/LoadingSpinner';

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

        // Initialize Socket.IO
        try {
            const socket = getSocket();
            socketRef.current = socket;

            // Join room
            socket.emit('joinRoom', { roomId: id });

            // Listen for events
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
            console.error('Socket initialization error:', err);
        }
    }, [id]);

    useEffect(() => {
        if (selectedQuestion) {
            fetchAnswers(selectedQuestion._id);
        }
    }, [selectedQuestion]);

    useEffect(() => {
        fetchQuestions();
    }, [filter]);

    // Socket event handlers
    const handleUserJoined = (data) => {
        setActiveUsers(data.activeUsers || []);
    };

    const handleUserLeft = (data) => {
        setActiveUsers(data.activeUsers || []);
    };

    const handleNewQuestion = (data) => {
        fetchQuestions();
    };

    const handleNewAnswer = (data) => {
        if (selectedQuestion && data.questionId === selectedQuestion._id) {
            fetchAnswers(selectedQuestion._id);
        }
        fetchQuestions(); // Update answer count
    };

    const handleQuestionResolved = (data) => {
        fetchQuestions();
        if (selectedQuestion && data.questionId === selectedQuestion._id) {
            setSelectedQuestion({ ...selectedQuestion, isResolved: true });
        }
    };

    const handleQuestionPinned = (data) => {
        fetchQuestions();
    };

    const handleAnswerUpvoted = (data) => {
        if (selectedQuestion) {
            fetchAnswers(selectedQuestion._id);
        }
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
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must be less than 2MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

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

            // Emit socket event
            if (socketRef.current) {
                socketRef.current.emit('askQuestion', response.data.data);
            }

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
            const response = await api.post('/answers', {
                questionId: selectedQuestion._id,
                text: newAnswer
            });

            // Emit socket event
            if (socketRef.current) {
                socketRef.current.emit('answerQuestion', {
                    questionId: selectedQuestion._id,
                    answer: response.data.data
                });
            }

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

            // Emit socket event
            if (socketRef.current) {
                socketRef.current.emit('markResolved', { questionId });
            }

            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resolve question');
        }
    };

    const handlePinQuestion = async (questionId) => {
        try {
            await api.put(`/questions/${questionId}/pin`);

            // Emit socket event
            if (socketRef.current) {
                socketRef.current.emit('pinQuestion', { questionId });
            }

            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to pin question');
        }
    };

    const handleVoteAnswer = async (answerId) => {
        try {
            await api.put(`/answers/${answerId}/vote`);

            // Emit socket event
            if (socketRef.current) {
                socketRef.current.emit('upvoteAnswer', { answerId });
            }

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
            setError(err.response?.data?.message || 'Failed to accept answer');
        }
    };

    if (!room && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Navbar />
                <div className="container-custom py-16 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Room not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <div className="container-custom py-6">
                {/* Room Header */}
                <div className="card p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="text-slate-600 hover:text-slate-900"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h1 className="text-3xl font-display font-bold text-slate-900">
                                    {room?.title}
                                </h1>
                                <span className="badge badge-primary">{room?.topic}</span>
                            </div>
                            {room?.description && (
                                <p className="text-slate-600 ml-9">{room.description}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {activeUsers.length > 0 && (
                                <div className="flex items-center gap-2 text-success-600">
                                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium">{activeUsers.length} online</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Room Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">{room?.totalQuestions || 0}</div>
                            <div className="text-sm text-slate-600">Total Questions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-success-600">{room?.resolvedQuestions || 0}</div>
                            <div className="text-sm text-slate-600">Resolved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                                {room?.totalQuestions > 0
                                    ? Math.round((room.resolvedQuestions / room.totalQuestions) * 100)
                                    : 0}%
                            </div>
                            <div className="text-sm text-slate-600">Success Rate</div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Questions List */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Filters and Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm ${filter === 'pending'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setFilter('resolved')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm ${filter === 'resolved'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    Resolved
                                </button>
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm ${filter === 'all'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    All
                                </button>
                            </div>

                            <button
                                onClick={() => setShowQuestionForm(true)}
                                className="btn btn-primary"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Ask Question
                            </button>
                        </div>

                        {/* Questions */}
                        {loading ? (
                            <LoadingSpinner text="Loading questions..." />
                        ) : questions.length === 0 ? (
                            <div className="card p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No questions yet</h3>
                                <p className="text-slate-600 mb-4">Be the first to ask a question in this room!</p>
                                <button onClick={() => setShowQuestionForm(true)} className="btn btn-primary">
                                    Ask First Question
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
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
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Active Users */}
                        {activeUsers.length > 0 && (
                            <div className="card p-5">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                                    Active Users ({activeUsers.length})
                                </h3>
                                <div className="space-y-2">
                                    {activeUsers.slice(0, 10).map((activeUser, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {activeUser.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900 truncate">{activeUser.name}</div>
                                                <div className="text-xs text-slate-500 capitalize">{activeUser.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Room Guidelines */}
                        <div className="card p-5">
                            <h3 className="font-semibold text-slate-900 mb-3">Room Guidelines</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Ask clear, specific questions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Provide helpful answers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Upvote quality answers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Mark questions as resolved</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Be respectful and collaborative</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ask Question Modal */}
            {showQuestionForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Ask a Question</h2>
                            <button
                                onClick={() => setShowQuestionForm(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAskQuestion} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Your Question *
                                </label>
                                <textarea
                                    required
                                    className="textarea"
                                    rows="6"
                                    placeholder="Describe your doubt in detail..."
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Be specific and provide context for better answers
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    className="input"
                                    value={newQuestion.priority}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Attach Image (Optional)
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="btn btn-outline cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Choose Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewQuestion({ ...newQuestion, image: null });
                                                setImagePreview(null);
                                            }}
                                            className="text-danger-600 hover:text-danger-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {imagePreview && (
                                    <div className="mt-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-full h-auto max-h-64 rounded-lg border border-slate-200"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    Max size: 2MB. Supported formats: JPG, PNG, GIF
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowQuestionForm(false)}
                                    className="btn btn-ghost flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    Post Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Question Detail Modal */}
            {selectedQuestion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card max-w-4xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Question & Answers</h2>
                            <button
                                onClick={() => {
                                    setSelectedQuestion(null);
                                    setAnswers([]);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Question */}
                        <QuestionCard
                            question={selectedQuestion}
                            currentUser={user}
                            onResolve={handleResolveQuestion}
                            onPin={handlePinQuestion}
                            onClick={() => { }}
                        />

                        {/* Answers */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                                </h3>
                                {!selectedQuestion.isResolved && (
                                    <button
                                        onClick={() => setShowAnswerForm(!showAnswerForm)}
                                        className="btn btn-primary text-sm"
                                    >
                                        {showAnswerForm ? 'Cancel' : 'Add Answer'}
                                    </button>
                                )}
                            </div>

                            {/* Answer Form */}
                            {showAnswerForm && (
                                <form onSubmit={handleSubmitAnswer} className="mb-6">
                                    <textarea
                                        required
                                        className="textarea"
                                        rows="4"
                                        placeholder="Write your answer..."
                                        value={newAnswer}
                                        onChange={(e) => setNewAnswer(e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="btn btn-primary">
                                            Submit Answer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAnswerForm(false);
                                                setNewAnswer('');
                                            }}
                                            className="btn btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Answers List */}
                            <div className="space-y-4">
                                {answers.length === 0 ? (
                                    <div className="text-center py-8 text-slate-600">
                                        No answers yet. Be the first to answer!
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
                </div>
            )}
        </div>
    );
};

export default RoomPage;
