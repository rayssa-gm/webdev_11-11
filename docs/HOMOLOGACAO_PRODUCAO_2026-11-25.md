# Homologação de produção — 25/11/2026

Fonte: relatório de execução em navegador fornecido pela operadora.

- 46 IDs únicos e detalhes conferidos: 24 nacionais e 22 extensão.
- Pesquisa positiva e vazia; filtros combinados retornaram seis projetos compatíveis.
- EXT-001 pré-selecionado no Apps Script, sem login na sessão testada.
- Interface pública indicou votação FECHADA e envio desabilitado.
- Ranking nacional: 21 projetos sem avaliações e três com uma; extensão: 22 sem avaliações. Todos abaixo do mínimo de cinco, sem médias ou posições.
- Chromium: larguras efetivas 1348, 674 e 337 px, sem rolagem horizontal; formulário e rankings conferidos a 337 px.
- Nenhum voto enviado, nenhuma alteração na planilha ou credencial exposta durante a execução relatada.

## Limites

Não houve teste de envio no servidor de produção, nem classificação com amostra suficiente em produção. Testes adicionais simulados de fechamento e desempate foram adicionados no commit 978649a; execução local confirmada no commit 749b162: 26/26 testes aprovados. Dispositivos físicos e aprovação institucional permanecem pendentes. Manter votação fechada até autorização específica.

## Teste físico Android — complemento

Capturas fornecidas pela operadora confirmam interface responsiva nas telas Avaliar e Ranking. Ambos os links do Apps Script falharam na sessão normal do Chrome com erro do Google Drive; a operadora confirmou que ambos abriram em guia anônima. Causa provável: conflito de sessões Google, não comprovada. Acesso em sessão normal permanece uma ressalva de compatibilidade; guia anônima é contorno validado. Não houve confirmação adicional de todos os filtros ou detalhes em aparelho físico. Manter votação fechada.

## Mitigação de acesso

Commits 373705b e 881f93a adicionam ajuda expansível em ambos os serviços, abertura na mesma guia, cópia do endereço e campo selecionável como alternativa. Preservam parâmetros de projeto/modalidade. Não eliminam necessariamente conflitos de sessão Google; guia anônima continua sendo contorno confirmado. Build e publicação dos novos commits e reteste físico ainda precisam ser confirmados. Nenhuma alteração no backend ou planilha.


## Smoke público automatizado — 25/11/2026

GitHub Actions run **45613535272** executou navegador Chromium contra a publicação real.

Resultado: **PASS**.

- GitHub Pages abriu corretamente.
- Catálogo publicado: **46 projetos**.
- Busca por `AGROSENTINELA`: PASS.
- Filtro `Mostra de Extensão`: **22 projetos**.
- Mitigação de acesso publicada: ajuda expansível, abertura na mesma guia, copiar link e endereço direto.
- Avaliação no Apps Script abriu em contexto anônimo.
- Ranking no Apps Script abriu em contexto anônimo.
- Votação exibida como **FECHADA**.
- Sem overflow horizontal em viewport móvel de 390 px.
- Erros JavaScript observados: **0**.

O probe temporário foi removido após a execução. Este teste confirma o fluxo anônimo/publicado, mas não reproduz uma sessão Chrome já autenticada em múltiplas contas Google; por isso o reteste físico da mitigação continua recomendado.


## Reteste físico Android — 25/11/2026 (Kêmilly)

Evidência fornecida pela operadora em aparelho Android físico, com captura da tela do Chrome mostrando `script.google.com` e a mensagem do Google Drive **“Não foi possível abrir o arquivo. Verifique o endereço e tente novamente.”**

Resultados:
- Avaliação no PC, Chrome normal: **PASS**.
- Avaliação no Android, Chrome normal: **FAIL** — erro do Google Drive.
- Link copiado no PC: **PASS**.
- Link copiado no Android: **FAIL** — mesmo erro.
- Ranking no PC, Chrome normal: **PASS**.
- Ranking no Android, Chrome normal: **FAIL** — mesmo erro.
- Ranking em guia anônima no PC: **PASS**.
- Ranking em guia anônima no Android: **FAIL** — mesmo erro.

Conclusão: o contorno por guia anônima não resolve neste aparelho Android. O problema ocorre antes da interface do Apps Script carregar e não depende apenas do estado de login da sessão. O frontend do GitHub Pages permanece funcional; a incompatibilidade está no acesso móvel ao endpoint `script.google.com/macros/.../exec` neste dispositivo/contexto.

Manter votação **FECHADA**. Não classificar o acesso móvel ao formulário/ranking como homologado até haver correção ou alternativa confirmada em aparelho físico.
