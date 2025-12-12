import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Send, User, LogOut, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
    const location = useLocation()
    const { signOut, profile } = useAuth()

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-md mx-auto min-h-screen relative bg-gray-50">
                {/* Header - Teal Green */}
                <header className="p-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white sticky top-0 z-10 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Banco Digital</h1>
                            <p className="text-sm text-teal-100">Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <button onClick={signOut} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4">
                    <Outlet />
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 shadow-lg">
                    <div className="max-w-md mx-auto flex justify-around p-3">
                        <Link to="/" className={`flex flex-col items-center gap-1 transition-colors py-2 px-4 rounded-lg ${isActive('/') ? 'text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-900'}`}>
                            <Home className="w-6 h-6" />
                            <span className="text-xs font-medium">Início</span>
                        </Link>
                        <Link to="/transfer" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/transfer') ? 'text-white' : 'text-gray-500'}`}>
                            <div className={`p-3 rounded-2xl -mt-6 shadow-lg ${isActive('/transfer') ? 'bg-black' : 'bg-gray-900 hover:bg-gray-800'}`}>
                                <Send className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium">Transferir</span>
                        </Link>
                        <Link to="/profile" className={`flex flex-col items-center gap-1 transition-colors py-2 px-4 rounded-lg ${isActive('/profile') ? 'text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-gray-900'}`}>
                            <User className="w-6 h-6" />
                            <span className="text-xs font-medium">Perfil</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    )
}
