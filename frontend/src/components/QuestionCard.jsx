import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, CheckCircle, Pin, ArrowUpRight, Crown, User, MoreHorizontal, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, onResolve, onPin, currentUser, onClick }) => {
    const canModerate = currentUser?.role === 'mentor' || currentUser?.role === 'admin';
    const isOwner = question.userId?._id === currentUser?.id;

    const priorityColors = {
        high: 'border-red-200 bg-red-50/50 text-red-600',
        medium: 'border-amber-200 bg-amber-50/50 text-amber-600',
        low: 'border-emerald-200 bg-emerald-50/50 text-emerald-600',
    };

    return (
        <motion.div
            layout
            onClick={onClick}
            whileHover={{ y: -2 }}
            className={`group relative bg-white rounded-3xl p-6 border transition-all cursor-pointer ${
                question.isPinned 
                ? 'border-primary-200 shadow-xl shadow-primary-600/5 bg-gradient-to-br from-white to-primary-50/20' 
                : 'border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
            } ${question.isResolved ? 'bg-slate-50/50 border-slate-50 opacity-90' : ''}`}
        >
            {/* Resolution/Pinned Badges */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
                {question.isPinned && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-600/30">
                        <Pin className="w-3 h-3" />
                        Pinned
                    </div>
                )}
                {question.isResolved && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
                <div className="relative">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 text-lg font-black transition-transform group-hover:scale-105">
                        {question.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                    {question.userId?.role === 'mentor' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-white border-2 border-white">
                            <Crown className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 pr-20"> {/* pr-20 to make space for badges */}
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{question.userId?.name}</h4>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                            question.userId?.role === 'mentor' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {question.userId?.role}
                        </span>
                        {question.userId?.reputation > 0 && (
                            <div className="flex items-center gap-1 text-slate-400">
                                <Crown className="w-3 h-3 text-amber-400" />
                                <span className="text-[11px] font-bold">{question.userId.reputation}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 italic">
                        <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                        {!question.isResolved && (
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${priorityColors[question.priority] || priorityColors.medium}`}>
                                <AlertCircle className="w-3 h-3" />
                                {question.priority}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mb-6">
                <p className="text-slate-700 text-base leading-relaxed line-clamp-3 font-medium">
                    {question.text}
                </p>
                {question.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 group/img relative">
                        <img 
                            src={question.image} 
                            alt="Question detail" 
                            className="w-full h-auto max-h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="p-3 bg-white rounded-full text-slate-900 transform translate-y-4 group-hover/img:translate-y-0 transition-transform">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-50 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold">
                        <div className="p-2 bg-slate-50 rounded-xl">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{question.answerCount || 0}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {canModerate && onPin && !question.isResolved && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onPin(question._id);
                            }}
                            className={`p-2.5 rounded-xl transition-all ${
                                question.isPinned 
                                ? 'bg-primary-50 text-primary-600' 
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            }`}
                        >
                            <Pin className="w-4 h-4" />
                        </button>
                    )}
                    {(canModerate || isOwner) && onResolve && !question.isResolved && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onResolve(question._id);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-sm font-bold transition-colors"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Resolve
                        </button>
                    )}
                    <div className="p-2.5 text-slate-300 hover:text-slate-500 rounded-xl transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuestionCard;

