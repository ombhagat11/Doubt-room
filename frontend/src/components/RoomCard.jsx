import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RoomCard = ({ room }) => {
    const resolutionRate = room.totalQuestions > 0
        ? ((room.resolvedQuestions / room.totalQuestions) * 100).toFixed(0)
        : 0;

    const topicColors = {
        'DSA': 'bg-blue-100 text-blue-700',
        'React': 'bg-cyan-100 text-cyan-700',
        'Node.js': 'bg-green-100 text-green-700',
        'MongoDB': 'bg-emerald-100 text-emerald-700',
        'System Design': 'bg-purple-100 text-purple-700',
        'DBMS': 'bg-orange-100 text-orange-700',
        'OS': 'bg-red-100 text-red-700',
        'Networks': 'bg-indigo-100 text-indigo-700',
        'JavaScript': 'bg-yellow-100 text-yellow-700',
        'Python': 'bg-teal-100 text-teal-700',
        'Java': 'bg-rose-100 text-rose-700',
        'Other': 'bg-slate-100 text-slate-700',
    };

    return (
        <Link to={`/room/${room._id}`}>
            <div className="card-hover p-6 h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                            {room.title}
                        </h3>
                        <span className={`badge ${topicColors[room.topic] || topicColors['Other']}`}>
                            {room.topic}
                        </span>
                    </div>
                    {room.activeCount > 0 && (
                        <div className="flex items-center gap-1 text-success-600">
                            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">{room.activeCount} online</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {room.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {room.description}
                    </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{room.totalQuestions || 0}</div>
                        <div className="text-xs text-slate-500">Questions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-success-600">{room.resolvedQuestions || 0}</div>
                        <div className="text-xs text-slate-500">Resolved</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600">{resolutionRate}%</div>
                        <div className="text-xs text-slate-500">Success</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}
                    </div>
                    {room.isPublic ? (
                        <span className="badge badge-success text-xs">Public</span>
                    ) : (
                        <span className="badge badge-warning text-xs">Private</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default RoomCard;
