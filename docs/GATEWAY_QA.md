# Formulário e ranking integrados

O GitHub Pages monta o formulário e os rankings no próprio site. O navegador chama o Worker por HTTPS sem cookies do Google. O Worker encaminha as operações ao Apps Script usando um segredo que fica no servidor. Use `avalia-worker/` para este fluxo.

## QA

1. Mantenha o Apps Script **Universo IF Avalia — QA** vinculado à planilha QA e publique o conteúdo de `backend/` na implantação Web App QA. Confirme que o Worker QA aponta para essa implantação. O valor em `AVALIA_GATEWAY_SECRET` nas propriedades do Apps Script deve coincidir com o segredo `GATEWAY_SECRET` do Worker QA. Preserve as propriedades e os segredos existentes. Nunca os copie para o frontend.
2. A partir da branch de integração, execute `npm ci`, `npm test`, `npm run build` e `node scripts/validar_catalogo.mjs`. Para navegar, configure `VITE_AVALIA_GATEWAY_URL=https://universo-if-avalia-qa.rayssagabriela.workers.dev` e use `npm run dev` em `http://localhost:5173`, a origem permitida no Worker QA.
3. Verifique formulário fechado, ambas as modalidades, médias por critério, impressão com a modalidade, alternância rápida, falhas de rede, acesso anônimo e sessão com mais de uma conta Google. Use somente códigos e dados sintéticos no ambiente QA. Restaure o estado FECHADA ao encerrar qualquer teste controlado de gravação.

## Produção

1. Após homologar a implantação QA, publique uma nova versão Web App do projeto **Universo IF Avalia**, preserve a propriedade da planilha e mantenha o status FECHADA. A versão em uso e a anterior devem permanecer identificáveis para reversão.
2. Use um Worker separado de QA. Configure `APPS_SCRIPT_URL` para a implantação de produção, configure um segredo de gateway próprio de produção em ambos os serviços e permita a origem `https://rayssa-gm.github.io`. CORS controla acesso no navegador. A autorização do gateway em relação ao Apps Script é feita no servidor.
3. Configure a variável de repositório `VITE_AVALIA_GATEWAY_URL` com a origem HTTPS do Worker de produção. O workflow do GitHub Pages exige uma origem diferente da de QA e consulta `/bootstrap` com a origem do GitHub Pages. A publicação exige resposta válida, CORS esperado, votação FECHADA e mínimo 5.
4. Após publicar, navegue no site e confirme catálogo, detalhes, formulário fechado e ambos os rankings. Se houver regressão, restaure a implantação anterior e confirme novamente o fechamento. Testes de produção são somente de leitura.
