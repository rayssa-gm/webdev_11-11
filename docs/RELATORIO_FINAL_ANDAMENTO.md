# Relatório final de andamento — Universo IF Avalia

Atualização: 25/11/2026
Linha oficial atual: `main`
Repositório: `rayssa-gm/webdev_11-11`  
PR #1 — integrado à `main` em 25/11/2026

## 1. Resumo executivo

O MVP do Universo IF Avalia está implementado e homologado no backend real do Google. O catálogo, a interface React/Vite/TypeScript, o Google Apps Script, o Google Sheets, a regra de voto Modelo B, a idempotência, a concorrência e o ranking conectado já foram testados com evidências reais.

A aplicação já foi integrada à `main` e está publicada no GitHub Pages. A votação oficial continua fechada.

Neste momento, os principais pontos restantes são:
1. retestar em Android físico as novas alternativas de acesso ao Apps Script;
2. testar Safari/iOS se houver aparelho disponível;
3. obter aprovação institucional antes de abrir a votação oficial.

## 2. Arquitetura implementada

- Frontend: React + Vite + TypeScript.
- Hospedagem prevista: GitHub Pages.
- Backend: Google Apps Script.
- Persistência: Google Sheets.
- Banco de dados adicional: nenhum.
- Login de visitantes: nenhum.
- Roteamento: compatível com hospedagem estática.
- Web App do Apps Script: integrado ao frontend pela URL pública `/exec`.
- Votação oficial: fechada durante homologação.

## 3. Catálogo e conteúdo

- Total: **46 projetos**.
- Mostra Nacional: **24** (`NAC-001` a `NAC-024`).
- Mostra de Extensão: **22** (`EXT-001` a `EXT-022`).
- IDs duplicados: **0**.
- Campos obrigatórios: validados.
- Busca acento-insensível: implementada.
- Filtros por modalidade, área temática e data: implementados.
- Detalhes, horários e locais: implementados.
- Layout responsivo: implementado.
- Consistência catálogo versionado × aba `Projetos` do Google Sheets: **46/46 projetos, 0 divergências em 9 campos públicos**.
- `src/catalogo.json`, `public/data/catalogo.json` e `universo_if_catalogo_46_projetos_v1.0.json`: **idênticos, 46 projetos em cada cópia**.

Pendência documental:
- os dois PDFs foram reabertos a partir do kit anexado em 24/11/2026;
- amostra visual de `EXT-001` a `EXT-005` e `NAC-001` a `NAC-005`: 10 títulos conferidos, sem divergências;
- a revisão dos 36 títulos restantes continua pendente; detalhes em `docs/AUDITORIA_CATALOGO.md`.

## 4. Avaliação e regras de voto

Critérios:
- Criatividade e inovação: 30%.
- Clareza da apresentação: 30%.
- Relevância e impacto: 25%.
- Demonstração e resultados: 15%.

Validações:
- notas inteiras de 1 a 5;
- cálculo ponderado no servidor;
- caso de referência `[4,5,4,3]` = **4,15**;
- token armazenado por hash;
- unicidade por par `(código, projeto)`;
- `LockService` para concorrência;
- `id_requisicao` para idempotência;
- votação fechada impede novos votos;
- ranking usa somente avaliações válidas.

## 5. Google Sheets real

Abas verificadas:
- `Projetos`
- `Codigos`
- `Avaliacoes`
- `Configuracao`

Estado seguro verificado em 18/11/2026:
- `STATUS_VOTACAO = FECHADA`;
- `MIN_RANKING = 5`;
- catálogo versionado como `universo-if-catalogo-v1.0`;
- apenas o código normal está habilitado;
- códigos sintéticos usados em homologação estão desabilitados;
- os dados sintéticos exclusivos do teste de ranking foram removidos;
- permanecem 3 avaliações reais de homologação anteriores (`NAC-001`, `NAC-002`, `NAC-003`).

## 6. Homologação conectada real

### Voto e readback — PASS
- voto real sintético em `NAC-001`;
- notas 4/5/4/3;
- nota ponderada 4,15;
- estado `VALIDO`;
- linha confirmada na planilha.

### Duplicidade — PASS
- mesma combinação código + `NAC-001` reenviada;
- nenhuma nova linha criada.

### Modelo B — PASS
- o mesmo código foi aceito em `NAC-002`;
- comprovado: um código pode avaliar projetos diferentes, mas não o mesmo projeto duas vezes.

### Concorrência — PASS
- duas submissões quase simultâneas para o mesmo código + `NAC-003`;
- exatamente uma avaliação foi gravada;
- nota 5,00.

