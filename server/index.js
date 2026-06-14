require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
// A small additional blocklist to catch common slurs/variants and fuzzy substrings
const EXTRA_BLOCK = ['fuck','fuk','shit','sh1t','bitch','b1tch','cunt','nigger','n1gger','faggot','motherfucker','mf'];

function createFallbackFilter(seed) {
  function SimpleFilter(initial) {
    this.words = new Set();
    if (Array.isArray(initial)) this.addWords.apply(this, initial);
  }
  SimpleFilter.prototype.addWords = function() {
    for (var i = 0; i < arguments.length; i++) {
      var word = String(arguments[i] || '').toLowerCase();
      if(word) this.words.add(word);
    }
    return this.words;
  };
  SimpleFilter.prototype.removeWords = function() {
    for (var i = 0; i < arguments.length; i++) {
      var word = String(arguments[i] || '').toLowerCase();
      if(word) this.words.delete(word);
    }
    return this.words;
  };
  SimpleFilter.prototype.isProfane = function(input) {
    if(!input) return false;
    var low = String(input).toLowerCase();
    var iterator = this.words.values();
    for (var next = iterator.next(); !next.done; next = iterator.next()) {
      var w = next.value;
      if(w && low.indexOf(w) !== -1) return true;
    }
    return false;
  };
  SimpleFilter.prototype.clean = function(input) { return input; };
  return new SimpleFilter(seed);
}

let filter = createFallbackFilter(EXTRA_BLOCK);
(async function loadBadWordsFilter(){
  try {
    const mod = await import('bad-words');
    var FilterCtor = (mod && (mod.Filter || mod.default)) || null;
    if(typeof FilterCtor === 'function') {
      var instance = new FilterCtor();
      if(instance && typeof instance.addWords === 'function') {
        try { instance.addWords.apply(instance, EXTRA_BLOCK); } catch (e) {}
      }
      filter = instance;
    }
  } catch (err) {
    console.warn('bad-words module unavailable; using fallback profanity filter', err && err.message ? err.message : err);
  }
})();

// nanoid v4+ is ESM-only and will throw when required from CommonJS on some runners.
// Try to require it; if that fails, fall back to a small synchronous UUID generator
// using Node's crypto APIs so CI and older environments remain compatible.
let nanoid;
try {
  // prefer the official nanoid when available
  ({ nanoid } = require('nanoid'));
} catch (e) {
  const crypto = require('crypto');
  // Provide a compact identifier similar in length to nanoid (21 chars by default)
  nanoid = function(size = 21) {
    if (crypto.randomUUID) {
      // randomUUID returns a 36-char UUID with hyphens; strip and truncate
      return crypto.randomUUID().replace(/-/g, '').slice(0, size);
    }
    // fallback to random bytes hex
    return crypto.randomBytes(Math.ceil(size / 2)).toString('hex').slice(0, size);
  };
}
const { scrubConfusables, remoteModerationCheck, logDecision } = require('./lib/moderation');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(UPLOADS));

// limit uploads to small images and validate types
const upload = multer({ dest: UPLOADS, limits: { fileSize: 1024 * 1024 * 2 } }); // 2MB

function looksProfane(name) {
  if (!name) return false;
  const low = name.toLowerCase();
  // direct bad-words library
  if (filter && typeof filter.isProfane === 'function' && filter.isProfane(low)) return true;
  // check extra blocklist as substrings for fuzzy matches
  for (const w of EXTRA_BLOCK) {
    if (low.includes(w)) return true;
  }
  return false;
}

// remoteModerationCheck and logging provided by lib/moderation

// Normalize username: NFC, remove diacritics, strip control/zero-width chars, map a few common confusables
function normalizeUsername(raw) {
  if (!raw || typeof raw !== 'string') return '';
  // NFC
  let s = raw.normalize('NFC');
  // remove zero-width and control characters
  s = s.replace(/\p{Cf}|\p{Cc}/gu, '');
  // Use scrubbing helper from moderation module (which may use a confusables lib)
  try { s = scrubConfusables(s); } catch (e) { /* fallback: proceed with s as-is */ }
  // remove diacritics (NFD then remove combining marks)
  s = s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
  // finally strip to allowed chars and trim/limit length
  s = s.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().slice(0,30);
  return s;
}

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return { users: {}, leaderboard: {} };
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) { return { users: {}, leaderboard: {} }; }
}

function writeData(data) {
  // atomic write: write to temp file then rename
  try {
    const tmp = DATA_FILE + '.' + Date.now() + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmp, DATA_FILE);
  } catch (e) {
    // fallback non-atomic write
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  }
}

