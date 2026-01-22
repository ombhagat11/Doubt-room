import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, CheckCircle, Crown, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const AnswerCard = ({ answer, onVote, onAccept, currentUser, questionOwnerId }) => {
    const hasVoted = answer.votedBy?.includes(currentUser?.id);
    const canAccept = currentUser?.id === questionOwnerId ||
        currentUser?.role === 'mentor' ||
        currentUser?.role === 'admin';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative bg-white rounded-3xl p-6 border transition-all ${
                answer.isAccepted 
                ? 'border-emerald-200 bg-emerald-50/20 shadow-lg shadow-emerald-500/5' 
                : 'border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
        >
            {answer.isAccepted && (
                <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Best Answer
                </div>
            )}

            <div className="flex gap-5">
                {/* Side Actions (Vote) */}
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => onVote(answer._id)}
                        className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            hasVoted
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                    >
                        <ThumbsUp className={`w-5 h-5 ${hasVoted ? 'fill-current' : ''}`} />
                        <span className="text-xs font-black mt-0.5 leading-none">{answer.votes || 0}</span>
                    </button>
                    {!answer.isAccepted && canAccept && onAccept && (
                        <button
                            onClick={() => onAccept(answer._id)}
                            className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                            title="Accept this answer"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-black">
                                {answer.userId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-bold text-slate-900">{answer.userId?.name}</h5>
                                    {answer.userId?.role === 'mentor' && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-black uppercase tracking-tighter">
                                            <Crown className="w-2.5 h-2.5" />
                                            Mentor
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 italic">
                                    {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="text-slate-700 text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
                        {answer.text}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnswerCard;

