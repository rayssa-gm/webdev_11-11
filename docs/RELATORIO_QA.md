# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Repositório `rayssa-gm/webdev_11-11` identificado; branch `feat/universo-if-avalia-mvp` ativa; escrita autorizada nesta conversa. |
| G1 — Catálogo | PASS | Validador aprovou 46 IDs únicos: 24 NAC + 22 EXT, campos obrigatórios, datas e proveniência. A conferência visual independente dos 46 títulos nos PDFs permanece como etapa de QA humano documentada em `AUDITORIA_CATALOGO.md`. |
| G2 — Interface, testes e build | PASS | GitHub Actions run **44159557349**: `npm ci`, typecheck, **18/18 testes**, validador do catálogo, `node --check` do Apps Script e build Vite concluídos com sucesso. QA responsivo automatizado passou em 320/375/768/1280 px. |
| G3 — Backend offline | PASS | Testes automatizados exercitam Modelo B, repetição, token inválido, validação das notas, idempotência, ranking agregado e corrida simulada com mocks dos serviços Google. Isso não substitui o runtime real do Apps Script/Sheets. |
| G4 — Voto real + readback | PASS / CONNECTED_HOMOLOGATED | Runtime Google real homologado: voto e readback, bloqueio de duplicidade, Modelo B, concorrência, idempotência e ranking conectado. O ranking foi validado com 5 avaliações em `NAC-004`: média 4,36, critérios 4,20/4,40/4,60/4,20, elegível e posição #1; a interface pública exibiu o agregado esperado. Os 5 votos/códigos exclusivos desse teste foram removidos após a evidência e a votação voltou a `FECHADA`. |
| G5 — GitHub Actions / Pages | PASS_BUILD / URL_INTEGRATED / NOT_DEPLOYED | A URL `/exec` real está integrada ao build. GitHub Actions run **44159031990** passou com 18/18 testes, catálogo, sintaxe e build. O deploy continua corretamente `skipped` porque a branch não é `main`. O workflow manual de sincronização Apps Script via `clasp` foi preparado no commit `1a0ba2c583494808b4dad2facbf110a012e08f44`. |
| G6 — QA independente | PARTIAL / INDEPENDENT_AUTOMATED_PASS / PHYSICAL_DEVICE_PENDING | QA móvel independente no GitHub Actions run **44211122128** passou em 320x800, 360x800, 390x844 e 430x932 com contexto touch/mobile: sem overflow, filtros e detalhes funcionais, links do Apps Script corretos, alvos da navegação inferior com 46 px de altura, foco visível por teclado, zero erros JS e zero violações axe WCAG A/AA. O probe encontrou e levou à correção de um contraste insuficiente nos rótulos pequenos. Ainda falta teste humano em aparelho físico Android/iOS e conferência documental final. |

## Evidências verificadas no CI

- Workflow: **Build and deploy GitHub Pages**.
- Run: **44159557349**.
- Commit verificado pelo run: `1a0ba2c583494808b4dad2facbf110a012e08f44`.
- Job `build`: **success**.
- `npm ci --no-audit --no-fund`: **PASS**.
- `npm run typecheck`: **PASS**.
- `npm test`: **18 testes aprovados, 0 falhas**.
- `node scripts/validar_catalogo.mjs`: **PASS — 46 projetos únicos (24 Mostra Nacional, 22 Mostra de Extensão)**.
- `node --check < backend/Code.gs`: **PASS**.
- `npm run build`: **PASS**; artefato `github-pages` enviado.
- Job `deploy`: **skipped**, conforme regra do workflow que só publica a partir de `main`.

## Estado correto do projeto

O código está em estado **MVP_READY_FOR_REVIEW**, mas ainda não deve ser classificado como `PUBLICADO_HOMOLOGADO`.

G4 está concluído no runtime conectado. O QA móvel independente automatizado de G6 também passou; para a liberação final ainda faltam o teste humano em aparelho físico Android/iOS, a conferência documental final e a autorização da equipe para merge/publicação definitiva.

O roteiro operacional atualizado está em `docs/TESTES_E_QA.md` e a configuração manual do Google em `docs/CONFIGURAR_GOOGLE.md`.


