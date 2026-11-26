import test from 'node:test';
import assert from 'node:assert/strict';
import { createProductTestingHandler } from '../server/productTesting.mjs';
import { applicationFields, submitApplication, validateApplication } from '../src/lib/productTesting.js';

const time = 1800000000000;
const env = { RESEND_API_KEY: 'test-key-not-real', PRODUCT_TESTING_FROM: 'AARAMBH Community <testing@aarambh-community.in>' };
const student = { fullName: 'Test Student', email: 'student@example.com', college: 'Example College', yearOfStudy: '2nd year', motivation: 'I want to learn how product teams use feedback.', phone: '+91 00000 00000', interests: 'Design, education', availability: 'Weekends' };
const startup = { contactName: 'Test Founder', email: 'founder@example.com', startupName: 'Example Startup', productLink: 'https://example.com/demo', productStage: 'MVP', testingGoals: 'Try onboarding\nThen explore the dashboard.', testerProfile: 'Students interested in design.', phone: '+91 00000 00000', timeline: 'Next month', notes: 'A test application, not a real applicant.' };
const payload = (kind, fields = kind === 'student' ? student : startup) => ({ kind, fields, website: '', startedAt: time - 5000 });

async function request(handler, body = payload('student'), overrides = {}) {
  const result = { headers: {} };
  const res = {
    setHeader: (key, value) => { result.headers[key] = value; },
    status: code => { result.status = code; return res; },
    json: data => { result.body = data; return res; },
  };
  await handler({ method: 'POST', headers: { host: 'www.aarambh-community.in', origin: 'https://www.aarambh-community.in', 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1' }, body, ...overrides }, res);
  return result;
}

for (const [kind, values] of [['student', student], ['startup', startup]]) {
  test(`${kind}: validates each required field and permits blank optional fields`, () => {
    assert.deepEqual(validateApplication(kind, values).errors, {});
    for (const field of applicationFields[kind]) {
      const result = validateApplication(kind, { ...values, [field.name]: '  ' });
      assert.equal(Boolean(result.errors[field.name]), Boolean(field.required), field.name);
    }
  });

  test(`${kind}: sends every field to the fixed inbox with applicant Reply-To and exact subject`, async () => {
    let email;
    const handler = createProductTestingHandler({ env, now: () => time, fetcher: async (url, init) => {
      assert.equal(url, 'https://api.resend.com/emails');
      assert.equal(init.headers.Authorization, 'Bearer test-key-not-real');
      email = JSON.parse(init.body);
      return Response.json({ id: 'accepted-test-id' });
    } });
    const result = await request(handler, payload(kind, { ...values, to: 'attacker@example.com', from: 'attacker@example.com', html: '<script>bad()</script>' }));
    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.deepEqual(email.to, ['aarambh.community.team@gmail.com']);
    assert.equal(email.from, env.PRODUCT_TESTING_FROM);
    assert.equal(email.reply_to, values.email);
    assert.equal(email.subject, kind === 'student' ? '[AARAMBH] Student Tester Application — Test Student' : '[AARAMBH] Startup Pilot Application — Example Startup');
    for (const field of applicationFields[kind]) assert.ok(email.text.includes(`${field.label}:\n${values[field.name]}`), field.name);
    assert.equal(email.html, undefined);
    assert.ok(!email.text.includes('attacker'));
    assert.equal(result.headers['Cache-Control'], 'no-store');
  });

  test(`${kind}: invalid fields never call the provider`, async () => {
    const handler = createProductTestingHandler({ env, now: () => time, fetcher: () => assert.fail('Must not send invalid data') });
    const result = await request(handler, payload(kind, { ...values, email: 'invalid@' }));
    assert.equal(result.status, 422);
    assert.ok(result.body.errors.email);
    assert.notEqual(result.body.success, true);
  });
}

test('sanitizes control characters and keeps multiline answers as plain text', async () => {
  const values = { ...student, fullName: '  A\r\nB\u0000  ', motivation: '<img src=x onerror=alert(1)>\r\nA second line' };
  const validated = validateApplication('student', values);
  assert.equal(validated.values.fullName, 'A B');
  assert.equal(validated.values.motivation, '<img src=x onerror=alert(1)>\nA second line');
  let email;
  await request(createProductTestingHandler({ env, now: () => time, fetcher: async (_, init) => {
    email = JSON.parse(init.body); return Response.json({ id: 'test-id' });
  } }), payload('student', values));
  assert.ok(email.text.includes('<img src=x onerror=alert(1)>'));
  assert.equal(email.html, undefined); // Never interprets an applicant's text as HTML.
  assert.ok(!/[\r\n]/.test(email.subject));
});

test('rejects email injection, executable/credential URLs, bad enums, objects and oversized fields', () => {
  for (const email of ['name@example.com\r\nBcc: bad@example.com', 'name@example.com\n', '<name@example.com>']) assert.ok(validateApplication('student', { ...student, email }).errors.email);
  for (const productLink of ['javascript:alert(1)', 'data:text/html,test', 'ftp://example.com', 'https://user:password@example.com', 'example.com']) assert.ok(validateApplication('startup', { ...startup, productLink }).errors.productLink);
  assert.ok(validateApplication('student', { ...student, college: { bad: 'value' } }).errors.college);
  assert.ok(validateApplication('student', { ...student, yearOfStudy: 'invalid' }).errors.yearOfStudy);
  assert.ok(validateApplication('startup', { ...startup, notes: 'a'.repeat(2001) }).errors.notes);
  for (const kind of ['unknown', '__proto__', 'toString']) assert.ok(validateApplication(kind, {}).errors.form);
});

test('optional omissions are labelled in the email', async () => {
  let email;
  await request(createProductTestingHandler({ env, now: () => time, fetcher: async (_, init) => {
    email = JSON.parse(init.body); return Response.json({ id: 'test-id' });
  } }), payload('student', { ...student, phone: '', interests: '', availability: '' }));
  assert.ok(email.text.includes('Phone number:\nNot provided'));
  assert.ok(email.text.includes('Areas of interest:\nNot provided'));
});

test('methods, JSON, size, origin and bot checks fail before sending', async () => {
  const handler = createProductTestingHandler({ env, now: () => time, fetcher: () => assert.fail('Must not send') });
  assert.equal((await request(handler, undefined, { method: 'GET' })).status, 405);
  assert.equal((await request(handler, undefined, { headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await request(handler, undefined, { headers: { 'content-type': 'application/json', 'content-length': '999999' } })).status, 413);
  assert.equal((await request(handler, 'x'.repeat(32769))).status, 413);
  assert.equal((await request(handler, '{broken')).status, 400);
  assert.equal((await request(handler, null)).status, 400);
  assert.equal((await request(handler, [], {})).status, 400);
  assert.equal((await request(handler, payload('student'), { headers: { host: 'www.aarambh-community.in', origin: 'https://evil.example', 'content-type': 'application/json' } })).status, 403);
  for (const override of [{ website: 'spam' }, { startedAt: time }, { startedAt: null }, { startedAt: time + 10000 }]) assert.equal((await request(handler, { ...payload('student'), ...override })).status, 400);
});

test('missing or non-AARAMBH sender configuration never returns success', async () => {
  for (const config of [{}, { RESEND_API_KEY: 'x' }, { ...env, PRODUCT_TESTING_FROM: 'onboarding@resend.dev' }, { ...env, PRODUCT_TESTING_FROM: 'team@gmail.com' }, { ...env, PRODUCT_TESTING_FROM: 'test@aarambh-community.in\nBcc: x@example.com' }]) {
    const handler = createProductTestingHandler({ env: config, now: () => time, fetcher: () => assert.fail('Must not send') });
    assert.equal((await request(handler)).status, 503);
  }
});

test('provider rejections, malformed responses and network timeouts retain a retry response', async () => {
  for (const fetcher of [async () => Response.json({ message: 'secret internal error' }, { status: 403 }), async () => Response.json({ error: 'no ID' }), async () => new Response('not-json'), async () => { throw new DOMException('Timed out', 'TimeoutError'); }]) {
    for (const kind of ['student', 'startup']) {
      const result = await request(createProductTestingHandler({ env, now: () => time, fetcher }), payload(kind));
      assert.equal(result.status, 502);
      assert.match(result.body.message, /answers are still here/);
      assert.notEqual(result.body.success, true);
      assert.ok(!JSON.stringify(result).includes('secret'));
    }
  }
});

test('provider acceptance is awaited before reporting success', async () => {
  let accept;
  const pending = new Promise(resolve => { accept = resolve; });
  const handler = createProductTestingHandler({ env, now: () => time, fetcher: () => pending });
  let finished = false;
  const result = request(handler).then(value => { finished = true; return value; });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(finished, false);
  accept(Response.json({ id: 'test-id' }));
  assert.equal((await result).body.success, true);
});

test('retries have stable provider idempotency keys; edited answers have a new key', async () => {
  const keys = [];
  const handler = createProductTestingHandler({ env, now: () => time, fetcher: async (_, init) => { keys.push(init.headers['Idempotency-Key']); return Response.json({ id: 'test-id' }); } });
  await request(handler);
  await request(handler, { ...payload('student'), startedAt: time - 10000 });
  await request(handler, payload('student', { ...student, motivation: 'Different answer' }));
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});

test('burst limit returns Retry-After and expires after ten minutes', async () => {
  let clock = time;
  const handler = createProductTestingHandler({ env, now: () => clock, fetcher: async () => Response.json({ id: 'test-id' }) });
  for (let attempt = 0; attempt < 8; attempt++) assert.equal((await request(handler)).status, 200);
  const blocked = await request(handler);
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers['Retry-After'], '600');
  clock += 600001;
  assert.equal((await request(handler)).status, 200);
});

test('browser submit handles accepted response and rejects HTTP errors, HTML fallbacks and false success', async () => {
  const data = payload('student');
  await submitApplication(data, async (url, init) => {
    assert.equal(url, '/api/product-testing');
    assert.deepEqual(JSON.parse(init.body), data);
    return Response.json({ success: true });
  });
  for (const response of [Response.json({ success: false }), new Response('<html>SPA fallback</html>'), Response.json({ message: 'Please retry' }, { status: 502 }), Response.json({ success: true }, { status: 500 })]) {
    await assert.rejects(submitApplication(data, async () => response));
    assert.deepEqual(data.fields, student);
  }
  await assert.rejects(submitApplication(data, async () => Response.json({ message: 'Check fields', errors: { email: 'Invalid email' } }, { status: 422 })), error => error.fields.email === 'Invalid email');
});