app.get('/api/leaderboard', (req, res) => {
  const data = readData();
  res.json({ leaderboard: data.leaderboard || {} });
});

app.post('/api/register', (req, res) => {
  const { username, email } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const clean = normalizeUsername(username);
  if (!clean) return res.status(400).json({ error: 'invalid username' });
  if (looksProfane(clean)) {
    return res.status(400).json({ error: 'username contains disallowed words' });
  }
  // remote moderation check (now fail-closed by default unless MODERATION_FAIL_CLOSED='0')
  (async () => {
    const mod = await remoteModerationCheck(clean);
    if (!mod.ok) return res.status(400).json({ error: 'username rejected by moderation', detail: mod });
    // proceed with registration
    const data = readData();
    if (data.users[clean]) return res.status(409).json({ error: 'username taken' });
    const id = nanoid();
    data.users[clean] = { id, username: clean, email: email || '', created: Date.now(), prefs: {} };
    if (!data.leaderboard) data.leaderboard = {};
    if (!data.leaderboard[clean]) data.leaderboard[clean] = { score: 0, questionsSolved: 0, totalCorrectTime: 0, correctCount: 0, highestStreak: 0 };
    writeData(data);
    return res.json({ user: data.users[clean] });
  })().catch(err => {
    console.error('Registration moderation flow error:', err && err.message ? err.message : err);
    // If configured to allow failures explicitly, proceed. Default is fail-closed.
    if (process.env.MODERATION_FAIL_CLOSED === '0') {
      const data = readData();
      if (data.users[clean]) return res.status(409).json({ error: 'username taken' });
      const id = nanoid();
      data.users[clean] = { id, username: clean, email: email || '', created: Date.now(), prefs: {} };
      if (!data.leaderboard) data.leaderboard = {};
      if (!data.leaderboard[clean]) data.leaderboard[clean] = { score: 0, questionsSolved: 0, totalCorrectTime: 0, correctCount: 0, highestStreak: 0 };
      writeData(data);
      return res.json({ user: data.users[clean] });
    }
    return res.status(500).json({ error: 'moderation service error' });
  });
  // registration flow completes in the async block above
});

app.post('/api/check-username', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.json({ ok: false, reason: 'missing' });
  const clean = normalizeUsername(username);
  const data = readData();
  if (!clean) return res.json({ ok: false, reason: 'invalid' });
  if (looksProfane(clean)) return res.json({ ok: false, reason: 'profanity' });
  if (data.users[clean]) return res.json({ ok: false, reason: 'taken' });
  // remote moderation check (fail-closed by default)
  (async () => {
    const mod = await remoteModerationCheck(clean);
    if (!mod.ok) return res.json({ ok: false, reason: 'remote_flagged', detail: mod });
    return res.json({ ok: true });
  })().catch(err => {
    console.error('check-username moderation error:', err && err.message ? err.message : err);
    if (process.env.MODERATION_FAIL_CLOSED === '0') return res.json({ ok: true });
    return res.json({ ok: false, reason: 'moderation_error' });
  });
});

app.post('/api/record', (req, res) => {
  const { username, type, time } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const data = readData();
  if (!data.leaderboard) data.leaderboard = {};
  if (!data.leaderboard[username]) data.leaderboard[username] = { score: 0, questionsSolved: 0, totalCorrectTime: 0, correctCount: 0, highestStreak: 0, currentStreak: 0 };
  const entry = data.leaderboard[username];
  if (type === 'correct') {
    entry.questionsSolved = (entry.questionsSolved || 0) + 1;
    entry.totalCorrectTime = (entry.totalCorrectTime || 0) + (time || 0);
    entry.correctCount = (entry.correctCount || 0) + 1;
    entry.currentStreak = (entry.currentStreak || 0) + 1;
    if ((entry.currentStreak || 0) > (entry.highestStreak || 0)) entry.highestStreak = entry.currentStreak;
    entry.score = (entry.score || 0) + 10;
  } else if (type === 'incorrect') {
    entry.currentStreak = 0;
  }
  data.leaderboard[username] = entry;
  writeData(data);
  res.json({ ok: true });
});

