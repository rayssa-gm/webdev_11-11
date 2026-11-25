import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const code = readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8');
test('backend usa LockService na seção crítica',()=>{
  assert.match(code,/LockService\.getScriptLock\(\)/);
  assert.match(code,/lock\.waitLock\(30000\)/);
  assert.match(code,/lock\.releaseLock\(\)/);
});
test('Modelo B verifica hash + projeto e não consome código',()=>{
  assert.match(code,/String\(r\[1\]\)===hash && String\(r\[2\]\)===projectId/);
  assert.match(code,/registerVoteCode_/);
});
test('backend recalcula pesos e valida quatro notas inteiras',()=>{
  assert.match(code,/scores\.length !== 4/);
  assert.match(code,/!Number\.isInteger\(n\)\|\|n<1\|\|n>5/);
  assert.match(code,/scores\.reduce\(function\(sum,n,i\)\{return sum\+n\*WEIGHTS\[i\];\},0\)/);
});
test('ranking público retorna agregados e inclui projetos aguardando amostra',()=>{
  assert.match(code,/function getPublicRanking/);
  assert.match(code,/PROJECTS\.filter\(function\(p\)\{return p\.modalidade===modality;\}\)/);
  assert.match(code,/MIN_RANKING/);
  assert.match(code,/cache\.put\(cacheKey, JSON\.stringify\(result\), 30\)/);
  assert.doesNotMatch(code,/return \{[^}]*hash_codigo/);
});
test('backend armazena SHA-256 e não escreve token puro na planilha',()=>{
  assert.match(code,/DigestAlgorithm\.SHA_256/);
  assert.match(code,/sh\.appendRow\(\[hash,true,new Date\(\)\]\)/);
});
test('requisição é idempotente e serviço recebe limitação global de taxa',()=>{
  assert.match(code,/sameRequest/);
  assert.match(code,/CacheService\.getScriptCache\(\)/);
  assert.match(code,/global_vote_rate/);
});
