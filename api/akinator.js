// Vercel Serverless Function - /api/akinator
// Calls Groq API for Akinator-like gameplay

const SYSTEM_PROMPT = `You are a mystical, all-knowing Genie, just like the famous Akinator. 
Your goal is to guess the real or fictional character the user is thinking of by asking a series of questions.
The user will typically answer with "Yes", "No", "Don't Know", "Probably", or "Probably Not".

RULES:
1. You can only ask ONE question at a time.
2. The questions should help you narrow down the possibilities (e.g., "Is your character real?", "Does your character fight with a sword?", "Is your character from an anime?").
3. DO NOT guess the character until you are very confident (e.g., after 10-20 questions or when you are certain).
4. When you decide to make a guess, format it clearly, for example: "I am guessing you are thinking of: [Character Name]!".
5. Keep your personality mystical, confident, and slightly dramatic.
6. Your first message MUST be a question to start the game.

Now, begin your game!`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' })
  }

  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(response.status).json({ error: error.error?.message || 'Groq API error' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'My mystical connections failed. Let us try again.'

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Akinator error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
