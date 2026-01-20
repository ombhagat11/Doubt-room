import { formatDistanceToNow } from 'date-fns';

const QuestionCard = ({ question, onResolve, onPin, currentUser, onClick }) => {
    const canModerate = currentUser?.role === 'mentor' || currentUser?.role === 'admin';
    const isOwner = question.userId?._id === currentUser?.id;

    return (
        <div
            className={`card p-5 cursor-pointer hover:shadow-xl transition-all ${question.isPinned ? 'border-2 border-primary-500 bg-primary-50/30' : ''
                } ${question.isResolved ? 'opacity-75' : ''}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                    {/* User Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {question.userId?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-900">{question.userId?.name}</span>
                            <span className={`badge badge-${question.userId?.role === 'mentor' ? 'secondary' : 'primary'} text-xs`}>
                                {question.userId?.role}
                            </span>
                            {question.userId?.reputation > 0 && (
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {question.userId?.reputation}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {question.isPinned && (
                        <span className="badge bg-primary-600 text-white text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.409 1.574 1.195 1.574H6.75a1 1 0 01.894.553l.448.894a1 1 0 001.788 0l.448-.894a1 1 0 01.894-.553h1.373c.786 0 1.445-.794 1.195-1.574L13 10.274v-1.548a1 1 0 10-2 0v1.548l-.532 1.651a.989.989 0 01-.91.627H9.442a.989.989 0 01-.91-.627L8 10.274v-1.548a1 1 0 10-2 0v1.548z" />
                            </svg>
                            Pinned
                        </span>
                    )}
                    {question.isResolved && (
                        <span className="badge badge-success text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Resolved
                        </span>
                    )}
                    {question.priority === 'high' && !question.isResolved && (
                        <span className="badge badge-danger text-xs">High Priority</span>
                    )}
                </div>
            </div>

            {/* Question Text */}
            <div className="mb-3">
                <p className="text-slate-900 text-base leading-relaxed whitespace-pre-wrap">
                    {question.text}
                </p>
            </div>

            {/* Question Image */}
            {question.image && (
                <div className="mb-3">
                    <img
                        src={question.image}
                        alt="Question attachment"
                        className="max-w-full h-auto max-h-96 rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(question.image, '_blank');
                        }}
                    />
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {question.answerCount || 0} {question.answerCount === 1 ? 'answer' : 'answers'}
                    </span>
                </div>

                {/* Actions */}
                {!question.isResolved && (
                    <div className="flex items-center gap-2">
                        {canModerate && onPin && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPin(question._id);
                                }}
                                className="btn btn-ghost text-xs"
                                title="Pin question"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        )}
                        {(canModerate || isOwner) && onResolve && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onResolve(question._id);
                                }}
                                className="btn btn-primary text-xs"
                            >
                                Mark Resolved
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;
