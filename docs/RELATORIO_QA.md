# Relatório de gates — Universo IF Avalia

| Gate | Estado | Evidência / bloqueio |
|---|---|---|
| G0 — GitHub e autorização | PASS | Conta conectada; `rayssa-gm/webdev_11-11`; branch autorizada `feat/universo-if-avalia-mvp`. |
| G1 — Catálogo | PASS | Validador Node aprovou 46 IDs únicos: 24 NAC + 22 EXT; JSON/CSV e PDFs do kit conferidos quanto a presença e número de páginas. |
| G2 — Interface e testes | BLOCKED_BUILD | Interface React/Vite/TS implementada; 16 testes automatizados passam. Instalação de dependências foi interrompida pelo ambiente; build/typecheck completo não foi concluído. |
| G3 — Backend offline | PASS | Código Apps Script executado em Node com mocks dos serviços Google; testes exercitam Modelo B, repetição, token inválido, notas, idempotência, ranking agregado e corrida simulada; sintaxe JS validada. Isso não substitui teste no runtime real do Google. |
| G4 — Voto real + readback | BLOCKED_CONNECTED_VOTE | Não há planilha nem implantação Apps Script criadas nesta etapa. Falta autorização separada para acesso anônimo e gravação de voto sintético. |
| G5 — GitHub Actions / Pages | BLOCKED_DEPLOY | Workflow incluído no pacote local, mas arquivos ainda não foram transferidos para branch nem executados no GitHub. Publicação não autorizada. |
| G6 — QA independente | NOT_RUN | Exige outra pessoa da equipe e teste em smartphone. |

## Evidências locais

- `node scripts/validar_catalogo.mjs`: PASS.
- `npm test`: 16 testes aprovados, 0 falhas (inclui quatro testes de execução simulada do Apps Script).
- `node --check` sobre `backend/Code.gs`: PASS (sintaxe JavaScript).
- `tsc --noEmit`: BLOCKED por dependências React/Vite ausentes; não equivale a falha funcional de tipos.
- `npm install`: interrompido pelo limite de execução do ambiente; sem `package-lock.json`.
- Build de produção: NOT_RUN.

Não classificar o sistema como homologado ou publicado. A verificação de gravação, recibo, bloqueio de duplicidade e readback no Sheets ainda não ocorreu.
