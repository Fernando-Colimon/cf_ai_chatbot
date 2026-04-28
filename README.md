# cf_ai_chatbot

A full-stack AI chat application built on Cloudflare's developer platform.

## Live Demo
🔗 cf-ai-chatbot-frontend-g1d.pages.dev

## What I Built
A chatbot that remembers your conversation across messages, powered by Llama 3.3 running on Cloudflare's edge network.

## Architecture
Browser (Frontend)
↓
Cloudflare Worker  — routes requests, coordinates everything
↓                        ↓
Durable Object          Workers AI (Llama 3.3)
(conversation memory)   (generates responses)

## Tech Stack

| Component | Technology |
|---|---|
| LLM | Llama 3.3 via Cloudflare Workers AI |
| Coordination | Cloudflare Worker (TypeScript) |
| Memory / State | Durable Objects |
| Frontend | HTML / CSS / JS on Cloudflare Pages |

## Project Structure

cf_ai_chatbot/
├── worker/
│   ├── wrangler.toml       # Cloudflare bindings config
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts        # Worker entry point + routing
│       └── session.ts      # Durable Object (conversation memory)
└── frontend/
├── index.html          # Chat UI
├── style.css
└── app.js              # Client-side logic
## Running Locally

### Prerequisites
- Node.js v18+
- Cloudflare account (free tier)
- Wrangler CLI: `npm install -g wrangler`

### Steps

1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/cf_ai_chatbot.git
cd cf_ai_chatbot
```

2. Install dependencies
```bash
cd worker
npm install
```

3. Log in to Cloudflare
```bash
npx wrangler login
```

4. Run the Worker locally
```bash
npx wrangler dev
```

5. Open `frontend/index.html` in your browser

## Deployment

### Deploy the Worker
```bash
cd worker
npx wrangler deploy
```

### Update the frontend
In `frontend/app.js` update `WORKER_URL` to your deployed Worker URL.

### Deploy frontend to Cloudflare Pages
```bash
cd frontend
npx wrangler pages deploy .
```

## How It Works

1. User types a message in the browser
2. Frontend sends `{ sessionId, message }` to the Worker
3. Worker saves the message to a Durable Object
4. Worker fetches full conversation history from the Durable Object
5. Worker sends history to Llama 3.3 via Workers AI
6. AI response is saved to the Durable Object and returned to the browser
