module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  let data = req.body;
  if (typeof data === 'string') {
    const params = {};
    const pairs = data.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '').replace(/\+/g, ' ');
    }
    data = params;
  }

  const { MessageSid, MessageStatus, To, ErrorCode, ErrorMessage } = data;

  console.log(`📊 Status Update: ${MessageSid} → ${MessageStatus} (To: ${To})`);
  if (ErrorCode) {
    console.log(`   ⚠️ Erro: ${ErrorCode} - ${ErrorMessage}`);
  }

  res.status(200).json({ received: true });
};
