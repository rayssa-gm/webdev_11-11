# webdev_11-11

Repositório de estudos e práticas de desenvolvimento web.

## Sobre

Este repositório será utilizado para organizar atividades, exemplos e projetos desenvolvidos durante os estudos de desenvolvimento web.

## Integração ChatGPT + Google Apps Script + Google Sheets

Este repositório inclui um ponto de partida para um GPT personalizado criar planilhas, listar abas, ler intervalos e gravar linhas/células no Google Sheets.

- Código Apps Script: `apps-script/`
- Gateway autenticado para GPT Actions: `cloudflare-worker/`
- Schema OpenAPI do GPT: `openapi/gpt-action.yaml`
- Guia de instalação: `docs/SETUP.md`

**Importante:** a integração ainda precisa ser configurada nas suas contas Google, Cloudflare e ChatGPT. Nenhuma planilha ou implantação foi criada automaticamente nesta etapa. Siga o [guia de instalação](docs/SETUP.md).

---

## Projeto Universo IF Avalia

MVP acadêmico responsivo para catálogo e avaliação educativa dos 46 projetos da Mostra Nacional e da Mostra de Extensão do IFMA 2026.2. **Não é votação ou julgamento oficial do evento.**

- Frontend: React + Vite + TypeScript (`src/`).
- Catálogo versionado: `public/data/catalogo.json`.
- Backend específico do projeto: `backend/Code.gs` + `backend/Index.html`.
- Google Sheets: abas privadas Projetos, Codigos, Avaliacoes e Configuracao.
- GitHub Pages: workflow `.github/workflows/pages.yml`.
- Regras, pesos e QA: `docs/`.

O projeto anterior de integração genérica (Apps Script + Cloudflare Worker + GPT Action) foi preservado sem alterações. O backend em `backend/` é separado e exclusivo do Universo IF Avalia.

### Desenvolvimento do Universo IF Avalia

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Consulte:
- [Configuração Google do Universo IF Avalia](docs/CONFIGURAR_GOOGLE.md)
- [Auditoria do catálogo](docs/AUDITORIA_CATALOGO.md)
- [Backlog](docs/BACKLOG.md)
- [Testes e QA](docs/TESTES_E_QA.md)
- [Relatório de gates](docs/RELATORIO_QA.md)

**Status:** `MVP_READY_FOR_REVIEW`. O catálogo contém 46 projetos; 18/18 testes automatizados, typecheck e build estão aprovados no CI. A homologação conectada do Apps Script/Sheets está documentada como concluída: recibo/readback, bloqueio de duplicidade, Modelo B, concorrência, idempotência e ranking com amostra mínima 5. O QA móvel automatizado independente passou; a votação permanece `FECHADA`. A publicação Pages está restrita à branch `main` e a PR #1 continua Draft. Pendências: teste humano em aparelho Android/iOS, revisão visual dos 36 títulos restantes dos PDFs e autorização explícita para merge/publicação.
