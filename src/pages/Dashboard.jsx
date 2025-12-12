import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card } from '../components/Card'
import { ArrowUpRight, ArrowDownLeft, Coins } from 'lucide-react'

export default function Dashboard() {
    const { profile, user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchTransactions()
        }
    }, [user])

    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
          *,
          sender:sender_id(username, full_name),
          receiver:receiver_id(username, full_name)
        `)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) throw error
            setTransactions(data)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <Card className="p-8">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Disponível</p>

                    <div className="flex items-center gap-3">
                        <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
                            {profile ? formatCurrency(profile.balance) : '...'}
                        </h2>
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Coins className="w-6 h-6 text-yellow-700" />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">Moedas disponíveis</p>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seu ID da conta</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.id?.slice(0, 8) || '...'}</p>
                    </div>
                </div>
            </Card>

            {/* Transactions History */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Histórico de Transações</h3>

                <div className="space-y-3">
                    {loading ? (
                        <Card className="text-center py-12">
                            <div className="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </Card>
                    ) : transactions.length === 0 ? (
                        <Card className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">Nenhuma transação ainda</p>
                        </Card>
                    ) : (
                        transactions.map((tx) => {
                            const isReceived = tx.receiver_id === user.id
                            return (
                                <Card key={tx.id} className="p-4 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isReceived ? 'bg-teal-50 dark:bg-teal-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                {isReceived ? (
                                                    <ArrowDownLeft className="w-5 h-5 text-teal-600" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5 text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {isReceived ? tx.sender?.full_name : tx.receiver?.full_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    @{isReceived ? tx.sender?.username : tx.receiver?.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-base ${isReceived ? 'text-teal-600 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`}>
                                                {isReceived ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDate(tx.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
