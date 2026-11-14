# Testes e QA

## Automatizados
- Catálogo: 46 IDs únicos, 24 NAC + 22 EXT, campos, datas e proveniência.
- Domínio: busca acento-insensível e cálculo [4,5,4,3] = 4,15.
- Validação de escala: notas ausentes, decimais e fora de 1–5 rejeitadas.
- Backend: funções de voto aplicam validação no servidor, hash do token, lock e idempotência; execute teste conectado após setup.

## Roteiro de homologação conectada (obrigatório)
1. Criar planilha privada executando `initializeSpreadsheet()` no editor Apps Script (manual, pela equipe).
2. Gerar um código sintético aleatório executando `registerSyntheticTestCode()` no editor Apps Script; copiar o token exibido no log de execução. Não usar token de produção.
3. Na aba `Configuracao`, mudar `STATUS_VOTACAO` para `ABERTA`.
4. Implantar Web App como proprietário; permitir acesso anônimo somente após autorização da equipe e política Google Workspace. Se indisponível, marcar `BLOQUEADO_ACESSO_PUBLICO`.
5. Em navegador anônimo, submeter o token para NAC-001. Confirmar recibo.
6. Repetir token + NAC-001 com novo ID de requisição: deve retornar `VOTO_DUPLICADO` e não criar linha.
7. Reutilizar token em NAC-002: deve aceitar.
8. Conferir as linhas na aba privada `Avaliacoes`; não compartilhar a planilha.
9. Semear cinco avaliações sintéticas em um projeto de homologação para validar ranking; nunca misturar com votos reais. Verificar média, contagem, amostra mínima e separação de modalidade.
10. Tentar duas submissões concorrentes do mesmo par; exatamente uma deve ser gravada.
11. Repetir o fluxo em smartphone e conferir foco, teclado, contraste e largura em 320, 375, 768 e 1280 px.

## Estado de execução
Testes automatizados executados localmente serão reportados com resultados do CI. Homologação real não foi executada: depende de planilha, implantação e autorização de acesso anônimo e gravação de votos sintéticos.
