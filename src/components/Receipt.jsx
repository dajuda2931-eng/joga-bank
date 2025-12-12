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

    Compartilhar
                    </div >
                </Button >
        <Button onClick={onClose}>
            Nova Transferência
        </Button>
            </div >
        </div >
    )
}
