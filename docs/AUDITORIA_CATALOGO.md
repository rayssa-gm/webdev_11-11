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
