import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CRITERIA, weightedScore, type Project } from './domain';

type Item = {
  id: string;
  titulo: string;
  total: number;
  media: number | null;
  posicao: number | null;
  criterios: number[] | null;
};
type Ranking = { minimum: number; items: Item[] };
type Failure = { ok: false; error: string };
type Reply<T> = { ok: true; data: T } | Failure;

const messages: Record<string, string> = {
  VOTACAO_FECHADA: 'Votação fechada.',
  VOTO_DUPLICADO: 'Este projeto já foi avaliado com esse código.',
  CODIGO_INVALIDO_OU_DESABILITADO: 'Código inválido ou desabilitado.',
  ID_REQUISICAO_REUTILIZADO: 'Conflito de recibo. Confira os dados antes de tentar novamente.',
  LIMITE_DE_TAXA_TEMPORARIO: 'Muitas avaliações neste momento. Aguarde e tente novamente.',
};
const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function api<T>(url: string, init?: RequestInit): Promise<Reply<T>> {
  const response = await fetch(url, {
    ...init, credentials: 'omit', redirect: 'error', cache: 'no-store',
    signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000),
  });
  const reply = await response.json();
  if (reply?.ok === false && typeof reply.error === 'string') return reply;
  if (!response.ok || reply?.ok !== true || !reply.data) throw new Error('Resposta inválida');
  return reply;
}

export function GatewayPanel({ url, projectId, modality, projects }: {
  url: string; projectId?: string; modality?: string; projects: Project[];
}) {
  const base = url.replace(/\/$/, '');
  return modality
    ? <RankingPanel base={base} modality={modality}/>
    : <VoteForm base={base} projectId={projectId} projects={projects}/>;
}

function useGatewayData<T>(url: string) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ data?: T; error?: boolean }>({});
  useEffect(() => {
    const controller = new AbortController();
    api<T>(url, { signal: controller.signal }).then(reply => {
      if (!reply.ok) throw new Error(reply.error);
      if (!controller.signal.aborted) setState({ data: reply.data });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ error: true });
    });
    return () => controller.abort();
  }, [url, attempt]);
  return { ...state, retry: () => { setState({}); setAttempt(value => value + 1); } };
}

function Retry({ onClick }: { onClick: () => void }) {
  return <><p role="status">Serviço indisponível no momento.</p>
    <button className="button secondary" type="button" onClick={onClick}>Tentar novamente</button></>;
}

function RankingPanel({ base, modality }: { base: string; modality: string }) {
  const { data, error, retry } = useGatewayData<Ranking>(
    base + '/ranking?modalidade=' + encodeURIComponent(modality),
  );
  if (error || (data && (!Array.isArray(data.items) || !Number.isInteger(data.minimum)))) {
    return <Retry onClick={retry}/>;
  }
  if (!data) return <p role="status">Carregando resultados…</p>;
  return <>
    <h4>{modality}</h4>
    <button className="button secondary print-ranking" type="button" onClick={() => window.print()}>
      Imprimir relatório
    </button>
    {data.items.length === 0 && <p role="status">Nenhum projeto encontrado nesta modalidade.</p>}
    <ul className="gateway-rank">
      {data.items.map(item => <li className="ranking-rules" key={item.id}>
        <b>{item.posicao !== null ? item.posicao + 'º · ' : ''}{item.titulo}</b>
        <p>{item.total} {item.total === 1 ? 'avaliação' : 'avaliações'} · {item.media === null
          ? 'Aguardando amostra mínima de ' + data.minimum : decimal.format(item.media) + ' / 5'}</p>
        {item.criterios && <details><summary>Médias por critério</summary>
          <ul>{CRITERIA.map((label, i) => <li key={label}>{label} · {decimal.format(item.criterios![i])}</li>)}</ul>
        </details>}
      </li>)}
    </ul>
  </>;
}

function VoteForm({ base, projectId, projects }: { base: string; projectId?: string; projects: Project[] }) {
  const { data, error, retry } = useGatewayData<{ status: string }>(base + '/bootstrap');
  const [closed, setClosed] = useState(false);
  const [project, setProject] = useState(projectId || '');
  const [code, setCode] = useState('');
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  const open = data?.status === 'ABERTA' && !closed;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !open) return;
    const token = code.trim();
    if (!projects.some(item => item.id === project) || token.length < 20 || token.length > 200) {
      setMessage('Selecione um projeto e informe um código de avaliação válido.');
      return;
    }
    try { weightedScore(scores); } catch {
      setMessage('Informe quatro notas inteiras de 1 a 5.');
      return;
    }

    inFlight.current = true;
    setBusy(true);
    setMessage('');
    try {
      const fingerprint = JSON.stringify([project, token, scores]);
      if (request.current?.fingerprint !== fingerprint) request.current = { fingerprint, id: crypto.randomUUID() };
      const reply = await api<{ receipt: string; score: number }>(base + '/vote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_requisicao: request.current.id, id_projeto: project, codigo: token, notas: scores }),
      });
      if (!reply.ok) {
        if (reply.error === 'VOTACAO_FECHADA') setClosed(true);
        setMessage(messages[reply.error] || 'Não foi possível confirmar. Tente novamente com os mesmos dados.');
        return;
      }
      if (reply.data.receipt !== request.current.id || !Number.isFinite(reply.data.score)) {
        throw new Error('Recibo inválido');
      }
      setMessage('Avaliação registrada. Recibo: ' + reply.data.receipt + ' · Nota: ' + decimal.format(reply.data.score));
      setCode('');
      setScores([0, 0, 0, 0]);
      request.current = null;
    } catch {
      setMessage('Não foi possível confirmar. Tente novamente com os mesmos dados.');
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (error) return <Retry onClick={retry}/>;
  return <form className="gateway-form" onSubmit={submit}>
    <p role="status">{data ? open ? 'Votação aberta' : 'Votação fechada' : 'Consultando situação…'}</p>
    <fieldset disabled={busy || !open}>
      <label>Projeto<select required value={project} onChange={e => setProject(e.target.value)}>
        <option value="">Selecione</option>
        {projects.map(item => <option key={item.id} value={item.id}>{item.id} · {item.titulo}</option>)}
      </select></label>
      <label>Código de avaliação<input required minLength={20} maxLength={200} value={code}
        onChange={e => setCode(e.target.value)} autoComplete="off" spellCheck={false}/></label>
      {CRITERIA.map((label, i) => <label key={label}>{label}<select required value={scores[i] || ''}
        onChange={e => { const value = Number(e.target.value); setScores(old => old.map((score, j) => i === j ? value : score)); }}>
        <option value="">Selecione uma nota de 1 a 5</option>
        {[1, 2, 3, 4, 5].map(value => <option key={value}>{value}</option>)}
      </select></label>)}
      <button className="button primary" type="submit">{busy ? 'Enviando…' : 'Enviar avaliação'}</button>
    </fieldset>
    <p role="status">{message}</p>
  </form>;
}
