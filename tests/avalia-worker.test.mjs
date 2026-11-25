import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../avalia-worker/src/index.js';

const gateway = 'https://qa.example.test';
const origin = 'http://localhost:5173';
const env = {
  ALLOWED_ORIGIN: origin,
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/synthetic-deployment/exec',
  GATEWAY_SECRET: 'synthetic-test-only-not-a-credential',
};

test('gateway responde ao preflight de avaliação pela origem QA', async () => {
  const response = await worker.fetch(new Request(gateway + '/vote', {
    method: 'OPTIONS',
    headers: {
      Origin: origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal(response.headers.get('Vary'), 'Origin');
  assert.match(response.headers.get('Access-Control-Allow-Methods'), /POST/);
});

test('gateway preserva fechamento e modalidade para o frontend', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, env.APPS_SCRIPT_URL);
    const body = JSON.parse(options.body);
    assert.equal(body.secret, env.GATEWAY_SECRET);
    if (body.action === 'bootstrap') {
      return Response.json({ ok: true, data: { status: 'FECHADA', minRanking: 5 } });
    }
    assert.equal(body.action, 'ranking');
    return Response.json({ ok: true, data: { modality: body.modality, minimum: 5, items: [] } });
  });

  const bootstrap = await worker.fetch(new Request(gateway + '/bootstrap', {
    headers: { Origin: origin },
  }), env);
  assert.equal(bootstrap.status, 200);
  assert.equal(bootstrap.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await bootstrap.json(), { ok: true, data: { status: 'FECHADA', minRanking: 5 } });

  for (const modality of ['Mostra Nacional', 'Mostra de Extensão']) {
    const url = new URL(gateway + '/ranking');
    url.searchParams.set('modalidade', modality);
    const response = await worker.fetch(new Request(url, { headers: { Origin: origin } }), env);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, data: { modality, minimum: 5, items: [] } });
  }
});

test('gateway apresenta indisponibilidade quando o serviço a montante falha', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }));
  const response = await worker.fetch(new Request(gateway + '/bootstrap', {
    headers: { Origin: origin },
  }), env);
  assert.equal(response.status, 502);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.deepEqual(await response.json(), { ok: false, error: 'SERVICO_INDISPONIVEL' });
});
