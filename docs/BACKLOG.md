# Backlog executável

| ID | História | Critérios de aceitação | Esforço | Responsável | Status |
|---|---|---|---|---|---|
| S1 | Catálogo e UX | 46 projetos, busca sem acento, filtros por modalidade/área/dia, detalhes, responsividade e navegação por hash | M | Equipe Web | IMPLEMENTADO; QA visual pendente |
| S2 | Regras e persistência | cálculo validado no servidor, Modelo B, hash SHA-256, LockService, idempotência, abas Sheets | L | Equipe Backend | PLANILHA REAL VERIFICADA; 46 projetos, configuração fechada e sem avaliações; runtime do Web App ainda não homologado |
| S3 | Ranking e liberação | agregados por modalidade, mínimo 5, empate determinístico, CI e Pages | M | Equipe QA/DevOps | BUILD PASS; URL `/exec` integrada ao artefato; deploy da branch corretamente bloqueado |
| QA-1 | Homologação conectada | voto, recibo, readback, duplicidade e ranking em navegador/Sheets reais | M | QA independente | NOT_RUN |
| QA-2 | Acessibilidade móvel | 320/375/768/1280 px, teclado, contraste, Android/iOS | M | QA independente | NOT_RUN |
