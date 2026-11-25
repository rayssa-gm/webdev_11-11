import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../backend/Code.gs',import.meta.url),'utf8');
for (const count of [0,1,2,3,4,5]) {
  test('Ranking: limiar de '+count+' avaliações e separação de modalidades',()=>{
    const rows=Array.from({length:count},(_,i)=>['req_'+i,'hash_'+i,'EXT-001',5,4,3,2,3.75,'2026-11-25','VALIDO']);
    rows.push(['other','secret','NAC-001',5,5,5,5,5,'2026-11-25','VALIDO']);
    rows.push(['invalid','secret','EXT-001',5,5,5,5,5,'2026-11-25','INVALIDO']);
    const context=vm.createContext({CacheService:{getScriptCache:()=>({get:()=>null,put:()=>{}})}});
    vm.runInContext(source,context);
    context.spreadsheet_=()=>({getSheetByName:()=>({getLastRow:()=>rows.length+1,getRange:()=>({getValues:()=>rows})})});
    context.readConfig_=()=>({MIN_RANKING:5});
    const result=context.getPublicRanking('Mostra de Extensão');
    assert.equal(result.items.length,22);
    assert.ok(result.items.every(p=>p.modalidade==='Mostra de Extensão'));
    const item=result.items.find(p=>p.id==='EXT-001');
    assert.equal(item.total,count);
    assert.equal(item.media,count===5?3.75:null);
    assert.equal(item.posicao,count===5?1:null);
    assert.equal(item.elegivel,count===5);
    assert.equal(JSON.stringify(item.criterios),count===5?'[5,4,3,2]':'null');
    assert.ok(!JSON.stringify(result).includes('hash_'));
    assert.ok(!JSON.stringify(result).includes('secret'));
    assert.equal(context.getPublicRanking('Mostra Nacional').items.length,24);
  });
}
