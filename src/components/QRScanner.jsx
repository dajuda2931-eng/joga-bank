import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

export const QRScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [error, setError] = useState('')
    const streamRef = useRef(null)

    useEffect(() => {
        startScanner()
        return () => {
            stopScanner()
        }
    }, [])

    const startScanner = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: 'environment' }, // Câmera traseira
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })

            streamRef.current = stream

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
                requestAnimationFrame(tick)
            }
        } catch (err) {
            console.error('Erro ao acessar câmera:', err)
            setError('Não foi possível acessar a câmera. Verifique as permissões.')
        }
    }

    const stopScanner = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
        }
    }

    const tick = () => {
        const video = videoRef.current
        const canvas = canvasRef.current

        if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const ctx = canvas.getContext('2d')
            canvas.height = video.videoHeight
            canvas.width = video.videoWidth
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            })

            if (code) {
                stopScanner()
                onScan(code.data)
                return
            }
        }

        requestAnimationFrame(tick)
    }

    return (
        <div className="relative">
            {error ? (
                <div className="text-center py-8">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={onClose} className="text-emerald-500 underline">
                        Voltar
                    </button>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        className="w-full rounded-xl"
                        playsInline
                        muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Overlay com guia de escaneamento */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-4 border-emerald-500 rounded-2xl relative">
                            {/* Cantos animados */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>

                            {/* Linha de scan animada */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
