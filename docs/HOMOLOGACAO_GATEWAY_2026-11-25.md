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

## Revalidação do PR nº 2

- Commit de código verificado: `10dff7277a423e516cedfd637d6286f1a8ef3961`. PR nº 2 em rascunho, sem merge. O comentário técnico registra execução bem-sucedida do GitHub Actions no run `45617609867`.
- Nova execução: 27 testes aprovados, `npm audit` com zero vulnerabilidades, build com URL QA, verificação de sintaxe do Apps Script e auditoria dos 46 projetos aprovados.
- Worker QA: `/bootstrap` exibiu FECHADA e mínimo 5. HTTP 200 e cabeçalho CORS para `http://localhost:5173`. A origem do GitHub Pages recebeu HTTP 403 `ORIGEM_INVALIDA` em QA. Uma primeira tentativa de ranking recebeu HTTP 403 pelo cliente Python. A nova verificação via curl com a origem QA retornou HTTP 200 nas duas modalidades, 24 e 22 projetos.
- A pasta `backend/` versionada contém uma única declaração de `doPost`, em `Code.gs`. Os links com e sem seleção de conta redirecionaram para a documentação do Google. O conteúdo de `Gateway.gs` no editor remoto, a publicação em QA e a homologação integrada com gravações sintéticas seguem pendentes.

## Reversão após publicação

1. Antes da liberação, registre o último commit e a execução saudável do GitHub Pages, a versão ativa do Worker de produção e a versão da implantação do Apps Script. Confirme FECHADA antes da mudança.
2. Em caso de regressão do frontend, reverta o commit de publicação e publique o conteúdo correspondente à execução saudável anterior. Se o problema estiver no Worker, restaure sua implantação anterior. No Apps Script, em **Implantar → Gerenciar implantações**, edite a implantação existente para voltar à versão anterior. Preserve a URL da implantação, as propriedades e a planilha.
3. Verifique o catálogo, o formulário público e os dois rankings em leitura. Confirme novamente FECHADA na interface e no gateway, quando disponível. Registre o motivo da reversão e as versões restauradas. A reversão de código não reverte dados da planilha.


## Retomada da homologação

- Commit `186c621` acrescentou três testes do Worker com respostas sintéticas: preflight CORS, bootstrap fechado e rankings por modalidade, e falha do serviço a montante. Resultado local: 30 testes aprovados, build e catálogo de 46 projetos validados.
- A leitura no navegador confirmou QA `FECHADA` e botão de envio desabilitado no formulário público de produção.
- A guia administrativa do navegador do Work continuou na tela de login. Uma nova abertura do endereço do projeto redirecionou à documentação do Apps Script. A duplicidade no projeto remoto e a implantação QA seguem sem verificação. Nenhum dado foi gravado e a publicação de produção continua condicionada à homologação QA.
