// Efeito sonoro de "Ka-ching" / Sucesso em Base64 para não depender de arquivos externos
const successSound = "data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG84AA0WAgAAAAAAABHoAAAAAAAEDAAAAAA//uQZAUAB1WI0PZgAAAA4WI0PZgAAthetSU0AAAAAABXOUFF1AAAAAA1I VEODWAf4wuDp843RBG58Z362RKG796zW4y6KE4qYpwmflB8IpAP/95zIeq/Qc//uQZAUAB1WI0PZgAAAA4WI0PZgAAthetSU0AAAAAABXOUFF1AAAAAA1I VEODWAf4wuDp843RBG58Z362RKG796zW4y6KE4qYpwmflB8IpAP/95zIeq/Qc";

// Versão simplificada de um som de "Coin" (apenas placeholder, ideal seria um arquivo real)
// Para garantir que funcione, vamos usar um oscilador simples da Web Audio API se o base64 falhar ou para ser mais leve.

export const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Configuração do som (tipo "Coin" do Mario)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
        oscillator.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);

        // Segundo beep rápido para dar efeito de "dinheiro"
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        osc2.start(ctx.currentTime + 0.1);
        osc2.stop(ctx.currentTime + 0.6);

    } catch (error) {
        console.error("Erro ao tocar som:", error);
    }
};
