/**
 * Universo IF Avalia — backend Google Apps Script.
 * A configuração inicial deve ser executada manualmente pelo proprietário conforme docs/CONFIGURAR_GOOGLE.md.
 * Em script vinculado a uma planilha, reutiliza a planilha vinculada; em script independente, cria uma planilha privada.
 * Nunca publique a planilha nem a aba Codigos/Avaliacoes.
 */
const PROJECTS = [{"id":"EXT-001","titulo":"CONSTRUINDO UMA COMUNIDADE DE LEITORES: A Leitura Como Meio De Inclusão De Pessoas Em Processo De Reintegração Social Da ACBS","modalidade":"Mostra de Extensão","area_tematica":"Ciências Sociais Aplicadas","data":"2026-11-17","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-002","titulo":"PROJETO DE EXTENSÃO: LEITURA E CULTURA: CONECTANDO SABERES NAS TRILHAS DO CONHECIMENTO","modalidade":"Mostra de Extensão","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-17","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-003","titulo":"II Jornada Da Consciência Negra: Identidade, História E Oralidade Dos Povos Negros","modalidade":"Mostra de Extensão","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-004","titulo":"VIAJANDO NO UNIVERSO DA LEITURA: Projeto De Mediação Literária Para Os Filhos Das Estudantes Do PROEJA.","modalidade":"Mostra de Extensão","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-005","titulo":"IDENTIDADE NEGRA: Experiências De Um Projeto De Extensão No Instituto Federal Do Maranhão - Campus Carolina","modalidade":"Mostra de Extensão","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-006","titulo":"III NEABI EM AÇÃO: SABERES E EDUCAÇÃO ANTIRRACISTA NAS ESCOLAS:\"NEGRITUDE E EDUCAÇÃO: LUTA POLÍTICA E VALORIZAÇÃO DA CULTURA NEGRA\"","modalidade":"Mostra de Extensão","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-007","titulo":"TECNOARTE: Robótica, Programação E Cultura Por Meio De Mangás Educativos","modalidade":"Mostra de Extensão","area_tematica":"Ciência, Inovação e Protagonismo Estudantil","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-008","titulo":"IV SIMPÓSIO DE BIOLOGIA","modalidade":"Mostra de Extensão","area_tematica":"Ciências Biológicas","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-009","titulo":"A MEDITAÇÃO COMO ESTRATÉGIA PEDAGÓGICA NO DESENVOLVIMENTO DE HABILIDADES COGNITIVAS E SOCIOEMOCIONAIS COM CRIANÇAS NO PROJETO ROBIN HOOD.","modalidade":"Mostra de Extensão","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-010","titulo":"CIÊNCIA CIDADÃ NA ESCOLA: BIOMONITORAMENTO DO RIO TOCANTINS COMO FERRAMENTA DE EDUCAÇÃO","modalidade":"Mostra de Extensão","area_tematica":"Ciências Biológicas","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-011","titulo":"ConsCIÊNCIA CLIMÁTICA: EDUCAÇÃO PARA MUDANÇAS CLIMÁTICAS EM ESCOLAS PÚBLICAS DE VIANA-MA","modalidade":"Mostra de Extensão","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-012","titulo":"IFMA DE PORTAS ABERTAS 2.0: CONECTANDO JOVENS DA BAIXADA MARANHENSE À EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA","modalidade":"Mostra de Extensão","area_tematica":"Ciência, Inovação e Protagonismo Estudantil","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-013","titulo":"EDUCAÇÃO EM SAÚDE E EMPODERAMENTO FEMININO: PROMOVENDO PRÁTICAS DE HIGIENE ÍNTIMA E AUTOESTIMA ENTRE ESTUDANTES DA REDE PÚBLICA MUNICIPAL","modalidade":"Mostra de Extensão","area_tematica":"Ciências Biológicas","data":"2026-11-17","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-014","titulo":"Projeto De Extensão: Jiu-Jitsu Para Todas: Mulheres Em Movimento","modalidade":"Mostra de Extensão","area_tematica":"Ciências da Saúde","data":"2026-11-18","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-015","titulo":"PLATEIA IFMA: FORMAÇÃO DE PLATEIA E VALORIZAÇÃO DAS MODINHAS BRASILEIRAS EM AÇAILÂNDIA – MA","modalidade":"Mostra de Extensão","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-016","titulo":"PARTIU REAGIR: A QUÍMICA EM AÇÃO COM OS ALUNOS DO PARTIU IF DO IFMA CAMPUS TIMON","modalidade":"Mostra de Extensão","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-18","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-017","titulo":"CURSO DE IDIOMAS BÁSICO I EM LÍNGUA ESTRANGEIRA (INGLÊS E ESPANHOL)","modalidade":"Mostra de Extensão","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-018","titulo":"Extensão Universitária Em Redes De Computadores Para Laboratórios Escolares E Comunidades Tradicionais","modalidade":"Mostra de Extensão","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-18","inicio":"14:00","fim":"15:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-019","titulo":"Setembro Azul: Celebrando A Semana Do Surdo No IFMA - Campus Barra Do Corda","modalidade":"Mostra de Extensão","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-020","titulo":"SANTA FILOMENA VIVA: RESGATE CULTURAL E AÇÕES AMBIENTAIS PARTICIPATIVAS","modalidade":"Mostra de Extensão","area_tematica":"Ciências Agrárias","data":"2026-11-18","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-021","titulo":"Inclusão Digital No Ensino De Ciências Para Alunos Do 9º Ano Do Ensino Fundamental Em Comunidades Afrodescendentes De São Luís","modalidade":"Mostra de Extensão","area_tematica":"Ciência, Inovação e Protagonismo Estudantil","data":"2026-11-18","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"EXT-022","titulo":"EVENTO GEEK ARENA: PROMOVENDO A CULTURA GEEK E TECNOLÓGICA ENTRE A COMUNIDADE ACADÊMICA E A SOCIEDADE EM GERAL","modalidade":"Mostra de Extensão","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"16:00","fim":"17:45","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-001","titulo":"TRANSFERÊNCIA ENTRE DESENVOLVIMENTO AO TESTE E PERFIL DE ERROS NO RECONHECIMENTO MULTIRRÓTULO DE EMOÇÕES EM PT-BR","modalidade":"Mostra Nacional","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-002","titulo":"Flora: Desenvolvimento Inicial De Um Sistema Adaptativo Para Integração Humano-Planta","modalidade":"Mostra Nacional","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-003","titulo":"EXTRAÇÃO DE NANOCELULOSE A PARTIR DA FIBRA DO AÇAÍ","modalidade":"Mostra Nacional","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-004","titulo":"AGROSENTINELA: DESENVOLVIMENTO E AVALIAÇÃO EXPLORATÓRIA DE UM PROTÓTIPO AUDITÁVEL PARA CONTAGEM DE BOVINOS EM VÍDEO","modalidade":"Mostra Nacional","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-005","titulo":"TRAÇO VIVO: INTERAÇÃO CONVERSACIONAL E ANIMAÇÃO EXPRESSIVA DE DESENHOS BIDIMENSIONAIS COM CONTROLE SEMÂNTICO","modalidade":"Mostra Nacional","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-006","titulo":"ZEÓLITAS FAU E LTA DERIVADAS DE BIOSSÍLICA MODIFICADAS COM CÉRIO PARA REDUÇÃO ELETROQUÍMICA DE OXIGÊNIO","modalidade":"Mostra Nacional","area_tematica":"Ciências Exatas e da Terra","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-007","titulo":"LIPOTALE: RELATO DE IMPLEMENTAÇÃO DE UM JOGO DIGITAL PARA O ENSINO DE BIOQUÍMICA NO ENSINO SUPERIOR","modalidade":"Mostra Nacional","area_tematica":"Ciência, Inovação e Protagonismo Estudantil","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-008","titulo":"A QUÍMICA DOS ALIMENTOS NO COTIDIANO: EXPERIÊNCIA EXTENSIONISTA COM ESTUDANTES DA EDUCAÇÃO DE JOVENS E ADULTOS","modalidade":"Mostra Nacional","area_tematica":"Outros","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-009","titulo":"SÍNTESE E CARACTERIZAÇÃO DE AZUL DA PRÚSSIA PARA APLICAÇÕES FOTOTÉRMICAS","modalidade":"Mostra Nacional","area_tematica":"Engenharias","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-010","titulo":"DESENVOLVIMENTO E APLICAÇÃO DE UM SISTEMA EMBARCADO INTERATIVO PARA ROBÓTICA EDUCACIONAL NOS ANOS INICIAIS","modalidade":"Mostra Nacional","area_tematica":"Engenharias","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-011","titulo":"SUSTENTABILIDADE AMBIENTAL EM UMA ESCOLA PÚBLICA DO MARANHÃO: ESTUDO SITUACIONAL E DIAGNÓSTICO","modalidade":"Mostra Nacional","area_tematica":"Ciências Humanas","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-012","titulo":"IDENTIDADE E PERTENCIMENTO: VIVÊNCIAS AFRO-BRASILEIRAS NA COMUNIDADE QUILOMBOLA DE CAJAZEIRAS EM ITAPECURU-MIRIM – MARANHÃO","modalidade":"Mostra Nacional","area_tematica":"Ciências Sociais Aplicadas","data":"2026-11-17","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-013","titulo":"ATIVIDADE ANTAGONISTA DE Trichoderma Harzianum CONTRA Fusarium Solani: UMA POSSÍVEL ESTRATÉGIA DE BIOCONTROLE DA FUSARIOSE NA CULTURA DA MANDIOCA","modalidade":"Mostra Nacional","area_tematica":"Ciências Agrárias","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-014","titulo":"DESENVOLVIMENTO DE BISCOITO COM FARINHA DE “ARROZ DO BARRO” E AVALIAÇÃO DE SUA ACEITABILIDADE SENSORIAL PARA A ALIMENTAÇÃO ESCOLAR","modalidade":"Mostra Nacional","area_tematica":"Ciências Agrárias","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-015","titulo":"PESCADO NA FEIRA LIVRE: UM DIAGNÓSTICO DAS CONDIÇÕES HIGIÊNICO-SANITÁRIAS DA COMERCIALIZAÇÃO EM BOM JARDIM-MA.","modalidade":"Mostra Nacional","area_tematica":"Ciências Agrárias","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-016","titulo":"INIBIÇÃO FÚNGICA E REDUÇÃO DE AFLATOXINAS POR EXTRATOS VEGETAIS NÃO VOLÁTEIS: REVISÃO INTEGRATIVA","modalidade":"Mostra Nacional","area_tematica":"Ciências Biológicas","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-017","titulo":"ABELHAS NATIVAS DOS LENÇÓIS MARANHENSES: DIVERSIDADE DE FONTES FLORAIS E QUALIDADE MICROBIOLÓGICA DO MEL","modalidade":"Mostra Nacional","area_tematica":"Ciências Biológicas","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-018","titulo":"AS CONTRIBUIÇÕES DE FLORENCE NIGHTINGALE PARA A CONSOLIDAÇÃO DA ENFERMAGEM COMO CIÊNCIA: REVISÃO DE ESCOPO","modalidade":"Mostra Nacional","area_tematica":"Ciências da Saúde","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-019","titulo":"AUTOCUIDADO E SAÚDE SEXUAL NA GESTAÇÃO ADOLESCENTE: RELATO DE EXPERIÊNCIA DE UMA OFICINA EDUCATIVA","modalidade":"Mostra Nacional","area_tematica":"Ciências da Saúde","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-020","titulo":"MEDICAL HELP: SISTEMA DIGITAL PICTOGRÁFICO PARA ACESSIBILIDADE DE ORIENTAÇÕES MEDICAMENTOSAS","modalidade":"Mostra Nacional","area_tematica":"Ciências da Saúde","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-021","titulo":"INTELIGÊNCIA ARTIFICIAL GENERATIVA E PRODUTIVIDADE ACADÊMICA: UM ESTUDO SOBRE O USO DE FERRAMENTAS DE IA POR ESTUDANTES DO IFMA","modalidade":"Mostra Nacional","area_tematica":"Ciências Sociais Aplicadas","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-022","titulo":"A PRÁTICA TEATRAL INCLUSIVA E O PROTAGONISMO DE MENINAS NA CIÊNCIA, TECNOLOGIA E INOVAÇÃO.","modalidade":"Mostra Nacional","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-023","titulo":"PLANETA ÁGUA, SENTIR PARA CUIDAR: RELATO DE EXPERIÊNCIA DE UMA INSTALAÇÃO MULTISSENSORIAL","modalidade":"Mostra Nacional","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"},{"id":"NAC-024","titulo":"CONEXÃO TENETEHARA: TECNOLOGIA E CULTURA NA VALORIZAÇÃO DA LÍNGUA GUAJAJARA","modalidade":"Mostra Nacional","area_tematica":"Linguísticas, Letras e Artes","data":"2026-11-18","inicio":"17:00","fim":"19:15","formato":"Exposição de pôster","local":"Área de vivência"}];
const SHEETS = {
  Projetos: ['id','titulo','modalidade','area_tematica','data','inicio','fim','formato','local'],
  Codigos: ['hash_codigo','habilitado','criado_em'],
  Avaliacoes: ['id_requisicao','hash_codigo','id_projeto','nota_1','nota_2','nota_3','nota_4','nota_ponderada','timestamp','estado'],
  Configuracao: ['chave','valor']
};
const WEIGHTS = [0.30, 0.30, 0.25, 0.15];
const MIN_RANKING = 5;

