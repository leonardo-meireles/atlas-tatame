# Proveniência das fontes de conhecimento (D0)

Uso **autorizado pelo dono** (fontes públicas, projeto open-source). Este doc vira o
NOTICE/ATTRIBUTION do repo. Cada nó ingerido carrega `fonte` + `sourceUrl` + `licenca`.
Regra de qualidade/legal: **definições reescritas em pt-BR próprio** (voz de tatame), não
copiadas verbatim — atribui-se a fonte do termo, não o texto.

| Fonte | URL | Tipo | Atribuição / nota | Método |
|---|---|---|---|---|
| ubershmekel/bjjdata | https://ubershmekel.github.io/bjjdata/ | grafo de posições/transições (open) | creditar repo GitHub | fetch JSON do GitHub Pages/repo |
| Kaggle grappling-techniques | https://www.kaggle.com/datasets/liiucbs/grappling-techniques/data | dataset técnicas | registrar licença do dataset; **precisa login/API key Kaggle** | Kaggle API (key do dono) |
| ViCoS Jiu-Jitsu | https://vicos.si/resources/jiujitsu/ | dataset acadêmico (vídeo/pose) | **citar o paper/lab** (norma acadêmica); provável não-comercial → usar como referência/estudo | download manual + citação |
| BJJ Brotherhood glossary | https://www.jiujitsubrotherhood.com/blogs/blog/a-glossary-of-bjj-terms | glossário (texto) | usar como **lista de termos**; definição própria pt-BR | Firecrawl scrape → termos |
| BJJ Heroes dicionário | https://www.bjjheroes.com/dicionario-de-jiu-jitsu | dicionário pt/termos | lista de termos; definição própria | Firecrawl scrape → termos |
| GrappleFlows | https://grappleflows.com/home | concorrente comercial | **só estudo de UX/estrutura** (na prática bloqueia scrape: Cloudflare/ToS) | não ingerir conteúdo |

## Pendências que precisam do dono
- **Kaggle**: requer credencial/API key (`~/.kaggle/kaggle.json` ou env) — você fornece.
- **ViCoS**: confirmar licença comercial vs pesquisa antes de embutir conteúdo (vs citar).
- **Curadoria "100% verdadeira"**: dado externo entra como `rascunho`; vira `publicado` só após
  revisão técnica (D4). Revisão humana de faixa é o gate final de verdade.

## Veredito das licenças (verificado via Firecrawl/WebSearch — 2026-05-31)
- **ViCoS** = **CC BY-NC-SA 4.0 (NonCommercial)** → NÃO embutir no produto pago (R$19 = comercial);
  só referência + citação do paper. **Decidido: não ingerir conteúdo.**
- **GrappleFlows** = home é marketing; o grafo de flows fica **atrás de login** (não público).
  Não ingerível por scrape. Continua só estudo de UX. (Bate com o flag inicial.)
- **daveyarwood/bjj-graph** (GitHub, Clojure, grafo posição→transição) = público, mas **sem arquivo
  LICENSE** → "all rights reserved" por padrão. Usar como **referência de estrutura**; copiar dados
  exige contato/permissão do autor (higiene de licença num projeto OSS).
- **carlosj934/BJJ_Positions_Submissions** (HuggingFace) = **licença MIT (limpa)** PORÉM **só 1 row**
  (amostra de pose-detection) → sem valor pro grafo. Descartado.
- **Glossários (BJJ Heroes / Brotherhood)** = termos públicos; **definições reescritas próprias** →
  ✅ via clean (já ingerido: 117 termos em `/glossario`).
- **Kaggle grappling-techniques** = script pronto (`scripts/ingest/kaggle-grappling.ts`), só falta a key.

### Conclusão estratégica
Os datasets de GRAFO externos esbarram em licença (ViCoS=NC, bjj-graph=sem licença, GrappleFlows=login).
Pra um SaaS comercial-ish OSS, o caminho limpo é **conteúdo curado próprio** (reforça a marca
"sem PDF de IA"). O glossário (reescrito) é o ganho 100% limpo e já está no ar.

## Estado
- D0 ✅ · D1-D3 ✅ (117 termos → `/glossario`, vetados, 0 flags) · licenças resolvidas (acima).
- Pendente do dono: key Kaggle (script pronto) · checar licença HF · revisão de faixa pra "publicar"
  além do glossário · D5 grafo de técnicas (precisa de fonte com licença OK + curadoria).
