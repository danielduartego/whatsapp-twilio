require('dotenv').config();
const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio envia dados como application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ============================================================
// WEBHOOK: Receber mensagens do WhatsApp via Twilio
// ============================================================
app.post('/webhook', (req, res) => {
  const {
    From,           // Número do remetente (ex: whatsapp:+5511999999999)
    To,             // Número Twilio (ex: whatsapp:+15558695521)
    Body,           // Texto da mensagem
    MessageSid,     // ID único da mensagem
    NumMedia,       // Quantidade de mídias anexadas
    ProfileName,    // Nome do perfil do WhatsApp do remetente
  } = req.body;

  // Log da mensagem recebida
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📩 Nova mensagem WhatsApp recebida!');
  console.log(`   De: ${ProfileName} (${From})`);
  console.log(`   Para: ${To}`);
  console.log(`   Mensagem: ${Body}`);
  console.log(`   MessageSid: ${MessageSid}`);
  console.log(`   Mídias anexadas: ${NumMedia || 0}`);

  // Log de mídias (se houver)
  const mediaCount = parseInt(NumMedia || '0');
  if (mediaCount > 0) {
    for (let i = 0; i < mediaCount; i++) {
      console.log(`   Mídia ${i}: ${req.body[`MediaUrl${i}`]} (${req.body[`MediaContentType${i}`]})`);
    }
  }

  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Resposta automática (TwiML)
  const twiml = new MessagingResponse();
  twiml.message(`Olá ${ProfileName || ''}! Recebemos sua mensagem: "${Body}". Obrigado por entrar em contato com a Tatersal Digital! 🐴`);

  res.type('text/xml');
  res.send(twiml.toString());
});

// ============================================================
// STATUS CALLBACK: Receber atualizações de status de envio
// ============================================================
app.post('/status-callback', (req, res) => {
  const {
    MessageSid,
    MessageStatus,  // queued, sent, delivered, read, failed, undelivered
    To,
    ErrorCode,
    ErrorMessage,
  } = req.body;

  console.log(`📊 Status Update: ${MessageSid} → ${MessageStatus} (To: ${To})`);
  if (ErrorCode) {
    console.log(`   ⚠️ Erro: ${ErrorCode} - ${ErrorMessage}`);
  }

  res.sendStatus(200);
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Tatersal Digital - Twilio WhatsApp Webhook',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: 'POST /webhook',
      statusCallback: 'POST /status-callback',
    }
  });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Tatersal Digital - Twilio WhatsApp Webhook Server');
  console.log(`   Servidor rodando em: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Endpoints:');
  console.log(`   POST http://localhost:${PORT}/webhook          → Receber mensagens`);
  console.log(`   POST http://localhost:${PORT}/status-callback   → Status de envio`);
  console.log(`   GET  http://localhost:${PORT}/                  → Health check`);
  console.log('');
  console.log('⚡ Para expor localmente, use ngrok:');
  console.log(`   ngrok http ${PORT}`);
  console.log('');
  console.log('   Depois configure no Twilio:');
  console.log('   Webhook URL: https://<seu-ngrok>.ngrok-free.app/webhook');
  console.log('');
});
