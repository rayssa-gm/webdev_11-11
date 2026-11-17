# Sincronizar o Apps Script real com a branch

## Fonte de verdade

- Branch: `feat/universo-if-avalia-mvp`
- Backend: `backend/Code.gs` e `backend/Index.html`
- Manifesto Apps Script: `backend/appsscript.json`
- O CI valida a sintaxe de `backend/Code.gs`.
- IDs, tokens e credenciais não devem ser versionados.

## Estado atual

A planilha real e a implantação `/exec` já existem. A URL pública do Web App está integrada ao build da branch. A sincronização via `clasp` foi preparada no workflow `.github/workflows/sync-apps-script.yml`, mas não faz push automaticamente.

## Sincronização manual segura

1. Mantenha `STATUS_VOTACAO=FECHADA`.
2. Faça uma cópia/versão de segurança do Apps Script online.
3. Compare o código online com `backend/Code.gs` e `backend/Index.html`.
4. Salve e confirme ausência de erro de sintaxe.
5. Execute `getUiBootstrap()` no editor e confirme catálogo com 46 projetos e votação fechada.
6. Valide a implantação de teste e somente depois atualize a versão `/exec`.

## Sincronização via GitHub Actions + clasp

O workflow é apenas manual (`workflow_dispatch`) e possui dois modos:

- `status`: mostra os arquivos locais que o clasp considera para sincronização.
- `push`: envia o conteúdo de `backend/` ao projeto Apps Script. Para executar push é obrigatório informar `SYNC` no campo de confirmação.

Configure no GitHub, em **Settings → Secrets and variables → Actions**, estes secrets:

- `APPS_SCRIPT_ID`: ID do projeto Apps Script. Não use a URL `/exec`.
- `CLASPRC_JSON`: conteúdo completo do arquivo de credenciais gerado por `clasp login`.

O workflow cria `.clasp.json` somente durante a execução. O arquivo real permanece ignorado pelo Git. O exemplo `.clasp.json.example` não contém IDs reais.

### Como obter CLASPRC_JSON

Em uma máquina da equipe:

1. Instale Node.js 22+.
2. Execute `npm install -g @google/clasp@3.4.1`.
3. Ative a Google Apps Script API na conta usada pelo projeto.
4. Execute `clasp login`.
5. Copie o conteúdo de `~/.clasprc.json` para o secret `CLASPRC_JSON`.
6. Não envie esse conteúdo por chat nem faça commit.

### Primeiro uso recomendado

1. Rode o workflow em modo `status`.
2. Revise a lista de arquivos.
3. Confirme que a votação está `FECHADA`.
4. Só então rode em modo `push` com confirmação `SYNC`.
5. Depois do push, abra o Apps Script e valide `getUiBootstrap()` antes de criar/atualizar qualquer implantação.

## Homologação conectada

Após a sincronização do código online:

1. Use somente código sintético autorizado.
2. Abra `STATUS_VOTACAO` apenas durante o teste controlado.
3. Vote em `NAC-001` e valide recibo/readback.
4. Repita no mesmo projeto para confirmar `VOTO_DUPLICADO`.
5. Reutilize o mesmo código em `NAC-002` para confirmar Modelo B.
6. Teste idempotência e concorrência.
7. Gere pelo menos cinco avaliações sintéticas para validar o ranking.
8. Ao terminar, retorne `STATUS_VOTACAO=FECHADA`.

## Segurança

O `clasp push --force` substitui o conteúdo remoto do projeto Apps Script pelos arquivos locais selecionados. Por isso o workflow nunca roda em push de Git, nunca publica automaticamente uma implantação e exige acionamento manual.
