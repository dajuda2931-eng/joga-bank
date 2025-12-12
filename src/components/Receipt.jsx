import { CheckCircle2, Share2, Download } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

export function Receipt({ transaction, onClose }) {
    const { amount, sender, receiver, created_at, id } = transaction

    const formattedDate = new Date(created_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const handleShare = async () => {
        const text = `Comprovante Joga Bank\n\nValor: R$ ${parseFloat(amount).toFixed(2)}\nPara: ${receiver.full_name}\nData: ${formattedDate}\nID: ${id}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Comprovante Joga Bank',
                    text: text,
                })
            } catch (err) {
                console.log('Erro ao compartilhar', err)
            }
        } else {
            navigator.clipboard.writeText(text)
            alert('Comprovante copiado para a área de transferência!')
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Transferência Realizada!</h2>
                <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 relative overflow-hidden">
                {/* Detalhe decorativo de "rasgo" do papel */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[linear-gradient(135deg,transparent_50%,#f9fafb_50%),linear-gradient(45deg,#f9fafb_50%,transparent_50%)] bg-[length:16px_16px] -mt-2"></div>

                <div className="space-y-1 text-center border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-500">Valor</p>
                    <p className="text-3xl font-bold text-gray-900">R$ {parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Origem</span>
                        <span className="text-sm font-medium text-gray-900 text-right">{sender?.full_name || 'Você'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Destino</span>
                        <span className="text-sm font-medium text-gray-900 text-right">{receiver?.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">ID da Transação</span>
                        <span className="text-xs font-mono text-gray-500 text-right max-w-[150px] truncate" title={id}>{id}</span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-2 bg-[linear-gradient(135deg,transparent_50%,#f9fafb_50%),linear-gradient(45deg,#f9fafb_50%,transparent_50%)] bg-[length:16px_16px] -mb-2 rotate-180"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={handleShare}>
                    <div className="flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                    </div>
                </Button>
                <Button onClick={onClose}>
                    Nova Transferência
                </Button>
            </div>
        </div>
    )
}
