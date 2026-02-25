# Simple As That Lab

A lab of unreasonably specific AI personalities. Chat with weird personas on the web, deploy them as Telegram/Discord bots.

## Project Structure

```
simple-as-that-lab/
├── web/              # Next.js website (simple-as-that.org)
├── bots/             # Telegram/Discord bot templates
├── config/           # Shared persona configurations
└── README.md         # This file
```

## Features

- **Chat Lab**: Web-based chat interface for all personas
- **Bots Lab**: Telegram/Discord versions of personas (coming soon)
- **Research Division**: NSFW & silly research papers (coming soon)
- **Persona System**: Centralized config makes adding new AIs trivial

## Setup

### Web (Next.js)

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file from the template:
   ```bash
   cp .env.example .env.local
   ```

4. Add your OpenRouter API key to `.env.local`:
   ```
   OPENROUTER_API_KEY=your_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Bots (Python/Telegram)

1. Navigate to the bots directory:
   ```bash
   cd bots
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

5. Add your tokens to `.env`:
   ```
   BOT_TOKEN=your_telegram_bot_token
   OPENROUTER_API_KEY=your_openrouter_key
   DEV_CODE=your_unlock_code
   ```

6. Run the bot:
   ```bash
   python telegram_bot_template.py
   ```

## Adding New Personas

1. Edit `config/personas.js`
2. Add a new object to the `personas` array:
   ```javascript
   {
     slug: "my_persona",
     name: "My Persona",
     role: "Role Type",
     model: "deepseek/deepseek-v3.2",
     description: "One-line description",
     systemPrompt: `Full system prompt here...`
   }
   ```
3. The persona automatically appears on the website
4. To make a bot version: copy `telegram_bot_template.py`, change `CHARACTER_NAME`, `MODEL_NAME`, and `SYSTEM_PROMPT` at the top

## Deployment

### Web to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set root directory to `/web`
4. Add `OPENROUTER_API_KEY` to environment variables
5. Deploy

### Bots to VPS

1. Rent a cheap VPS (Hetzner, Contabo, etc.)
2. Clone this repo
3. Set up bots in separate folders with their own `.env` files
4. Use `systemd` or `supervisord` to keep bots running
5. Example systemd service:
   ```ini
   [Unit]
   Description=Simple AI Bot
   After=network.target

   [Service]
   Type=simple
   User=youruser
   WorkingDirectory=/path/to/bots
   ExecStart=/path/to/venv/bin/python telegram_bot_template.py
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenRouter (DeepSeek v3.2, Claude Sonnet 4, etc.)
- **Bots**: Python, pyTelegramBotAPI
- **Hosting**: Vercel (web), VPS (bots)

## License

MIT - Do whatever you want

## Credits

Built by cybergod-duck for Simple As That  
Infrastructure by Voss Neural Research  
Certified by Simple As That