### Idempotência — PASS
- o mesmo `id_requisicao` foi reapresentado no runtime real;
- resposta `idempotent=true`;
- mesmo recibo e mesma nota 4,15;
- nenhuma avaliação válida adicional criada.
- GitHub Actions run: **44209294761**.

### Ranking conectado — PASS
Projeto de homologação: `NAC-004`.

Cinco avaliações sintéticas exclusivas:
- 5,00
- 4,00
- 4,15
- 3,95
- 4,70

Resultado:
- total: **5 avaliações**;
- média: **4,36**;
- critérios: **4,20 / 4,40 / 4,60 / 4,20**;
- elegível: **sim**;
- posição: **#1**;
- interface pública exibiu `4,36 / 5 · 5 avaliações`.
- GitHub Actions run: **44210018945**.
- dados sintéticos exclusivos do ranking removidos após o teste.

## 7. Testes automatizados e QA

### Suite principal
- **26/26 testes aprovados**.
- typecheck: PASS.
- validador do catálogo: PASS.
- sintaxe do Apps Script: PASS.
- build Vite: PASS.

### Responsividade
Testes anteriores:
- 320 px: PASS.
- 375 px: PASS.
- 768 px: PASS.
- 1280 px: PASS.

QA móvel independente ampliado:
- 320x800: PASS.
- 360x800: PASS.
- 390x844: PASS.
- 430x932: PASS.

Verificações:
- zero overflow horizontal;
- busca e filtros;
- detalhes;
- navegação mobile;
- links para avaliação e ranking;
- foco por teclado;
- alvos de toque da navegação inferior com 46 px;
- zero erros JavaScript;
- axe WCAG A/AA: zero violações após correção.

### Correção de acessibilidade encontrada pelo QA
O probe independente detectou contraste insuficiente em `.prototype` / `.eyebrow` (~3,68:1).  
Correção aplicada no commit:
`fcbbcf95220a228b9926494623650939dbfebaa1`

Após a correção, contraste aproximado: 4,61:1 no fundo claro.

Run do QA móvel independente:
**44211122128 — success**.

## 8. Segurança pré-publicação

Auditoria do diff do PR executada.

Não foram encontrados:
- tokens sintéticos em texto puro;
- link administrativo da planilha;
- ID administrativo do Apps Script;
- credenciais;
- chaves privadas;
- segredos GitHub/Google.

A URL pública `/exec` do Web App está no build de forma intencional.

A planilha e os dados administrativos permanecem privados.

## 9. GitHub e revisão

Branch:
`feat/universo-if-avalia-mvp`

PR draft:
**#1 — Universo IF Avalia — MVP homologado para revisão final**

Estado:
- aberto;
- draft;
- sem merge;
- mergeable;
- base: `main`;
- checklist de segurança e publicação incluído.

O PR não deve ser mesclado até o teste físico, a revisão documental final e autorização explícita da equipe.

## 10. GitHub Pages

O workflow de Pages:
- executa testes, typecheck, validação do catálogo e build nas branches de trabalho e em PRs;
- publica somente a partir da branch `main`, após merge autorizado;
- a alteração foi registrada no commit `3b06252de1941d9ff0ddee40d6ff14e15be5a684`.

Situação:
- GitHub Pages foi habilitado pela proprietária;
- CI da branch: run `45518706578` (push do commit `3b06252de1941d9ff0ddee40d6ff14e15be5a684`) concluiu `build: success`; o job `deploy` ficou `skipped`, conforme a nova regra que restringe publicação a `main`;
- execução da PR para o mesmo commit também executa build, sem publicar;
- o deploy definitivo só ocorrerá após autorização explícita e merge em `main`.

A publicação temporária é somente para QA; não equivale a abrir a votação oficial.

## 11. Gates

| Gate | Estado | Situação |
|---|---|---|
| G0 — GitHub/autorização | PASS | Repo e branch corretos; escrita autorizada |
| G1 — catálogo | PASS estrutural / amostra visual 10 de 46 | 46 = 24 NAC + 22 EXT, sem duplicados; 10 títulos conferidos sem divergências, 36 restantes pendentes |
| G2 — interface/testes/build | PASS | Frontend funcional e testado |
| G3 — backend offline | PASS | Regras, validações e testes aprovados |
| G4 — runtime conectado | PASS / CONNECTED_HOMOLOGATED | voto, readback, duplicidade, Modelo B, concorrência, idempotência e ranking |
| G5 — Pages | BUILD_PASS / DEPLOY_RESTRICTED_TO_MAIN | build PASS; deploy da branch de trabalho intencionalmente bloqueado; publicação após merge autorizado |
| G6 — QA independente | PARTIAL / AUTOMATED_PASS | QA automatizado independente PASS; aparelho físico e revisão dos 36 títulos restantes pendentes |

