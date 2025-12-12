import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/Card'
import { Toast } from '../components/Toast'
import QRCode from 'react-qr-code'
import { Copy, QrCode as QrCodeIcon } from 'lucide-react'

export default function Profile() {
    const { profile, user } = useAuth()
    const [showToast, setShowToast] = useState(false)

    if (!profile) return null

    const copyToClipboard = () => {
        navigator.clipboard.writeText(user.id)
        setShowToast(true)
    }

    return (
        <>
            {showToast && (
                <Toast
                    message="ID copiado para a área de transferência!"
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h2>

                <Card className="flex flex-col items-center space-y-6 py-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {profile.username[0].toUpperCase()}
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
                    </div>

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
