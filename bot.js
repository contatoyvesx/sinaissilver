import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

// CONFIGURAÇÕES
const CHANNEL = "@silvercorp_sinais";

// gera horário futuro aleatório (1 a 5 min)
function horaAleatoria() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 5) + 1);
  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// gera saque entre 1.50x e 3.00x
function saqueAleatorio() {
  return (Math.random() * (3 - 1.5) + 1.5).toFixed(2);
}

function enviarSinal() {
  const msg = 
`🚀 AVIATOR – SILVER CORP

🔗 Plataforma: https://plataforma-exemplo.com/aviator

⏰ Entrada: ${horaAleatoria()}
🎯 Saque: ${saqueAleatorio()}x

📌 Regra:
Entrar após 2 voos abaixo de 1.50x
Valor fixo
Máx. 2 tentativas`;

  bot.telegram.sendMessage(CHANNEL, msg);
}

// ENVIA UM SINAL A CADA 10 MINUTOS
setInterval(enviarSinal, 10 * 60 * 1000);

bot.launch();
console.log("🤖 Bot AVIATOR rodando...");
