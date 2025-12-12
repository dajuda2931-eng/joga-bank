import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { supabase } from '../lib/supabase'
import { Loader2, CheckCircle2, Copy } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { playSuccessSound } from '../utils/sound'

export function ReceiveQR({ user, onClose }) {
    const [paymentReceived, setPaymentReceived] = useState(null)
    const [amount, setAmount] = useState('')
    const [copied, setCopied] = useState(false)

    // Gera o valor do QR Code: string simples (ID) ou JSON string ({id, amount})
    const qrValue = amount && parseFloat(amount) > 0
        ? JSON.stringify({ id: user.id, amount: parseFloat(amount) })
        : user.id

    const [notificationPermission, setNotificationPermission] = useState(Notification.permission)

    // Gera o valor do QR Code: string simples (ID) ou JSON string ({id, amount})
    const qrValue = amount && parseFloat(amount) > 0
        ? JSON.stringify({ id: user.id, amount: parseFloat(amount) })
        : user.id

    const requestNotificationPermission = async () => {
        const permission = await Notification.requestPermission()
        setNotificationPermission(permission)
        if (permission === 'granted') {
            new Notification('Notificações Ativadas! 🔔', {
                body: 'Você será avisado quando receber um pagamento.',
                icon: '/icon-192.png'
            })
        }
    }

    useEffect(() => {
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
                    // Se um valor específico foi solicitado, verifica se bate
                    if (amount && parseFloat(amount) > 0) {
                        if (Math.abs(parseFloat(payload.new.amount) - parseFloat(amount)) < 0.01) {
                            playSuccessSound()
                            showNotification(payload.new)
                            setPaymentReceived(payload.new)
                        }
                    } else {
                        playSuccessSound()
                        showNotification(payload.new)
                        setPaymentReceived(payload.new)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user.id, amount])

    const showNotification = (transaction) => {
        if (Notification.permission === 'granted') {
            new Notification('Pagamento Recebido! 💰', {
                body: `Você recebeu R$ ${parseFloat(transaction.amount).toFixed(2)}`,
                icon: '/icon-192.png' // Certifique-se de que este ícone existe
            })
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrValue)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (paymentReceived) {
        return (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamento Recebido!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                    Você recebeu <span className="font-bold text-emerald-600 dark:text-emerald-400">R$ {parseFloat(paymentReceived.amount).toFixed(2)}</span>
                </p>
                <Button onClick={onClose} className="w-full mt-6">
                    Fechar
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-6 py-4">
            <div className="w-full max-w-xs">
                <Input
                    type="number"
                    placeholder="Valor (Opcional)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-center"
                />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <QRCode
                    value={qrValue}
                    size={200}
                    level="H"
                    fgColor="#0f172a"
                />
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {amount ? `QR Code para receber R$ ${amount}` : 'Seu ID de usuário'}
                </p>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mx-auto group"
                >
                    <span className="font-mono font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                        {user.id}
                    </span>
                    {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    )}
                </button>

                {notificationPermission === 'default' && (
                    <button
                        onClick={requestNotificationPermission}
                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline mt-2"
                    >
                        Ativar notificações de pagamento
                    </button>
                )}
                {notificationPermission === 'denied' && (
                    <p className="text-xs text-red-500 mt-2">
                        Notificações bloqueadas no navegador
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 text-sm text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-full animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                {amount ? `Aguardando R$ ${amount}...` : 'Aguardando pagamento...'}
            </div>
        </div>
    )
}
