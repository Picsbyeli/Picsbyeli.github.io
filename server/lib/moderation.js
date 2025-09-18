const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let axios;
try { axios = require('axios'); } catch (e) { axios = null; }

// try to require a confusables package; some environments may not have it
let confusables = null;
try { confusables = require('confusables'); } catch (e) { confusables = null; }

const LOG_PATH = path.join(__dirname, '..', 'moderation.log');
const MAX_LOG_BYTES = Number(process.env.MODERATION_LOG_MAX_BYTES || 1024 * 1024 * 5); // 5MB default
const MAX_LOG_FILES = Number(process.env.MODERATION_LOG_MAX_FILES || 5);

function rotateLogIfNeeded() {
  try {
    if (!fs.existsSync(LOG_PATH)) return;
    const st = fs.statSync(LOG_PATH);
    if (st.size > MAX_LOG_BYTES) {
      const rotated = LOG_PATH + '.' + Date.now() + '.old';
      fs.renameSync(LOG_PATH, rotated);
      // enforce retention
      try {
        const dir = path.dirname(LOG_PATH);
        const base = path.basename(LOG_PATH);
        const files = fs.readdirSync(dir).filter(f => f.startsWith(base + '.')).sort();
        while (files.length > MAX_LOG_FILES) {
          const rem = files.shift();
          try { fs.unlinkSync(path.join(dir, rem)); } catch (e) {}
        }
      } catch (e) {}
      // optionally upload rotated file to S3 (best-effort)
      if (process.env.MODERATION_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
        try { uploadRotatedToS3(rotated).catch(() => {}); } catch (e) {}
      }
    }
  } catch (e) {
    console.error('Log rotation failed', e && e.message ? e.message : e);
  }
}

async function uploadRotatedToS3(filePath) {
  // Lazy-require AWS SDK to avoid heavy dep if not used
  let AWS;
  try { AWS = require('aws-sdk'); } catch (e) { return; }
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const bucket = process.env.MODERATION_S3_BUCKET;
  const key = path.basename(filePath);
  try {
    const body = fs.createReadStream(filePath);
    await s3.upload({ Bucket: bucket, Key: key, Body: body }).promise();
  } catch (e) {
    console.error('Failed to upload rotated moderation log to S3', e && e.message ? e.message : e);
  }
}

function hashName(name) {
  try {
    return crypto.createHash('sha256').update(name || '').digest('hex');
  } catch (e) { return 'hash_error'; }
}

async function sendAuditEvent(obj) {
  const auditUrl = process.env.MODERATION_AUDIT_URL;
  const auditKey = process.env.MODERATION_AUDIT_KEY;
  if (!auditUrl || !axios) return;
  try {
    await axios.post(auditUrl, obj, { headers: auditKey ? { 'Authorization': `Bearer ${auditKey}` } : {}, timeout: 3000 });
  } catch (e) {
    console.error('Failed to send audit event', e && e.message ? e.message : e);
  }
}

function logDecision(obj) {
  try {
    rotateLogIfNeeded();
    // hash any name field to avoid logging PII
    if (obj && obj.name) obj.nameHash = hashName(obj.name);
    delete obj.name; // remove raw name
    const line = JSON.stringify(Object.assign({ ts: new Date().toISOString() }, obj)) + '\n';
    fs.appendFileSync(LOG_PATH, line, 'utf8');
    // also optionally send to audit webhook (best-effort)
    if (process.env.MODERATION_AUDIT_URL) sendAuditEvent(obj).catch(() => {});
  } catch (e) {
    // best-effort logging
    console.error('Failed to write moderation log', e && e.message ? e.message : e);
  }
}

function scrubConfusables(s) {
  if (!s || typeof s !== 'string') return '';
  // NFC + remove zero-width/control
  s = s.normalize('NFC').replace(/\p{Cf}|\p{Cc}/gu, '');
  if (confusables && typeof confusables.toASCII === 'function') {
    try { s = confusables.toASCII(s); } catch (e) { /* fallback below */ }
  } else {
    // small fallback map for common Cyrillic/Greek homoglyphs
    const map = {
      '\u0410':'A','\u0430':'a','\u0415':'E','\u0435':'e','\u041E':'O','\u043E':'o',
      '\u0421':'C','\u0441':'c','\u039F':'O','\u03BF':'o','\u0391':'A','\u03B1':'a'
    };
    if (s) s = s.split('').map(ch => map[ch] || ch).join('');
  }
  // remove diacritics
  s = s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
  // allow only reasonable chars
  s = s.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().slice(0,30);
  return s;
}

async function remoteModerationCheck(name) {
  const url = process.env.MODERATION_URL;
  const key = process.env.MODERATION_KEY;
  if (!url || !axios) {
    logDecision({ action: 'remote_check_skipped', name });
    return { ok: true, reason: 'skipped' };
  }
  try {
    const resp = await axios.post(url, { text: name }, { headers: key ? { 'Authorization': `Bearer ${key}` } : {}, timeout: 3000 });
    const data = resp && resp.data ? resp.data : {};
    const flagged = data.flagged === true || data.blocked === true || data.reject === true || (typeof data.score === 'number' && data.score >= 0.8);
    const out = { ok: !flagged, detail: data };
    logDecision({ action: 'remote_check', name, result: out });
    return out;
  } catch (err) {
    logDecision({ action: 'remote_check_error', name, error: err && err.message ? err.message : err });
    // by default, treat errors as allowed (fail-open) unless MODERATION_FAIL_CLOSED='1'
    if (process.env.MODERATION_FAIL_CLOSED === '1') return { ok: false, reason: 'error' };
    return { ok: true, reason: 'error_allowed' };
  }
}

module.exports = { scrubConfusables, remoteModerationCheck, logDecision };

