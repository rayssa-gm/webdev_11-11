import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../backend/Code.gs', import.meta.url), 'utf8');

class Range {
  constructor(sheet, row, col, rows, cols) { Object.assign(this,{sheet,row,col,rows,cols}); }
  getValues() {
    return Array.from({length:this.rows},(_,r)=>Array.from({length:this.cols},(_,c)=>this.sheet.values[this.row-1+r]?.[this.col-1+c] ?? ''));
  }
  setValues(matrix) {
    matrix.forEach((line,r)=>line.forEach((value,c)=>{
      const y=this.row-1+r, x=this.col-1+c;
      while(this.sheet.values.length<=y) this.sheet.values.push([]);
      while(this.sheet.values[y].length<=x) this.sheet.values[y].push('');
      this.sheet.values[y][x]=value;
    }));
  }
}
class Sheet {
  constructor(name){this.name=name;this.values=[];}
  getName(){return this.name;}
  setName(name){this.name=name;return this;}
  getLastRow(){let last=0;this.values.forEach((r,i)=>{if(r.some(v=>v!==''&&v!==null&&v!==undefined))last=i+1;});return last;}
  getLastColumn(){return Math.max(0,...this.values.map(r=>r.length));}
  getRange(row,col,rows,cols){return new Range(this,row,col,rows,cols);}
  appendRow(row){this.values.push([...row]);}
  setFrozenRows(){}
}
class Spreadsheet {
  constructor(id){this.id=id;this.sheets=[new Sheet('Sheet1')];}
  getId(){return this.id;}
  getUrl(){return 'https://docs.google.test/spreadsheets/d/'+this.id;}
  getName(){return 'Test sheet';}
  getSheets(){return this.sheets;}
  getSheetByName(name){return this.sheets.find(s=>s.name===name)||null;}
  insertSheet(name){const s=new Sheet(name);this.sheets.push(s);return s;}
}
function makeRuntime({activeSpreadsheet=null}={}){
  const props=new Map(), cache=new Map(), sheets=new Map();
  let serial=0;
  if(activeSpreadsheet) sheets.set(activeSpreadsheet.id,activeSpreadsheet);
  const context={
    console,
    Date,
    JSON,
    Math,
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)||null,setProperty:(k,v)=>props.set(k,v)})},
    SpreadsheetApp:{
      create:()=>{const ss=new Spreadsheet('sheet-'+(++serial));sheets.set(ss.id,ss);return ss;},
      getActiveSpreadsheet:()=>activeSpreadsheet,
      openById:id=>{const ss=sheets.get(id);if(!ss)throw Error('missing spreadsheet');return ss;},
      flush:()=>{}
    },
    LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>{}})},
    CacheService:{getScriptCache:()=>({get:k=>cache.get(k)||null,put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},
    Utilities:{
      DigestAlgorithm:{SHA_256:'SHA-256'},
      Charset:{UTF_8:'utf8'},
      computeDigest:(algo,value)=>Array.from(crypto.createHash('sha256').update(value,'utf8').digest())
    }
  };
  vm.runInNewContext(source,context);
  const ssResult=context.initializeSpreadsheet_();
  const ss=sheets.get(ssResult.spreadsheetId);
  const config=ss.getSheetByName('Configuracao');
  const statusRow=config.values.findIndex(r=>r[0]==='STATUS_VOTACAO')+1;
  config.getRange(statusRow,2,1,1).setValues([['ABERTA']]);
  return {context,ss,cache,props};
}

test('Apps Script reutiliza a planilha vinculada durante a configuração inicial',()=>{
  const bound=new Spreadsheet('bound-sheet');
  const {ss,props}=makeRuntime({activeSpreadsheet:bound});
  assert.equal(ss,bound);
  assert.equal(props.get('SPREADSHEET_ID'),'bound-sheet');
  assert.ok(ss.getSheetByName('Projetos'));
  assert.ok(ss.getSheetByName('Codigos'));
  assert.ok(ss.getSheetByName('Avaliacoes'));
  assert.ok(ss.getSheetByName('Configuracao'));
});
const token='TOKEN-SINTETICO-NAO-PRODUCAO-123456789';
const payload=(id,project='NAC-001',code=token)=>({id_requisicao:id,codigo:code,id_projeto:project,notas:[4,5,4,3]});

test('Apps Script aceita um código em projetos diferentes e bloqueia repetição no mesmo projeto',()=>{
  const {context,ss}=makeRuntime();
  context.registerVoteCode_(token);
  const a=context.submitVote(payload('req_12345678901234567890'));
  const b=context.submitVote(payload('req_22345678901234567890','NAC-002'));
  assert.equal(a.score,4.15); assert.equal(b.ok,true);
  const before=ss.getSheetByName('Avaliacoes').getLastRow();
  assert.throws(()=>context.submitVote(payload('req_32345678901234567890')),/VOTO_DUPLICADO/);
  assert.equal(ss.getSheetByName('Avaliacoes').getLastRow(),before);
});

test('Apps Script valida token e notas no servidor',()=>{
  const {context}=makeRuntime();
  context.registerVoteCode_(token);
  assert.throws(()=>context.submitVote(payload('req_42345678901234567890','NAC-001','TOKEN-INVALIDO-123456789012345')),/CODIGO_INVALIDO/);
  assert.throws(()=>context.submitVote({...payload('req_52345678901234567890'),notas:[4,5,4.5,3]}),/notas inteiras/);
  assert.throws(()=>context.submitVote({...payload('req_62345678901234567890'),id_projeto:'NAC-999'}),/Projeto inexistente/);
});

test('Apps Script emite recibo idempotente e ranking sem hash de token',()=>{
  const {context}=makeRuntime();
  context.registerVoteCode_(token);
  const first=context.submitVote(payload('req_72345678901234567890'));
  const retry=context.submitVote(payload('req_72345678901234567890'));
  assert.equal(retry.idempotent,true);
  assert.equal(retry.receipt,first.receipt);
  const ranking=context.getPublicRanking('Mostra Nacional');
  assert.equal(ranking.items.length,24);
  assert.equal(ranking.items.find(x=>x.id==='NAC-001').total,1);
  assert.equal(JSON.stringify(ranking).includes(token),false);
});

test('duas submissões concorrentes do mesmo par geram uma única linha',async()=>{
  const {context,ss}=makeRuntime();
  context.registerVoteCode_(token);
  const results=await Promise.allSettled([
    Promise.resolve().then(()=>context.submitVote(payload('req_82345678901234567890'))),
    Promise.resolve().then(()=>context.submitVote(payload('req_92345678901234567890')))
  ]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(results.filter(r=>r.status==='rejected').length,1);
  assert.equal(ss.getSheetByName('Avaliacoes').getLastRow(),2);
});
