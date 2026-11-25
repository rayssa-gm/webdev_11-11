# Backlog executável

| ID | História | Critérios de aceitação | Esforço | Responsável | Status |
|---|---|---|---|---|---|
| S1 | Catálogo e UX | 46 projetos, busca sem acento, filtros por modalidade/área/dia, detalhes, responsividade e navegação por hash | M | Equipe Web | IMPLEMENTADO; catálogo 46/46 revisado tecnicamente com PDFs; aprovação institucional humana ainda recomendada |
| S2 | Regras e persistência | cálculo validado no servidor, Modelo B, hash SHA-256, LockService, idempotência, abas Sheets | L | Equipe Backend | RUNTIME REAL HOMOLOGADO; voto/readback, Modelo B, duplicidade, concorrência e idempotência PASS; configuração final fechada |
| S3 | Ranking e liberação | agregados por modalidade, mínimo 5, empate determinístico, CI e Pages | M | Equipe QA/DevOps | PUBLICADO; GitHub Pages e Apps Script integrados; ranking homologado; 26/26 testes; votação oficial ainda FECHADA |
| QA-1 | Homologação conectada | voto, recibo, readback, duplicidade e ranking em navegador/Sheets reais | M | QA independente | PASS; voto, recibo/readback, duplicidade, Modelo B, concorrência, idempotência e ranking real homologados |
| QA-2 | Acessibilidade móvel | 320/375/768/1280 px, teclado, contraste, Android/iOS | M | QA independente | AUTOMATED PASS + ANDROID PARCIAL; sessão anônima abre Avaliar/Ranking; mitigação de acesso publicada; reteste físico e iOS ainda pendentes |