app.post('/api/upload-profile', (req, res) => {
  // Use the upload middleware explicitly to capture errors and validate file type
  upload.single('banner')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ error: 'upload error', detail: err.message });
    }
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'username required' });
    const data = readData();
    if (!data.users[username]) return res.status(404).json({ error: 'user not found' });
    if (!req.file) return res.status(400).json({ error: 'file missing' });
    // validate mime type (basic) and extension
    const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    const mime = req.file.mimetype || '';
    if (!allowed.includes(mime)) {
      // remove the uploaded file
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      return res.status(400).json({ error: 'unsupported file type' });
    }
    // success
    const url = `/uploads/${path.basename(req.file.path)}`;
    data.users[username].banner = url;
    writeData(data);
    res.json({ ok: true, url });
  });
});

app.post('/api/save-prefs', (req, res) => {
  const { username, prefs } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const data = readData();
  if (!data.users[username]) return res.status(404).json({ error: 'user not found' });
  data.users[username].prefs = prefs || {};
  writeData(data);
  res.json({ ok: true });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

/* ================================================================
   LUMEN — Bible Study AI endpoints
   Key lives ONLY in server/.env as GROK_API_KEY — never sent to
   the browser. All AI calls go through these routes.
   ================================================================ */

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL   = 'grok-3-mini';  // free-tier model

// Helper: call Grok with a messages array, return the text content
async function callGrok(messages, maxTokens = 1800, temperature = 0.4) {
  const key = process.env.GROK_API_KEY;
  if (!key) throw new Error('GROK_API_KEY not set in server/.env');
  const res = await axios.post(
    GROK_API_URL,
    { model: GROK_MODEL, messages, max_tokens: maxTokens, temperature },
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, timeout: 30000 }
  );
  return (res.data.choices[0].message.content || '').trim();
}

// Helper: parse JSON from model output (strips markdown fences if present)
function parseJSON(txt) {
  try { return JSON.parse(txt); } catch (_) {}
  const m = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) { try { return JSON.parse(m[1].trim()); } catch (_) {} }
  const obj = txt.match(/\{[\s\S]*\}/);
  if (obj) { try { return JSON.parse(obj[0]); } catch (_) {} }
  throw new Error('Could not parse JSON from model response');
}

// Helper: fetch a single verse from bible-api.com (free, KJV/WEB, no key needed)
async function fetchVerse(ref, translation = 'kjv') {
  try {
    const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${translation}`;
    const r = await axios.get(url, { timeout: 8000 });
    const text = (r.data.text || '').replace(/\s+/g, ' ').trim();
    const canon = r.data.reference || ref;
    return { ref: canon, text, ok: !!text };
  } catch (_) {
    return { ref, text: '', ok: false };
  }
}

// Helper: fetch a whole chapter
async function fetchChapter(ref, translation = 'kjv') {
  try {
    const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${translation}`;
    const r = await axios.get(url, { timeout: 8000 });
    return (r.data.verses || []).map(v => ({ num: v.verse, text: (v.text || '').trim() }));
  } catch (_) { return []; }
}

