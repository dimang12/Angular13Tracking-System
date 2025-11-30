require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5020;

app.use(cors({ origin: true }));
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_KEY;
if (!OPENAI_KEY) {
  console.warn('WARNING: OPENAI_KEY not set in .env. Set OPENAI_KEY to forward requests to OpenAI.');
}

app.post('/improve', async (req, res) => {
  try {
    const text = req.body && typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).json({ error: 'Missing text' });

    // No mock fallback: require a valid OpenAI key in local development.
    if (!OPENAI_KEY || OPENAI_KEY.startsWith('sk-REPLACE')) {
      console.error('OPENAI_KEY not set or placeholder detected - no mock fallback enabled. Please set OPENAI_KEY in backend/localserver/.env');
      return res.status(500).json({ error: 'OpenAI key not configured' });
    }

    // Instruct model to return an HTML fragment that preserves formatting (inline tags like <strong>, <em>, <p>, <ul>, <ol>, <li>, <a>, etc.).
    // Respond with HTML only — no surrounding <html>, <body>, or commentary.
    const systemPrompt = `You are an assistant that improves and rewrites HTML fragments. You must return only the improved HTML fragment, preserving original meaning and formatting. Use valid HTML inline elements (<strong>, <em>, <u>, <a>, <code>, <pre>, <p>, <ul>, <ol>, <li>, etc.). Do not include <html>, <head>, or <body> tags. Do not add any commentary.`;
    const userPrompt = `Improve and rephrase this HTML fragment for clarity, tone, and grammar while preserving the structure and inline formatting. Return only the improved HTML fragment and nothing else:\n\n${text}`;

    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1200,
      temperature: 0.6
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      }
    });

    const improvedText = resp.data?.choices?.[0]?.message?.content?.trim();
    res.json({ improvedText });
  } catch (err) {
    console.error('local improve error', err && err.toString && err.toString());
    res.status(500).json({ error: 'Failed' });
  }
});

// Health endpoint so browser can verify server is running at root
app.get('/', (req, res) => {
  res.send('Local OpenAI proxy running');
});

// End of routes
app.listen(port, () => console.log(`Local OpenAI proxy listening on http://localhost:${port}`));
