import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
    };

    return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
            <div className="relative">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`${sizes[size]} border-4 border-slate-100 border-t-primary-600 rounded-full`}
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 ${sizes[size]} border-4 border-transparent border-b-secondary-400 opacity-40 rounded-full scale-110`}
                />
            </div>
            {text && (
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

export default LoadingSpinner;

