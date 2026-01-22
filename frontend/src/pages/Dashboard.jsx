import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/home/Navbar';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Search, Filter, Layers, HelpCircle, CheckCircle, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, refreshUser } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoom, setNewRoom] = useState({
        title: '',
        topic: 'DSA',
        description: '',
        isPublic: true
    });

    const topics = ['All', 'DSA', 'React', 'Node.js', 'MongoDB', 'System Design', 'DBMS', 'OS', 'Networks', 'JavaScript', 'Python', 'Java', 'Other'];

    useEffect(() => {
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

    const filteredRooms = rooms.filter(room => 
        room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const canCreateRoom = user?.role === 'mentor' || user?.role === 'admin';

    const stats = [
        { label: 'Active Rooms', value: rooms.length, icon: <Layers className="w-5 h-5" />, color: 'bg-blue-500' },
        { label: 'Questions Asked', value: user?.questionsAsked || 0, icon: <HelpCircle className="w-5 h-5" />, color: 'bg-amber-500' },
        { label: 'Resolved', value: user?.questionsResolved || 0, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-emerald-500' },
        { label: 'Reputation', value: user?.reputation || 0, icon: <Award className="w-5 h-5" />, color: 'bg-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">
                            Welcome back, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">
                            Ready to solve some doubts or learn something new today?
                        </p>
                    </div>
                    {canCreateRoom && (
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary shadow-lg shadow-primary-600/20 px-6"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Room
                        </button>
                    )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                        >
                            <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by title or description..."
                                className="input-modern pl-11 bg-slate-50/50 border-transparent focus:bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth">
                            <div className="flex items-center gap-2 px-2 border-r border-slate-100 mr-2 flex-shrink-0">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-400 uppercase">Topic</span>
                            </div>
                            {topics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => setSelectedTopic(topic)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                                        selectedTopic === topic 
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                                    }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 font-semibold">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        {error}
                    </div>
                )}

                {/* Content Grid */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-bold italic">Gathering all rooms...</p>
                    </div>
                ) : filteredRooms.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map((room, i) => (
                            <motion.div
                                key={room._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <RoomCard room={room} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No rooms match your criteria</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                            Try adjusting your filters or search terms to find what you're looking for.
                        </p>
                        {canCreateRoom && (
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="btn btn-secondary"
                            >
                                Create the first room for {selectedTopic}
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Study Room</h2>
                                    <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateRoom} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Room Title</label>
                                        <input 
                                            type="text"
                                            required
                                            className="input-modern"
                                            placeholder="e.g. Master React Concurrency"
                                            value={newRoom.title}
                                            onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Topic</label>
                                        <select 
                                            className="input-modern"
                                            value={newRoom.topic}
                                            onChange={(e) => setNewRoom({...newRoom, topic: e.target.value})}
                                        >
                                            {topics.filter(t => t !== 'All').map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Description</label>
                                        <textarea 
                                            className="input-modern min-h-[100px] resize-none"
                                            placeholder="What will students learn here?"
                                            value={newRoom.description}
                                            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <input 
                                            type="checkbox"
                                            id="isPublic"
                                            checked={newRoom.isPublic}
                                            onChange={(e) => setNewRoom({...newRoom, isPublic: e.target.checked})}
                                            className="w-5 h-5 text-primary-600 rounded-lg border-slate-300 focus:ring-primary-500"
                                        />
                                        <label htmlFor="isPublic" className="text-sm font-bold text-slate-700 cursor-pointer">
                                            Make this room public
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full py-4 shadow-lg shadow-primary-600/20">
                                        Launch Room
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;

