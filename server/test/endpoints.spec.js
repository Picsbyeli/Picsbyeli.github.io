const request = require('supertest');
const nock = require('nock');
const { expect } = require('chai');
const path = require('path');

const app = require('../index');

describe('API endpoints with moderation', () => {
  const url = 'http://moderation.test';
  beforeEach(() => { process.env.MODERATION_URL = url + '/check'; });
  afterEach(() => { delete process.env.MODERATION_URL; nock.cleanAll(); });
  // ensure persistent data file is cleared between tests
  beforeEach(() => {
    try { require('fs').unlinkSync(require('path').join(__dirname, '..', 'data.json')); } catch (e) {}
  });

  it('rejects register when remote flags', async () => {
    nock(url).post('/check').reply(200, { flagged: true });
    const res = await request(app).post('/api/register').send({ username: 'badname', email: 'a@b.c' });
    expect(res.status).to.equal(400);
  });

  it('allows register when remote approves', async () => {
    nock(url).post('/check').reply(200, { flagged: false });
    const res = await request(app).post('/api/register').send({ username: 'goodname', email: 'a@b.c' });
    expect(res.status).to.equal(200);
    expect(res.body.user).to.have.property('username');
  });

  it('check-username returns taken for existing', async () => {
    nock(url).post('/check').reply(200, { flagged: false });
    await request(app).post('/api/register').send({ username: 'alice', email: 'a@b.c' });
    const res = await request(app).post('/api/check-username').send({ username: 'alice' });
    expect(res.body.ok).to.equal(false);
    expect(res.body.reason).to.equal('taken');
  });
});
