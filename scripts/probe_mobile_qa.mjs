import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const base='http://127.0.0.1:4173/';
const appScript='https://script.google.com/macros/s/AKfycbydHsI_vFZdPun-cwrk7Pz7Bkoua_T2kKsOMIizu67gJCTcyKTD1QXRS10ISrlDyc6i/exec';
const axeSource=await readFile('node_modules/axe-core/axe.min.js','utf8');

const devices=[
  {name:'320x800',width:320,height:800},
  {name:'360x800',width:360,height:800},
  {name:'390x844',width:390,height:844},
  {name:'430x932',width:430,height:932}
];

function assert(condition,message){ if(!condition) throw new Error(message); }

const browser=await chromium.launch({headless:true});
try{
  for(const d of devices){
    const context=await browser.newContext({
      viewport:{width:d.width,height:d.height},
      isMobile:true,
      hasTouch:true,
      deviceScaleFactor:2,
      locale:'pt-BR'
    });
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });

    await page.goto(base+'#/projetos',{waitUntil:'networkidle',timeout:60000});
    const metrics=await page.evaluate(()=>({
      innerWidth:window.innerWidth,
      body:document.body.scrollWidth,
      doc:document.documentElement.scrollWidth
    }));
    assert(metrics.body<=metrics.innerWidth && metrics.doc<=metrics.innerWidth, d.name+': overflow horizontal');

    assert(await page.locator('.mobile-nav').isVisible(), d.name+': navegação mobile não visível');
    assert(!(await page.locator('.tabs').isVisible()), d.name+': tabs desktop deveriam estar ocultas');

    const navBoxes=await page.locator('.mobile-nav button').evaluateAll(els=>els.map(e=>{
      const r=e.getBoundingClientRect(); return {w:r.width,h:r.height};
    }));
    assert(navBoxes.every(b=>b.w>=24 && b.h>=24), d.name+': alvo móvel abaixo de 24x24');

    const search=page.getByLabel('Buscar pelo título');
    await search.fill('AGROSENTINELA');
    await page.waitForTimeout(150);
    assert((await page.locator('.project-card').count())===1,d.name+': busca não retornou 1 projeto');
    assert((await page.locator('.result-count').innerText()).includes('1 de 46'),d.name+': contador da busca divergente');

    await search.fill('');
    await page.selectOption('.filters select:nth-of-type(1)',{label:'Mostra de Extensão'}).catch(async()=>{
      await page.locator('.filters label').filter({hasText:'Modalidade'}).locator('select').selectOption({label:'Mostra de Extensão'});
    });
    await page.waitForTimeout(100);
    const extCount=await page.locator('.project-card').count();
    assert(extCount===22,d.name+': filtro de modalidade retornou '+extCount+' em vez de 22');

    await page.locator('.filters label').filter({hasText:'Modalidade'}).locator('select').selectOption('');
    await page.locator('.project-card').first().click();
    assert(await page.locator('.details').isVisible(),d.name+': detalhes não abriram');
    assert(await page.getByRole('button',{name:/Avaliar este projeto/}).isVisible(),d.name+': CTA de avaliação ausente');

    await page.getByRole('button',{name:/Avaliar este projeto/}).click();
    assert((await page.locator('.selected-project').count())===1,d.name+': projeto selecionado não preservado');
    const evalHref=await page.getByRole('link',{name:/Abrir avaliação segura/}).getAttribute('href');
    assert(evalHref && evalHref.startsWith(appScript),d.name+': link de avaliação não aponta ao Web App');
    assert(evalHref.includes('projectId='),d.name+': link de avaliação perdeu projectId');

    await page.locator('.mobile-nav button').filter({hasText:'Ranking'}).click();
    assert(await page.locator('.ranking-card').isVisible(),d.name+': tela de ranking não abriu');
    await page.getByRole('button',{name:'Mostra de Extensão'}).click();
    const rankHref=await page.getByRole('link',{name:/Abrir ranking público/}).getAttribute('href');
    assert(rankHref && rankHref.startsWith(appScript),d.name+': link do ranking não aponta ao Web App');
    assert(rankHref.includes('Mostra%20de%20Extens%C3%A3o'),d.name+': modalidade do ranking não foi codificada corretamente');

    await page.goto(base+'#/projetos',{waitUntil:'networkidle',timeout:60000});
    const focusSequence=[];
    let visibleFocusFound=false;
    for(let i=0;i<8;i++){
      await page.keyboard.press('Tab');
      const state=await page.evaluate(()=>{
        const el=document.activeElement; if(!el) return null;
        const s=getComputedStyle(el);
        return {
          tag:el.tagName,
          text:(el.textContent||'').trim().slice(0,80),
          focusVisible:el.matches(':focus-visible'),
          outlineStyle:s.outlineStyle,
          outlineWidth:s.outlineWidth
        };
      });
      focusSequence.push(state);
      if(state && state.focusVisible && state.outlineStyle!=='none' && state.outlineWidth!=='0px') visibleFocusFound=true;
    }
    assert(visibleFocusFound,d.name+': nenhum foco visível encontrado na sequência de Tab');

    await page.addScriptTag({content:axeSource});
    const axe=await page.evaluate(async()=>await window.axe.run(document,{
      runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}
    }));
    const serious=axe.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
    console.log('DEVICE_'+d.name+'='+JSON.stringify({
      overflow:false,
      extensionCount:extCount,
      navTargets:navBoxes,
      axeViolations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})),
      seriousCritical:serious.length,
      focusSequence,
      jsErrors:errors
    }));
    assert(serious.length===0,d.name+': axe serious/critical: '+serious.map(v=>v.id).join(','));
    assert(errors.length===0,d.name+': erros JS/console: '+errors.join(' | '));

    await context.close();
  }

  console.log('MOBILE_QA_INDEPENDENT_PASS');
}finally{
  await browser.close();
}
