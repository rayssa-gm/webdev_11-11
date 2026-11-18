// Validador didático, executável com Node.js 20+ (sem dependências externas).
// Uso dentro da pasta do kit: node scripts/validar_catalogo.mjs
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, 'universo_if_catalogo_46_projetos_v1.0.json'), 'utf8'));
const projetos = data.projetos;
const count = mode => projetos.filter(p => p.modalidade === mode).length;

assert.equal(data.schema, 'universo-if-catalogo-v1.0');
assert.equal(projetos.length, 46, 'Catálogo exige 46 projetos');
assert.equal(count('Mostra Nacional'), 24, 'Mostra Nacional exige 24 projetos');
assert.equal(count('Mostra de Extensão'), 22, 'Mostra de Extensão exige 22 projetos');
assert.equal(new Set(projetos.map(p => p.id)).size, 46, 'IDs únicos');
assert.equal(new Set(projetos.map(p => `${p.modalidade}:${p.titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()}`)).size, 46, 'Não há títulos repetidos por modalidade');
const mandatory = ['id', 'titulo', 'modalidade', 'area_tematica', 'data', 'inicio', 'fim', 'formato', 'local'];
for (const p of projetos) {
  for (const k of mandatory) assert.equal(typeof p[k], 'string', `${p.id}: campo ${k} não é string`);
  for (const k of mandatory) assert.ok(p[k].trim().length > 0, `${p.id}: campo ${k} vazio`);
  assert.match(p.data, /^2026-11-(17|18)$/, `${p.id}: data fora do material`);
  assert.match(p.inicio, /^\d{2}:\d{2}$/, `${p.id}: horário de início`);
  assert.match(p.fim, /^\d{2}:\d{2}$/, `${p.id}: horário de término`);
  assert.equal(p.local, 'Área de vivência');
  assert.equal(p.formato, 'Exposição de pôster');
  assert.ok(p.fontes.length > 0, `${p.id}: sem fonte visual`);
  for (const f of p.fontes) {
    assert.ok(Number.isInteger(f.pagina) && f.pagina >= 1 && f.pagina <= 5);
    assert.match(f.arquivo, /\.pdf$/);
  }
}
assert.ok(projetos.some(p => p.id.startsWith('NAC-') && p.titulo.startsWith('AGROSENTINELA:')));
assert.ok(projetos.some(p => p.id.startsWith('NAC-') && p.titulo.startsWith('TRAÇO VIVO:')));
console.log('PASS — 46 projetos únicos (24 Mostra Nacional, 22 Mostra de Extensão).');
console.log('PASS — Campos, datas, modalidade, local e proveniência validados.');
