# Relatório final de andamento — Universo IF Avalia

Atualização: 18/11/2026  
Branch de trabalho: `feat/universo-if-avalia-mvp`  
Repositório: `rayssa-gm/webdev_11-11`  
PR de revisão: #1 — Universo IF Avalia — MVP homologado para revisão final

## 1. Resumo executivo

O MVP do Universo IF Avalia está implementado e homologado no backend real do Google. O catálogo, a interface React/Vite/TypeScript, o Google Apps Script, o Google Sheets, a regra de voto Modelo B, a idempotência, a concorrência e o ranking conectado já foram testados com evidências reais.

A aplicação permanece em branch de homologação e a votação oficial continua fechada. O merge na `main` e a abertura pública da votação ainda não foram executados.

Neste momento, os principais bloqueios restantes são externos à implementação:
1. concluir a publicação temporária via GitHub Pages para o teste em aparelho físico;
2. executar o teste humano em Android/iOS;
3. fazer a conferência documental final contra os dois PDFs originais, que não estão acessíveis nesta conversa/biblioteca;
4. receber autorização explícita da equipe para merge/publicação definitiva.

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
- os PDFs `trabalhos-mostra-nacional-extensao.pdf` e `trabalhos-mostra-nacional.pdf` não estão acessíveis nesta conversa/biblioteca;
- portanto, a conferência visual final dos registros contra os PDFs continua pendente.

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
- **18/18 testes aprovados**.
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
- builda a branch de homologação;
- executa testes, typecheck, catálogo e build;
- foi temporariamente ajustado para permitir deploy da branch de homologação.

Situação:
- GitHub Pages foi habilitado pela proprietária;
- o build passa;
- o deploy ainda depende da regra do ambiente `github-pages` permitir a branch `feat/universo-if-avalia-mvp`;
- o workflow foi corrigido para separar a concorrência de runs `push` e `pull_request`, evitando que o PR cancele o run de publicação;
- commit da correção de concorrência: `23ff73718001a942320347095c24163ccc8dd3e5`;
- após a correção, o build do run de `push` passou, mas o job de deploy continuou recusado pelo ambiente, indicando que a regra administrativa ainda não havia sido aplicada/propagada naquele momento.

A publicação temporária é somente para QA; não equivale a abrir a votação oficial.

## 11. Gates

| Gate | Estado | Situação |
|---|---|---|
| G0 — GitHub/autorização | PASS | Repo e branch corretos; escrita autorizada |
| G1 — catálogo | PASS estrutural / revisão PDF pendente | 46 = 24 NAC + 22 EXT, sem duplicados |
| G2 — interface/testes/build | PASS | Frontend funcional e testado |
| G3 — backend offline | PASS | Regras, validações e testes aprovados |
| G4 — runtime conectado | PASS / CONNECTED_HOMOLOGATED | voto, readback, duplicidade, Modelo B, concorrência, idempotência e ranking |
| G5 — Pages | PARTIAL / DEPLOY_PENDING | build PASS; publicação temporária aguardando regra do ambiente |
| G6 — QA independente | PARTIAL / AUTOMATED_PASS | QA automatizado independente PASS; aparelho físico e revisão PDF pendentes |

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
1. A proprietária finalizar a regra do ambiente `github-pages` para permitir a branch de homologação.
2. Publicar e verificar a URL temporária do GitHub Pages.
3. Testar em aparelho físico Android e/ou iPhone.
4. Disponibilizar os dois PDFs originais para conferência documental final.

### Antes do merge
5. Registrar o resultado do teste físico no QA.
6. Conferir pelo menos 10 projetos diretamente contra os PDFs originais.
7. Confirmar CI final verde.
8. Remover/normalizar a permissão temporária de deploy da branch, se necessário.
9. Obter autorização explícita da equipe para merge/publicação definitiva.

### Somente depois da autorização final
10. Fazer merge da branch em `main`.
11. Verificar deploy definitivo do Pages.
12. Executar smoke test final do catálogo, avaliação e ranking.
13. Confirmar novamente `STATUS_VOTACAO=FECHADA`.
14. Abrir votação oficial somente quando a equipe autorizar explicitamente.

## 14. Roteiro para o teste físico

Quando a URL temporária estiver disponível:

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

**Estado atual recomendado:** `MVP_READY_FOR_REVIEW / CONNECTED_BACKEND_HOMOLOGATED`.

Ainda não usar `PUBLICADO_HOMOLOGADO` enquanto a URL do GitHub Pages e o teste humano em aparelho físico não estiverem concluídos.

Também não abrir a votação oficial antes da autorização explícita da equipe.
