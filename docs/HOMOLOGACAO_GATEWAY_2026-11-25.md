# Homologação da integração | 25/11/2026

| Verificação | Evidência |
|---|---|
| Bootstrap do Worker QA | HTTP 200, `ok=true`, `status=FECHADA`, `minRanking=5`. |
| Ranking QA, Mostra Nacional | HTTP 200 em 6,52 s na nova tentativa após timeout inicial. 24 IDs únicos, 21 projetos com zero avaliações e 3 com uma. Posição, média e critérios ocultos abaixo do mínimo. |
| Ranking QA, Mostra de Extensão | HTTP 200 em 6,23 s na nova tentativa. 22 IDs únicos. EXT-001 em 1º com 5 avaliações e média 3,95. Dos demais, 20 com zero e um com uma. |
| Separação e privacidade do ranking | As modalidades retornaram somente projetos da sua categoria. Os campos públicos corresponderam ao contrato de agregados, sem código nem hash. |
| CORS QA | Bootstrap a partir de `http://localhost:5173` retornou o cabeçalho de origem esperado. Preflight de envio retornou HTTP 204 e permitiu `Content-Type` e `POST`. |
| Rejeição com QA fechado | Uma tentativa com código sintético não cadastrado recebeu HTTP 400 e `VOTACAO_FECHADA`. Nenhuma avaliação foi aceita. |
| Catálogo e código | Catálogo validado com 46 projetos, 24 nacionais e 22 de extensão. Build TypeScript/Vite e 27 testes de regressão aprovados localmente, com `npm audit` retornando zero vulnerabilidades. Eventos de escrita dos testes usaram planilha em memória e valores sintéticos. |
| Navegação de produção | Catálogo público abriu no Chrome remoto. A aba Avaliar ainda apresentava o link para o Google Apps Script. O formulário público exibiu “A votação está fechada” e botão desabilitado. |

O código revisado elimina os redirecionamentos, mantém o formulário desabilitado sem confirmação de abertura, exibe os agregados e evita ler a configuração da planilha uma vez por projeto. A validação em navegador remoto do novo build local encontrou conexão recusada.

**Pendentes:** implantar a versão revisada no Apps Script QA e testar os painéis contra essa versão no navegador, inclusive responsividade e sessão com múltiplas contas. Validação de gravação pelo Worker com código sintético e revalidação de produção dependem dessa homologação. A conta Cloudflare conectada listou somente o Worker de QA para o projeto. O editor autenticado do Apps Script QA não estava disponível. A produção preserva a implantação publicada. Nenhum voto real foi enviado e nenhuma planilha de produção foi alterada.