function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  template.initialProject = (e && e.parameter && e.parameter.projectId) || '';
  template.initialView = (e && e.parameter && e.parameter.view) || 'avaliar';
  template.initialModality = (e && e.parameter && e.parameter.modalidade) || 'Mostra Nacional';
  return template.evaluate()
    .setTitle('Universo IF Avalia')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function initializeSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SPREADSHEET_ID');
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    // Se o código foi aberto por Extensões → Apps Script dentro de uma planilha,
    // reutilize essa planilha em vez de criar uma segunda cópia no Drive.
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      ss = SpreadsheetApp.create('Universo IF Avalia — dados privados');
    }
    props.setProperty('SPREADSHEET_ID', ss.getId());
  }
  Object.keys(SHEETS).forEach(function(name) {
    let sh = ss.getSheetByName(name);
    if (!sh) {
      if (name === 'Projetos' && ss.getSheets().length === 1 &&
          ss.getSheets()[0].getLastRow() === 0) {
        sh = ss.getSheets()[0];
        sh.setName(name);
      } else {
        sh = ss.insertSheet(name);
      }
    }
    if (sh.getLastRow() === 0) sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]);
    sh.setFrozenRows(1);
  });
  const projectsSheet = ss.getSheetByName('Projetos');
  if (projectsSheet.getLastRow() === 1) {
    const rows = PROJECTS.map(function(p) { return [p.id,p.titulo,p.modalidade,p.area_tematica,p.data,p.inicio,p.fim,p.formato,p.local]; });
    projectsSheet.getRange(2,1,rows.length,rows[0].length).setValues(rows);
  }
  const config = ss.getSheetByName('Configuracao');
  if (config.getLastRow() === 1) {
    config.getRange(2,1,4,2).setValues([
      ['STATUS_VOTACAO','FECHADA'],
      ['MIN_RANKING',String(MIN_RANKING)],
      ['CATALOG_VERSION','universo-if-catalogo-v1.0'],
      ['ATUALIZADO_EM',new Date().toISOString()]
    ]);
  }
  return {ok:true, spreadsheetId:ss.getId(), url:ss.getUrl(), sheets:Object.keys(SHEETS)};
}

