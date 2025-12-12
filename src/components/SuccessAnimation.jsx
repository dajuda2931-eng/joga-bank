import { useEffect, useState } from 'react'
import { CheckCircle, Sparkles } from 'lucide-react'

export const SuccessAnimation = ({ amount, receiverUsername, onClose }) => {
    const [confetti, setConfetti] = useState([])

    useEffect(() => {
        // Generate confetti particles
        const particles = []
        const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f59e0b']

        for (let i = 0; i < 30; i++) {
            particles.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            })
        }

        setConfetti(particles)
    }, [])

    return (
        <div className="relative overflow-hidden">
            {/* Confetti particles */}
            {confetti.map(particle => (
                <div
                    key={particle.id}
                    className="confetti-particle animate-confetti"
                    style={{
                        left: `${particle.left}%`,
                        backgroundColor: particle.color,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}

            {/* Success content */}
            <div className="relative z-10 text-center py-12 space-y-6">
                {/* Animated check icon */}
                <div className="relative mx-auto w-32 h-32">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-glow-pulse" />

                    {/* Middle ring */}
                    <div className="absolute inset-2 bg-emerald-500/30 rounded-full animate-scale-bounce"
                        style={{ animationDelay: '0.1s' }} />

                    {/* Inner circle with icon */}
                    <div className="absolute inset-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center animate-success-burst shadow-2xl">
                        <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                    </div>

                    {/* Sparkles */}
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-emerald-600 animate-float" />
                    <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-emerald-600 animate-float"
                        style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Success message */}
                <div className="space-y-3 animate-bounce-in" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Transferência Realizada! 🎉
                    </h3>
                    <div className="inline-block px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 animate-shimmer">
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                            R$ {parseFloat(amount).toFixed(2)}
                        </p>
                    </div>
                    <p className="text-gray-900 dark:text-gray-200 text-lg">
                        enviado para <span className="font-bold text-emerald-700 dark:text-emerald-400">@{receiverUsername}</span>
                    </p>
                </div>

                {/* Success details */}
                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 animate-bounce-in"
                    style={{ animationDelay: '0.5s' }}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Transação concluída com sucesso</span>
                </div>
            </div>
        </div>
    )
}
