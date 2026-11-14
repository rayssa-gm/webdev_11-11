# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Repositório `rayssa-gm/webdev_11-11` identificado; branch `feat/universo-if-avalia-mvp` ativa; escrita autorizada nesta conversa. |
| G1 — Catálogo | PASS | Validador aprovou 46 IDs únicos: 24 NAC + 22 EXT, campos obrigatórios, datas e proveniência. A conferência visual independente dos 46 títulos nos PDFs permanece como etapa de QA humano documentada em `AUDITORIA_CATALOGO.md`. |
| G2 — Interface, testes e build | PASS | GitHub Actions run **43618034230**: `npm ci`, typecheck, **16/16 testes**, validador do catálogo, `node --check` do Apps Script e build Vite concluídos com sucesso. |
| G3 — Backend offline | PASS | Testes automatizados exercitam Modelo B, repetição, token inválido, validação das notas, idempotência, ranking agregado e corrida simulada com mocks dos serviços Google. Isso não substitui o runtime real do Apps Script/Sheets. |
| G4 — Voto real + readback | BLOCKED_CONNECTED_VOTE | Ainda falta planilha privada configurada, implantação real do Apps Script e autorização específica para executar voto sintético conectado e conferir o readback no Sheets. |
| G5 — GitHub Actions / Pages | PASS_BUILD / NOT_DEPLOYED | O build e o artefato do Pages foram gerados com sucesso no run **43618034230**. O job de deploy foi **skipped** por projeto porque a branch atual é de desenvolvimento; publicação em `main` ainda não foi autorizada. |
| G6 — QA independente | NOT_RUN | Exige outra pessoa da equipe, conferência documental e teste completo em smartphone. |

## Evidências verificadas no CI

- Workflow: **Build and deploy GitHub Pages**.
- Run: **43618034230**.
- Commit verificado pelo run: `db6962b0ce55577f9025d02f67598195617be09e`.
- Job `build`: **success**.
- `npm ci --no-audit --no-fund`: **PASS**.
- `npm run typecheck`: **PASS**.
- `npm test`: **16 testes aprovados, 0 falhas**.
- `node scripts/validar_catalogo.mjs`: **PASS — 46 projetos únicos (24 Mostra Nacional, 22 Mostra de Extensão)**.
- `node --check < backend/Code.gs`: **PASS**.
- `npm run build`: **PASS**; artefato `github-pages` enviado.
- Job `deploy`: **skipped**, conforme regra do workflow que só publica a partir de `main`.

## Estado correto do projeto

O código está em estado **MVP_READY_FOR_REVIEW**, mas ainda não deve ser classificado como `PUBLICADO_HOMOLOGADO`.

Para atingir homologação, ainda é obrigatório concluir G4 e G6: criar/configurar o Google Sheets privado, implantar o Apps Script com a política de acesso autorizada, executar voto sintético com recibo e readback, verificar duplicidade e concorrência no ambiente real e realizar QA independente/mobile.

O roteiro operacional atualizado está em `docs/TESTES_E_QA.md` e a configuração manual do Google em `docs/CONFIGURAR_GOOGLE.md`.
