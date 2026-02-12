import { Telegraf } from "telegraf";
import http from "http";

const bot = new Telegraf(process.env.BOT_TOKEN);

// ================= CONFIG =================
const CHANNEL = "@silvercorp_sinais";
const LINK = "https://dash.affiliatesbr.com/api/r/73937/cmkrbg0jc000212hh8rno627q";
// =========================================

// gera horário futuro aleatório (1 a 5 minutos à frente)
function horaAleatoria() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 5) + 1);
  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// gera saque aleatório entre 1.50x e 3.00x
function saqueAleatorio() {
  return (Math.random() * (3.0 - 1.5) + 1.5).toFixed(2);
}

function montarMensagemSinal({ entrada, saque, link }) {
  return `🚀 AVIATOR — SILVER CORP

🎯 Entrada: ${entrada}
💸 Saque: ${saque}x
📌 Regra: Entrar após 2 voos abaixo de 1.50x | Valor fixo | Máx. 2 tentativas

🔥 ENTRE PELO LINK OFICIAL (BÔNUS)
${link}`;
}

function validarMensagemSinal(mensagem, link) {
  return (
    mensagem.includes("AVIATOR") &&
    mensagem.includes("ENTRE PELO LINK OFICIAL") &&
    mensagem.includes(link)
  );
}

// envia o sinal
async function enviarSinal() {
  const mensagem = montarMensagemSinal({
    entrada: horaAleatoria(),
    saque: saqueAleatorio(),
    link: LINK,
  });

  if (!validarMensagemSinal(mensagem, LINK)) {
    console.error("❌ Mensagem de sinal inválida, envio cancelado");
    return;
  }

  await bot.telegram.sendMessage(CHANNEL, mensagem, {
    disable_web_page_preview: true,
  });

  console.log("📢 Sinal enviado");
}

// loop com intervalo ALEATÓRIO até 10 minutos
function loopSinais() {
  enviarSinal().catch((error) => {
    console.error("Erro ao enviar sinal:", error);
  });

  // tempo aleatório entre 1 e 10 minutos
  const tempo = (Math.floor(Math.random() * 10) + 1) * 60 * 1000;
  console.log(`⏱ Próximo sinal em ${(tempo / 60000).toFixed(0)} min`);

  setTimeout(loopSinais, tempo);
}

function iniciarServidorHttp() {
  const PORT = process.env.PORT || 3000;

  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK");
    })
    .listen(PORT, () => {
      console.log("🌐 HTTP server ouvindo na porta", PORT);
    });
}

function iniciarBot() {
  bot.launch();
  console.log("🤖 Bot AVIATOR rodando...");

  loopSinais();
  iniciarServidorHttp();

  // shutdown limpo
  process.on("SIGTERM", () => process.exit(0));
  process.on("SIGINT", () => process.exit(0));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  iniciarBot();
}

export { LINK, montarMensagemSinal, validarMensagemSinal };