function registerVoteCode_(token) {
  const raw = String(token || '').trim();
  if (raw.length < 20) throw new Error('Token sintético/aleatório deve ter pelo menos 20 caracteres.');
  const ss = spreadsheet_();
  const sh = ss.getSheetByName('Codigos');
  const hash = hashToken_(raw);
  const rows = sh.getLastRow() > 1 ? sh.getRange(2,1,sh.getLastRow()-1,3).getValues() : [];
  if (rows.some(function(r) { return String(r[0]) === hash; })) throw new Error('Código já cadastrado.');
  sh.appendRow([hash,true,new Date()]);
  return {ok:true, message:'Código habilitado; somente o hash foi armazenado.'};
}

function getUiBootstrap() {
  const cfg = readConfig_();
  return {projects:PROJECTS, status:cfg.STATUS_VOTACAO || 'FECHADA', minRanking:Number(cfg.MIN_RANKING || MIN_RANKING)};
}

function getPublicRanking(modality) {
  if (['Mostra Nacional','Mostra de Extensão'].indexOf(modality) < 0) throw new Error('Modalidade inválida.');
  const cache = CacheService.getScriptCache();
  const cacheKey = 'ranking_' + modality;
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const ss = spreadsheet_();
  const sh = ss.getSheetByName('Avaliacoes');
  const rows = sh.getLastRow() > 1 ? sh.getRange(2,1,sh.getLastRow()-1,10).getValues() : [];
  const groups = {};
  rows.forEach(function(r) {
    if (String(r[9]) !== 'VALIDO') return;
    const projectId = String(r[2]);
    const project = PROJECTS.find(function(p) { return p.id === projectId; });
    if (!project || project.modalidade !== modality) return;
    if (!groups[projectId]) groups[projectId] = {id:projectId,titulo:project.titulo,modalidade:modality,total:0,sum:0,criteria:[0,0,0,0],updatedAt:null};
    const g = groups[projectId];
    g.total++;
    g.sum += Number(r[7]);
    for (let i=0;i<4;i++) g.criteria[i] += Number(r[3+i]);
    const stamp = r[8] instanceof Date ? r[8].toISOString() : String(r[8]);
    if (!g.updatedAt || stamp > g.updatedAt) g.updatedAt = stamp;
  });
  PROJECTS.filter(function(p){return p.modalidade===modality;}).forEach(function(p){
    if (!groups[p.id]) groups[p.id] = {id:p.id,titulo:p.titulo,modalidade:modality,total:0,sum:0,criteria:[0,0,0,0],updatedAt:null};
  });
  const items = Object.keys(groups).map(function(id) {
    const g = groups[id];
    const eligible = g.total >= Number(readConfig_().MIN_RANKING || MIN_RANKING);
    return {id:g.id,titulo:g.titulo,modalidade:g.modalidade,total:g.total,media:eligible?Number((g.sum/g.total).toFixed(2)):null,criterios:eligible?g.criteria.map(function(n){return Number((n/g.total).toFixed(2));}):null,updatedAt:g.updatedAt};
  }).sort(function(a,b){return b.media-a.media || a.titulo.localeCompare(b.titulo,'pt-BR') || a.id.localeCompare(b.id);});
  let position = 0;
  items.forEach(function(item) {
    item.elegivel = item.total >= Number(readConfig_().MIN_RANKING || MIN_RANKING);
    item.posicao = item.elegivel ? ++position : null;
  });
  const result = {modality:modality,minimum:Number(readConfig_().MIN_RANKING || MIN_RANKING),updatedAt:items.reduce(function(max,item){return item.updatedAt && (!max || item.updatedAt>max)?item.updatedAt:max;},null),items:items};
  cache.put(cacheKey, JSON.stringify(result), 30);
  return result;
}