## 12. O que já está pronto

- catálogo completo no sistema;
- interface responsiva;
- busca e filtros;
- detalhes de projetos;
- fluxo de avaliação;
- pesos e cálculo;
- backend Apps Script;
- Google Sheets real;
- código por hash;
- Modelo B;
- bloqueio de duplicidade;
- concorrência;
- idempotência;
- ranking por modalidade;
- mínimo de 5 avaliações;
- QA automatizado;
- QA móvel independente;
- correções de acessibilidade;
- CI;
- auditoria de segurança;
- documentação;
- PR final em draft.

## 13. O que falta fazer

### Dependências externas/imediatas
1. Obter autorização explícita para merge/publicação em `main`.
2. Após o merge autorizado, verificar a URL publicada do GitHub Pages.
3. Testar em aparelho físico Android e/ou iPhone, sem enviar voto oficial.
4. Revisar visualmente os 36 títulos restantes dos PDFs.

### Antes do merge
5. Registrar o resultado do teste físico no QA.
6. Registrar a revisão dos 36 títulos restantes.
7. Confirmar CI final verde após todas as atualizações.
8. Obter autorização explícita da equipe para merge/publicação definitiva.

### Somente depois da autorização final
10. Fazer merge da branch em `main`.
11. Verificar deploy definitivo do Pages.
12. Executar smoke test final do catálogo, avaliação e ranking.
13. Confirmar novamente `STATUS_VOTACAO=FECHADA`.
14. Abrir votação oficial somente quando a equipe autorizar explicitamente.

## 14. Roteiro para o teste físico

Após a publicação autorizada em `main`:

1. abrir no Chrome Android ou Safari iOS;
2. confirmar os 46 projetos;
3. buscar `AGROSENTINELA`;
4. filtrar Mostra de Extensão e confirmar 22 projetos;
5. abrir detalhes de um projeto;
6. acessar `Avaliar este projeto` e confirmar abertura do Apps Script com o projeto correto;
7. acessar Ranking e alternar modalidade;
8. verificar barra inferior, tamanho dos botões, textos, rolagem e ausência de corte lateral;
9. não enviar voto oficial durante esse teste — a votação deve permanecer fechada.

## 15. Estado de liberação

**Estado atual recomendado:** `MVP_PUBLICADO / CONNECTED_BACKEND_HOMOLOGATED / VOTACAO_FECHADA`.

O GitHub Pages está publicado e o backend está homologado. Ainda há ressalva de compatibilidade com sessão Google em Android normal; guia anônima funcionou e a mitigação foi publicada.

Também não abrir a votação oficial antes da autorização explícita da equipe.


## 16. Retomada de execução — 24/11/2026

- Conta GitHub autenticada: `rayssa-gm`; permissões de escrita no repositório confirmadas.
- PR #1 permanece Draft, aberta e sem merge.
- PDF original anexado foi reaberto; 10 títulos foram conferidos visualmente sem divergências; 36 aguardam revisão humana.
- Documentação de auditoria e gates atualizada.
- Workflow Pages ajustado para publicar somente a partir de `main`; commits na branch de trabalho não publicam o site.
- CI de push do commit `3b06252de1941d9ff0ddee40d6ff14e15be5a684`: build success, deploy skipped intencionalmente.
- A votação permanece fechada conforme a última evidência registrada; nenhuma abertura de votação ou novo voto foi realizado nesta retomada.
- O projeto continua em `MVP_READY_FOR_REVIEW`, não em `PUBLICADO_HOMOLOGADO`.


## 17. Atualização após merge e publicação — 25/11/2026

- PR #1 foi integrado à `main` no commit `8b8408efbe7f7fcee0d7a1e95e0e78f02ef761fc`.
- Site publicado: `https://rayssa-gm.github.io/webdev_11-11/`.
- GitHub Actions run `45610275861`: build **success**, deploy **success**.
- Workflow de sincronização do Apps Script também teve execução bem-sucedida.
- Suíte atual do CI: **26 testes aprovados, 0 falhas**.
- Conferência técnica dos 46 projetos contra os PDFs concluída sem divergências substantivas.
- Teste Android físico confirmou responsividade nas telas Avaliar e Ranking.
- Em sessão normal do Chrome Android houve erro de acesso Google; os dois serviços abriram em guia anônima.
- A interface publicou alternativas de acesso: abrir na mesma guia, copiar link e endereço direto.
- Planilha principal permanece com `STATUS_VOTACAO=FECHADA`.
- Pendências reais: reteste físico das mitigações, Safari/iOS se disponível e aprovação institucional antes de abrir a votação.