// ── POST /api/lumen-pastor ────────────────────────────────────────
// Body: { question: string, history: [{role,content}] }
// Flow:
//   1. Ask Grok for up to 5 relevant verse references
//   2. Fetch each verse from bible-api.com (KJV/WEB)
//   3. Ask Grok for full 6-part pastoral response using ONLY those real verses
// Returns: { answer, verses, examples, takeaway, reflection, prayer, topic }
app.post('/api/lumen-pastor', async (req, res) => {
  const { question, history = [] } = req.body || {};
  if (!question || typeof question !== 'string') return res.status(400).json({ error: 'question required' });

  try {
    // Step 1 — identify relevant verse references
    const refMsg = [
      { role: 'system', content: 'You are a Bible reference expert. Given a question or topic, return ONLY valid JSON array of up to 5 real Bible verse references (strings like "John 3:16" or "Philippians 4:6-7"). Return ONLY the JSON array, no other text.' },
      { role: 'user', content: `Question: ${question}` }
    ];
    let refs = [];
    try {
      const refTxt = await callGrok(refMsg, 200, 0.2);
      refs = JSON.parse(refTxt.match(/\[[\s\S]*\]/)[0]);
    } catch (_) { refs = ['Psalm 34:4', 'James 1:5']; }

    // Step 2 — fetch real verse texts from bible-api.com
    const verseData = await Promise.all(
      refs.slice(0, 5).map(r => fetchVerse(r, 'kjv').catch(() => ({ ref: r, text: '', ok: false })))
    );
    const confirmedVerses = verseData.filter(v => v.ok && v.text);

    // Build the verse context block for the final prompt
    const verseBlock = confirmedVerses.length
      ? confirmedVerses.map(v => `[${v.ref}] "${v.text}"`).join('\n')
      : '(no verses retrieved — do not invent any)';

    // Step 3 — full pastoral response
    const conversationMsgs = history.slice(-8).map(m => ({ role: m.role === 'pastor' ? 'assistant' : 'user', content: m.content || m.text || '' })).filter(m => m.content);
    if (!conversationMsgs.length || conversationMsgs[conversationMsgs.length - 1].role !== 'user') {
      conversationMsgs.push({ role: 'user', content: question });
    }

    const PASTOR_SYS = `You are a warm, knowledgeable AI Pastor and Bible teacher. A set of VERIFIED Bible verses has been retrieved from a licensed Bible API and provided below. You MUST:
1. ONLY quote from the verses provided — never invent or modify scripture text.
2. Clearly label when Christians have different interpretations.
3. Distinguish biblical teaching from practical suggestions.
4. Be warm, honest, and pastoral — like a pastor over coffee.
5. If you are uncertain about a fact, say so.

VERIFIED BIBLE VERSES (KJV from bible-api.com):
${verseBlock}

Return ONLY valid JSON (no markdown) with these exact keys:
- "answer": string — direct compassionate response (reference verses inline as [Book ch:v])
- "verses": array of {ref, text, note} — use ONLY verses from the list above
- "examples": array of 2-3 concrete real-world examples or analogies
- "takeaway": string — one practical action the person can take today  
- "reflection": string — one honest reflection question
- "prayer": string — a short sincere prayer (2-4 sentences)
- "topic": string — 3-5 word label for this topic`;

    const txt = await callGrok([{ role: 'system', content: PASTOR_SYS }, ...conversationMsgs], 1800, 0.4);
    const data = parseJSON(txt);

    // Ensure verses array only contains confirmed ones
    if (data.verses) {
      data.verses = data.verses.filter(v => confirmedVerses.some(c => c.ref === v.ref || c.text === v.text));
      // Re-attach confirmed text in case model paraphrased
      data.verses = data.verses.map(v => {
        const confirmed = confirmedVerses.find(c => c.ref === v.ref);
        return confirmed ? { ...v, text: confirmed.text } : v;
      });
    }

    res.json(data);
  } catch (err) {
    console.error('[lumen-pastor]', err.message);
    res.status(500).json({ error: 'AI unavailable', detail: err.message });
  }
});

// ── POST /api/lumen-explain ───────────────────────────────────────
// Body: { reference: string, version: string }
// Flow:
//   1. Fetch the verse text from bible-api.com
//   2. Ask Grok for structured explanation using only that real text
// Returns: { context, meaning, themes, related, application, reflection, prayer, interpretation_notes }
app.post('/api/lumen-explain', async (req, res) => {
  const { reference, version = 'KJV' } = req.body || {};
  if (!reference) return res.status(400).json({ error: 'reference required' });

  try {
    // Fetch the verse text
    const translation = ['KJV','WEB'].includes((version||'').toUpperCase()) ? version.toLowerCase() : 'kjv';
    const verse = await fetchVerse(reference, translation);

    const verseContext = verse.ok
      ? `Reference: ${verse.ref}\nVersion: ${version.toUpperCase()}\nText (authoritative — do not alter): "${verse.text}"`
      : `Reference: ${reference}\n(Text could not be retrieved — do not fabricate wording)`;

    const EXPLAIN_SYS = `You are a careful, respectful Bible study assistant. Explain the given passage grounded in its actual text and historical/biblical context. Be accurate and humble.
RULES:
- NEVER invent facts, quotes, authors, dates, or cross-references.
- Only cite cross-references you are certain are real.
- Where Christian traditions differ, say so without endorsing one.
- Clearly label practical suggestions vs. biblical teaching.
Return ONLY valid JSON (no markdown) with keys: "context", "meaning", "themes" (array of 3-5 short strings), "related" (array of real "Book ch:v" strings), "application", "reflection", "prayer", "interpretation_notes" (empty string unless genuinely debated).`;

    const txt = await callGrok(
      [
        { role: 'system', content: EXPLAIN_SYS },
        { role: 'user', content: verseContext + '\n\nExplain this passage.' }
      ],
      1200, 0.3
    );
    const data = parseJSON(txt);
    // Attach the verified verse text
    if (verse.ok) data._verifiedText = verse.text;
    res.json(data);
  } catch (err) {
    console.error('[lumen-explain]', err.message);
    res.status(500).json({ error: 'AI unavailable', detail: err.message });
  }
});

module.exports = app;
