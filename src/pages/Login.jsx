import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { Wallet, ArrowRight, Loader2 } from 'lucide-react'

export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')

    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await signIn(email, password)
            } else {
                await signUp(email, password, fullName, username)
                // Auto-login após cadastro
                await signIn(email, password)
            }
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <Card className="w-full max-w-md space-y-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-teal-600" />

                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 mb-6">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isLogin ? 'Acesse sua carteira digital' : 'Comece a transferir hoje mesmo'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <>
                            <Input
                                label="Nome Completo"
                                placeholder="Seu nome"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <Input
                                label="Nome de Usuário"
                                placeholder="@usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="group">
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {isLogin ? 'Entrar' : 'Cadastrar'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                    </button>
                </div>
            </Card>
        </div>
    )
}
