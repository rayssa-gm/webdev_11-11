# Auditoria do catálogo — v1.0

Fonte obrigatória: JSON do kit (`universo_if_catalogo_46_projetos_v1.0.json`), com CSV equivalente e dois PDFs originais preservados no kit de execução.

| Modalidade | 17/11 | 18/11 | Total |
|---|---:|---:|---:|
| Mostra de Extensão | 13 | 9 | 22 |
| Mostra Nacional | 12 | 12 | 24 |
| **Total** | **25** | **21** | **46** |

IDs estáveis: `EXT-001`–`EXT-022`; `NAC-001`–`NAC-024`. Os 24 registros nacionais aparecem nos dois PDFs e foram contados uma única vez. Não há duplicatas no JSON consolidado por modalidade/título.

Campos provenientes da programação: título, modalidade, área temática, data, início/fim, local comum `Área de vivência`, formato comum `Exposição de pôster` e página-fonte. Autores, resumos, imagens, links individuais e presença não são fornecidos e não foram inventados.

**Limite documental:** os PDFs foram incluídos no kit e a auditoria fornecida com o kit registra inspeção visual manual. Nesta execução automatizada, a validação estrutural e de proveniência do JSON foi feita; não foi refeita uma conferência visual independente de todos os 46 títulos nas páginas. QA humano deverá conferir pelo menos 10 registros e corrigir eventuais transcrições antes de uso institucional.

Comando independente: `node scripts/validar_catalogo.mjs`.


## Consistência catálogo versionado × Google Sheets — 18/11/2026

- Catálogo da branch: **46 projetos**.
- Aba `Projetos` da planilha real: **46 projetos**.
- Campos comparados por ID: `id`, `titulo`, `modalidade`, `area_tematica`, `data`, `inicio`, `fim`, `formato`, `local`.
- Divergências encontradas: **0**.
- As três cópias JSON versionadas (`src/catalogo.json`, `public/data/catalogo.json` e `universo_if_catalogo_46_projetos_v1.0.json`) são estruturalmente idênticas e contêm os mesmos 46 projetos.
- A conferência visual contra os PDFs originais continua pendente porque os dois PDFs não estão acessíveis nesta conversa/biblioteca.


## Conferência documental complementar — 24/11/2026

Os dois PDFs originais foram disponibilizados novamente no kit anexado a esta execução e foram reabertos para inspeção:

- `trabalhos-mostra-nacional-extensao.pdf`: 5 páginas.
- `trabalhos-mostra-nacional.pdf`: 3 páginas.

Foi feita conferência visual amostral de 10 títulos, apoiada por OCR para localizar os registros nas páginas: `EXT-001` a `EXT-005` e `NAC-001` a `NAC-005`. Os títulos da amostra correspondem aos registros do JSON; nenhuma divergência foi identificada nessa amostra. `AGROSENTINELA` (`NAC-004`) e `TRAÇO VIVO` (`NAC-005`) aparecem como registros nacionais distintos.

**Limite desta revisão:** a amostra de 10 não equivale a uma conferência individual dos 46 títulos. Os 36 registros restantes ainda devem ser revisados por uma pessoa da equipe antes da liberação institucional. A validação estrutural de todos os 46 registros continua aprovada pelo script.

## Conferência integral — 25/11/2026

Os dois PDFs originais foram novamente fornecidos pela operadora. Comparação visual assistida por IA dos 46 registros de src/catalogo.json com as oito páginas: EXT-001–006 página 1 do PDF conjunto; EXT-007–020 página 2; EXT-021–022 página 3. NAC-001–007 página 1 do PDF nacional; NAC-008–020 página 2; NAC-021–024 página 3. As páginas 3–5 do PDF conjunto repetem os 24 nacionais. Nenhuma divergência substantiva identificada em títulos, modalidades, áreas, datas, horários ou referências; diferenças tipográficas de caixa, espaço e hífen consideradas equivalentes. Não houve alteração dos dados. Esta revisão assistida por IA encerra a comparação documental técnica, mas não substitui aprovação institucional humana.
