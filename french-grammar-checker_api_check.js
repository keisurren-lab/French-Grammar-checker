// This runs on Vercel's server, never in the browser — so your API key stays hidden.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || text.length > 2000) {
    return res.status(400).json({ error: 'Missing or invalid text' });
  }

  const prompt = [
    'You are a French grammar checker. Analyze the following French text for grammar, spelling, agreement, and conjugation errors.',
    'Respond with ONLY valid JSON, no markdown fences, in this exact shape:',
    '{"corrected": "the fully corrected version of the text", "issues": [{"original": "the incorrect word or phrase", "correction": "the corrected word or phrase", "explanation": "a short, one-sentence explanation in English of the rule involved"}]}',
    'If there are no errors, return an empty issues array and set corrected equal to the original text.',
    'Text to check:',
    text
  ].join('\n');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Anthropic API error:', detail);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    const raw = (textBlock && textBlock.text || '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ''));
    } catch (e) {
      console.error('Failed to parse model output:', raw);
      return res.status(502).json({ error: 'Could not parse model output' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
