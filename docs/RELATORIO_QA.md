# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Repositório `rayssa-gm/webdev_11-11` identificado; branch `feat/universo-if-avalia-mvp` ativa; escrita autorizada nesta conversa. |
| G1 — Catálogo | PASS | Validador aprovou 46 IDs únicos: 24 NAC + 22 EXT, campos obrigatórios, datas e proveniência. A conferência visual independente dos 46 títulos nos PDFs permanece como etapa de QA humano documentada em `AUDITORIA_CATALOGO.md`. |
| G2 — Interface, testes e build | PASS | GitHub Actions run **43633940351**: `npm ci`, typecheck, **18/18 testes**, validador do catálogo, `node --check` do Apps Script e build Vite concluídos com sucesso. |
| G3 — Backend offline | PASS | Testes automatizados exercitam Modelo B, repetição, token inválido, validação das notas, idempotência, ranking agregado e corrida simulada com mocks dos serviços Google. Isso não substitui o runtime real do Apps Script/Sheets. |
| G4 — Voto real + readback | PARTIAL / BLOCKED_CONNECTED_VOTE | Planilha real verificada diretamente: abas `Projetos`, `Codigos`, `Avaliacoes`, `Configuracao`; 46 projetos; `STATUS_VOTACAO=FECHADA`; `MIN_RANKING=5`; dois hashes de código cadastrados (um habilitado, um desabilitado); nenhuma avaliação registrada. Ainda falta validar a implantação real do Apps Script, recibo/readback, duplicidade e concorrência no runtime Google. |
| G5 — GitHub Actions / Pages | PASS_BUILD / URL_INTEGRATED / NOT_DEPLOYED | A URL `/exec` real do Apps Script foi validada e conectada ao build da branch. GitHub Actions run **43637104717** passou com 18/18 testes, catálogo, sintaxe e build; inspeção do artefato confirmou a URL `/exec` incorporada e ausência das mensagens de integração pendente. O deploy continua corretamente `skipped` porque a branch não é `main`. |
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

Para atingir homologação, ainda é obrigatório concluir G4 e G6: executar voto sintético com recibo e readback no runtime Google real, verificar duplicidade e concorrência, validar o ranking conectado e realizar QA independente/mobile. A URL `/exec` real já foi validada e integrada ao build da branch; a URL `/dev` não é acessível por esta ferramenta e pode exigir sessão de editor.

O roteiro operacional atualizado está em `docs/TESTES_E_QA.md` e a configuração manual do Google em `docs/CONFIGURAR_GOOGLE.md`.


## Evidência da integração com o Web App

- URL pública `/exec` respondeu com o título **Universo IF Avalia**.
- Commit de integração: `9ba542857f0f5aee5ac70122fea47bcda82d0854`.
- GitHub Actions run **43637104717**: **18/18 testes**, catálogo 46/46, checagem de sintaxe e build aprovados.
- O artefato `github-pages` contém a URL `/exec` real do Apps Script.
- As mensagens de fallback “Integração ainda não configurada” / “Integração pendente” não aparecem no bundle final.
- O job de deploy permaneceu **skipped**, pois a branch é de desenvolvimento.
