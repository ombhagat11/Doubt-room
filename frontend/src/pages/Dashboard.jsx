import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user, refreshUser } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoom, setNewRoom] = useState({
        title: '',
        topic: 'DSA',
        description: '',
        isPublic: true
    });

    const topics = ['All', 'DSA', 'React', 'Node.js', 'MongoDB', 'System Design', 'DBMS', 'OS', 'Networks', 'JavaScript', 'Python', 'Java', 'Other'];

    useEffect(() => {
        // Refresh user stats on mount
        refreshUser();
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [selectedTopic]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const params = selectedTopic !== 'All' ? { topic: selectedTopic } : {};
            const response = await api.get('/rooms', { params });
            setRooms(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms', newRoom);
            setShowCreateModal(false);
            setNewRoom({ title: '', topic: 'DSA', description: '', isPublic: true });
            fetchRooms();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        }
    };

    const canCreateRoom = user?.role === 'mentor' || user?.role === 'admin';

    const filteredRooms = rooms;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-lg text-slate-600">
                        Choose a room to start learning or help others resolve their doubts
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{rooms.length}</div>
                                <div className="text-sm text-slate-600">Active Rooms</div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{user?.questionsAsked || 0}</div>
                                <div className="text-sm text-slate-600">Questions Asked</div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{user?.questionsResolved || 0}</div>
                                <div className="text-sm text-slate-600">Resolved</div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{user?.reputation || 0}</div>
                                <div className="text-sm text-slate-600">Reputation</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    {/* Topic Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                        {topics.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => setSelectedTopic(topic)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${selectedTopic === topic
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'bg-white text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>

                    {/* Create Room Button */}
                    {canCreateRoom && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Room
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Rooms Grid */}
                {loading ? (
                    <LoadingSpinner text="Loading rooms..." />
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No rooms found</h3>
                        <p className="text-slate-600 mb-4">
                            {selectedTopic !== 'All'
                                ? `No rooms available for ${selectedTopic}. Try selecting a different topic.`
                                : 'No rooms available yet. Be the first to create one!'}
                        </p>
                        {canCreateRoom && (
                            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                                Create First Room
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map((room) => (
                            <RoomCard key={room._id} room={room} />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card max-w-md w-full p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Create New Room</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Room Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    placeholder="e.g., DSA Doubt Room"
                                    value={newRoom.title}
                                    onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Topic *
                                </label>
                                <select
                                    className="input"
                                    value={newRoom.topic}
                                    onChange={(e) => setNewRoom({ ...newRoom, topic: e.target.value })}
                                >
                                    {topics.filter(t => t !== 'All').map((topic) => (
                                        <option key={topic} value={topic}>{topic}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="textarea"
                                    rows="3"
                                    placeholder="Brief description of this room..."
                                    value={newRoom.description}
                                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={newRoom.isPublic}
                                    onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
                                    className="w-4 h-4 text-primary-600 rounded"
                                />
                                <label htmlFor="isPublic" className="text-sm text-slate-700">
                                    Public room (anyone can join)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="btn btn-ghost flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    Create Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
