# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Repositório `rayssa-gm/webdev_11-11` identificado; branch `feat/universo-if-avalia-mvp` ativa; escrita autorizada nesta conversa. |
| G1 — Catálogo | PASS | Validador aprovou 46 IDs únicos: 24 NAC + 22 EXT, campos obrigatórios, datas e proveniência. A conferência visual independente dos 46 títulos nos PDFs permanece como etapa de QA humano documentada em `AUDITORIA_CATALOGO.md`. |
| G2 — Interface, testes e build | PASS | GitHub Actions run **43633940351**: `npm ci`, typecheck, **18/18 testes**, validador do catálogo, `node --check` do Apps Script e build Vite concluídos com sucesso. |
| G3 — Backend offline | PASS | Testes automatizados exercitam Modelo B, repetição, token inválido, validação das notas, idempotência, ranking agregado e corrida simulada com mocks dos serviços Google. Isso não substitui o runtime real do Apps Script/Sheets. |
| G4 — Voto real + readback | PARTIAL / BLOCKED_CONNECTED_VOTE | Planilha real verificada diretamente: abas `Projetos`, `Codigos`, `Avaliacoes`, `Configuracao`; 46 projetos; `STATUS_VOTACAO=FECHADA`; `MIN_RANKING=5`; dois hashes de código cadastrados (um habilitado, um desabilitado); nenhuma avaliação registrada. Ainda falta validar a implantação real do Apps Script, recibo/readback, duplicidade e concorrência no runtime Google. |
| G5 — GitHub Actions / Pages | PASS_BUILD / NOT_DEPLOYED | O build e o artefato do Pages foram gerados com sucesso no run **43633940351**. O job de deploy foi **skipped** porque a branch atual é de desenvolvimento. Inspeção do artefato confirmou que `VITE_APPS_SCRIPT_URL` não está configurada: a UI ainda exibe a mensagem de integração pendente. |
| G6 — QA independente | NOT_RUN | Exige outra pessoa da equipe, conferência documental e teste completo em smartphone. |

## Evidências verificadas no CI

- Workflow: **Build and deploy GitHub Pages**.
- Run: **43633940351**.
- Commit verificado pelo run: `cc666592ff40ac1cfa94712aa250cd08c458f110`.
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

Para atingir homologação, ainda é obrigatório concluir G4 e G6: obter/validar a URL implantada do Web App (`/exec` e, para editores, `/dev`), configurar `VITE_APPS_SCRIPT_URL`, executar voto sintético com recibo e readback, verificar duplicidade e concorrência no ambiente real e realizar QA independente/mobile. A planilha real já foi verificada diretamente; o conteúdo/implantação do projeto Apps Script continua sem acesso de leitura direta por esta integração.

O roteiro operacional atualizado está em `docs/TESTES_E_QA.md` e a configuração manual do Google em `docs/CONFIGURAR_GOOGLE.md`.
