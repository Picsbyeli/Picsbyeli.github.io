const fc = require('fast-check');
const { expect } = require('chai');
const { scrubConfusables } = require('../lib/moderation');
const request = require('supertest');
const app = require('../index');

describe('property-based tests', () => {
  it('scrubConfusables should return ascii-only and length <= 30', () => {
    const runs = Number(process.env.FAST_CHECK_RUNS || 200);
    fc.assert(
      fc.property(fc.unicodeString({ maxLength: 100 }), (s) => {
        const out = scrubConfusables(s);
        // Should be ascii-ish (only allowed chars)
        expect(out.length).to.be.at.most(30);
        expect(out).to.match(/^[\w \-]*$/);
      }),
      { numRuns: runs }
    );
  });

  it('check-username should not crash for random unicode input', async () => {
    const runs2 = Number(process.env.FAST_CHECK_RUNS || 200);
    await fc.assert(
      fc.asyncProperty(fc.unicodeString({ maxLength: 80 }), async (s) => {
        const res = await request(app).post('/api/check-username').send({ username: s });
        // result should be a JSON with ok boolean
        if (!res.body || typeof res.body.ok !== 'boolean') return false;
        return true;
      }),
      { numRuns: runs2 }
    );
  });

  it('scrubConfusables is idempotent', () => {
    const runs3 = Number(process.env.FAST_CHECK_RUNS || 200);
    fc.assert(
      fc.property(fc.unicodeString({ maxLength: 80 }), (s) => {
        const a = scrubConfusables(s);
        const b = scrubConfusables(a);
        expect(b).to.equal(a);
      }),
      { numRuns: runs3 }
    );
  });

  it('confusable-equivalence: similar chars normalize to same string', () => {
    // simple confusable pairs to test equivalence
    const pairs = [ ['A','\u0410'], ['a','\u0430'], ['e','\u0435'], ['o','\u043E'] ];
    const runs4 = Number(process.env.FAST_CHECK_RUNS || 200);
    fc.assert(
      fc.property(fc.unicodeString({ maxLength: 20 }), (s) => {
        for (const [base, conf] of pairs) {
          const s1 = s.replace(/[AaEeOo]/g, base);
          const s2 = s.replace(/[AaEeOo]/g, conf);
          const n1 = scrubConfusables(s1);
          const n2 = scrubConfusables(s2);
          if (n1 !== n2) return false;
        }
        return true;
      }),
      { numRuns: runs4 }
    );
  });
});
