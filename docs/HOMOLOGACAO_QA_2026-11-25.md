# Homologação QA — 24–25/11/2026

Ambiente separado, planilha QA vinculada por SPREADSHEET_ID. Evidências observadas em capturas fornecidas pela operadora; não constituem execução automatizada independente.

| Caso | Resultado observado |
|---|---|
| Voto válido EXT-001 | 3,75, recibo e registro |
| Duplicidade | Rejeitada, sem linha adicional |
| Modelo B EXT-002 | Mesmo código aceito, nota 4,00 |
| Código inválido | Rejeitado, sem linha adicional |
| Ranking com uma avaliação | Média e posição ocultas |
| Ranking com cinco avaliações | EXT-001: posição 1, média 3,95; critérios 4,20 / 4,00 / 3,80 / 3,60 |
| Modalidades | Alternância visual confirmada |
| Impressão | Resultados corretos; nome da modalidade ausente na versão testada |
| Auditoria | 3 registros anteriores e 6 novos válidos, total 9 |
| Encerramento | Interface QA voltou a votação fechada |

## Pendências

- Revalidar commit 5228848: mensagens amigáveis, modalidade impressa e proteção contra respostas atrasadas.
- Confirmar limiares 2, 3 e 4 avaliações, sem alterar dados originais.
- Executar testes de regressão e revisar catálogo com documentos originais.
- Confirmar configuração e permissões antes da entrega; aprovação do PR e publicação dependem de autorização.

Não publicar códigos, hashes, recibos ou identificadores privados. Não sincronizar a implantação original durante testes QA. Manter votação fechada fora de testes controlados.
