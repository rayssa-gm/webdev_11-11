# Testes e QA

## Automatizados
- Catálogo: 46 IDs únicos, 24 NAC + 22 EXT, campos, datas e proveniência.
- Domínio: busca acento-insensível e cálculo [4,5,4,3] = 4,15.
- Validação de escala: notas ausentes, decimais e fora de 1–5 rejeitadas.
- Backend: validação no servidor, hash do token, Modelo B, LockService, idempotência, ranking agregado e corrida simulada.
- CI da branch: GitHub Actions executa `npm ci`, typecheck, 18 testes automatizados, validador do catálogo, verificação de sintaxe do Apps Script e build de produção.

## Roteiro de homologação conectada (obrigatório)
1. Siga `docs/CONFIGURAR_GOOGLE.md`: crie/configure a planilha privada usando temporariamente a função administrativa `setupForHomologation()` indicada naquele guia.
2. Execute `setupForHomologation()` no editor do Apps Script, copie o token sintético exibido no log e mantenha-o privado. Somente o hash deve permanecer na aba `Codigos`.
3. Remova a função temporária `setupForHomologation()` de `Code.gs` antes de qualquer implantação.
4. Na aba `Configuracao`, mantenha `STATUS_VOTACAO=FECHADA` durante a configuração. Altere para `ABERTA` somente durante o teste autorizado.
5. Implante o Web App como proprietário; permita acesso anônimo somente após autorização da equipe e se a política Google Workspace permitir. Se indisponível, marque `BLOQUEADO_ACESSO_PUBLICO`.
6. Em navegador anônimo, submeta o token sintético para `NAC-001`. Confirme recibo inequívoco.
7. Repita token + `NAC-001` com novo ID de requisição: deve retornar `VOTO_DUPLICADO` e não criar nova linha.
8. Reutilize o mesmo token em `NAC-002`: deve aceitar, comprovando o Modelo B.
9. Confira as linhas na aba privada `Avaliacoes` e faça o readback do recibo; não compartilhe a planilha.
10. Use apenas dados sintéticos de homologação para obter cinco avaliações em um projeto e validar ranking, média, contagem, amostra mínima e separação por modalidade.
11. Tente duas submissões simultâneas do mesmo par token + projeto; exatamente uma deve ser gravada.
12. Repita o fluxo em smartphone e confira foco, teclado, contraste e largura em 320, 375, 768 e 1280 px.
13. Ao terminar, retorne `STATUS_VOTACAO` para `FECHADA` até existir autorização explícita para qualquer demonstração pública.

## Estado de execução
- Último CI verificado na branch `feat/universo-if-avalia-mvp`: run **44159031990**, concluído com sucesso.
- Testes automatizados: **18 aprovados, 0 falhas**.
- Validador do catálogo: **PASS — 46 projetos únicos (24 Mostra Nacional, 22 Mostra de Extensão)**.
- Typecheck, sintaxe de `backend/Code.gs` e build Vite: **PASS**.
- QA responsivo automatizado: **PASS** em 320, 375, 768 e 1280 px, sem overflow horizontal; navegação e links Apps Script válidos; sem erros de JavaScript.
- Planilha real: verificada com 4 abas, 46 projetos, `MIN_RANKING=5`, `STATUS_VOTACAO=FECHADA` em 17/11/2026 e nenhuma avaliação registrada.
- Web App `/exec`: validado e integrado ao build.
- Homologação conectada: **PARTIAL / BLOCKED_CONNECTED_SUBMISSION** — o envio real via `google.script.run`, recibo/readback, duplicidade, Modelo B e concorrência ainda precisam ser executados no navegador real.
- Sincronização GitHub → Apps Script: workflow manual com `clasp` preparado; execução remota depende dos secrets privados `APPS_SCRIPT_ID` e `CLASPRC_JSON`.
