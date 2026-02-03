import os
import requests
from telebot import TeleBot
from dotenv import load_dotenv

load_dotenv()

# Configuration - Edit these for each bot
CHARACTER_NAME = "Simple_AI"
MODEL_NAME = "deepseek/deepseek-v3.2"
SYSTEM_PROMPT = """You are Simple_AI, the central assistant for Simple-as-that.org - a lab of strange, specific AI personalities.

Your job is to:
- Greet people as "Simple_AI" and briefly explain that this site lets them chat with and deploy different personas as bots.
- Match the user's tone. If they're casual or swearing, you can answer with the same energy (including profanity) as long as it's playful, not hateful.
- Ask a couple of quick questions about what they're into, then recommend 2-3 personas.
- Keep explanations short and clear, in the "simple as that" spirit.
"""

# Environment variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DEV_CODE = os.getenv("DEV_CODE", "SIMPLEDEV2025")

bot = TeleBot(BOT_TOKEN)
user_data = {}  # In-memory user state; can upgrade to redis/sqlite later

def ask_model(prompt, system=None, max_tokens=600):
    """Call OpenRouter API with the persona's settings"""
    if not OPENROUTER_API_KEY:
        return "My brain is offline right now, try again later."
    
    if system is None:
        system = SYSTEM_PROMPT
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    
    data = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
    }
    
    try:
        r = requests.post(url, headers=headers, json=data, timeout=40)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Oops, something broke: {str(e)}"

def is_unlimited(user_id: int) -> bool:
    """Check if user has premium access"""
    return user_data.get(user_id, {}).get("lifetime", False)

def has_active_subscription(user_id: int) -> bool:
    """Placeholder for future Stripe/Gumroad integration"""
    # TODO: Replace with actual subscription check via API
    return is_unlimited(user_id)

@bot.message_handler(commands=["code"])
def handle_code(message):
    """Handle unlock code for premium access"""
    user_id = message.from_user.id
    parts = message.text.strip().split(maxsplit=1)
    if len(parts) < 2:
        bot.reply_to(message, "Send /code YOURCODE")
        return
    
    code = parts[1].strip().upper()
    if user_id not in user_data:
        user_data[user_id] = {}
    
    if code == DEV_CODE:
        user_data[user_id]["lifetime"] = True
        bot.reply_to(
            message,
            f"✨ Code accepted: you now have full access to {CHARACTER_NAME}.\n\n"
            "You don't need slash commands anymore—just talk to me like a person."
        )
    else:
        bot.reply_to(message, "Invalid code.")

@bot.message_handler(func=lambda m: True)
def handle(message):
    """Handle all text messages"""
    user_id = message.from_user.id
    text = message.text.strip()
    text_lower = text.lower()
    
    # Magic word for testing/quick unlock
    if text_lower == "paid":
        if user_id not in user_data:
            user_data[user_id] = {}
        user_data[user_id]["lifetime"] = True
        bot.reply_to(
            message,
            f"Got it, full access is active for {CHARACTER_NAME}. Just talk to me normally."
        )
        return
    
    # Check if user has access
    if has_active_subscription(user_id):
        prompt = (
            f"The user says: \"{text}\"\n\n"
            f"Reply as {CHARACTER_NAME}, stay in character, answer fully."
        )
        reply = ask_model(prompt, max_tokens=800)
        bot.reply_to(message, reply)
        return
    
    # Free / onboarding behavior
    bot.reply_to(
        message,
        f"Hey, I'm {CHARACTER_NAME}. To unlock full access, use /code or type 'paid' to test."
    )

if __name__ == "__main__":
    print(f"Bot {CHARACTER_NAME} is starting...")
    bot.polling()
