const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

// Initialize admin SDK if not already initialized
try {
  admin.initializeApp();
} catch (e) {
  // already initialized
}

const OPENAI_CONFIG = functions.config().openai || {};
const OPENAI_KEY = OPENAI_CONFIG.key;

exports.improveWithOpenAI = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    // Require authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
    }

    const text = (data && typeof data.text === 'string') ? data.text.trim() : '';
    if (!text) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing `text` to improve.');
    }

    const MAX_CHARS = 4000;
    if (text.length > MAX_CHARS) {
      throw new functions.https.HttpsError('invalid-argument', `Text too long (max ${MAX_CHARS} chars).`);
    }

    if (!OPENAI_KEY) {
      functions.logger.error('OpenAI key missing in functions config.');
      throw new functions.https.HttpsError('internal', 'OpenAI key not configured on server.');
    }

    try {
      // Ask the model to return an HTML fragment only. Preserve formatting/inline tags and
      // do not return any commentary or surrounding <html>/<body> tags.
      const systemPrompt = `You are an assistant that improves and rewrites HTML fragments. Return only a valid HTML fragment that improves clarity, grammar, tone and conciseness while preserving structure and inline formatting (e.g. <strong>, <em>, <u>, <a>, <code>, <pre>, <p>, <ul>, <ol>, <li>). Do not include <html>, <head>, or <body> tags and provide no commentary.`;
      const userPrompt = `Improve and rephrase the following HTML fragment. Preserve original meaning and inline formatting; return only the improved HTML fragment and nothing else:\n\n${text}`;

      const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.6
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        timeout: 20000
      });

      const improvedText = resp.data?.choices?.[0]?.message?.content?.trim();
      if (!improvedText) {
        functions.logger.error('OpenAI returned empty response', { data: resp.data });
        throw new functions.https.HttpsError('internal', 'OpenAI returned no content.');
      }

      return { improvedText };
    } catch (err) {
      functions.logger.error('OpenAI request failed', err && err.toString && err.toString());
      throw new functions.https.HttpsError('internal', 'Failed to call OpenAI API.');
    }
  });

// New HTTP function to support CORS and token verification for browser calls from localhost
exports.improveWithOpenAIHttp = functions.region('us-central1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Set CORS headers explicitly (safeguard in case middleware doesn't add them)
    const origin = req.get('Origin') || '*';
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');

    if (req.method === 'OPTIONS') {
      // CORS preflight
      return res.status(204).send('');
    }

    try {
      // Check auth token from Authorization: Bearer <token>
      const authHeader = req.get('Authorization') || '';
      const match = authHeader.match(/^Bearer (.*)$/);
      if (!match) {
        return res.status(401).json({ error: 'Missing or invalid auth token.' });
      }
      const idToken = match[1];

      // Verify token
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded || !decoded.uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const text = req.body && typeof req.body.text === 'string' ? req.body.text.trim() : '';
      if (!text) {
        return res.status(400).json({ error: 'Missing `text` to improve.' });
      }

      if (!OPENAI_KEY) {
        functions.logger.error('OpenAI key missing in functions config.');
        return res.status(500).json({ error: 'OpenAI key not configured on server.' });
      }

      // forward to OpenAI
      // Ask the model to return an HTML fragment only. Preserve formatting/inline tags and
      // do not return any commentary or surrounding <html>/<body> tags.
      const systemPrompt = `You are an assistant that improves and rewrites HTML fragments. Return only a valid HTML fragment that improves clarity, grammar, tone and conciseness while preserving structure and inline formatting (e.g. <strong>, <em>, <u>, <a>, <code>, <pre>, <p>, <ul>, <ol>, <li>). Do not include <html>, <head>, or <body> tags and provide no commentary.`;
      const userPrompt = `Improve and rephrase the following HTML fragment. Preserve original meaning and inline formatting; return only the improved HTML fragment and nothing else:\n\n${text}`;

      const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.6
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        timeout: 20000
      });

      const improvedText = resp.data?.choices?.[0]?.message?.content?.trim();
      if (!improvedText) {
        functions.logger.error('OpenAI returned empty response', { data: resp.data });
        return res.status(500).json({ error: 'OpenAI returned no content.' });
      }

      // Ensure CORS header on successful response
      res.set('Access-Control-Allow-Origin', origin);
      return res.json({ improvedText });
    } catch (err) {
      functions.logger.error('improveWithOpenAIHttp failed', err && err.toString && err.toString());
      return res.status(500).json({ error: 'Failed to call OpenAI API.' });
    }
  });
});
