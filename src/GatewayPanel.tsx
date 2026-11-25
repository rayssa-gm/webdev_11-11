import {useEffect,useRef,useState} from 'react';
import {CRITERIA,type Project} from './domain';
type Item={id:string;titulo:string;total:number;media:number|null;posicao:number|null};
export function GatewayPanel({url,projectId,modality,projects}:{url:string;projectId?:string;modality?:string;projects:Project[]}){
 const [status,setStatus]=useState('');const [items,setItems]=useState<Item[]>([]);
 const [project,setProject]=useState(projectId||'');const [code,setCode]=useState('');
 const [scores,setScores]=useState([0,0,0,0]);const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);const request=useRef<{fingerprint:string;id:string}|null>(null);
 const base=url.replace(/\/$/,'');
 useEffect(()=>{const controller=new AbortController();setMessage('');setStatus('');
 fetch(base+(modality?'/ranking?modalidade='+encodeURIComponent(modality):'/bootstrap'),{signal:controller.signal,credentials:'omit'})
 .then(r=>r.json()).then(r=>{if(!r.ok)throw Error();if(modality)setItems(r.data.items);else setStatus(r.data.status);})
 .catch(()=>{if(!controller.signal.aborted)setMessage('Serviço indisponível. Atualize a página e tente novamente.');});
 return()=>controller.abort();},[base,modality]);
 async function submit(){
 if(busy||status!=='ABERTA')return;
 setBusy(true);setMessage('');
 const fingerprint=JSON.stringify([project,code,scores]);
 if(request.current?.fingerprint!==fingerprint)request.current={fingerprint,id:crypto.randomUUID()};
 try{const r=await fetch(base+'/vote',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({id_requisicao:request.current.id,id_projeto:project,codigo:code,notas:scores})}).then(r=>r.json());
 if(!r.ok){setMessage(({VOTACAO_FECHADA:'Votação fechada.',VOTO_DUPLICADO:'Este projeto já foi avaliado com esse código.',CODIGO_INVALIDO_OU_DESABILITADO:'Código inválido ou desabilitado.'} as Record<string,string>)[r.error]||'Não foi possível confirmar. Tente novamente.');if(r.error==='VOTACAO_FECHADA')setStatus('FECHADA');return;}
 setMessage('Avaliação registrada. Recibo: '+r.data.receipt+' · Nota: '+r.data.score);setCode('');request.current=null;
 }catch{setMessage('Não foi possível confirmar. Tente novamente com os mesmos dados.');}finally{setBusy(false);}
 }
 if(modality)return <div><p role="status">{message||(!items.length?'Carregando resultados…':'')}</p>{items.map(i=><div className="ranking-rules" key={i.id}><b>{i.posicao!==null?i.posicao+'º · ':''}{i.titulo}</b><p>{i.total} avaliações · {i.media===null?'Aguardando amostra mínima':i.media.toFixed(2)}</p></div>)}</div>;
 return <form onSubmit={e=>{e.preventDefault();void submit();}}><p role="status">{status==='ABERTA'?'Votação aberta':status==='FECHADA'?'Votação fechada':message?'Serviço indisponível':'Consultando situação…'}</p>
 <fieldset disabled={busy||status!=='ABERTA'}><label>Projeto<select required value={project} onChange={e=>setProject(e.target.value)}><option value="">Selecione</option>{projects.map(p=><option key={p.id} value={p.id}>{p.id} · {p.titulo}</option>)}</select></label>
 <label>Código de avaliação<input required minLength={20} maxLength={200} value={code} onChange={e=>setCode(e.target.value)} autoComplete="off"/></label>
 {CRITERIA.map((c,i)=><label key={c}>{c}<select required value={scores[i]||''} onChange={e=>setScores(old=>old.map((n,j)=>i===j?Number(e.target.value):n))}><option value="">Selecione</option>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label>)}
 <button className="button primary" disabled={busy||status!=='ABERTA'}>Enviar avaliação</button></fieldset><p role="status">{message}</p></form>;
}
