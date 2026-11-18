import { chromium } from 'playwright';

const url='https://script.google.com/macros/s/AKfycbydHsI_vFZdPun-cwrk7Pz7Bkoua_T2kKsOMIizu67gJCTcyKTD1QXRS10ISrlDyc6i/exec?view=avaliar&projectId=NAC-004';
const votes=[
  {codigo:'RANK-HOMO-2026-A-jkUEl-mI6pAV_cu0IGsxSofP',notas:[5,5,5,5]},
  {codigo:'RANK-HOMO-2026-B-WSuKDZQZv9SK7XFUa8hGYtHY',notas:[4,4,4,4]},
  {codigo:'RANK-HOMO-2026-C-g-UnbrD-n5GUev2baOKJKs3J',notas:[5,4,4,3]},
  {codigo:'RANK-HOMO-2026-D-kBbxKS0LCRr-KY4Tp6WSVxRb',notas:[3,4,5,4]},
  {codigo:'RANK-HOMO-2026-E-5I_AgYvAtzxsKifBj_pFFIJf',notas:[4,5,5,5]}
];

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});

  let appFrame=null;
  for(let attempt=0;attempt<40 && !appFrame;attempt++){
    for(const frame of page.frames()){
      try{
        const ready=await frame.evaluate(()=>typeof google!=='undefined' && google.script && google.script.run);
        if(ready){appFrame=frame;break;}
      }catch{}
    }
    if(!appFrame) await page.waitForTimeout(1000);
  }
  if(!appFrame) throw new Error('google.script.run não ficou disponível.');

  async function call(name,arg){
    return appFrame.evaluate(({name,arg})=>new Promise((resolve,reject)=>{
      let runner=google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(err=>reject(new Error(err&&err.message?err.message:String(err))));
      runner[name](arg);
    }),{name,arg});
  }

  for(let i=0;i<votes.length;i++){
    const payload={
      id_requisicao:'req_rank_homo_20261117_'+String(i+1).padStart(2,'0'),
      codigo:votes[i].codigo,
      id_projeto:'NAC-004',
      notas:votes[i].notas
    };
    const res=await call('submitVote',payload);
    console.log('VOTE_'+(i+1)+'='+JSON.stringify(res));
    if(!res || res.ok!==true || res.idempotent!==false) throw new Error('Falha no voto '+(i+1));
  }

  const ranking=await call('getPublicRanking','Mostra Nacional');
  const item=ranking.items.find(x=>x.id==='NAC-004');
  console.log('RANKING_ITEM='+JSON.stringify(item));
  if(!item) throw new Error('NAC-004 ausente do ranking.');
  if(item.total!==5) throw new Error('Total divergente: '+item.total);
  if(Number(item.media)!==4.36) throw new Error('Média divergente: '+item.media);
  if(JSON.stringify(item.criterios)!==JSON.stringify([4.2,4.4,4.6,4.2])) throw new Error('Critérios divergentes: '+JSON.stringify(item.criterios));
  if(item.elegivel!==true) throw new Error('Projeto não ficou elegível.');
  if(item.posicao!==1) throw new Error('Posição divergente: '+item.posicao);

  await page.goto('https://script.google.com/macros/s/AKfycbydHsI_vFZdPun-cwrk7Pz7Bkoua_T2kKsOMIizu67gJCTcyKTD1QXRS10ISrlDyc6i/exec?view=ranking&modalidade=Mostra%20Nacional',{waitUntil:'domcontentloaded',timeout:90000});
  let text='';
  for(let attempt=0;attempt<30;attempt++){
    text=(await Promise.all(page.frames().map(async f=>{try{return await f.locator('body').innerText({timeout:1000});}catch{return '';}}))).join('\n');
    if(text.includes('NAC-004')||text.includes('4,36 / 5 · 5 avaliações')) break;
    await page.waitForTimeout(1000);
  }
  console.log('RANKING_UI_HAS_EXPECTED='+String(text.includes('4,36 / 5 · 5 avaliações')));
  if(!text.includes('4,36 / 5 · 5 avaliações')) throw new Error('Ranking público não exibiu o agregado esperado.');

  console.log('RANKING_HOMOLOGATION_PASS');
}finally{
  await browser.close();
}
