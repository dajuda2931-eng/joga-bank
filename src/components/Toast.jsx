import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

export const Toast = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-gray-800 border border-emerald-500/50 rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[280px] backdrop-blur-xl">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-white font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
