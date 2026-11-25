export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = {'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
    if(origin === env.ALLOWED_ORIGIN) headers['Access-Control-Allow-Origin']=origin;
    const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
    if(origin && origin!==env.ALLOWED_ORIGIN) return reply({ok:false,error:'ORIGEM_INVALIDA'},403);
    if(request.method==='OPTIONS') return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
    const url=new URL(request.url);
    let body;
    try {
      if(request.method==='GET' && url.pathname==='/bootstrap') body={action:'bootstrap'};
      else if(request.method==='GET' && url.pathname==='/ranking') {
        const modality=url.searchParams.get('modalidade');
        if(!['Mostra Nacional','Mostra de Extensão'].includes(modality)) return reply({ok:false,error:'MODALIDADE_INVALIDA'},400);
        body={action:'ranking',modality};
      } else if(request.method==='POST' && url.pathname==='/vote') {
        if(env.VOTING_DISABLED === 'true') return reply({ok:false,error:'VOTACAO_FECHADA'},403);
        if(!origin || !request.headers.get('Content-Type')?.startsWith('application/json')) return reply({ok:false,error:'REQUISICAO_INVALIDA'},400);
        const reader=request.body?.getReader(); if(!reader) return reply({ok:false,error:'REQUISICAO_INVALIDA'},400);
        let size=0;const decoder=new TextDecoder();let raw='';
        while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return reply({ok:false,error:'REQUISICAO_INVALIDA'},413);}raw+=decoder.decode(value,{stream:true});}
        raw+=decoder.decode();body={action:'vote',payload:JSON.parse(raw)};
      } else return reply({ok:false,error:'ROTA_INVALIDA'},404);
      if(!env.GATEWAY_SECRET || env.GATEWAY_SECRET.length<32 || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(env.APPS_SCRIPT_URL||'')) return reply({ok:false,error:'SERVICO_INDISPONIVEL'},503);
      const upstream=await fetch(env.APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,secret:env.GATEWAY_SECRET}),redirect:'follow',signal:AbortSignal.timeout(25000)});
      if(!upstream.ok) throw Error('upstream');
      const data=await upstream.json();
      if(typeof data.ok!=='boolean') throw Error('response');
      return reply(data,data.ok?200:400);
    } catch {return reply({ok:false,error:'SERVICO_INDISPONIVEL'},502);}
  }
};
