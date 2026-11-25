# Entrega técnica — Universo IF Avalia

25/11/2026 — candidato à entrega, aguardando aprovação institucional e liberação.

## Evidências

- Commit 8915e9b: execução local informada pela operadora, 24/24 testes, build TypeScript/Vite aprovado, npm audit sem vulnerabilidades detectadas. Aviso de autorização do postinstall esbuild não bloqueou build.
- QA isolado: voto válido, recibo, Modelo B, rejeição de duplicidade e código inválido, ranking com cinco avaliações, impressão com modalidade e mensagens amigáveis. Nove registros preservados e votação fechada conforme confirmação da operadora.
- Alternância rápida entre modalidades aprovada pela operadora em 25/11/2026.
- Commit 223d9f5: conferência visual assistida por IA dos 46 títulos com PDFs originais; 24 nacionais e 22 extensão. Sem divergências substantivas identificadas.

## Repasse

- Branch feat/universo-if-avalia-mvp; PR #1.
- Consultar docs/HOMOLOGACAO_QA_2026-11-25.md, docs/AUDITORIA_CATALOGO.md, docs/CONFIGURAR_GOOGLE.md e docs/SINCRONIZAR_APPS_SCRIPT.md.
- Para reproduzir: npm ci, npm test, npm run build, npm audit.
- Não compartilhar códigos, hashes, credenciais ou planilha privada publicamente.

## Liberação pendente

1. Aprovação humana do catálogo e da entrega acadêmica.
2. Revisão do PR, confirmação dos checks e autorização explícita de merge/publicação.
3. Confirmar backup, vínculo da planilha original e votação FECHADA antes de sincronizar backend e atualizar implantação existente.
4. Verificar catálogo, formulário fechado, ranking e impressão no ambiente definitivo; manter votação fechada até autorização específica.

Nenhuma implantação definitiva ou merge realizado nesta etapa. Os testes QA não substituem a verificação pós-implantação.

## Atualização após publicação — 25/11/2026

PR #1 integrado à main (8b8408e), publicação e sincronização confirmadas pela operadora. Implantação existente atualizada conforme relato. Fluxos públicos homologados conforme docs/HOMOLOGACAO_PRODUCAO_2026-11-25.md. Votação fechada na interface. Testes adicionais de servidor fechado e desempate adicionados em 978649a e aprovados na execução local do commit 749b162. Pendências: teste físico, aprovação institucional, confirmação de classificação com dados reais quando houver amostra e autorização específica de abertura. Não inserir votos fictícios em produção. As etapas de liberação acima são histórico, não instrução para repetir merge ou implantação.

## Evidência final de execução local

Saída do terminal fornecida pela operadora para main em 749b162: npm ci instalou 72 pacotes; npm test: 26 aprovados, zero falhas; typecheck e build Vite 6.4.6 aprovados (3,07 s); npm audit: zero vulnerabilidades detectadas. Aviso de allowScripts do esbuild não bloqueou execução. Fechamento no servidor e desempate aprovados em ambiente simulado, não por envio em produção. Teste físico e aprovação institucional permanecem pendentes; votação deve permanecer fechada.
