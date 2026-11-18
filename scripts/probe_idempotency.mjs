import { chromium } from 'playwright';

const url = 'https://script.google.com/macros/s/AKfycbydHsI_vFZdPun-cwrk7Pz7Bkoua_T2kKsOMIizu67gJCTcyKTD1QXRS10ISrlDyc6i/exec?view=avaliar&projectId=NAC-004';
const payload = {
  id_requisicao: 'req_idempotencia_runtime_20261117',
  codigo: 'HOMOLOGACAO-IDEMPOTENCIA-PUBLICO-2026-11-17',
  id_projeto: 'NAC-004',
  notas: [4, 5, 4, 3]
};

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

  let appFrame = null;
  for (let attempt = 0; attempt < 40 && !appFrame; attempt++) {
    for (const frame of page.frames()) {
      try {
        const ready = await frame.evaluate(() =>
          typeof google !== 'undefined' &&
          google.script &&
          google.script.run
        );
        if (ready) {
          appFrame = frame;
          break;
        }
      } catch {}
    }
    if (!appFrame) await page.waitForTimeout(1000);
  }

  if (!appFrame) {
    throw new Error('google.script.run não ficou disponível no Web App.');
  }

  const result = await appFrame.evaluate((p) => new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler((err) => reject(new Error(err && err.message ? err.message : String(err))))
      .submitVote(p);
  }), payload);

  console.log('IDEMPOTENCY_RESULT=' + JSON.stringify(result));

  if (!result || result.ok !== true) throw new Error('Resposta sem ok=true.');
  if (result.receipt !== payload.id_requisicao) throw new Error('Recibo divergente.');
  if (result.idempotent !== true) throw new Error('A resposta não marcou idempotent=true.');
  if (Number(result.score) !== 4.15) throw new Error('Nota retornada divergente.');

  console.log('IDEMPOTENCY_PROBE_PASS');
} finally {
  await browser.close();
}
