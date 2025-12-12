import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { QRScanner } from '../components/QRScanner'
import { SuccessAnimation } from '../components/SuccessAnimation'
import { Loader2, X, Camera } from 'lucide-react'

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

    const handleScanSuccess = (decodedText) => {
        setSearchQuery(decodedText)
        setShowScanner(false)
        setTimeout(() => handleSearch(null, decodedText), 100)
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
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Buscar'}
                                </Button>
                            </div>
                        </form>

                        {contacts.length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Contatos Salvos</h3>
                                <div className="space-y-2">
                                    {contacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => selectContact(contact)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold group-hover:bg-teal-200 transition-colors">
                                                {contact.contact?.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{contact.nickname || contact.contact?.full_name}</p>
                                                <p className="text-xs text-gray-500">@{contact.contact?.username}</p>
                                            </div>
                                        </button>
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
