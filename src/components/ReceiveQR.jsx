import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { supabase } from '../lib/supabase'
import { Loader2, CheckCircle2, Copy } from 'lucide-react'
import { Button } from './Button'

export function ReceiveQR({ user, onClose }) {
    const [paymentReceived, setPaymentReceived] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Inscreve-se para ouvir novas transações onde o receiver_id é o usuário atual
        const channel = supabase
            .channel('incoming-transfers')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'transactions',
                    filter: `receiver_id=eq.${user.id}`
                },
                (payload) => {
                    console.log('Payment received!', payload)
                    setPaymentReceived(payload.new)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user.id])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(user.id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (paymentReceived) {
        return (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Pagamento Recebido!</h3>
                <p className="text-gray-600">
                    Você recebeu <span className="font-bold text-emerald-600">R$ {parseFloat(paymentReceived.amount).toFixed(2)}</span>
                </p>
                <Button onClick={onClose} className="w-full mt-6">
                    Fechar
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-6 py-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <QRCode
                    value={user.id}
                    size={200}
                    level="H"
                    fgColor="#0f172a"
                />
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">Seu ID de usuário</p>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mx-auto group"
                >
                    <span className="font-mono font-medium text-gray-700">{user.id}</span>
                    {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-teal-600 bg-teal-50 px-4 py-2 rounded-full animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                Aguardando pagamento...
            </div>
        </div>
    )
}
