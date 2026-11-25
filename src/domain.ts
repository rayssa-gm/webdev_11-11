export const WEIGHTS = [0.30, 0.30, 0.25, 0.15] as const;
export const CRITERIA = [
  'Criatividade e inovação',
  'Clareza da apresentação',
  'Relevância e impacto',
  'Demonstração e resultados',
] as const;
export type Modality = 'Mostra Nacional' | 'Mostra de Extensão';
export type Project = {
  id: string; titulo: string; modalidade: Modality; area_tematica: string;
  data: string; inicio: string; fim: string; formato: string; local: string;
  fontes: { arquivo: string; pagina: number }[];
};
export type RankingItem = {
  id: string; titulo: string; modalidade: Modality; media: number; total: number;
  criterios: number[]; posicao: number | null; elegivel: boolean;
};
export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}
export function weightedScore(scores: number[]): number {
  if (!Array.isArray(scores) || scores.length !== 4 ||
      scores.some(n => !Number.isInteger(n) || n < 1 || n > 5)) {
    throw new Error('Informe quatro notas inteiras entre 1 e 5.');
  }
  return scores.reduce((sum, score, index) => sum + score * WEIGHTS[index], 0);
}
export function filterProjects(projects: Project[], q: string, modality: string, area: string, day: string): Project[] {
  const needle = normalize(q);
  return projects.filter(p =>
    (!needle || normalize(p.titulo).includes(needle)) &&
    (!modality || p.modalidade === modality) &&
    (!area || p.area_tematica === area) &&
    (!day || p.data === day)
  );
}
export function rankProjects(items: Omit<RankingItem, 'posicao' | 'elegivel'>[], minimum = 5): RankingItem[] {
  const sorted = [...items].sort((a,b) => b.media - a.media || a.titulo.localeCompare(b.titulo, 'pt-BR') || a.id.localeCompare(b.id));
  let position = 0;
  return sorted.map(item => {
    const eligible = item.total >= minimum;
    if (eligible) position += 1;
    return { ...item, elegivel: eligible, posicao: eligible ? position : null };
  });
}
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}