function submitVote(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Dados inválidos.');
  const requestId = String(payload.id_requisicao || '').trim();
  const token = String(payload.codigo || '').trim();
  const projectId = String(payload.id_projeto || '').trim();
  const scores = payload.notas;
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(requestId)) throw new Error('ID de requisição inválido.');
  if (token.length < 20 || token.length > 200) throw new Error('Código inválido.');
  if (!PROJECTS.some(function(p){return p.id===projectId;})) throw new Error('Projeto inexistente.');
  if (!Array.isArray(scores) || scores.length !== 4 || scores.some(function(n){return !Number.isInteger(n)||n<1||n>5;})) throw new Error('Informe quatro notas inteiras entre 1 e 5.');
  const score = scores.reduce(function(sum,n,i){return sum+n*WEIGHTS[i];},0);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = spreadsheet_();
    const codes = ss.getSheetByName('Codigos');
    const votes = ss.getSheetByName('Avaliacoes');
    const hash = hashToken_(token);
    const existing = votes.getLastRow() > 1 ? votes.getRange(2,1,votes.getLastRow()-1,10).getValues() : [];
    const sameRequest = existing.find(function(r){return String(r[0])===requestId;});
    if (sameRequest) {
      if (String(sameRequest[1])===hash && String(sameRequest[2])===projectId) {
        return {ok:true,receipt:requestId,score:Number(sameRequest[7]),idempotent:true};
      }
      throw new Error('ID_REQUISICAO_REUTILIZADO');
    }
    const config = readConfig_();
    if (String(config.STATUS_VOTACAO) !== 'ABERTA') throw new Error('VOTACAO_FECHADA');
    const codeRows = codes.getLastRow() > 1 ? codes.getRange(2,1,codes.getLastRow()-1,3).getValues() : [];
    const code = codeRows.find(function(r){return String(r[0])===hash;});
    if (!code || code[1] !== true) throw new Error('CODIGO_INVALIDO_OU_DESABILITADO');
    if (existing.some(function(r){return String(r[1])===hash && String(r[2])===projectId && String(r[9])==='VALIDO';})) {
      throw new Error('VOTO_DUPLICADO');
    }
    const cache = CacheService.getScriptCache();
    const now = Date.now();
    const recent = JSON.parse(cache.get('global_vote_rate') || '[]').filter(function(ts){return now-ts<10000;});
    if (recent.length >= 60) throw new Error('LIMITE_DE_TAXA_TEMPORARIO');
    recent.push(now);
    cache.put('global_vote_rate', JSON.stringify(recent), 10);
    votes.appendRow([requestId,hash,projectId,scores[0],scores[1],scores[2],scores[3],score,new Date(),'VALIDO']);
    const votedProject = PROJECTS.find(function(p){return p.id===projectId;});
    cache.remove('ranking_' + votedProject.modalidade);
    SpreadsheetApp.flush();
    return {ok:true,receipt:requestId,score:Number(score.toFixed(2)),idempotent:false};
  } finally {
    lock.releaseLock();
  }
}

