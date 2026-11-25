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
