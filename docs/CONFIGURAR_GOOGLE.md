# Configurar Google Apps Script + Sheets

**Não cole tokens, senhas, IDs privados ou URLs privadas nesta conversa ou no GitHub.** A planilha e a administração devem permanecer privadas.

## 1. Criar projeto
1. A equipe cria uma planilha privada no Google Drive.
2. Abra Extensões → Apps Script.
3. Copie `backend/Code.gs` e `backend/Index.html` para o projeto.
4. Salve. Para inicializar a planilha e criar um token sintético, cole temporariamente no final de `Code.gs` a função abaixo e execute `setupForHomologation()` no editor:
   ```javascript
   function setupForHomologation() {
     const setup = initializeSpreadsheet_();
     const token = Utilities.getUuid().replace(/-/g, '') +
       Utilities.getUuid().replace(/-/g, '');
     registerVoteCode_(token);
     Logger.log('PLANILHA: ' + setup.url);
     Logger.log('TOKEN SINTÉTICO (somente para homologação): ' + token);
   }
   ```
   Autorize as permissões solicitadas. Copie o token do registro de execução para o teste e mantenha-o privado. Somente o hash SHA-256 é armazenado na aba `Codigos`.
5. **Apague a função temporária `setupForHomologation()` de `Code.gs` antes de implantar o Web App.** Ela é apenas uma rotina administrativa de configuração e não pode ficar publicada.
6. Na aba `Configuracao`, mantenha `STATUS_VOTACAO=FECHADA` durante a configuração. Altere para `ABERTA` somente durante o teste com token sintético autorizado e volte imediatamente para `FECHADA` ao terminar.

## 2. Implantar
1. Implantar → Nova implantação → Aplicativo da Web.
2. Executar como: proprietário que implantou.
3. Acesso: `Qualquer pessoa` somente se a equipe autorizar e a política institucional permitir acesso anônimo. Não contorne bloqueios da organização.
4. Copie a URL `/exec` e configure `VITE_APPS_SCRIPT_URL` no build do Pages (GitHub Actions variable/repository variable `VITE_APPS_SCRIPT_URL`) ou no `.env.local` para teste local.
5. A tela Apps Script usa `google.script.run`, evitando falso sucesso por CORS/no-cors. A hospedagem pública do Web App continua dependente de acesso anônimo permitido.

## 3. Abas criadas
- `Projetos`: catálogo público.
- `Codigos`: hash SHA-256, habilitação e data de criação.
- `Avaliacoes`: request ID, hash, ID projeto, quatro notas, média ponderada, timestamp e estado.
- `Configuracao`: status, amostra mínima, versão e parâmetros.

## 4. Segurança e limites
- `LockService` protege a verificação/gravação.
- Idempotência por `id_requisicao`.
- Modelo B: unicidade por `(hash_codigo, id_projeto)`.
- Não são armazenados nome, email, IP, MAC ou fingerprint.
- Ranking retorna apenas agregados, nunca hashes nem linhas brutas.
- Cache do ranking por 30 segundos e limite global de 60 novos votos por janela de 10 segundos; a limitação não usa IP ou fingerprint.
- O token é portador, não identifica uma pessoa.
- Não publique a planilha, não habilite compartilhamento amplo e não inclua tokens no repositório.
- Antes de abrir a votação pública, a equipe deve definir período, emitir códigos aleatórios e obter autorização dos organizadores.
