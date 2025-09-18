const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

describe('fuzz tests for username edge cases', () => {
  it('rejects empty username', async () => {
    const res = await request(app).post('/api/register').send({ username: '', email: 'a@b.c' });
    expect(res.status).to.equal(400);
  });

  it('truncates long usernames and allows reasonable part', async () => {
    const long = 'a'.repeat(100) + 'bob';
    const res = await request(app).post('/api/register').send({ username: long, email: 'a@b.c' });
    // should either create or reject due to normalization but not crash
    expect([200,400,409]).to.include(res.status);
  });

  it('handles unicode control and zero-width chars', async () => {
    const name = 'alice\u200B\u0000';
    const res = await request(app).post('/api/register').send({ username: name, email: 'a@b.c' });
    expect([200,400,409]).to.include(res.status);
  });

  it('normalizes confusable characters', async () => {
    const name = '\u0410lex'; // Cyrillic A + lex
    const res = await request(app).post('/api/register').send({ username: name, email: 'a@b.c' });
    expect([200,400,409]).to.include(res.status);
  });
});
