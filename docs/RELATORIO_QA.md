# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Conta conectada; `rayssa-gm/webdev_11-11`; branch autorizada `feat/universo-if-avalia-mvp`. |
| G1 — Catálogo | PASS | Validador Node aprovou 46 IDs únicos: 24 NAC + 22 EXT; JSON/CSV e PDFs do kit conferidos quanto a presença e número de páginas. |
| G2 — Interface, testes e build | PASS | GitHub Actions run 43617795374: `npm ci`, typecheck, 16/16 testes e build de produção concluídos com sucesso na branch de trabalho. |
| G3 — Backend offline | PASS | Código Apps Script executado em Node com mocks dos serviços Google; testes exercitam Modelo B, repetição, token inválido, notas, idempotência, ranking agregado e corrida simulada; sintaxe JS validada. Isso não substitui teste no runtime real do Google. |
| G4 — Voto real + readback | BLOCKED_CONNECTED_VOTE | Não há planilha nem implantação Apps Script criadas nesta etapa. Falta autorização separada para acesso anônimo e gravação de voto sintético. |
| G5 — GitHub Actions / Pages | PASS_BUILD / NOT_DEPLOYED | Build e artefato do Pages gerados com sucesso no run 43617795374. Deploy foi corretamente ignorado porque a branch é `feat/universo-if-avalia-mvp`; publicação em `main` não autorizada. |
| G6 — QA independente | NOT_RUN | Exige outra pessoa da equipe e teste em smartphone. |

## Evidências locais

- `node scripts/validar_catalogo.mjs`: PASS.
- `npm test`: 16 testes aprovados, 0 falhas (inclui quatro testes de execução simulada do Apps Script).
- `node --check` sobre `backend/Code.gs`: PASS (sintaxe JavaScript).
- `tsc --noEmit`: BLOCKED por dependências React/Vite ausentes; não equivale a falha funcional de tipos.
- `npm install`: interrompido pelo limite de execução do ambiente; sem `package-lock.json`.
- Build de produção: NOT_RUN.

Não classificar o sistema como homologado ou publicado. A verificação de gravação, recibo, bloqueio de duplicidade e readback no Google Sheets real ainda não ocorreu. O workflow obsoleto de importação automática do ZIP foi removido para impedir que ele sobrescreva fontes e tente fazer push com permissões insuficientes.
