import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, Filter, GraduationCap, Search, Star, Trophy } from 'lucide-react';
import catalog from './catalogo.json';
import { CRITERIA, filterProjects, formatDate, type Project } from './domain';

import { GatewayPanel } from './GatewayPanel';
const gatewayUrl = import.meta.env.VITE_AVALIA_GATEWAY_URL as string | undefined;
type View = 'projetos' | 'avaliar' | 'ranking';
const projects = (catalog as { projetos: Project[] }).projetos;
const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined;
const views: { id: View; label: string; icon: typeof BookOpen }[] = [
  { id: 'projetos', label: 'Projetos', icon: BookOpen },
  { id: 'avaliar', label: 'Avaliar', icon: Star },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
];
function App() {
  const [view, setView] = useState<View>('projetos');
  const [selected, setSelected] = useState<Project | null>(null);
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState('');
  const [area, setArea] = useState('');
  const [day, setDay] = useState('');
  const [rankMode, setRankMode] = useState('Mostra Nacional');
  const areas = useMemo(() => [...new Set(projects.map(p => p.area_tematica))].sort((a,b)=>a.localeCompare(b,'pt-BR')), []);
  const filtered = useMemo(() => filterProjects(projects, query, modality, area, day), [query, modality, area, day]);
  useEffect(() => {
    const readHash = () => {
      const hash = location.hash.replace(/^#\/?/, '');
      const [route, id] = hash.split('/');
      if (route === 'avaliar' || route === 'ranking' || route === 'projetos') setView(route);
      if (id) setSelected(projects.find(p => p.id === id) ?? null);
      else setSelected(null);
    };
    window.addEventListener('hashchange', readHash); readHash();
    return () => window.removeEventListener('hashchange', readHash);
  }, []);
  function navigate(next: View, project?: Project) {
    setView(next); setSelected(project ?? null);
    location.hash = project ? `/${next}/${project.id}` : `/${next}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const dynamicLink = (params: string) => scriptUrl ? `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}${params}` : '';
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#/projetos" onClick={() => navigate('projetos')} aria-label="Universo IF Avalia, início">
        <span className="brand-mark"><GraduationCap size={25}/></span><span><strong>Universo IF</strong><small>AVALIA · IFMA 2026.2</small></span>
      </a>
      <span className="prototype">PROTÓTIPO ACADÊMICO</span>
    </header>
    <main className="main-content">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">MOSTRAS · 17 E 18 DE NOVEMBRO</span>
          <h1>Conheça ideias.<br/><em>Valorize projetos.</em></h1>
          <p>Explore os trabalhos da Mostra Nacional e da Mostra de Extensão. Sua avaliação é uma atividade educativa e indicativa.</p>
          <div className="hero-stats"><div><b>46</b><span>projetos</span></div><div><b>02</b><span>mostras</span></div><div><b>04</b><span>critérios</span></div></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-center"><GraduationCap size={76}/><span>IF</span></div><div className="floating f-one">30%</div><div className="floating f-two">25%</div><div className="floating f-three">15%</div></div>
      </section>
      <nav className="tabs" aria-label="Navegação principal">
        {views.map(({id,label,icon:Icon}) => <button key={id} className={view===id?'tab active':'tab'} onClick={()=>navigate(id)} aria-current={view===id?'page':undefined}><Icon size={18}/>{label}</button>)}
      </nav>
      {view === 'projetos' && <section className="section">
        {selected ? <ProjectDetails project={selected} onBack={()=>navigate('projetos')} onRate={()=>navigate('avaliar',selected)} /> : <>
          <div className="section-heading"><div><span className="eyebrow">CATÁLOGO COMPLETO</span><h2>Projetos em destaque</h2><p>Encontre trabalhos por título, área temática, modalidade ou dia.</p></div><span className="result-count">{filtered.length} de 46</span></div>
          <div className="filters">
            <label className="search-field"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar pelo título..." aria-label="Buscar pelo título"/></label>
            <label><span>Modalidade</span><select value={modality} onChange={e=>setModality(e.target.value)}><option value="">Todas</option><option>Mostra Nacional</option><option>Mostra de Extensão</option></select></label>
            <label><span>Área temática</span><select value={area} onChange={e=>setArea(e.target.value)}><option value="">Todas as áreas</option>{areas.map(a=><option key={a}>{a}</option>)}</select></label>
            <label><span>Dia</span><select value={day} onChange={e=>setDay(e.target.value)}><option value="">Todos</option><option value="2026-11-17">17/11/2026</option><option value="2026-11-18">18/11/2026</option></select></label>
          </div>
          {filtered.length ? <div className="project-grid">{filtered.map(p=><ProjectCard key={p.id} project={p} onClick={()=>navigate('projetos',p)}/>)}</div> : <div className="empty"><Filter size={28}/><h3>Nenhum projeto encontrado</h3><p>Tente alterar os filtros ou a busca.</p><button className="button secondary" onClick={()=>{setQuery('');setModality('');setArea('');setDay('')}}>Limpar filtros</button></div>}
        </>}
      </section>}
      {view === 'avaliar' && <section className="section"><div className="section-heading"><div><span className="eyebrow">PARTICIPE</span><h2>Avalie um projeto</h2><p>As avaliações são registradas no serviço seguro do Apps Script.</p></div></div>
        {selected && <div className="selected-project"><span>PROJETO SELECIONADO</span><b>{selected.titulo}</b><small>{selected.id} · {selected.modalidade}</small></div>}
        <div className="service-card"><div className="service-icon"><Star size={26}/></div><div><h3>Formulário de avaliação</h3><p>Para confirmar o recebimento do voto e evitar problemas de CORS, a avaliação é realizada na tela do Google Apps Script, usando comunicação autenticada entre a página e o servidor.</p>{gatewayUrl ? <GatewayPanel key={selected?.id || 'vote'} url={gatewayUrl} projectId={selected?.id} projects={projects}/> : scriptUrl ? <ServiceAccess href={dynamicLink(selected ? `view=avaliar&projectId=${encodeURIComponent(selected.id)}` : 'view=avaliar')} label="Abrir avaliação segura"/> : <p className="warning-text">Integração ainda não configurada. O endereço do Web App será informado em <code>VITE_APPS_SCRIPT_URL</code> após a implantação autorizada.</p>}</div></div>
        <div className="criteria-list">{CRITERIA.map((c,i)=><div key={c}><span>{i+1}. {c}</span><b>{[30,30,25,15][i]}%</b></div>)}</div>
        <p className="note">Modelo B: um mesmo código pode avaliar projetos diferentes, mas não pode avaliar o mesmo projeto duas vezes. O código é um token ao portador, não identifica uma pessoa.</p>
      </section>}
      {view === 'ranking' && <section className="section"><div className="section-heading"><div><span className="eyebrow">RESULTADOS INDICATIVOS</span><h2>Ranking das mostras</h2><p>Classificação independente por modalidade, sem misturar os resultados.</p></div></div>
        <div className="rank-switch">{['Mostra Nacional','Mostra de Extensão'].map(m=><button key={m} className={rankMode===m?'selected':''} onClick={()=>setRankMode(m)}>{m}</button>)}</div>
        <div className="service-card ranking-card"><div className="service-icon"><Trophy size={26}/></div><div><h3>Consultar resultados atualizados</h3><p>O ranking público é calculado no servidor e exibe apenas agregados. Projetos com menos de cinco avaliações aguardam amostra mínima.</p>{gatewayUrl ? <GatewayPanel key={rankMode} url={gatewayUrl} modality={rankMode} projects={projects}/> : scriptUrl ? <ServiceAccess href={dynamicLink(`view=ranking&modalidade=${encodeURIComponent(rankMode)}`)} label="Abrir ranking público"/> : <p className="warning-text">Integração pendente: configure <code>VITE_APPS_SCRIPT_URL</code>.</p>}</div></div>
        <div className="ranking-rules"><b>Como a classificação funciona</b><p>Média ponderada: 30% criatividade, 30% clareza, 25% relevância e 15% demonstração. Empates são ordenados pelo título e, depois, pelo ID. A posição só aparece a partir de cinco avaliações válidas.</p></div>
      </section>}
    </main>
    <footer><div><b>Universo IF Avalia</b><span>Participação popular educativa · IFMA 2026.2</span></div><p>Este protótipo não representa votação ou julgamento oficial do evento.</p></footer>
    <nav className="mobile-nav" aria-label="Navegação inferior">{views.map(({id,label,icon:Icon})=><button key={id} className={view===id?'active':''} onClick={()=>navigate(id)}><Icon size={20}/><span>{label}</span></button>)}</nav>
  </div>;
}
function ServiceAccess({href,label}:{href:string;label:string}) {
  const [message,setMessage]=useState('');
  useEffect(()=>setMessage(''),[href]);
  async function copyLink(){
    try {
      await navigator.clipboard.writeText(href);
      setMessage('Link copiado. Abra uma guia anônima e cole o endereço.');
    } catch {
      setMessage('Não foi possível copiar automaticamente. Selecione e copie o endereço abaixo.');
    }
  }
  return <div className="service-access">
    <a className="button primary" href={href} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={17}/></a>
    <details className="access-help">
      <summary>Problemas para acessar?</summary>
      <p>Se o Google mostrar “Não foi possível abrir o arquivo”, tente abrir nesta mesma guia. Se o erro continuar, copie o link e abra em uma guia anônima ou privada do navegador. Não é necessário fazer login.</p>
      <div className="access-actions"><a className="button secondary" href={href}>Abrir nesta guia</a><button type="button" className="button secondary" onClick={copyLink}>Copiar link</button></div>
      <label className="access-address">Endereço direto<input aria-label="Endereço direto do serviço" readOnly value={href} onFocus={e=>e.currentTarget.select()}/></label>
      <span role="status">{message}</span>
    </details>
  </div>;
}
function ProjectCard({project:p,onClick}:{project:Project;onClick:()=>void}) {
  return <button className="project-card" onClick={onClick}><div className="card-top"><span className={p.modalidade==='Mostra Nacional'?'tag national':'tag extension'}>{p.modalidade}</span><span className="project-id">{p.id}</span></div><h3>{p.titulo}</h3><p className="area">{p.area_tematica}</p><div className="card-meta"><span><CalendarDays size={15}/>{formatDate(p.data)}</span><span>{p.inicio}–{p.fim}</span></div><div className="card-bottom"><span>{p.local} · {p.formato}</span><ArrowUpRight size={17}/></div></button>;
}
function ProjectDetails({project:p,onBack,onRate}:{project:Project;onBack:()=>void;onRate:()=>void}) {
  return <div className="details"><button className="back-link" onClick={onBack}><ArrowLeft size={17}/> Voltar ao catálogo</button><span className={p.modalidade==='Mostra Nacional'?'tag national':'tag extension'}>{p.modalidade}</span><span className="project-id">{p.id}</span><h2>{p.titulo}</h2><div className="detail-grid"><div><small>Área temática</small><b>{p.area_tematica}</b></div><div><small>Data e horário</small><b>{formatDate(p.data)} · {p.inicio}–{p.fim}</b></div><div><small>Local</small><b>{p.local}</b></div><div><small>Formato</small><b>{p.formato}</b></div></div><p className="note">A programação não disponibiliza resumo, autoria ou descrição individual deste trabalho.</p><button className="button primary" onClick={onRate}>Avaliar este projeto <ArrowUpRight size={17}/></button></div>;
}
export default App;
