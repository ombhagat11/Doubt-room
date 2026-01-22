import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Users, MessageSquare, CheckCircle2, Globe, Lock, Clock } from 'lucide-react';

const RoomCard = ({ room }) => {
    const resolutionRate = room.totalQuestions > 0
        ? ((room.resolvedQuestions / room.totalQuestions) * 100).toFixed(0)
        : 0;

    const topicStyles = {
        'DSA': 'bg-blue-50 text-blue-600 border-blue-100',
        'React': 'bg-cyan-50 text-cyan-600 border-cyan-100',
        'Node.js': 'bg-green-50 text-green-600 border-green-100',
        'MongoDB': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'System Design': 'bg-indigo-50 text-indigo-600 border-indigo-100',
        'DBMS': 'bg-orange-50 text-orange-600 border-orange-100',
        'OS': 'bg-red-50 text-red-600 border-red-100',
        'Networks': 'bg-violet-50 text-violet-600 border-violet-100',
        'JavaScript': 'bg-yellow-50 text-yellow-600 border-yellow-100',
        'Python': 'bg-teal-50 text-teal-600 border-teal-100',
        'Java': 'bg-rose-50 text-rose-600 border-rose-100',
        'Other': 'bg-slate-50 text-slate-600 border-slate-100',
    };

    return (
        <Link to={`/room/${room._id}`} className="group block h-full">
            <div className="card-modern p-6 flex flex-col h-full hover:border-primary-200 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${topicStyles[room.topic] || topicStyles['Other']} mb-3`}>
                            {room.topic}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {room.title}
                        </h3>
                    </div>
                    {room.activeCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{room.activeCount} Live</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium flex-1">
                    {room.description || "Join this room to discuss and resolve subject-specific doubts."}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-primary-50 transition-colors">
                            <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-primary-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 leading-none mb-1">{room.totalQuestions || 0}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Doubts</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 leading-none mb-1">{room.resolvedQuestions || 0}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Solved</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold italic">
                                {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            {room.isPublic ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Public</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Private</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RoomCard;

