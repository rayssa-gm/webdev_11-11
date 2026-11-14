import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../public/data/catalogo.json', import.meta.url), 'utf8'));
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const score = ns => {
  if (!Array.isArray(ns) || ns.length !== 4 || ns.some(n => !Number.isInteger(n) || n < 1 || n > 5)) throw Error('invalid');
  return ns.reduce((a,n,i)=>a+n*[.3,.3,.25,.15][i],0);
};
test('catálogo contém 46 projetos: 24 nacionais e 22 extensão',()=>{
  assert.equal(data.projetos.length,46);
  assert.equal(data.projetos.filter(p=>p.modalidade==='Mostra Nacional').length,24);
  assert.equal(data.projetos.filter(p=>p.modalidade==='Mostra de Extensão').length,22);
  assert.equal(new Set(data.projetos.map(p=>p.id)).size,46);
});
test('campos obrigatórios, dias e fontes estão presentes',()=>{
  for(const p of data.projetos){
    for(const k of ['id','titulo','modalidade','area_tematica','data','inicio','fim','formato','local','fontes']) assert.ok(p[k],`${p.id}:${k}`);
    assert.match(p.data,/^2026-11-(17|18)$/);
    assert.ok(p.fontes.length);
  }
});
test('pontuação ponderada de [4,5,4,3] é 4,15',()=>assert.equal(score([4,5,4,3]),4.15));
test('notas ausentes, decimais e fora da escala são rejeitadas',()=>{
  for(const ns of [[],[1,2,3],[1,2,3,4.5],[0,2,3,4],[1,2,3,6]]) assert.throws(()=>score(ns));
});
test('busca ignora acentos e caixa',()=>{
  const title='TRAÇO VIVO: arte e território';
  assert.ok(normalize(title).includes(normalize('traco vivo')));
});
test('datas do catálogo limitam-se a 17 e 18 de novembro de 2026',()=>{
  assert.deepEqual([...new Set(data.projetos.map(p=>p.data))].sort(),['2026-11-17','2026-11-18']);
});
