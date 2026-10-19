// Vercel serverless endpoint. Keep OPENAI_API_KEY in Vercel Environment Variables; never expose it in browser code.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    return res.status(200).json({ configured: Boolean(process.env.OPENAI_API_KEY), service: 'FAST-TRACK AI Career Assistant' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'AI service is not configured' });
  const body = req.body || {};
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';
  if (!message) return res.status(400).json({ error: 'A message is required' });
  const history = Array.isArray(body.history) ? body.history.slice(-10).filter(m => m && ['user','assistant'].includes(m.role) && typeof m.content === 'string').map(m => ({ role: m.role, content: m.content.slice(0, 2000) })) : [];
  const input = [...history, { role: 'user', content: message }].map(m => ({ role: m.role, content: m.content }));
  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [
        { role: 'system', content: 'You are FAST-TRACK AI, a friendly and practical career assistant for a job portal. Help with job-search strategy, skills, resumes, career planning, and interview practice. Be supportive, concise, and actionable. Do not claim access to live job listings, private user profiles, application statuses, or company data unless explicitly included in the conversation. Never invent job openings, credentials, work experience, or qualifications. For resume help, preserve truth and never fabricate achievements. Do not make hiring decisions or advise rejecting people based solely on AI scores. Ask clarifying questions when useful. Remind users not to share passwords or sensitive personal data when relevant.' },
        ...input
      ], temperature: 0.6, max_tokens: 700 })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error('AI provider request failed:', upstream.status, data?.error?.type || 'unknown');
      return res.status(502).json({ error: 'AI provider request failed' });
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return res.status(502).json({ error: 'Empty AI response' });
    return res.status(200).json({ reply: reply.trim() });
  } catch (error) {
    console.error('AI assistant error:', error?.message || 'unknown');
    return res.status(500).json({ error: 'Unable to process the message right now' });
  }
}
