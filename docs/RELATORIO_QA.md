# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Repositório `rayssa-gm/webdev_11-11` identificado; branch `feat/universo-if-avalia-mvp` ativa; escrita autorizada nesta conversa. |
| G1 — Catálogo | PASS | Validador aprovou 46 IDs únicos: 24 NAC + 22 EXT, campos obrigatórios, datas e proveniência. A conferência visual independente dos 46 títulos nos PDFs permanece como etapa de QA humano documentada em `AUDITORIA_CATALOGO.md`. |
| G2 — Interface, testes e build | PASS | GitHub Actions run **44159557349**: `npm ci`, typecheck, **18/18 testes**, validador do catálogo, `node --check` do Apps Script e build Vite concluídos com sucesso. QA responsivo automatizado passou em 320/375/768/1280 px. |
| G3 — Backend offline | PASS | Testes automatizados exercitam Modelo B, repetição, token inválido, validação das notas, idempotência, ranking agregado e corrida simulada com mocks dos serviços Google. Isso não substitui o runtime real do Apps Script/Sheets. |
| G4 — Voto real + readback | PARTIAL / CONNECTED_VOTE_PASS | Em 17/11/2026 o voto real sintético em `NAC-001` foi aceito com notas 4/5/4/3, nota ponderada 4,15 e estado `VALIDO`; nova tentativa no mesmo projeto não criou segunda linha; o mesmo código foi aceito em `NAC-002`, comprovando o Modelo B. Após cada janela, `STATUS_VOTACAO` voltou para `FECHADA`, código normal foi restaurado e código sintético desabilitado. Faltam idempotência/concorrência e ranking conectado com amostra mínima. |
| G5 — GitHub Actions / Pages | PASS_BUILD / URL_INTEGRATED / NOT_DEPLOYED | A URL `/exec` real está integrada ao build. GitHub Actions run **44159031990** passou com 18/18 testes, catálogo, sintaxe e build. O deploy continua corretamente `skipped` porque a branch não é `main`. O workflow manual de sincronização Apps Script via `clasp` foi preparado no commit `1a0ba2c583494808b4dad2facbf110a012e08f44`. |
| G6 — QA independente | PARTIAL / AUTOMATED_PASS / HUMAN_PENDING | QA técnico automatizado passou em 320/375/768/1280 px sem overflow, com links/navegação válidos, teclado funcional e contraste AA corrigido. Ainda exige teste humano independente em smartphone e conferência documental final. |

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

Para atingir homologação, ainda é obrigatório concluir G4 e G6: validar idempotência/concorrência no runtime Google real, validar o ranking conectado com amostra mínima e realizar QA humano independente/mobile. A URL `/exec` real já foi validada e integrada ao build da branch; a URL `/dev` não é acessível por esta ferramenta e pode exigir sessão de editor.

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
- G4 continua pendente apenas para a submissão real do formulário, recibo, readback e testes de duplicidade/concorrência no runtime Google.


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
- Pendências restantes do G4: idempotência/concorrência e ranking conectado com mínimo de 5 avaliações.
