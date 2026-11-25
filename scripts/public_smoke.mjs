import { chromium } from 'playwright';

const site='https://rayssa-gm.github.io/webdev_11-11/';
const appScriptBase='https://script.google.com/macros/s/AKfycbydHsI_vFZdPun-cwrk7Pz7Bkoua_T2kKsOMIizu67gJCTcyKTD1QXRS10ISrlDyc6i/exec';

function assert(cond,msg){ if(!cond) throw new Error(msg); }

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({
    viewport:{width:390,height:844},
    isMobile:true,
    hasTouch:true,
    locale:'pt-BR'
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

  await page.goto(site,{waitUntil:'networkidle',timeout:90000});
  assert((await page.title()).includes('Universo IF Avalia'),'Título do Pages divergente');
  assert((await page.locator('.project-card').count())===46,'Catálogo publicado não tem 46 cartões');
  const scroll=await page.evaluate(()=>({w:innerWidth,body:document.body.scrollWidth,doc:document.documentElement.scrollWidth}));
  assert(scroll.body<=scroll.w && scroll.doc<=scroll.w,'Overflow horizontal em 390 px');

  const search=page.getByLabel('Buscar pelo título');
  await search.fill('AGROSENTINELA');
  await page.waitForTimeout(100);
  assert((await page.locator('.project-card').count())===1,'Busca publicada falhou');
  await search.fill('');

  await page.locator('.filters label').filter({hasText:'Modalidade'}).locator('select').selectOption({label:'Mostra de Extensão'});
  await page.waitForTimeout(100);
  assert((await page.locator('.project-card').count())===22,'Filtro Extensão publicado não retornou 22');

  await page.locator('.filters label').filter({hasText:'Modalidade'}).locator('select').selectOption('');
  await page.locator('.project-card').first().click();
  await page.getByRole('button',{name:/Avaliar este projeto/}).click();

  const evalLink=page.getByRole('link',{name:/Abrir avaliação segura/});
  const evalHref=await evalLink.getAttribute('href');
  assert(evalHref && evalHref.startsWith(appScriptBase),'Link de avaliação publicado divergente');
  assert(await page.getByText('Problemas para acessar?').isVisible(),'Mitigação de acesso não publicada');

  await page.getByText('Problemas para acessar?').click();
  assert(await page.getByRole('link',{name:/Abrir nesta guia/}).isVisible(),'Alternativa mesma guia ausente');
  assert(await page.getByRole('button',{name:/Copiar link/}).isVisible(),'Botão copiar link ausente');
  assert(await page.getByLabel('Endereço direto do serviço').isVisible(),'Campo de endereço direto ausente');

  await page.locator('.mobile-nav button').filter({hasText:'Ranking'}).click();
  const rankHref=await page.getByRole('link',{name:/Abrir ranking público/}).getAttribute('href');
  assert(rankHref && rankHref.startsWith(appScriptBase),'Link de ranking publicado divergente');

  const anonEval=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'pt-BR'});
  const ep=await anonEval.newPage();
  await ep.goto(evalHref,{waitUntil:'domcontentloaded',timeout:90000});
  await ep.waitForTimeout(2500);
  const evalText=(await Promise.all(ep.frames().map(async f=>{try{return await f.locator('body').innerText({timeout:2000});}catch{return '';}}))).join('\n');
  assert(/Universo IF Avalia/i.test(evalText),'Apps Script avaliação não abriu em contexto anônimo');
  assert(/FECHADA|fechada/i.test(evalText),'Avaliação anônima não mostrou votação fechada');
  await anonEval.close();

  const anonRank=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'pt-BR'});
  const rp=await anonRank.newPage();
  await rp.goto(rankHref,{waitUntil:'domcontentloaded',timeout:90000});
  await rp.waitForTimeout(2500);
  const rankText=(await Promise.all(rp.frames().map(async f=>{try{return await f.locator('body').innerText({timeout:2000});}catch{return '';}}))).join('\n');
  assert(/Universo IF Avalia/i.test(rankText),'Apps Script ranking não abriu em contexto anônimo');
  assert(/Ranking|Mostra/i.test(rankText),'Ranking anônimo não exibiu conteúdo esperado');
  await anonRank.close();

  assert(errors.length===0,'Erros JS/console no Pages: '+errors.join(' | '));
  console.log('PUBLIC_SMOKE_RESULT='+JSON.stringify({
    pages:true,
    catalog:46,
    extensionFilter:22,
    search:true,
    mitigationPublished:true,
    evalAnonymous:true,
    rankingAnonymous:true,
    votingClosed:true,
    overflow390:false,
    jsErrors:errors.length
  }));
  console.log('PUBLIC_SMOKE_PASS');
  await context.close();
}finally{
  await browser.close();
}
