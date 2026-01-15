import { formatDistanceToNow } from 'date-fns';

const AnswerCard = ({ answer, onVote, onAccept, currentUser, questionOwnerId }) => {
    const hasVoted = answer.votedBy?.includes(currentUser?.id);
    const canAccept = currentUser?.id === questionOwnerId ||
        currentUser?.role === 'mentor' ||
        currentUser?.role === 'admin';

    return (
        <div className={`card p-5 ${answer.isAccepted ? 'border-2 border-success-500 bg-success-50/20' : ''}`}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => onVote(answer._id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${hasVoted
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-primary-100 hover:text-primary-600'
                            }`}
                        title={hasVoted ? 'Remove vote' : 'Upvote'}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className={`text-lg font-bold ${answer.votes > 0 ? 'text-primary-600' : 'text-slate-600'}`}>
                        {answer.votes || 0}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {answer.userId?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 text-sm">{answer.userId?.name}</span>
                                {answer.isByMentor && (
                                    <span className="badge badge-secondary text-xs">Mentor</span>
                                )}
                                {answer.isAccepted && (
                                    <span className="badge badge-success text-xs flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Accepted Answer
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500">
                                {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                            </div>
                        </div>
                    </div>

                    {/* Answer Text */}
                    <div className="prose prose-sm max-w-none mb-3">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {answer.text}
                        </p>
                    </div>

                    {/* Actions */}
                    {!answer.isAccepted && canAccept && onAccept && (
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                onClick={() => onAccept(answer._id)}
                                className="btn btn-outline text-xs flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Accept Answer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnswerCard;
