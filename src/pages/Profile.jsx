import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card } from '../components/Card'
import { Toast } from '../components/Toast'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import QRCode from 'react-qr-code'
import { Copy, QrCode as QrCodeIcon, Edit2, Save, X, User } from 'lucide-react'

export default function Profile() {
    const { profile, user, refreshProfile } = useAuth()
    const [showToast, setShowToast] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        full_name: '',
        avatar_url: ''
    })
    const [loading, setLoading] = useState(false)

    if (!profile) return null

    const copyToClipboard = () => {
        navigator.clipboard.writeText(user.id)
        setShowToast(true)
    }

    const startEditing = () => {
        setEditForm({
            full_name: profile.full_name || '',
            avatar_url: profile.avatar_url || ''
        })
        setIsEditing(true)
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editForm.full_name,
                    avatar_url: editForm.avatar_url
                })
                .eq('id', user.id)

            if (error) throw error

            await refreshProfile()
            setIsEditing(false)
            setShowToast(true) // Reusing toast for success message
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Erro ao atualizar perfil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {showToast && (
                <Toast
                    message={isEditing ? "Perfil atualizado com sucesso!" : "ID copiado para a área de transferência!"}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h2>

                <Card className="flex flex-col items-center space-y-6 py-8 relative">
                    <button
                        onClick={() => isEditing ? setIsEditing(false) : startEditing()}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-teal-600 transition-colors"
                    >
                        {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                    </button>

                    <div className="relative group">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-white dark:border-gray-800">
                                {profile.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="w-full max-w-xs space-y-4 animate-in fade-in zoom-in duration-200">
                            <Input
                                label="Nome Completo"
                                value={editForm.full_name}
                                onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                            />
                            <Input
                                label="URL da Foto (Avatar)"
                                placeholder="https://..."
                                value={editForm.avatar_url}
                                onChange={e => setEditForm({ ...editForm, avatar_url: e.target.value })}
                            />
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                        <QRCode value={user.id} size={180} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escaneie para transferir</p>

                    <div className="w-full">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 ml-1">Seu ID da conta</p>
                        <button
                            onClick={copyToClipboard}
                            className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-xl flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600 active:scale-95"
                        >
                            <code className="text-teal-600 dark:text-teal-400 text-sm font-mono truncate mr-4">
                                {user.id}
                            </code>
                            <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </Card>
            </div>
        </>
    )
}
