# Gateway QA — não publicar em produção ainda

Branch experimental. O frontend só ativa os painéis internos com VITE_AVALIA_GATEWAY_URL. Sem essa variável mantém o acesso anterior.

1. Usar exclusivamente planilha e Apps Script QA. Copiar Code.gs desta branch ao script QA, preservando Index e SPREADSHEET_ID. Confirmar FECHADA.
2. Gerar segredo aleatório de pelo menos 32 caracteres (preferir 32 bytes aleatórios em hexadecimal). Guardar em Script Properties como AVALIA_GATEWAY_SECRET. Nunca enviar no chat ou GitHub.
3. Implantar versão QA com acesso anônimo permitido, se política institucional autorizar. Não publicar a planilha.
4. Em avalia-worker, executar npx wrangler login, npx wrangler secret put GATEWAY_SECRET (mesmo segredo), npx wrangler secret put APPS_SCRIPT_URL (URL /exec pública do QA) e npx wrangler deploy. ALLOWED_ORIGIN padrão http://localhost:5173.
5. Configurar VITE_AVALIA_GATEWAY_URL em .env.local com URL HTTPS do Worker QA e executar npm ci, npm test, npm run build, npm run dev.
6. Validar bootstrap fechado, ranking das modalidades, rejeição de voto fechado, código inválido, duplicidade, recibo idempotente, limites, falhas de rede, acessibilidade e responsividade. Testar Chrome normal com múltiplas contas. Usar apenas códigos sintéticos em QA.
7. Antes de produção: revisar segurança, quotas e rate limiting do gateway (CORS não autentica clientes), paridade de critérios/ impressão/ acessibilidade, testes automatizados da API e Worker, configurar origem https://rayssa-gm.github.io e segredos separados de produção. Não mesclar nem publicar até aprovação.

Nenhuma conta Cloudflare ou implantação foi configurada por este commit.
