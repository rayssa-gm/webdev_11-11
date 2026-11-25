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


## QA v1.3 — validação após atualização manual

- A operadora informou que implantou **Universo IF Avalia — QA v1.3 — Backend revisado** na implantação existente. Substituiu `Code.gs`, desativou `Gateway.gs`, preservou `Index.html`, URL, propriedades e segredos. Essa atualização não foi repetida.
- Leituras independentes do Worker QA após a atualização, com a origem de QA: `/bootstrap` confirmou `FECHADA` e mínimo 5. Mostra Nacional retornou 24 identificadores únicos, sem projetos classificados. Mostra de Extensão retornou 22 e classificou EXT-001 em 1º, média 3,95, com 5 avaliações. Foram conferidas as modalidades e a ausência de posição e média abaixo do limiar.
- Build com URL de QA a partir de `2de9d03` concluído. Navegação local no Chromium com respostas capturadas do Worker, em contextos novos sem conta Google: formulário pré-selecionou EXT-001, manteve o envio desabilitado, exibiu os rankings 24/22 e não abriu outra guia nem redirecionou. Formulário e ranking sem rolagem horizontal a 360, 768 e 1.366 px.
- Teste de envio interceptado no navegador, sem gravação: a primeira tentativa simulou falha de rede. A segunda preservou o identificador e as quatro notas sintéticas [4, 5, 4, 3], exibiu recibo e nota 4,15 após a resposta simulada.
- O Chromium do executor retornou `ERR_CERT_AUTHORITY_INVALID` ao acessar diretamente o Worker pelo proxy do ambiente. A chamada HTTP independente funcionou. A validação ponta a ponta no Edge com Worker real, a gravação sintética na planilha QA e o teste com múltiplas contas seguem pendentes. Este ciclo não implantou produção nem alterou planilhas.

## Validação no Edge e preparação de produção

- Evidência informada pela operadora: Edge normal e InPrivate carregaram formulário e rankings integrados. Avaliação sintética de EXT-003 com notas 4, 5, 4 e 3 gerou nota 4,15 e recibo. O status de QA foi restaurado para FECHADA.
- Conferência independente após o teste: `/bootstrap` confirmou FECHADA e mínimo 5. O ranking Mostra de Extensão mostrou uma avaliação em EXT-003, com média e posição ocultas. Os dois rankings retornaram 24 e 22 IDs únicos. O recibo e as notas individuais são evidência da operadora, pois não integram a API pública.
- Revisão do código: o segredo pertence aos servidores e os clientes usam o gateway sem cookies. O Apps Script valida notas, aplica o Modelo B e verifica o estado antes de gravar. O perfil `production` do Worker adota origem específica e recusa envios antes de chamar o Apps Script. Um teste sintético confirma que essa recusa não gera chamada ao backend.
- O workflow de publicação exige bootstrap FECHADA, mínimo 5, origem esperada e resposta válida dos dois rankings com 24 e 22 projetos únicos. Os testes locais passaram (31 de 31), assim como o build e a validação do catálogo.
- A conta Cloudflare conectada mostrou apenas o Worker QA. O perfil de produção está versionado. A implantação real exige uma URL de Apps Script de produção e um segredo exclusivo configurado de forma privada nos dois serviços. QA e produção devem manter vínculos de planilha separados. A homologação da configuração implantada é pré-requisito para publicar. Nenhum voto real foi enviado e os dados de produção foram preservados.

### Preparação no Edge

No projeto Apps Script **Universo IF Avalia** de produção, confira `FECHADA` por leitura. Preserve `SPREADSHEET_ID`, `Index.html` e o histórico da implantação atual. Atualize o backend com `backend/Code.gs`, mantenha apenas uma definição de `doPost` e configure o segredo próprio de produção em `AVALIA_GATEWAY_SECRET`. Crie uma implantação de Web App separada para o gateway. Use a URL `/exec` dessa implantação em `APPS_SCRIPT_URL` e o mesmo segredo privado em `GATEWAY_SECRET` no Worker de produção. Mantenha `VOTING_DISABLED=true`. Não compartilhe o segredo pelo GitHub ou pelo chat.

Após validar os endpoints de produção em leitura, defina `VITE_AVALIA_GATEWAY_URL` no GitHub com a origem do Worker de produção. A implantação definitiva depende da validação do workflow e da navegação anônima do site publicado. A URL pública permanece https://rayssa-gm.github.io/webdev_11-11/.

## Última verificação antes da publicação

- Worker de produção confirmado em leitura: HTTP 200, votação FECHADA e mínimo 5. O ranking de cada modalidade retornou HTTP 200 e 24 ou 22 identificadores únicos, respectivamente. Nenhum projeto atingiu o limiar de classificação.
- Configuração Cloudflare conferida sem ler segredos: Workers distintos, origens separadas, bindings de segredos em cada ambiente e `VOTING_DISABLED=true` em produção. Nas leituras de bootstrap, produção aceitou a origem GitHub Pages e recusou a origem local. QA recusou a origem GitHub Pages. Nenhum POST de avaliação foi enviado.
- O conflito com `main` em `src/App.tsx` foi resolvido preservando formulário e rankings integrados. A publicação deste workflow ficou restrita à `main`, em fila única, e verifica a origem exata do Worker de produção antes de consultar bootstrap e os dois rankings.
- Build com a configuração de produção e 31 testes locais aprovados. Auditoria sem vulnerabilidades e catálogo de 46 projetos validado.
- A variável de repositório `VITE_AVALIA_GATEWAY_URL` precisa estar presente antes do merge. A página de configuração do GitHub retornou 404 na sessão sem autenticação administrativa. Testes do site integrado já publicado e verificação final em sessão com múltiplas contas continuam pendentes.
