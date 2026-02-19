const { MessagingResponse } = require('twilio').twiml;

const recentMessages = [];
const MAX_MESSAGES = 50;

// Helper para parsear application/x-www-form-urlencoded
function parseUrlEncoded(body) {
  const params = {};
  const pairs = body.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '').replace(/\+/g, ' ');
  }
  return params;
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json({ messages: recentMessages });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Parse o body dependendo do content-type
  let data = req.body;
  if (typeof data === 'string') {
    data = parseUrlEncoded(data);
  }

  const {
    From,
    To,
    Body,
    MessageSid,
    NumMedia,
    ProfileName,
  } = data;

  // Log da mensagem recebida
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📩 Nova mensagem WhatsApp recebida!');
  console.log(`   De: ${ProfileName} (${From})`);
  console.log(`   Para: ${To}`);
  console.log(`   Mensagem: ${Body}`);
  console.log(`   MessageSid: ${MessageSid}`);
  console.log(`   Mídias: ${NumMedia || 0}`);

  const mediaCount = parseInt(NumMedia || '0');
  if (mediaCount > 0) {
    for (let i = 0; i < mediaCount; i++) {
      console.log(`   Mídia ${i}: ${data[`MediaUrl${i}`]} (${data[`MediaContentType${i}`]})`);
    }
  }

  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  recentMessages.unshift({
    from: `${ProfileName || 'Sem nome'} (${From || 'desconhecido'})`,
    body: Body || '',
    timestamp: new Date().toISOString(),
  });

  if (recentMessages.length > MAX_MESSAGES) {
    recentMessages.length = MAX_MESSAGES;
  }

  // Resposta automática (TwiML)
  const twiml = new MessagingResponse();
  twiml.message('Aqui é da Tatersal Digital, entraremos em contato.');

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
};