function readConfig_() {
  const sh = spreadsheet_().getSheetByName('Configuracao');
  const values = sh.getLastRow()>1 ? sh.getRange(2,1,sh.getLastRow()-1,2).getValues() : [];
  const result = {};
  values.forEach(function(r){result[String(r[0])]=r[1];});
  return result;
}
function spreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Execute a função privada initializeSpreadsheet_() por meio do procedimento temporário descrito em docs/CONFIGURAR_GOOGLE.md.');
  return SpreadsheetApp.openById(id);
}
function hashToken_(token) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8);
  return bytes.map(function(b){const v=(b+256)%256;return ('0'+v.toString(16)).slice(-2);}).join('');
}

/** API exclusiva do gateway; segredo em Script Properties, nunca no frontend. */
function doPost(e) {
  function reply(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('AVALIA_GATEWAY_SECRET');
    if (!secret || secret.length < 32 || typeof body.secret !== 'string' || body.secret !== secret) return reply({ok:false,error:'NAO_AUTORIZADO'});
    if (body.action === 'bootstrap') {
      const cfg = getUiBootstrap();
      return reply({ok:true,data:{status:cfg.status,minRanking:cfg.minRanking}});
    }
    if (body.action === 'ranking') return reply({ok:true,data:getPublicRanking(body.modality)});
    if (body.action === 'vote') return reply({ok:true,data:submitVote(body.payload)});
    return reply({ok:false,error:'ACAO_INVALIDA'});
  } catch (err) {
    const message = String(err.message || '');
    const allowed = ['VOTACAO_FECHADA','VOTO_DUPLICADO','CODIGO_INVALIDO_OU_DESABILITADO','ID_REQUISICAO_REUTILIZADO','LIMITE_DE_TAXA_TEMPORARIO'];
    return reply({ok:false,error:allowed.indexOf(message)>=0?message:'REQUISICAO_INVALIDA'});
  }
}
