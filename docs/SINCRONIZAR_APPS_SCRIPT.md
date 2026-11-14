# Sincronizar o Apps Script real com a branch

Este procedimento existe para resolver divergências entre o código versionado em `feat/universo-if-avalia-mvp` e o projeto Google Apps Script já criado pela equipe, sem recriar a planilha e sem abrir a votação oficial.

## Estado de referência

- Fonte de verdade do backend: `backend/Code.gs` e `backend/Index.html` na branch `feat/universo-if-avalia-mvp`.
- O `backend/Code.gs` versionado passa na verificação de sintaxe do CI.
- A equipe informou que o Web App já foi implantado e abre em janela anônima, com votação fechada.
- A equipe também relatou `SyntaxError: Unexpected token ';'` na versão `/dev`. Como a linha correspondente do arquivo versionado é válida, trate o projeto online como potencialmente divergente até a comparação.
- Não recrie a planilha existente e não execute uma nova inicialização destrutiva.

## Sincronização manual segura

1. No Apps Script real, confirme que a votação continua `FECHADA`.
2. Crie uma versão/cópia de segurança do código atual antes de substituir arquivos.
3. Substitua integralmente o conteúdo do arquivo de servidor pelo conteúdo de `backend/Code.gs` da branch.
4. Substitua integralmente o HTML pelo conteúdo de `backend/Index.html`.
5. Salve e confirme que o editor não apresenta erro de sintaxe.
6. Execute uma função de leitura não destrutiva, como `getUiBootstrap()`, e confirme que ela retorna o catálogo e `status: FECHADA`.
7. Abra a implantação de teste/`dev` novamente. O formulário e o ranking devem carregar sem erro de sintaxe.
8. Só depois disso crie uma nova versão da implantação `/exec`. Não abra a votação ainda.

## Verificação da planilha existente

Antes do primeiro voto de homologação, confirme visualmente que existem as abas:

- `Projetos`
- `Codigos`
- `Avaliacoes`
- `Configuracao`

Na aba `Projetos`, confirme 46 registros de projeto além do cabeçalho. Na aba `Configuracao`, mantenha `STATUS_VOTACAO=FECHADA` até o teste controlado.

Não publique nem cole no repositório IDs da planilha, URL administrativa, tokens de voto ou dados privados.

## Teste conectado seguinte

Depois da sincronização:

1. Gere ou habilite um código sintético somente para homologação.
2. Altere temporariamente `STATUS_VOTACAO` para `ABERTA`.
3. Vote em `NAC-001` e guarde o recibo.
4. Confira a linha correspondente em `Avaliacoes`.
5. Tente novamente o mesmo código em `NAC-001`: deve retornar `VOTO_DUPLICADO`.
6. Use o mesmo código em `NAC-002`: deve aceitar.
7. Volte `STATUS_VOTACAO` para `FECHADA`.
8. Registre a evidência em `docs/RELATORIO_QA.md`.

## Sincronização automática futura

Somente após a sincronização manual e o teste conectado passarem, configurar `clasp`/GitHub Actions para reduzir divergências entre GitHub e Apps Script. Credenciais OAuth, tokens e IDs privados devem ficar em secrets/variables do ambiente e nunca em arquivos versionados.