## Evidência da integração com o Web App

- URL pública `/exec` respondeu com o título **Universo IF Avalia**.
- Commit de integração: `9ba542857f0f5aee5ac70122fea47bcda82d0854`.
- GitHub Actions run **43637104717**: **18/18 testes**, catálogo 46/46, checagem de sintaxe e build aprovados.
- O artefato `github-pages` contém a URL `/exec` real do Apps Script.
- As mensagens de fallback “Integração ainda não configurada” / “Integração pendente” não aparecem no bundle final.
- O job de deploy permaneceu **skipped**, pois a branch é de desenvolvimento.


## Tentativa de homologação conectada — 14/11/2026

- Autorização explícita recebida para teste sintético conectado.
- Planilha real preparada temporariamente com `STATUS_VOTACAO=ABERTA` e um código sintético exclusivo.
- O código previamente ativo foi desabilitado durante a janela de teste para evitar votos não controlados.
- Esta integração não consegue preencher/submeter o formulário HTML do Apps Script via `google.script.run`; por isso, nenhum voto foi enviado ao runtime.
- A janela foi encerrada imediatamente: `STATUS_VOTACAO=FECHADA`, código original reativado e código sintético desabilitado.
- A aba `Avaliacoes` permaneceu sem registros.
- Esta tentativa histórica foi posteriormente superada: o G4 foi concluído em 17/11/2026 com voto real, duplicidade, Modelo B, concorrência, idempotência e ranking conectado.


## QA responsivo automatizado — 17/11/2026

- 320x800: PASS, sem overflow horizontal, navegação mobile visível, 46 cartões.
- 375x812: PASS, sem overflow horizontal, navegação mobile visível, 46 cartões.
- 768x900: PASS, sem overflow horizontal, navegação desktop visível, 46 cartões.
- 1280x900: PASS, sem overflow horizontal, navegação desktop visível, 46 cartões.
- Altura mínima de botão visível no mobile: 44 px.
- Links de avaliação e ranking apontam para a implantação `/exec`.
- Nenhum erro de JavaScript observado no carregamento/teste.
- O defeito de overflow dos filtros em 320/375 px foi corrigido no commit `715b85997cf7bbd4e9768b7ee3ea58483f99799c`.

## Segurança após tentativa de homologação

Em 17/11/2026 foi constatado que a janela de homologação havia permanecido `ABERTA` desde 14/11. A configuração foi corrigida imediatamente: `STATUS_VOTACAO=FECHADA`, código sintético desabilitado, código original restaurado e a aba `Avaliacoes` permaneceu vazia.


## QA de teclado e contraste — 17/11/2026

- Ordem de foco por Tab validada em 375 px e 1280 px.
- Cartões de projeto abrem por teclado com Enter.
- Nenhum foco visível apontou para elemento com dimensão zero.
- Contraste verde/branco: 12,04:1.
- Contraste lima/verde: 9,49:1.
- Contraste do texto muted sobre fundo claro passou de 4,24:1 para aproximadamente 4,61:1 após o commit `43cd9c93f9caf4c0791a1f56d02b502510b03d3b`.
- GitHub Actions run **44159557349**: build **success**; deploy **skipped** por permanecer na branch de desenvolvimento.


## Homologação conectada — voto real, duplicidade e Modelo B — 17/11/2026

- Voto sintético real em `NAC-001`: **PASS**.
- Notas gravadas: 4 / 5 / 4 / 3.
- Nota ponderada gravada: **4,15**.
- Estado da avaliação: **VALIDO**.
- Readback da linha na aba privada `Avaliacoes`: **PASS**.
- Segunda tentativa do mesmo código em `NAC-001`: **PASS — duplicidade bloqueada**, sem nova linha.
- Mesmo código reutilizado em `NAC-002`: **PASS — Modelo B comprovado**, com segunda linha válida.
- Estado de segurança ao final: `STATUS_VOTACAO=FECHADA`, código normal restaurado e código sintético desabilitado.
- G4 concluído após a homologação conectada do ranking com 5 avaliações.


## Homologação conectada — concorrência — 17/11/2026

