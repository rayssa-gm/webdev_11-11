# Testes e QA

## Automatizados
- Catálogo: 46 IDs únicos, 24 NAC + 22 EXT, campos, datas e proveniência.
- Domínio: busca acento-insensível e cálculo [4,5,4,3] = 4,15.
- Validação de escala: notas ausentes, decimais e fora de 1–5 rejeitadas.
- Backend: validação no servidor, hash do token, Modelo B, LockService, idempotência, ranking agregado e corrida simulada.
- CI da `main`: GitHub Actions executa `npm ci`, typecheck, **26 testes automatizados**, validador do catálogo, verificação de sintaxe do Apps Script, build e deploy do GitHub Pages.

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
- CI da branch segue obrigatório após cada atualização; a homologação conectada do ranking passou no run **44210018945**.
- Testes automatizados atuais: **26 aprovados, 0 falhas**.
- Validador do catálogo: **PASS — 46 projetos únicos (24 Mostra Nacional, 22 Mostra de Extensão)**.
- Typecheck, sintaxe de `backend/Code.gs` e build Vite: **PASS**.
- QA responsivo/acessibilidade automatizado: **PASS** em 320, 375, 768 e 1280 px. Uma segunda rodada independente em contexto móvel/touch também passou em 320x800, 360x800, 390x844 e 430x932 no GitHub Actions run **44211122128**, com zero overflow, zero erros JS e zero violações axe WCAG A/AA após correção adicional de contraste nos rótulos `.prototype` / `.eyebrow`.
- Planilha real: verificada com 4 abas, 46 projetos, `MIN_RANKING=5` e `STATUS_VOTACAO=FECHADA`; após a homologação do ranking, os 5 votos/códigos exclusivos desse teste foram removidos. Permanecem apenas as 3 avaliações anteriores de homologação.
- Web App `/exec`: validado e integrado ao build.
- Homologação conectada: **PASS / CONNECTED_HOMOLOGATED** — voto e recibo/readback, duplicidade, Modelo B, concorrência, idempotência e ranking com 5 avaliações foram comprovados no runtime Google real. Ranking de `NAC-004`: média 4,36, critérios 4,20/4,40/4,60/4,20, elegível, posição #1 e interface pública validada. GitHub Actions run **44210018945**: success.
- Sincronização GitHub → Apps Script: workflow manual com `clasp` preparado; execução remota depende dos secrets privados `APPS_SCRIPT_ID` e `CLASPRC_JSON`.

## QA móvel independente adicional — 17/11/2026
- Run **44211122128**: **success**.
- Emulação touch/mobile Chromium nas larguras 320, 360, 390 e 430 px.
- Busca, filtro de modalidade (22 projetos de Extensão), detalhes, CTA de avaliação, navegação inferior, alternância de ranking e links do Apps Script validados.
- Alvos da navegação inferior: 46 px de altura.
- Foco visível por teclado confirmado na sequência de Tab.
- axe WCAG A/AA: 0 violações após a correção de contraste.
- Primeiro probe encontrou `.prototype` / `.eyebrow` em ~3,68:1; corrigido para ~4,61:1 no commit `fcbbcf95220a228b9926494623650939dbfebaa1`.
- Pendente: teste humano em aparelho físico Android/iOS; a emulação não substitui esse passo.


## Produção publicada e teste físico — 25/11/2026

- PR #1 mesclado em `main`.
- GitHub Pages publicado em `https://rayssa-gm.github.io/webdev_11-11/`.
- Run `45610275861`: build **success** e deploy **success**.
- Suíte atual no CI: **26/26 testes**.
- Teste físico Android confirmou responsividade nas telas Avaliar e Ranking.
- Em Chrome Android com sessão Google normal, os links do Apps Script apresentaram erro do Google; em guia anônima, ambos abriram.
- A interface passou a oferecer alternativas: abrir na mesma guia, copiar link e campo de endereço direto.
- Pendente: retestar essas alternativas no aparelho físico e testar Safari/iOS se houver dispositivo disponível.
- A votação oficial permanece **FECHADA**.
