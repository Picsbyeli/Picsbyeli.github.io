const { expect } = require('chai');
const nock = require('nock');
const { scrubConfusables, remoteModerationCheck } = require('../lib/moderation');

describe('moderation helpers', () => {
  describe('scrubConfusables', () => {
    it('removes confusable characters and diacritics (returns ascii-ish output)', () => {
      const raw = 'ТеѕtÁ'; // contains Cyrillic T, weird s, and diacritic A
      const out = scrubConfusables(raw);
      expect(out).to.be.a('string');
      // should contain ASCII letters and not contain combining marks
      expect(out).to.match(/^[\w \-]{1,30}$/);
      expect(out.normalize('NFD')).to.not.match(/\p{M}/u);
    });
  });

  describe('remoteModerationCheck', () => {
    const url = 'http://moderation.test';
    beforeEach(() => { process.env.MODERATION_URL = url + '/check'; });
    afterEach(() => { delete process.env.MODERATION_URL; nock.cleanAll(); });

    it('returns ok:false when remote flags', async () => {
      nock(url).post('/check').reply(200, { flagged: true });
      const res = await remoteModerationCheck('badname');
      expect(res.ok).to.equal(false);
    });

    it('returns ok:true when remote approves', async () => {
      nock(url).post('/check').reply(200, { flagged: false });
      const res = await remoteModerationCheck('goodname');
      expect(res.ok).to.equal(true);
    });

    it('treats network errors as failure (fail-closed)', async () => {
      nock(url).post('/check').replyWithError('network down');
      // default behavior is now fail-open
      let res = await remoteModerationCheck('maybe');
      expect(res.ok).to.equal(true);
      // if configured to fail-closed, it should block
      process.env.MODERATION_FAIL_CLOSED = '1';
      nock.cleanAll();
      nock(url).post('/check').replyWithError('network down');
      res = await remoteModerationCheck('maybe');
      expect(res.ok).to.equal(false);
      delete process.env.MODERATION_FAIL_CLOSED;
    });
  });
});
