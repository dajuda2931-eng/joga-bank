import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { QRScanner } from '../components/QRScanner'
import { SuccessAnimation } from '../components/SuccessAnimation'
import { Loader2, X, Camera, Trash2, QrCode } from 'lucide-react'
import { ReceiveQR } from '../components/ReceiveQR'

export default function Transfer() {
    const { user, profile, refreshProfile } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [receiver, setReceiver] = useState(null)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [contacts, setContacts] = useState([])
    const [showContacts, setShowContacts] = useState(true)
    const [showScanner, setShowScanner] = useState(false)
    const [showReceive, setShowReceive] = useState(false)

    useEffect(() => {
        if (user) {
            fetchContacts()
        }
    }, [user])

    const fetchContacts = async () => {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select(`
                    *,
                    contact:contact_id(id, username, full_name)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setContacts(data || [])
        } catch (error) {
            console.error('Error fetching contacts:', error)
            setContacts([])
        }
    }

    const saveContact = async () => {
        if (!receiver) return

        try {
            const { error } = await supabase
                .from('contacts')
                .insert({
                    user_id: user.id,
                    contact_id: receiver.id,
                    nickname: receiver.full_name
                })

            if (error) {
                if (error.code === '23505') { // Unique violation
                    setError('Contato já salvo.')
                } else {
                    throw error
                }
            } else {
                fetchContacts()
                alert('Contato salvo com sucesso!')
            }
        } catch (error) {
            console.error('Error saving contact:', error)
            setError('Erro ao salvar contato.')
        }
    }

    const deleteContact = async (e, contactId) => {
        e.stopPropagation()
        if (!confirm('Tem certeza que deseja excluir este contato?')) return

        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contactId)

            if (error) throw error

            setContacts(contacts.filter(c => c.id !== contactId))
        } catch (error) {
            console.error('Error deleting contact:', error)
            alert('Erro ao excluir contato.')
        }
    }

    const handleScanSuccess = async (decodedText) => {
        setShowScanner(false)

        let query = decodedText
        let detectedAmount = null

        try {
            const data = JSON.parse(decodedText)
            if (data.id) {
                query = data.id
                if (data.amount) {
                    detectedAmount = data.amount.toString()
                }
            }
        } catch (e) {
            console.log('QR Code não é JSON, usando como string simples')
        }

        setSearchQuery(query)
        if (detectedAmount) {
            setAmount(detectedAmount)
        }

        // Aguarda um pequeno delay para garantir que o componente principal renderize
        // antes de iniciar a busca (opcional, mas ajuda na transição visual)
        setTimeout(() => handleSearch(null, query), 50)
    }

    const handleSearch = async (e, queryOverride = null) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError('')

        const query = queryOverride || searchQuery;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .or(`username.eq.${query},id.eq.${query}`)
                .neq('id', user.id)
                .single()

            if (error || !data) {
                setError('Usuário não encontrado.')
            } else {
                setReceiver(data)
            }
        } catch (err) {
            setError('Erro ao buscar usuário.')
        } finally {
            setLoading(false)
        }
    }

    const handleTransfer = async () => {
        setLoading(true)
        setError('')

        const value = parseFloat(amount)
        if (isNaN(value) || value <= 0) {
            setError('Valor inválido.')
            setLoading(false)
            return
        }

        if (value > profile.balance) {
            setError('Saldo insuficiente.')
            setLoading(false)
            return
        }

        try {
            const { error: rpcError } = await supabase.rpc('transfer_coins', {
                receiver_id: receiver.id,
                amount: value
            })

            if (rpcError) throw rpcError

            setShowSuccess(true)

            setTimeout(() => {
                refreshProfile()
            }, 500)

        } catch (err) {
            console.error(err)
            setError('Erro ao processar transferência. ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setShowSuccess(false)
        setAmount('')
        setReceiver(null)
        setSearchQuery('')
        setError('')
    }

    const selectContact = (contact) => {
        if (contact && contact.contact) {
            setReceiver(contact.contact)
            setSearchQuery(contact.contact.username || '')
        }
    }

    if (showSuccess && receiver) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Transferir</h2>
                <Card className="overflow-hidden">
                    <SuccessAnimation
                        amount={amount}
                        receiverUsername={receiver.username}
                    />
                    <div className="px-6 pb-6 pt-2">
                        <Button
                            className="w-full"
                            onClick={resetForm}
                        >
                            Nova Transferência
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    if (showScanner) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Escanear QR Code</h2>
                    <button onClick={() => setShowScanner(false)} className="text-gray-600 hover:text-gray-900">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <Card>
                    <QRScanner
                        onScan={handleScanSuccess}
                        onClose={() => setShowScanner(false)}
                    />
                    <p className="text-sm text-center text-gray-500 mt-4">Aponte a câmera para o QR Code</p>
                </Card>
            </div>
        )
    }

    if (showReceive) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Receber</h2>
                    <button onClick={() => setShowReceive(false)} className="text-gray-600 hover:text-gray-900">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <Card>
                    <ReceiveQR
                        user={user}
                        onClose={() => {
                            setShowReceive(false)
                            refreshProfile()
                        }}
                    />
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Enviar Moedas</h2>

            <Card>
                {!receiver ? (
                    <div className="space-y-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <Input
                                label="ID da Conta do Destinatário"
                                placeholder="000000000"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                error={error}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowScanner(true)}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Camera className="w-5 h-5" />
                                        Ler QR
                                    </div>
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowReceive(true)}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <QrCode className="w-5 h-5" />
                                        Receber
                                    </div>
                                </Button>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Buscar'}
                            </Button>
                        </form>

                        {contacts.length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Contatos Salvos</h3>
                                <div className="space-y-2">
                                    {contacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <button
                                                onClick={() => selectContact(contact)}
                                                className="flex-1 flex items-center gap-3 text-left"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold group-hover:bg-teal-200 transition-colors">
                                                    {contact.contact?.username?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{contact.nickname || contact.contact?.full_name}</p>
                                                    <p className="text-xs text-gray-500">@{contact.contact?.username}</p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={(e) => deleteContact(e, contact.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Excluir contato"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Receiver Info */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                                    {receiver.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{receiver.full_name}</p>
                                    <p className="text-sm text-gray-500">@{receiver.username}</p>
                                </div>
                            </div>
                            {!contacts.some(c => c.contact_id === receiver.id) && (
                                <button
                                    onClick={saveContact}
                                    className="text-xs font-medium text-teal-600 hover:text-teal-700 underline"
                                >
                                    Salvar Contato
                                </button>
                            )}
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Valor</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full text-4xl font-bold text-gray-900 bg-transparent focus:outline-none"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="secondary" onClick={() => setReceiver(null)}>
                                Voltar
                            </Button>
                            <Button onClick={handleTransfer} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Enviar Moedas'}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