- Duas submissões foram disparadas em paralelo pelo usuário para o mesmo código sintético e o mesmo projeto `NAC-003`.
- Resultado na aba `Avaliacoes`: **apenas uma** nova linha válida.
- Projeto: `NAC-003`.
- Notas: 5 / 5 / 5 / 5.
- Nota ponderada: **5,00**.
- Estado: **VALIDO**.
- Evidência operacional: não houve gravação dupla para o mesmo par código/projeto durante as tentativas concorrentes.
- Estado de segurança ao final: `STATUS_VOTACAO=FECHADA`, código normal restaurado e código sintético de concorrência desabilitado.
- A idempotência foi posteriormente comprovada no runtime real no GitHub Actions run **44209294761**.


## Homologação conectada — idempotência — 17/11/2026

- Teste executado contra o Web App público no runtime Google real.
- A votação permaneceu **FECHADA** durante todo o teste.
- Foi usada uma fixture temporária com estado `TESTE_IDEMPOTENCIA`, que não entra no ranking público.
- A mesma combinação de `id_requisicao`, código sintético e projeto foi reenviada ao `submitVote`.
- GitHub Actions run **44209294761**: **success**.
- Resposta do runtime: `ok=true`, `idempotent=true`, mesmo recibo e nota **4,15**.
- A fixture foi removida imediatamente após a validação.
- Nenhum voto válido adicional foi criado pelo teste de idempotência.
- Estado de segurança ao final: `STATUS_VOTACAO=FECHADA`; apenas o código normal permanece habilitado.


## Homologação conectada — ranking público — 17/11/2026

- Teste executado contra o Web App público e a planilha real.
- Foram usados 5 códigos sintéticos exclusivos, com o código normal desabilitado durante a janela.
- Projeto-alvo: `NAC-004`.
- Notas ponderadas gravadas: **5,00 / 4,00 / 4,15 / 3,95 / 4,70**.
- Total do projeto no ranking: **5 avaliações**.
- Média agregada: **4,36**.
- Médias por critério: **4,20 / 4,40 / 4,60 / 4,20**.
- Elegibilidade: **true**, atendendo `MIN_RANKING=5`.
- Posição calculada: **#1** entre os projetos elegíveis.
- A interface pública do ranking exibiu **4,36 / 5 · 5 avaliações**.
- GitHub Actions run **44210018945**: **success**.
- Resultado do probe: `RANKING_HOMOLOGATION_PASS`.
- Após a evidência, a votação voltou para `FECHADA`, o código normal foi restaurado, os 5 códigos sintéticos foram desabilitados e os 5 votos/códigos exclusivos do ranking foram removidos da planilha.
- **G4: PASS / CONNECTED_HOMOLOGATED**.


## QA móvel independente ampliado — 17/11/2026

- Execução independente no GitHub Actions run **44211122128**: **PASS**.
- Build local da branch testado sem deploy e com a URL real do Apps Script injetada.
- Contexto de navegador móvel/touch validado em **320x800**, **360x800**, **390x844** e **430x932**.
- Sem overflow horizontal em nenhuma largura.
- Navegação inferior móvel visível e navegação desktop oculta nas larguras testadas.
- Alvos da navegação inferior medidos com **46 px de altura**.
- Busca por título validada; busca por `AGROSENTINELA` retornou 1 de 46.
- Filtro `Mostra de Extensão` retornou **22 projetos**.
- Abertura de detalhes e CTA `Avaliar este projeto` validados.
- Links de avaliação e ranking confirmados apontando para o Web App real, com projeto/modalidade preservados.
- Sequência de Tab confirmou foco visível nos controles e cartões.
- Varredura axe WCAG A/AA: **0 violações** nas quatro larguras após correção.
- Erros JavaScript/console: **0**.
- O primeiro probe detectou contraste insuficiente em `.prototype` / `.eyebrow` (`#6e866e` sobre fundo claro, ~3,68:1). Corrigido no commit `fcbbcf95220a228b9926494623650939dbfebaa1` para `var(--muted)`, ~4,61:1 no fundo claro.
- Limitação restante: esta evidência usa emulação Chromium; não substitui interação humana em aparelho físico Android/iOS.
