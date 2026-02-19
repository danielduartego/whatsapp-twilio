# Tatersal Digital - Twilio WhatsApp Webhook

Servidor para receber mensagens do WhatsApp via Twilio para a Tatersal Digital.

## Setup Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais do Twilio
```

### 3. Rodar o servidor
```bash
npm start
```

### 4. Expor para a internet (ngrok)
```bash
ngrok http 3000
```

### 5. Configurar no Twilio
No painel do Twilio (WhatsApp Sender +15558695521):

| Campo | Valor |
|-------|-------|
| **Webhook URL for incoming messages** | `https://<seu-subdominio>.ngrok-free.app/webhook` |
| **Webhook method** | `HTTP Post` |
| **Status callback URL** | `https://<seu-subdominio>.ngrok-free.app/status-callback` |

---

## Deploy na Vercel

### 1. Conectar ao GitHub
```bash
git init
git add .
git commit -m "Initial commit: Twilio WhatsApp webhook"
git remote add origin https://github.com/<seu-user>/tatersal-digital-twillio.git
git push -u origin main
```

### 2. Deploy
- Acesse [vercel.com](https://vercel.com) e importe o repositório
- Ou use a CLI: `npx vercel --prod`

### 3. Configurar no Twilio
Após o deploy, use a URL da Vercel:

| Campo | Valor |
|-------|-------|
| **Webhook URL for incoming messages** | `https://tatersal-digital-twillio.vercel.app/webhook` |
| **Webhook method** | `HTTP Post` |
| **Status callback URL** | `https://tatersal-digital-twillio.vercel.app/status-callback` |

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/webhook` | Recebe mensagens do WhatsApp |
| `POST` | `/status-callback` | Recebe status de entrega |
| `GET`  | `/` | Health check (apenas localhost) |
