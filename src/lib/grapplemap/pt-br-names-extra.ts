// pt-BR names — EXTRA backlog layer (auto-gerado por .scratch/gen-pt-br-extra.test.ts).
//
// Cobre TODAS as posições/transições do GrappleMap que NÃO estavam no
// PT_BR_NAMES hand-curado (~250 entradas). Mesmas convenções de casa
// (ver research/traducao-bjj-corpus.md): mantém anglicismos/nomes próprios
// que o brasileiro fala no tatame, traduz o vocabulário core de posição/ação.
// Tradutor determinístico via glossário de frases (match mais longo primeiro).
//
// É feito MERGE em PT_BR_NAMES (spread) em pt-br-names.ts, então gmKey lookups
// pegam estas entradas. Regenerar quando o glossário mudar; revisão à mão bem-vinda.

import type { PtBrName } from "./pt-br-names";

export const PT_BR_NAMES_EXTRA: Record<string, PtBrName> = {
  "...a": {
    slug: "a",
    nomeBR: "...a",
  },
  "...b": {
    slug: "b",
    nomeBR: "...b",
  },
  "...c": {
    slug: "c",
    nomeBR: "...c",
  },
  "2-on-1 to chest": {
    slug: "2-em-1-para-peito",
    nomeBR: "2-em-1 para Peito",
  },
  "3/4 mount w/ bottom on side and leg grabbed": {
    slug: "3-4-montada-com-de-baixo-no-lado-e-perna-agarrada",
    nomeBR: "3/4 Montada com de Baixo no Lado e Perna Agarrada",
  },
  "3/4 mount w/ underhook": {
    slug: "3-4-montada-com-underhook",
    nomeBR: "3/4 Montada com Underhook",
  },
  "3/4 mount with isolated arm": {
    slug: "3-4-montada-com-braco-isolado",
    nomeBR: "3/4 Montada com Braço Isolado",
  },
  "50/50 heel hook": {
    slug: "50-50-heel-hook",
    nomeBR: "50/50 Heel Hook",
  },
  "50/50 vs combat base": {
    slug: "50-50-vs-base-de-combate",
    nomeBR: "50/50 vs Base de Combate",
  },
  "?": {
    slug: "transicao",
    nomeBR: "?",
  },
  "angled monoplata": {
    slug: "angled-monoplata",
    nomeBR: "Angled Monoplata",
  },
  "ankle pick off of overhook": {
    slug: "ankle-pick-de-sobre-gancho",
    nomeBR: "Ankle Pick de Sobre-Gancho",
  },
  "ankle pick off of two-on-one": {
    slug: "ankle-pick-de-2-em-1",
    nomeBR: "Ankle Pick de 2-em-1",
  },
  "another leg drag w/ head&arm": {
    slug: "another-leg-drag-com-cabeca-e-braco",
    nomeBR: "Another Leg Drag com Cabeça e Braço",
  },
  "approaching turned away t-rex": {
    slug: "aproximando-virado-pra-fora-t-rex",
    nomeBR: "Aproximando Virado pra Fora T-rex",
  },
  "arm bar w/ single leg over": {
    slug: "armlock-com-single-leg-por-cima",
    nomeBR: "Armlock com Single Leg por Cima",
  },
  "arm-in guillotine vs single leg": {
    slug: "guilhotina-com-braco-dentro-vs-single-leg",
    nomeBR: "Guilhotina com Braço Dentro vs Single Leg",
  },
  "arm-out guillotine": {
    slug: "guilhotina-sem-braco",
    nomeBR: "Guilhotina sem Braço",
  },
  "attempting spiral": {
    slug: "tentando-espiral",
    nomeBR: "Tentando Espiral",
  },
  "back on choke arm side w/ one leg trapped": {
    slug: "costas-no-estrangulamento-braco-lado-com-uma-perna-presa",
    nomeBR: "Costas no Estrangulamento Braço Lado com Uma Perna Presa",
  },
  "back on choke arm side": {
    slug: "costas-no-estrangulamento-braco-lado",
    nomeBR: "Costas no Estrangulamento Braço Lado",
  },
  "back on underhook side": {
    slug: "costas-no-underhook-lado",
    nomeBR: "Costas no Underhook Lado",
  },
  "back step pass leg battle": {
    slug: "back-step-passagem-perna-disputa",
    nomeBR: "Back Step Passagem Perna Disputa",
  },
  "back w/ arm trapped": {
    slug: "costas-com-braco-preso",
    nomeBR: "Costas com Braço Preso",
  },
  "backward roll north south escape": {
    slug: "pra-tras-rolamento-norte-sul-fuga",
    nomeBR: "Pra Trás Rolamento Norte-Sul Fuga",
  },
  "baseball bat control": {
    slug: "gravata-de-taco-controle",
    nomeBR: "Gravata de Taco Controle",
  },
  "basic omoplata finish": {
    slug: "basic-omoplata-finalizar",
    nomeBR: "Basic Omoplata Finalizar",
  },
  "berimbolo start": {
    slug: "berimbolo-inicio",
    nomeBR: "Berimbolo Início",
  },
  "blocked knee bar": {
    slug: "bloqueada-chave-de-joelho",
    nomeBR: "Bloqueada Chave de Joelho",
  },
  "blocked triangle": {
    slug: "bloqueada-triangulo",
    nomeBR: "Bloqueada Triângulo",
  },
  "body lock from side w/ arm trapped": {
    slug: "body-lock-de-lado-com-braco-preso",
    nomeBR: "Body Lock de Lado com Braço Preso",
  },
  "bottom arm triangle w/ lockdown": {
    slug: "de-baixo-triangulo-de-braco-com-lockdown",
    nomeBR: "De Baixo Triângulo de Braço com Lockdown",
  },
  "bottom coming up into guillotine": {
    slug: "de-baixo-subindo-pra-cima-para-guilhotina",
    nomeBR: "De Baixo Subindo pra Cima para Guilhotina",
  },
  "bottom starting to turn in": {
    slug: "de-baixo-comecando-para-virar-na",
    nomeBR: "De Baixo Começando para Virar na",
  },
  "bottom throwing leg up": {
    slug: "de-baixo-jogando-perna-pra-cima",
    nomeBR: "De Baixo Jogando Perna pra Cima",
  },
  "bottom turning in w/ underhook in side control": {
    slug: "de-baixo-virando-na-com-underhook-na-cem-quilos",
    nomeBR: "De Baixo Virando na com Underhook na Cem-Quilos",
  },
  "bridged against judo side": {
    slug: "em-ponte-contra-cem-quilos-de-judo",
    nomeBR: "Em Ponte Contra Cem-Quilos de Judô",
  },
  "broken out of triangle": {
    slug: "quebrada-de-triangulo",
    nomeBR: "Quebrada de Triângulo",
  },
  "butterflies engaged w/ over/under body lock": {
    slug: "butterflies-engaged-com-over-under-body-lock",
    nomeBR: "Butterflies Engaged com Over-under Body Lock",
  },
  "butterfly 2-on-1": {
    slug: "guarda-de-gancho-2-em-1",
    nomeBR: "Guarda de Gancho 2-em-1",
  },
  "butterfly arm drag w/ leg grab": {
    slug: "guarda-de-gancho-arm-drag-com-perna-agarrar",
    nomeBR: "Guarda de Gancho Arm Drag com Perna Agarrar",
  },
  "butterfly ashi": {
    slug: "guarda-de-gancho-ashi",
    nomeBR: "Guarda de Gancho Ashi",
  },
  "butterfly elevation vs squeezed knees": {
    slug: "guarda-de-gancho-elevation-vs-apertado-joelhos",
    nomeBR: "Guarda de Gancho Elevation vs Apertado Joelhos",
  },
  "butterfly guillotine": {
    slug: "guarda-de-gancho-guilhotina",
    nomeBR: "Guarda de Gancho Guilhotina",
  },
  "butterfly knee pin pass": {
    slug: "guarda-de-gancho-passagem-prensando-o-joelho",
    nomeBR: "Guarda de Gancho Passagem Prensando o Joelho",
  },
  "butterfly w/ double under elevation start": {
    slug: "guarda-de-gancho-com-duplo-por-baixo-elevation-inicio",
    nomeBR: "Guarda de Gancho com Duplo por Baixo Elevation Início",
  },
  "butterfly w/ whizzer": {
    slug: "guarda-de-gancho-com-whizzer",
    nomeBR: "Guarda de Gancho com Whizzer",
  },
  "calf crank from truck": {
    slug: "calf-slicer-de-truck",
    nomeBR: "Calf Slicer de Truck",
  },
  "caught kick": {
    slug: "caught-chute",
    nomeBR: "Caught Chute",
  },
  "chest pass": {
    slug: "passagem-pelo-peito",
    nomeBR: "Passagem Pelo Peito",
  },
  "close half guard shell": {
    slug: "close-meia-guarda-shell",
    nomeBR: "Close Meia-guarda Shell",
  },
  "clubbing butterfly sweep": {
    slug: "raspagem-de-gancho-clubbing",
    nomeBR: "Raspagem de Gancho Clubbing",
  },
  "cocoon w/ collar tie and overhook": {
    slug: "cocoon-com-pegada-de-nuca-e-sobre-gancho",
    nomeBR: "Cocoon com Pegada de Nuca e Sobre-Gancho",
  },
  "cocoon w/ overhook": {
    slug: "cocoon-com-sobre-gancho",
    nomeBR: "Cocoon com Sobre-Gancho",
  },
  "cocoon w/ posture broken": {
    slug: "cocoon-com-postura-quebrada",
    nomeBR: "Cocoon com Postura Quebrada",
  },
  "collar tie + tricep vs weak underhook": {
    slug: "pegada-de-nuca-e-triceps-vs-underhook-fraco",
    nomeBR: "Pegada de Nuca e Tríceps vs Underhook Fraco",
  },
  "collar tie ankle pick + inside trip": {
    slug: "pegada-de-nuca-ankle-pick-e-por-dentro-rasteira",
    nomeBR: "Pegada de Nuca Ankle Pick e por Dentro Rasteira",
  },
  "collar tie ankle pick from knee": {
    slug: "pegada-de-nuca-ankle-pick-de-joelho",
    nomeBR: "Pegada de Nuca Ankle Pick de Joelho",
  },
  "collar tie vs wrist+tricep control": {
    slug: "pegada-de-nuca-vs-punho-e-triceps-controle",
    nomeBR: "Pegada de Nuca vs Punho e Tríceps Controle",
  },
  "combat base back": {
    slug: "base-de-combate-costas",
    nomeBR: "Base de Combate Costas",
  },
  "combat base butterfly arm drag": {
    slug: "base-de-combate-guarda-de-gancho-arm-drag",
    nomeBR: "Base de Combate Guarda de Gancho Arm Drag",
  },
  "combat base leg drag w/ bicep control": {
    slug: "base-de-combate-leg-drag-com-controle-de-biceps",
    nomeBR: "Base de Combate Leg Drag com Controle de Bíceps",
  },
  "combat base vs butterfly": {
    slug: "base-de-combate-vs-guarda-de-gancho",
    nomeBR: "Base de Combate vs Guarda de Gancho",
  },
  "combat base vs flat\\bbutterfly": {
    slug: "base-de-combate-vs-flatbutterfly",
    nomeBR: "Base de Combate vs Flatbutterfly",
  },
  "combat base vs knee side 2-on-1": {
    slug: "base-de-combate-vs-joelho-lado-2-em-1",
    nomeBR: "Base de Combate vs Joelho Lado 2-em-1",
  },
  "combat base w/ single": {
    slug: "base-de-combate-com-single",
    nomeBR: "Base de Combate com Single",
  },
  "coming up on close single-leg": {
    slug: "subindo-pra-cima-no-close-single-leg",
    nomeBR: "Subindo pra Cima no Close Single Leg",
  },
  "coming up on distant single": {
    slug: "subindo-pra-cima-no-distant-single",
    nomeBR: "Subindo pra Cima no Distant Single",
  },
  "coming up on posting turtle's leg": {
    slug: "subindo-pra-cima-no-apoiando-da-tartaruga-perna",
    nomeBR: "Subindo pra Cima no Apoiando da Tartaruga Perna",
  },
  "completed imanari roll": {
    slug: "concluida-rolamento-imanari",
    nomeBR: "Concluída Rolamento Imanari",
  },
  "completed o-soto-gari": {
    slug: "concluida-o-soto-gari",
    nomeBR: "Concluída O-soto-gari",
  },
  "cop landing": {
    slug: "cop-landing",
    nomeBR: "Cop Landing",
  },
  "countering upa side control escape": {
    slug: "countering-upa-cem-quilos-fuga",
    nomeBR: "Countering Upa Cem-Quilos Fuga",
  },
  "covered up s-mount": {
    slug: "covered-pra-cima-s-mount",
    nomeBR: "Covered pra Cima S-mount",
  },
  "crab ride w/ ankle control": {
    slug: "crab-ride-com-controle-de-tornozelo",
    nomeBR: "Crab Ride com Controle de Tornozelo",
  },
  "crab ride w/ ankles vs hand posts": {
    slug: "crab-ride-com-tornozelos-vs-mao-apoia",
    nomeBR: "Crab Ride com Tornozelos vs Mão Apoia",
  },
  "crouching w/ one leg over shoulder": {
    slug: "agachado-com-uma-perna-sobre-o-ombro",
    nomeBR: "Agachado com Uma Perna Sobre o Ombro",
  },
  "crucified turtle": {
    slug: "crucificado-tartaruga",
    nomeBR: "Crucificado Tartaruga",
  },
  "crucifix w/ kimura": {
    slug: "crucifixo-com-kimura",
    nomeBR: "Crucifixo com Kimura",
  },
  "crucifix": {
    slug: "crucifixo",
    nomeBR: "Crucifixo",
  },
  "cupping leg smash": {
    slug: "encaixando-esmagamento-de-perna",
    nomeBR: "Encaixando Esmagamento de Perna",
  },
  "deep half back roll": {
    slug: "deep-half-rolamento-pra-tras",
    nomeBR: "Deep Half Rolamento pra Trás",
  },
  "deep half backdoor sweep": {
    slug: "deep-half-backdoor-raspagem",
    nomeBR: "Deep Half Backdoor Raspagem",
  },
  "deep half leaning backwards": {
    slug: "deep-half-inclinando-backwards",
    nomeBR: "Deep Half Inclinando Backwards",
  },
  "deep half leaning forward": {
    slug: "deep-half-inclinando-pra-frente",
    nomeBR: "Deep Half Inclinando pra Frente",
  },
  "deep half top receded": {
    slug: "deep-half-de-cima-receded",
    nomeBR: "Deep Half de Cima Receded",
  },
  "deep half vs head&arm": {
    slug: "deep-half-vs-cabeca-e-braco",
    nomeBR: "Deep Half vs Cabeça e Braço",
  },
  "defeated deep half": {
    slug: "vencida-deep-half",
    nomeBR: "Vencida Deep Half",
  },
  "distance standing vs seated": {
    slug: "distance-em-pe-vs-sentado",
    nomeBR: "Distance em Pé vs Sentado",
  },
  "distance supine butterfly": {
    slug: "distance-deitado-guarda-de-gancho",
    nomeBR: "Distance Deitado Guarda de Gancho",
  },
  "distant leg drag": {
    slug: "distant-leg-drag",
    nomeBR: "Distant Leg Drag",
  },
  "distant standing collar-tie": {
    slug: "distant-em-pe-collar-tie",
    nomeBR: "Distant em Pé Collar-tie",
  },
  "dogfight w/ double unders": {
    slug: "dogfight-com-duplo-por-baixo",
    nomeBR: "Dogfight com Duplo por Baixo",
  },
  "dogfight w/o leg control": {
    slug: "dogfight-sem-controle-de-perna",
    nomeBR: "Dogfight sem Controle de Perna",
  },
  "dogfight w/o whizzer": {
    slug: "dogfight-sem-whizzer",
    nomeBR: "Dogfight sem Whizzer",
  },
  "double ankle pick": {
    slug: "double-ankle-pick",
    nomeBR: "Double Ankle Pick",
  },
  "double bagged chill dog w/o hand on mat": {
    slug: "double-bagged-chill-dog-sem-mao-no-tatame",
    nomeBR: "Double Bagged Chill Dog sem Mão no Tatame",
  },
  "double knee bar": {
    slug: "double-chave-de-joelho",
    nomeBR: "Double Chave de Joelho",
  },
  "double leg from knees vs sprawl": {
    slug: "double-leg-de-joelhos-vs-sprawl",
    nomeBR: "Double Leg de Joelhos vs Sprawl",
  },
  "double leg takedown finish": {
    slug: "double-leg-queda-finalizar",
    nomeBR: "Double Leg Queda Finalizar",
  },
  "double leg vs reverse leg": {
    slug: "double-leg-vs-invertida-perna",
    nomeBR: "Double Leg vs Invertida Perna",
  },
  "double outside ashi": {
    slug: "double-por-fora-ashi",
    nomeBR: "Double por Fora Ashi",
  },
  "double under pass w/ hips pulled in": {
    slug: "passagem-com-duplo-por-baixo-com-quadril-puxado-na",
    nomeBR: "Passagem com Duplo por Baixo com Quadril Puxado na",
  },
  "double under pass": {
    slug: "passagem-com-duplo-por-baixo",
    nomeBR: "Passagem com Duplo por Baixo",
  },
  "double unders side control vs headlock": {
    slug: "duplo-por-baixo-cem-quilos-vs-headlock",
    nomeBR: "Duplo por Baixo Cem-Quilos vs Headlock",
  },
  "double unders w/ feet on hips": {
    slug: "duplo-por-baixo-com-pes-no-quadril",
    nomeBR: "Duplo por Baixo com Pés no Quadril",
  },
  "duck under vs arm": {
    slug: "duck-under-vs-braco",
    nomeBR: "Duck Under vs Braço",
  },
  "elbow half w/ deep underhook vs whizzer": {
    slug: "cotovelo-half-com-underhook-profundo-vs-whizzer",
    nomeBR: "Cotovelo Half com Underhook Profundo vs Whizzer",
  },
  "elbow half w/ deep underhook": {
    slug: "cotovelo-half-com-underhook-profundo",
    nomeBR: "Cotovelo Half com Underhook Profundo",
  },
  "elbow half w/ lockdown + underh. vs whizzer": {
    slug: "cotovelo-half-com-lockdown-e-underh-vs-whizzer",
    nomeBR: "Cotovelo Half com Lockdown e Underh. vs Whizzer",
  },
  "elbow half w/ weak underhook": {
    slug: "cotovelo-half-com-underhook-fraco",
    nomeBR: "Cotovelo Half com Underhook Fraco",
  },
  "electric chair submission": {
    slug: "electric-chair-finalizacao",
    nomeBR: "Electric Chair Finalização",
  },
  "electric chair sweep": {
    slug: "electric-chair-raspagem",
    nomeBR: "Electric Chair Raspagem",
  },
  "electric chair": {
    slug: "electric-chair",
    nomeBR: "Electric Chair",
  },
  "electric cradle w/ lockdown": {
    slug: "electric-cradle-com-lockdown",
    nomeBR: "Electric Cradle com Lockdown",
  },
  "electric cradle w/ open elbow": {
    slug: "electric-cradle-com-aberto-cotovelo",
    nomeBR: "Electric Cradle com Aberto Cotovelo",
  },
  "electric cradle": {
    slug: "electric-cradle",
    nomeBR: "Electric Cradle",
  },
  "electric underhooks": {
    slug: "eletrica-underhooks",
    nomeBR: "Elétrica Underhooks",
  },
  "entering side control w/ kimura": {
    slug: "entrando-cem-quilos-com-kimura",
    nomeBR: "Entrando Cem-Quilos com Kimura",
  },
  "escape from judo side": {
    slug: "fuga-de-cem-quilos-de-judo",
    nomeBR: "Fuga de Cem-Quilos de Judô",
  },
  "far side side control kimura": {
    slug: "longe-lado-cem-quilos-kimura",
    nomeBR: "Longe Lado Cem-Quilos Kimura",
  },
  "fetal w/ seat belt": {
    slug: "fetal-com-seatbelt",
    nomeBR: "Fetal com Seatbelt",
  },
  "flanking after standing drag": {
    slug: "flanqueando-after-em-pe-arrastar",
    nomeBR: "Flanqueando After em Pé Arrastar",
  },
  "flanking body lock": {
    slug: "flanqueando-body-lock",
    nomeBR: "Flanqueando Body Lock",
  },
  "flat 3/4 mount vs double unders": {
    slug: "estendido-3-4-montada-vs-duplo-por-baixo",
    nomeBR: "Estendido 3/4 Montada vs Duplo por Baixo",
  },
  "flat ¼ w/ head+arm": {
    slug: "estendido-com-cabeca-e-braco",
    nomeBR: "Estendido ¼ com Cabeça e Braço",
  },
  "flattened back mount": {
    slug: "estendido-pegada-nas-costas",
    nomeBR: "Estendido Pegada nas Costas",
  },
  "flattened butterfly w/ stiff arms": {
    slug: "estendido-guarda-de-gancho-com-stiff-bracos",
    nomeBR: "Estendido Guarda de Gancho com Stiff Braços",
  },
  "flipped omoplata": {
    slug: "girado-omoplata",
    nomeBR: "Girado Omoplata",
  },
  "forward leaning leg drag vs t-rex": {
    slug: "pra-frente-inclinando-leg-drag-vs-t-rex",
    nomeBR: "Pra Frente Inclinando Leg Drag vs T-rex",
  },
  "freeing leg in deep half": {
    slug: "liberando-perna-na-deep-half",
    nomeBR: "Liberando Perna na Deep Half",
  },
  "from sprawl to turtle": {
    slug: "de-sprawl-para-tartaruga",
    nomeBR: "De Sprawl para Tartaruga",
  },
  "front headlock vs single": {
    slug: "gravata-frontal-vs-single",
    nomeBR: "Gravata Frontal vs Single",
  },
  "full domination top lock half": {
    slug: "full-domination-de-cima-travar-half",
    nomeBR: "Full Domination de Cima Travar Half",
  },
  "game over": {
    slug: "game-por-cima",
    nomeBR: "Game por Cima",
  },
  "gangsta- lean w/ head&armpit": {
    slug: "gangsta-lean-com-cabeca-e-axila",
    nomeBR: "Gangsta Lean com Cabeça e Axila",
  },
  "gangsta-lean": {
    slug: "gangsta-lean",
    nomeBR: "Gangsta Lean",
  },
  "goes guard": {
    slug: "vai-guarda",
    nomeBR: "Vai Guarda",
  },
  "grounded single leg vs arm drag": {
    slug: "grounded-single-leg-vs-arm-drag",
    nomeBR: "Grounded Single Leg vs Arm Drag",
  },
  "half guard arm drag": {
    slug: "meia-guarda-arm-drag",
    nomeBR: "Meia-guarda Arm Drag",
  },
  "half guard kimura": {
    slug: "meia-guarda-kimura",
    nomeBR: "Meia-guarda Kimura",
  },
  "half guard knee+hip control": {
    slug: "meia-guarda-joelho-e-controle-de-quadril",
    nomeBR: "Meia-guarda Joelho e Controle de Quadril",
  },
  "half guard shell w/ leg grabbed": {
    slug: "meia-guarda-shell-com-perna-agarrada",
    nomeBR: "Meia-guarda Shell com Perna Agarrada",
  },
  "half guard shell": {
    slug: "meia-guarda-shell",
    nomeBR: "Meia-guarda Shell",
  },
  "half guard w/ double unders vs crossface": {
    slug: "meia-guarda-com-duplo-por-baixo-vs-crossface",
    nomeBR: "Meia-guarda com Duplo por Baixo vs Crossface",
  },
  "half guard w/ head&arm vs t rex": {
    slug: "meia-guarda-com-cabeca-e-braco-vs-t-rex",
    nomeBR: "Meia-guarda com Cabeça e Braço vs T-rex",
  },
  "half guard w/ hip control": {
    slug: "meia-guarda-com-controle-de-quadril",
    nomeBR: "Meia-guarda com Controle de Quadril",
  },
  "half guard w/ knee pin": {
    slug: "meia-guarda-com-joelho-prensado",
    nomeBR: "Meia-guarda com Joelho Prensado",
  },
  "half guard w/ underhook + wrist vs combat base": {
    slug: "meia-guarda-com-underhook-e-punho-vs-base-de-combate",
    nomeBR: "Meia-guarda com Underhook e Punho vs Base de Combate",
  },
  "halfway butterfly overhook sweep": {
    slug: "halfway-guarda-de-gancho-sobre-gancho-raspagem",
    nomeBR: "Halfway Guarda de Gancho Sobre-Gancho Raspagem",
  },
  "halfway over/- under bodylock butterfly sweep": {
    slug: "halfway-over-por-baixo-bodylock-raspagem-de-gancho",
    nomeBR: "Halfway Over/- por Baixo Bodylock Raspagem de Gancho",
  },
  "high double leg": {
    slug: "double-alto-perna",
    nomeBR: "Double Alto Perna",
  },
  "high mount w/ one arm trapped": {
    slug: "montada-alta-com-uma-braco-preso",
    nomeBR: "Montada Alta com Uma Braço Preso",
  },
  "high single vs arm drag": {
    slug: "single-alto-vs-arm-drag",
    nomeBR: "Single Alto vs Arm Drag",
  },
  "high single w/ head inside": {
    slug: "single-alto-com-cabeca-por-dentro",
    nomeBR: "Single Alto com Cabeça por Dentro",
  },
  "high single w/ head on chest": {
    slug: "single-alto-com-cabeca-no-peito",
    nomeBR: "Single Alto com Cabeça no Peito",
  },
  "hip control pass": {
    slug: "controle-de-quadril-passagem",
    nomeBR: "Controle de Quadril Passagem",
  },
  "hippoplatamus": {
    slug: "hippoplatamus",
    nomeBR: "Hippoplatamus",
  },
  "homer": {
    slug: "homer",
    nomeBR: "Homer",
  },
  "honey hole escape route": {
    slug: "honey-hole-fuga-route",
    nomeBR: "Honey Hole Fuga Route",
  },
  "honey hole heel hook": {
    slug: "honey-hole-heel-hook",
    nomeBR: "Honey Hole Heel Hook",
  },
  "honey hole": {
    slug: "honey-hole",
    nomeBR: "Honey Hole",
  },
  "incoming roundhouse": {
    slug: "entrando-chute-giratorio",
    nomeBR: "Entrando Chute Giratório",
  },
  "inserting first hook from side": {
    slug: "encaixando-primeiro-gancho-de-lado",
    nomeBR: "Encaixando Primeiro Gancho de Lado",
  },
  "inverted half guard": {
    slug: "invertida-meia-guarda",
    nomeBR: "Invertida Meia-guarda",
  },
  "japanese necktie w/ top leg trapped": {
    slug: "japanese-necktie-com-de-cima-perna-presa",
    nomeBR: "Japanese Necktie com de Cima Perna Presa",
  },
  "japanese necktie": {
    slug: "japanese-necktie",
    nomeBR: "Japanese Necktie",
  },
  "judo side going around c-cups": {
    slug: "cem-quilos-de-judo-indo-ao-redor-c-cups",
    nomeBR: "Cem-Quilos de Judô Indo ao Redor C-cups",
  },
  "judo side vs t-rex": {
    slug: "cem-quilos-de-judo-vs-t-rex",
    nomeBR: "Cem-Quilos de Judô vs T-rex",
  },
  "judo side w/ crossface vs elbow blocking hip and neck frame": {
    slug: "cem-quilos-de-judo-com-crossface-vs-cotovelo-bloqueando-quadril-e-frame-no-pescoco",
    nomeBR: "Cem-Quilos de Judô com Crossface vs Cotovelo Bloqueando Quadril e Frame no Pescoço",
  },
  "judo side w/ far underhook + near wrist": {
    slug: "cem-quilos-de-judo-com-underhook-longe-e-punho-de-perto",
    nomeBR: "Cem-Quilos de Judô com Underhook Longe e Punho de Perto",
  },
  "judo side w/ head and near open elbow": {
    slug: "cem-quilos-de-judo-com-cabeca-e-perto-aberto-cotovelo",
    nomeBR: "Cem-Quilos de Judô com Cabeça e Perto Aberto Cotovelo",
  },
  "judo side w/ whizzer vs shitty underhook": {
    slug: "cem-quilos-de-judo-com-whizzer-vs-shitty-underhook",
    nomeBR: "Cem-Quilos de Judô com Whizzer vs Shitty Underhook",
  },
  "kimura throw/sweep": {
    slug: "kimura-queda-raspagem",
    nomeBR: "Kimura Queda/raspagem",
  },
  "knee bar escape": {
    slug: "chave-de-joelho-fuga",
    nomeBR: "Chave de Joelho Fuga",
  },
  "knee bar from half guard": {
    slug: "chave-de-joelho-de-meia-guarda",
    nomeBR: "Chave de Joelho de Meia-guarda",
  },
  "knee knot": {
    slug: "joelho-knot",
    nomeBR: "Joelho Knot",
  },
  "knee on belly center": {
    slug: "joelho-na-barriga-centro",
    nomeBR: "Joelho na Barriga Centro",
  },
  "knee on belly drape": {
    slug: "joelho-na-barriga-drapeado",
    nomeBR: "Joelho na Barriga Drapeado",
  },
  "knee on belly vs underhook": {
    slug: "joelho-na-barriga-vs-underhook",
    nomeBR: "Joelho na Barriga vs Underhook",
  },
  "knee over pass w/ leg over shoulder": {
    slug: "joelho-por-cima-passagem-com-perna-sobre-o-ombro",
    nomeBR: "Joelho por Cima Passagem com Perna Sobre o Ombro",
  },
  "knee pinned w/ leg over shoulder": {
    slug: "joelho-preso-com-perna-sobre-o-ombro",
    nomeBR: "Joelho Preso com Perna Sobre o Ombro",
  },
  "knee slice vs de la riva": {
    slug: "joelho-cortando-vs-de-la-riva",
    nomeBR: "Joelho Cortando vs de La Riva",
  },
  "knee-pinned butterfly w/ wrist ctrl and overhook": {
    slug: "knee-pinned-guarda-de-gancho-com-punho-controle-e-sobre-gancho",
    nomeBR: "Knee-pinned Guarda de Gancho com Punho Controle e Sobre-Gancho",
  },
  "kneeling behind turned away passee": {
    slug: "ajoelhado-atras-virado-pra-fora-passee",
    nomeBR: "Ajoelhado Atrás Virado pra Fora Passee",
  },
  "kneeling body lock vs kimura": {
    slug: "ajoelhado-body-lock-vs-kimura",
    nomeBR: "Ajoelhado Body Lock vs Kimura",
  },
  "kneeling darce vs half guard w/ underhook": {
    slug: "ajoelhado-d-arce-vs-meia-guarda-com-underhook",
    nomeBR: "Ajoelhado D'Arce vs Meia-guarda com Underhook",
  },
  "kneeling fireman's carry": {
    slug: "ajoelhado-fireman-s-carry",
    nomeBR: "Ajoelhado Fireman's Carry",
  },
  "kneeling single-leg": {
    slug: "ajoelhado-single-leg",
    nomeBR: "Ajoelhado Single Leg",
  },
  "kneeling slx": {
    slug: "ajoelhado-slx",
    nomeBR: "Ajoelhado Slx",
  },
  "kob w/ collar tie and elbow": {
    slug: "joelho-na-barriga-com-pegada-de-nuca-e-cotovelo",
    nomeBR: "Joelho na Barriga com Pegada de Nuca e Cotovelo",
  },
  "kung fu move w/ leg trapped": {
    slug: "kung-fu-move-com-perna-presa",
    nomeBR: "Kung Fu Move com Perna Presa",
  },
  "kuzure kesa gatame": {
    slug: "kuzure-kesa-gatame",
    nomeBR: "Kuzure-kesa-gatame",
  },
  "lead leg collar tie vs south paw": {
    slug: "lead-perna-pegada-de-nuca-vs-south-paw",
    nomeBR: "Lead Perna Pegada de Nuca vs South Paw",
  },
  "leg drag to side control": {
    slug: "leg-drag-para-cem-quilos",
    nomeBR: "Leg Drag para Cem-Quilos",
  },
  "leg drag w/ head&arm": {
    slug: "leg-drag-com-cabeca-e-braco",
    nomeBR: "Leg Drag com Cabeça e Braço",
  },
  "leg drag w/ lockdown": {
    slug: "leg-drag-com-lockdown",
    nomeBR: "Leg Drag com Lockdown",
  },
  "leg drag w/ underhook": {
    slug: "leg-drag-com-underhook",
    nomeBR: "Leg Drag com Underhook",
  },
  "leg pushed down from truck": {
    slug: "perna-empurrado-pra-baixo-de-truck",
    nomeBR: "Perna Empurrado pra Baixo de Truck",
  },
  "leg ride": {
    slug: "leg-ride",
    nomeBR: "Leg Ride",
  },
  "leg smash pass w/ body lock": {
    slug: "esmagamento-de-perna-passagem-com-body-lock",
    nomeBR: "Esmagamento de Perna Passagem com Body Lock",
  },
  "leg smash vs pimp-arm": {
    slug: "esmagamento-de-perna-vs-pimp-arm",
    nomeBR: "Esmagamento de Perna vs Pimp Arm",
  },
  "level dropped": {
    slug: "nivel-baixado",
    nomeBR: "Nível Baixado",
  },
  "limp armed out of cocoon": {
    slug: "molenga-armado-de-cocoon",
    nomeBR: "Molenga Armado de Cocoon",
  },
  "lockdown w/ double unders": {
    slug: "lockdown-com-duplo-por-baixo",
    nomeBR: "Lockdown com Duplo por Baixo",
  },
  "locked triangle halfway perpendicular": {
    slug: "travado-triangulo-halfway-perpendicular",
    nomeBR: "Travado Triângulo Halfway Perpendicular",
  },
  "locked triangle": {
    slug: "travado-triangulo",
    nomeBR: "Travado Triângulo",
  },
  "loose traditional side control": {
    slug: "frouxo-cem-quilos-tradicional",
    nomeBR: "Frouxo Cem-Quilos Tradicional",
  },
  "low double leg": {
    slug: "baixo-double-leg",
    nomeBR: "Baixo Double Leg",
  },
  "low flying double leg": {
    slug: "baixo-voador-double-leg",
    nomeBR: "Baixo Voador Double Leg",
  },
  "low lockdown clinch": {
    slug: "baixo-lockdown-clinch",
    nomeBR: "Baixo Lockdown Clinch",
  },
  "low mount": {
    slug: "montada-baixa",
    nomeBR: "Montada Baixa",
  },
  "low side control w/ arm between legs": {
    slug: "baixo-cem-quilos-com-braco-between-pernas",
    nomeBR: "Baixo Cem-Quilos com Braço Between Pernas",
  },
  "lower-back mounted turtle": {
    slug: "lower-back-montado-tartaruga",
    nomeBR: "Lower-back Montado Tartaruga",
  },
  "mini stomp one": {
    slug: "mini-pisar-uma",
    nomeBR: "Mini Pisar Uma",
  },
  "modified jean jacques sweep": {
    slug: "modified-jean-jacques-raspagem",
    nomeBR: "Modified Jean Jacques Raspagem",
  },
  "mono w/ figure four and foot-in-armpit": {
    slug: "mono-com-figura-quatro-e-foot-in-armpit",
    nomeBR: "Mono com Figura-quatro e Foot-in-armpit",
  },
  "monoplata w/ leg trapped": {
    slug: "monoplata-com-perna-presa",
    nomeBR: "Monoplata com Perna Presa",
  },
  "mount vs body lock": {
    slug: "montada-vs-body-lock",
    nomeBR: "Montada vs Body Lock",
  },
  "mount w/ double unders": {
    slug: "montada-com-duplo-por-baixo",
    nomeBR: "Montada com Duplo por Baixo",
  },
  "mount w/ head&armpit": {
    slug: "montada-com-cabeca-e-axila",
    nomeBR: "Montada com Cabeça e Axila",
  },
  "mounted arm triangle": {
    slug: "montado-triangulo-de-braco",
    nomeBR: "Montado Triângulo de Braço",
  },
  "mounted triangle": {
    slug: "montado-triangulo",
    nomeBR: "Montado Triângulo",
  },
  "mounted turtle w/ double wrist control": {
    slug: "montado-tartaruga-com-double-controle-de-punho",
    nomeBR: "Montado Tartaruga com Double Controle de Punho",
  },
  "mounted turtle w/ seatbelt": {
    slug: "montado-tartaruga-com-seatbelt",
    nomeBR: "Montado Tartaruga com Seatbelt",
  },
  "mounted turtle w/ single hook & seatbelt": {
    slug: "montado-tartaruga-com-single-gancho-e-seatbelt",
    nomeBR: "Montado Tartaruga com Single Gancho e Seatbelt",
  },
  "mounted turtle": {
    slug: "montado-tartaruga",
    nomeBR: "Montado Tartaruga",
  },
  "mounting turtle": {
    slug: "montando-tartaruga",
    nomeBR: "Montando Tartaruga",
  },
  "near side side control kimura": {
    slug: "perto-lado-cem-quilos-kimura",
    nomeBR: "Perto Lado Cem-Quilos Kimura",
  },
  "neck cleared in new jersey": {
    slug: "pescoco-cleared-na-new-jersey",
    nomeBR: "Pescoço Cleared na New Jersey",
  },
  "new jersey w/ meat hook": {
    slug: "new-jersey-com-meat-hook",
    nomeBR: "New Jersey com Meat Hook",
  },
  "new jersey w/ overhook": {
    slug: "new-jersey-com-sobre-gancho",
    nomeBR: "New Jersey com Sobre-Gancho",
  },
  "new jersey": {
    slug: "new-jersey",
    nomeBR: "New Jersey",
  },
  "north south": {
    slug: "norte-sul",
    nomeBR: "Norte-Sul",
  },
  "north/south choke": {
    slug: "estrangulamento-norte-sul",
    nomeBR: "Estrangulamento Norte-Sul",
  },
  "north/south darce": {
    slug: "norte-sul-d-arce",
    nomeBR: "Norte-Sul D'Arce",
  },
  "north/south kimura": {
    slug: "norte-sul-kimura",
    nomeBR: "Norte-Sul Kimura",
  },
  "north/south vs elbow frame": {
    slug: "norte-sul-vs-frame-no-cotovelo",
    nomeBR: "Norte-Sul vs Frame no Cotovelo",
  },
  "octopus half guard": {
    slug: "octopus-meia-guarda",
    nomeBR: "Octopus Meia-guarda",
  },
  "off balanced crab ride": {
    slug: "de-balanced-crab-ride",
    nomeBR: "De Balanced Crab Ride",
  },
  "old school": {
    slug: "old-school",
    nomeBR: "Old School",
  },
  "omoplata dig under escape": {
    slug: "omoplata-dig-por-baixo-fuga",
    nomeBR: "Omoplata Dig por Baixo Fuga",
  },
  "omoplata escape roll": {
    slug: "omoplata-fuga-rolamento",
    nomeBR: "Omoplata Fuga Rolamento",
  },
  "omoplata posturing up": {
    slug: "omoplata-postureando-pra-cima",
    nomeBR: "Omoplata Postureando pra Cima",
  },
  "omoplata w/ far arm vs seated": {
    slug: "omoplata-com-braco-de-longe-vs-sentado",
    nomeBR: "Omoplata com Braço de Longe vs Sentado",
  },
  "outside ashi vs combat base": {
    slug: "por-fora-ashi-vs-base-de-combate",
    nomeBR: "Por Fora Ashi vs Base de Combate",
  },
  "over/under cocoon w/ head on overhook side": {
    slug: "over-under-cocoon-com-cabeca-no-sobre-gancho-lado",
    nomeBR: "Over-under Cocoon com Cabeça no Sobre-Gancho Lado",
  },
  "over/under cocoon w/ head on underhook side": {
    slug: "over-under-cocoon-com-cabeca-no-underhook-lado",
    nomeBR: "Over-under Cocoon com Cabeça no Underhook Lado",
  },
  "over/under pass start": {
    slug: "passagem-over-under-inicio",
    nomeBR: "Passagem Over-under Início",
  },
  "over/under pass w/ leg trapped": {
    slug: "passagem-over-under-com-perna-presa",
    nomeBR: "Passagem Over-under com Perna Presa",
  },
  "overhook and collar vs underhook and tricep": {
    slug: "sobre-gancho-e-gola-vs-underhook-e-triceps",
    nomeBR: "Sobre-Gancho e Gola vs Underhook e Tríceps",
  },
  "pablo lockdown": {
    slug: "pablo-lockdown",
    nomeBR: "Pablo Lockdown",
  },
  "parallel jiu-claw vs locked hands": {
    slug: "paralelo-jiu-claw-vs-travado-maos",
    nomeBR: "Paralelo Jiu-claw vs Travado Mãos",
  },
  "parallel jiu-claw": {
    slug: "paralelo-jiu-claw",
    nomeBR: "Paralelo Jiu-claw",
  },
  "parallel kimura roll": {
    slug: "paralelo-rolamento-de-kimura",
    nomeBR: "Paralelo Rolamento de Kimura",
  },
  "parallel turtle w/ hip and shoulder control": {
    slug: "paralelo-tartaruga-com-quadril-e-controle-de-ombro",
    nomeBR: "Paralelo Tartaruga com Quadril e Controle de Ombro",
  },
  "parallel turtle": {
    slug: "paralelo-tartaruga",
    nomeBR: "Paralelo Tartaruga",
  },
  "passing vs pimp-arm": {
    slug: "passagem-vs-pimp-arm",
    nomeBR: "Passagem vs Pimp Arm",
  },
  "perfect kimura": {
    slug: "perfect-kimura",
    nomeBR: "Perfect Kimura",
  },
  "pinned arm sweep start": {
    slug: "preso-braco-raspagem-inicio",
    nomeBR: "Preso Braço Raspagem Início",
  },
  "posture broken seated butterfly w/ double unders": {
    slug: "postura-quebrada-sentado-guarda-de-gancho-com-duplo-por-baixo",
    nomeBR: "Postura Quebrada Sentado Guarda de Gancho com Duplo por Baixo",
  },
  "postured up new jersey w/ overhook": {
    slug: "postura-pra-cima-new-jersey-com-sobre-gancho",
    nomeBR: "Postura pra Cima New Jersey com Sobre-Gancho",
  },
  "postured up new jersey": {
    slug: "postura-pra-cima-new-jersey",
    nomeBR: "Postura pra Cima New Jersey",
  },
  "postured up omoplata": {
    slug: "postura-pra-cima-omoplata",
    nomeBR: "Postura pra Cima Omoplata",
  },
  "postured up single-x": {
    slug: "postura-pra-cima-single-x",
    nomeBR: "Postura pra Cima Single-x",
  },
  "pre-web": {
    slug: "pre-web",
    nomeBR: "Pre-web",
  },
  "prone rnc": {
    slug: "de-brucos-mata-leao",
    nomeBR: "De Bruços Mata-Leão",
  },
  "pulling guard from single-leg": {
    slug: "puxando-pra-guarda-de-single-leg",
    nomeBR: "Puxando pra Guarda de Single Leg",
  },
  "quarter guard w/ far underhook": {
    slug: "quarto-guarda-com-underhook-longe",
    nomeBR: "Quarto Guarda com Underhook Longe",
  },
  "quarter on side w/ top underhook": {
    slug: "quarto-no-lado-com-underhook-de-cima",
    nomeBR: "Quarto no Lado com Underhook de Cima",
  },
  "quarter w/ double unders": {
    slug: "quarto-com-duplo-por-baixo",
    nomeBR: "Quarto com Duplo por Baixo",
  },
  "quarter z": {
    slug: "quarto-z",
    nomeBR: "Quarto Z",
  },
  "rear naked choke w/ arm trapped": {
    slug: "mata-leao-com-braco-preso",
    nomeBR: "Mata-Leão com Braço Preso",
  },
  "recovered half": {
    slug: "recuperada-half",
    nomeBR: "Recuperada Half",
  },
  "removing butterfly hooks": {
    slug: "removendo-guarda-de-gancho-ganchos",
    nomeBR: "Removendo Guarda de Gancho Ganchos",
  },
  "rev. mounted triangle-crucifix- kimura": {
    slug: "rev-montado-triangle-crucifix-kimura",
    nomeBR: "Rev. Montado Triangle-crucifix-kimura",
  },
  "rev. triangle crucifix + kimura": {
    slug: "rev-triangulo-crucifixo-e-kimura",
    nomeBR: "Rev. Triângulo Crucifixo e Kimura",
  },
  "reverse butterfly sweep": {
    slug: "raspagem-de-gancho-invertida",
    nomeBR: "Raspagem de Gancho Invertida",
  },
  "reverse knee on belly": {
    slug: "joelho-na-barriga-invertido",
    nomeBR: "Joelho na Barriga Invertido",
  },
  "reverse leg drag w/ head&arm": {
    slug: "leg-drag-invertido-com-cabeca-e-braco",
    nomeBR: "Leg Drag Invertido com Cabeça e Braço",
  },
  "reverse leg drag": {
    slug: "leg-drag-invertido",
    nomeBR: "Leg Drag Invertido",
  },
  "reverse triangle": {
    slug: "triangulo-invertido",
    nomeBR: "Triângulo Invertido",
  },
  "rnc on side": {
    slug: "mata-leao-no-lado",
    nomeBR: "Mata-Leão no Lado",
  },
  "rnc with one hook and hip control": {
    slug: "mata-leao-com-um-gancho-e-controle-de-quadril",
    nomeBR: "Mata-Leão com Um Gancho e Controle de Quadril",
  },
  "roll escape from double under pass": {
    slug: "fuga-de-rolamento-de-passagem-com-duplo-por-baixo",
    nomeBR: "Fuga de Rolamento de Passagem com Duplo por Baixo",
  },
  "rolled onto side in mount": {
    slug: "rolado-para-lado-na-montada",
    nomeBR: "Rolado para Lado na Montada",
  },
  "rolling away from pass": {
    slug: "rolando-pra-fora-de-passagem",
    nomeBR: "Rolando pra Fora de Passagem",
  },
  "rolling toward hippo": {
    slug: "rolando-em-direcao-hippo",
    nomeBR: "Rolando em Direção Hippo",
  },
  "roundhouse vs forearm": {
    slug: "chute-giratorio-vs-antebraco",
    nomeBR: "Chute Giratório vs Antebraço",
  },
  "running survival posture": {
    slug: "postura-de-sobrevivencia-correndo",
    nomeBR: "Postura de Sobrevivência Correndo",
  },
  "s-mount w/ isolated arm": {
    slug: "s-mount-com-braco-isolado",
    nomeBR: "S-mount com Braço Isolado",
  },
  "safe haven": {
    slug: "safe-haven",
    nomeBR: "Safe Haven",
  },
  "scarf hold neck crank": {
    slug: "kesa-gatame-gravata-de-pescoco",
    nomeBR: "Kesa-gatame Gravata de Pescoço",
  },
  "seatbelt from dogfight": {
    slug: "seatbelt-de-dogfight",
    nomeBR: "Seatbelt de Dogfight",
  },
  "seated back w/ hook on underhook side": {
    slug: "sentado-costas-com-gancho-no-underhook-lado",
    nomeBR: "Sentado Costas com Gancho no Underhook Lado",
  },
  "seated back w/ seatbelt": {
    slug: "sentado-costas-com-seatbelt",
    nomeBR: "Sentado Costas com Seatbelt",
  },
  "seated butterfly dragging arm": {
    slug: "sentado-guarda-de-gancho-arrastando-braco",
    nomeBR: "Sentado Guarda de Gancho Arrastando Braço",
  },
  "seated butterfly w/ over/under body lock": {
    slug: "sentado-guarda-de-gancho-com-over-under-body-lock",
    nomeBR: "Sentado Guarda de Gancho com Over-under Body Lock",
  },
  "seated butterfly w/ reverse 2-on-1": {
    slug: "sentado-guarda-de-gancho-com-invertida-2-em-1",
    nomeBR: "Sentado Guarda de Gancho com Invertida 2-em-1",
  },
  "seated butterfly w/ single underhook": {
    slug: "sentado-guarda-de-gancho-com-single-underhook",
    nomeBR: "Sentado Guarda de Gancho com Single Underhook",
  },
  "seated half w/ bottom underhook": {
    slug: "sentado-half-com-underhook-de-baixo",
    nomeBR: "Sentado Half com Underhook de Baixo",
  },
  "seated leg drag start": {
    slug: "sentado-leg-drag-inicio",
    nomeBR: "Sentado Leg Drag Início",
  },
  "seated lower back control": {
    slug: "sentado-controle-das-costas-baixas",
    nomeBR: "Sentado Controle das Costas Baixas",
  },
  "seated rnc w/ trapped arm": {
    slug: "sentado-mata-leao-com-preso-braco",
    nomeBR: "Sentado Mata-Leão com Preso Braço",
  },
  "semi crab w/ over/under ankles": {
    slug: "semi-crab-com-over-under-tornozelos",
    nomeBR: "Semi Crab com Over-under Tornozelos",
  },
  "shooting for single": {
    slug: "atacando-pro-single",
    nomeBR: "Atacando pro Single",
  },
  "shooting for underhook in bottom half": {
    slug: "atacando-pro-underhook-na-de-baixo-half",
    nomeBR: "Atacando pro Underhook na de Baixo Half",
  },
  "shrugged turtle": {
    slug: "encolhido-tartaruga",
    nomeBR: "Encolhido Tartaruga",
  },
  "side control arm triangle": {
    slug: "cem-quilos-triangulo-de-braco",
    nomeBR: "Cem-Quilos Triângulo de Braço",
  },
  "side control behind w/ double unders vs overhook": {
    slug: "cem-quilos-atras-com-duplo-por-baixo-vs-sobre-gancho",
    nomeBR: "Cem-Quilos Atrás com Duplo por Baixo vs Sobre-Gancho",
  },
  "side control darce": {
    slug: "cem-quilos-d-arce",
    nomeBR: "Cem-Quilos D'Arce",
  },
  "side control double unders bridge": {
    slug: "cem-quilos-duplo-por-baixo-ponte",
    nomeBR: "Cem-Quilos Duplo por Baixo Ponte",
  },
  "side control elbow level": {
    slug: "cem-quilos-cotovelo-nivel",
    nomeBR: "Cem-Quilos Cotovelo Nível",
  },
  "side control handfight": {
    slug: "cem-quilos-disputa-de-pegada",
    nomeBR: "Cem-Quilos Disputa de Pegada",
  },
  "side control vs turned away t-rex": {
    slug: "cem-quilos-vs-virado-pra-fora-t-rex",
    nomeBR: "Cem-Quilos vs Virado pra Fora T-rex",
  },
  "side control w/ bottom body lock": {
    slug: "cem-quilos-com-de-baixo-body-lock",
    nomeBR: "Cem-Quilos com de Baixo Body Lock",
  },
  "side control w/ bottom underhook": {
    slug: "cem-quilos-com-underhook-de-baixo",
    nomeBR: "Cem-Quilos com Underhook de Baixo",
  },
  "side control w/ crossface vs t-rex": {
    slug: "cem-quilos-com-crossface-vs-t-rex",
    nomeBR: "Cem-Quilos com Crossface vs T-rex",
  },
  "side control w/ far underhook": {
    slug: "cem-quilos-com-underhook-longe",
    nomeBR: "Cem-Quilos com Underhook Longe",
  },
  "side control w/ head&arm vs hip block and overhook": {
    slug: "cem-quilos-com-cabeca-e-braco-vs-bloqueio-de-quadril-e-sobre-gancho",
    nomeBR: "Cem-Quilos com Cabeça e Braço vs Bloqueio de Quadril e Sobre-Gancho",
  },
  "side control w/ head&arm": {
    slug: "cem-quilos-com-cabeca-e-braco",
    nomeBR: "Cem-Quilos com Cabeça e Braço",
  },
  "side control w/ near arm pin and far underhook": {
    slug: "cem-quilos-com-braco-de-perto-prender-e-underhook-longe",
    nomeBR: "Cem-Quilos com Braço de Perto Prender e Underhook Longe",
  },
  "side control w/ near bottom overhook and neck frame": {
    slug: "cem-quilos-com-perto-de-baixo-sobre-gancho-e-frame-no-pescoco",
    nomeBR: "Cem-Quilos com Perto de Baixo Sobre-Gancho e Frame no Pescoço",
  },
  "side control w/ seatbelt and first hook": {
    slug: "cem-quilos-com-seatbelt-e-primeiro-gancho",
    nomeBR: "Cem-Quilos com Seatbelt e Primeiro Gancho",
  },
  "side control w/ vice grip vs underhook": {
    slug: "cem-quilos-com-vice-grip-vs-underhook",
    nomeBR: "Cem-Quilos com Vice Grip vs Underhook",
  },
  "side ctrl w/ lat trap": {
    slug: "lado-controle-com-dorsal-prender",
    nomeBR: "Lado Controle com Dorsal Prender",
  },
  "side ctrl w/ near open elbow and crossface": {
    slug: "lado-controle-com-perto-aberto-cotovelo-e-crossface",
    nomeBR: "Lado Controle com Perto Aberto Cotovelo e Crossface",
  },
  "side half w/ deep underhook": {
    slug: "lado-half-com-underhook-profundo",
    nomeBR: "Lado Half com Underhook Profundo",
  },
  "single leg arm drag 2": {
    slug: "single-leg-arm-drag-2",
    nomeBR: "Single Leg Arm Drag 2",
  },
  "single leg vs kimura": {
    slug: "single-leg-vs-kimura",
    nomeBR: "Single Leg vs Kimura",
  },
  "single leg vs leg ride": {
    slug: "single-leg-vs-leg-ride",
    nomeBR: "Single Leg vs Leg Ride",
  },
  "single leg vs reverse leg": {
    slug: "single-leg-vs-invertida-perna",
    nomeBR: "Single Leg vs Invertida Perna",
  },
  "single leg vs spladle": {
    slug: "single-leg-vs-spladle",
    nomeBR: "Single Leg vs Spladle",
  },
  "single leg w/\\bwrist control": {
    slug: "single-leg-w-wrist-controle",
    nomeBR: "Single Leg W/wrist Controle",
  },
  "single leg x w/ overhook": {
    slug: "single-leg-x-com-sobre-gancho",
    nomeBR: "Single Leg X com Sobre-Gancho",
  },
  "single-leg from knees": {
    slug: "single-leg-de-joelhos",
    nomeBR: "Single Leg de Joelhos",
  },
  "sitting after trip": {
    slug: "sentando-after-rasteira",
    nomeBR: "Sentando After Rasteira",
  },
  "sliced guard vs cross grip and wrist pin": {
    slug: "cortada-guarda-vs-cruzada-pegada-e-punho-prender",
    nomeBR: "Cortada Guarda vs Cruzada Pegada e Punho Prender",
  },
  "sliced knee": {
    slug: "cortada-joelho",
    nomeBR: "Cortada Joelho",
  },
  "smashed half above knees": {
    slug: "esmagado-half-acima-joelhos",
    nomeBR: "Esmagado Half Acima Joelhos",
  },
  "smashed half w/ double unders vs crossface": {
    slug: "esmagado-half-com-duplo-por-baixo-vs-crossface",
    nomeBR: "Esmagado Half com Duplo por Baixo vs Crossface",
  },
  "smashed traditional half": {
    slug: "esmagado-tradicional-half",
    nomeBR: "Esmagado Tradicional Half",
  },
  "smashed ¼ vs whizzer": {
    slug: "esmagado-vs-whizzer",
    nomeBR: "Esmagado ¼ vs Whizzer",
  },
  "snapped down vs standing head stuff": {
    slug: "puxado-pela-nuca-vs-em-pe-cabeca-bloquear",
    nomeBR: "Puxado Pela Nuca vs em Pé Cabeça Bloquear",
  },
  "snapped down": {
    slug: "puxado-pela-nuca",
    nomeBR: "Puxado Pela Nuca",
  },
  "snapping down w/ collar and tricep": {
    slug: "puxando-pela-nuca-com-gola-e-triceps",
    nomeBR: "Puxando Pela Nuca com Gola e Tríceps",
  },
  "south-paw neutral standing": {
    slug: "south-paw-neutro-em-pe",
    nomeBR: "South-paw Neutro em Pé",
  },
  "spider guard w/ wrist control": {
    slug: "guarda-aranha-com-controle-de-punho",
    nomeBR: "Guarda-Aranha com Controle de Punho",
  },
  "spider web w/ near arm extended but far arm free": {
    slug: "spider-web-com-braco-de-perto-estendido-mas-braco-de-longe-liberar",
    nomeBR: "Spider Web com Braço de Perto Estendido mas Braço de Longe Liberar",
  },
  "spiderweb w/ arms locked and leg control": {
    slug: "spider-web-com-bracos-travado-e-controle-de-perna",
    nomeBR: "Spider Web com Braços Travado e Controle de Perna",
  },
  "spiderweb w/o leg control": {
    slug: "spider-web-sem-controle-de-perna",
    nomeBR: "Spider Web sem Controle de Perna",
  },
  "spiderweb w/o leg over head": {
    slug: "spider-web-sem-perna-sobre-a-cabeca",
    nomeBR: "Spider Web sem Perna Sobre a Cabeça",
  },
  "sprawl vs turtle w/ single": {
    slug: "sprawl-vs-tartaruga-com-single",
    nomeBR: "Sprawl vs Tartaruga com Single",
  },
  "sprawl w/ head&arm vs double-leg": {
    slug: "sprawl-com-cabeca-e-braco-vs-double-leg",
    nomeBR: "Sprawl com Cabeça e Braço vs Double-leg",
  },
  "sprawl w/ head&arm vs turtle": {
    slug: "sprawl-com-cabeca-e-braco-vs-tartaruga",
    nomeBR: "Sprawl com Cabeça e Braço vs Tartaruga",
  },
  "sprawled front chestlock vs turtle": {
    slug: "sprawled-frente-chave-de-peito-vs-tartaruga",
    nomeBR: "Sprawled Frente Chave de Peito vs Tartaruga",
  },
  "squared up russian vs elbow grip": {
    slug: "enquadrado-russa-vs-cotovelo-pegada",
    nomeBR: "Enquadrado Russa vs Cotovelo Pegada",
  },
  "stack double under w/ arm pin": {
    slug: "empilhar-duplo-por-baixo-com-braco-preso",
    nomeBR: "Empilhar Duplo por Baixo com Braço Preso",
  },
  "stacked double under pass": {
    slug: "empilhado-passagem-com-duplo-por-baixo",
    nomeBR: "Empilhado Passagem com Duplo por Baixo",
  },
  "stacked w/ waist lock": {
    slug: "empilhado-com-trava-de-cintura",
    nomeBR: "Empilhado com Trava de Cintura",
  },
  "staggered + hip post vs open guard": {
    slug: "staggered-e-quadril-apoiar-vs-guarda-aberta",
    nomeBR: "Staggered e Quadril Apoiar vs Guarda Aberta",
  },
  "standing arm drag on back leg side": {
    slug: "em-pe-arm-drag-no-costas-perna-lado",
    nomeBR: "Em Pé Arm Drag no Costas Perna Lado",
  },
  "standing arm drag on front leg side": {
    slug: "em-pe-arm-drag-no-frente-perna-lado",
    nomeBR: "Em Pé Arm Drag no Frente Perna Lado",
  },
  "standing back mount": {
    slug: "em-pe-pegada-nas-costas",
    nomeBR: "Em Pé Pegada nas Costas",
  },
  "standing behind w/ body lock, grip fighting": {
    slug: "em-pe-atras-com-body-lock-pegada-fighting",
    nomeBR: "Em Pé Atrás com Body Lock, Pegada Fighting",
  },
  "standing behind w/ body lock": {
    slug: "em-pe-atras-com-body-lock",
    nomeBR: "Em Pé Atrás com Body Lock",
  },
  "standing body lock vs kimura": {
    slug: "em-pe-body-lock-vs-kimura",
    nomeBR: "Em Pé Body Lock vs Kimura",
  },
  "standing collar+tricep": {
    slug: "em-pe-gola-e-triceps",
    nomeBR: "Em Pé Gola e Tríceps",
  },
  "standing collar-tie + wrist ctrl": {
    slug: "em-pe-collar-tie-e-punho-controle",
    nomeBR: "Em Pé Collar-tie e Punho Controle",
  },
  "standing dominant overhook + wrist ctrl": {
    slug: "em-pe-dominante-sobre-gancho-e-punho-controle",
    nomeBR: "Em Pé Dominante Sobre-Gancho e Punho Controle",
  },
  "standing front headlock": {
    slug: "em-pe-gravata-frontal",
    nomeBR: "Em Pé Gravata Frontal",
  },
  "standing half guard knee slice start": {
    slug: "em-pe-meia-guarda-joelho-cortando-inicio",
    nomeBR: "Em Pé Meia-guarda Joelho Cortando Início",
  },
  "standing in half w/ hip pinned": {
    slug: "em-pe-na-half-com-quadril-preso",
    nomeBR: "Em Pé na Half com Quadril Preso",
  },
  "standing over+under vs tricep+under": {
    slug: "em-pe-por-cima-e-por-baixo-vs-triceps-e-por-baixo",
    nomeBR: "Em Pé por Cima e por Baixo vs Tríceps e por Baixo",
  },
  "standing parallel upright w/ underhook": {
    slug: "em-pe-paralelo-ereto-com-underhook",
    nomeBR: "Em Pé Paralelo Ereto com Underhook",
  },
  "standing quarter": {
    slug: "em-pe-quarto",
    nomeBR: "Em Pé Quarto",
  },
  "standing rnc": {
    slug: "em-pe-mata-leao",
    nomeBR: "Em Pé Mata-Leão",
  },
  "standing single w/ head outside": {
    slug: "em-pe-single-com-cabeca-por-fora",
    nomeBR: "Em Pé Single com Cabeça por Fora",
  },
  "standing single- leg w/ head and leg outside": {
    slug: "em-pe-single-leg-com-cabeca-e-perna-por-fora",
    nomeBR: "Em Pé Single Leg com Cabeça e Perna por Fora",
  },
  "standing single-leg turned away": {
    slug: "em-pe-single-leg-virado-pra-fora",
    nomeBR: "Em Pé Single Leg Virado pra Fora",
  },
  "standing underhook vs wrist ctrl": {
    slug: "em-pe-underhook-vs-punho-controle",
    nomeBR: "Em Pé Underhook vs Punho Controle",
  },
  "standing up from footsies": {
    slug: "em-pe-pra-cima-de-footsies",
    nomeBR: "Em Pé pra Cima de Footsies",
  },
  "standing up w/ collar tie": {
    slug: "em-pe-pra-cima-com-pegada-de-nuca",
    nomeBR: "Em Pé pra Cima com Pegada de Nuca",
  },
  "standing vs 50/50": {
    slug: "em-pe-vs-50-50",
    nomeBR: "Em Pé vs 50/50",
  },
  "standing vs darce": {
    slug: "em-pe-vs-d-arce",
    nomeBR: "Em Pé vs D'Arce",
  },
  "standing vs elbow control": {
    slug: "em-pe-vs-cotovelo-controle",
    nomeBR: "Em Pé vs Cotovelo Controle",
  },
  "standing vs outside ashi": {
    slug: "em-pe-vs-por-fora-ashi",
    nomeBR: "Em Pé vs por Fora Ashi",
  },
  "standing vs reverse dlr": {
    slug: "em-pe-vs-de-la-riva-invertida",
    nomeBR: "Em Pé vs de La Riva Invertida",
  },
  "standing vs seated ankle to ankle": {
    slug: "em-pe-vs-sentado-tornozelo-para-tornozelo",
    nomeBR: "Em Pé vs Sentado Tornozelo para Tornozelo",
  },
  "standing vs seated grabbing leg": {
    slug: "em-pe-vs-sentado-agarrando-perna",
    nomeBR: "Em Pé vs Sentado Agarrando Perna",
  },
  "standing vs seated single w/ head inside": {
    slug: "em-pe-vs-sentado-single-com-cabeca-por-dentro",
    nomeBR: "Em Pé vs Sentado Single com Cabeça por Dentro",
  },
  "standing vs seated single w/ head outside": {
    slug: "em-pe-vs-sentado-single-com-cabeca-por-fora",
    nomeBR: "Em Pé vs Sentado Single com Cabeça por Fora",
  },
  "standing vs seated w/ knee pinned": {
    slug: "em-pe-vs-sentado-com-joelho-preso",
    nomeBR: "Em Pé vs Sentado com Joelho Preso",
  },
  "standing vs seated": {
    slug: "em-pe-vs-sentado",
    nomeBR: "Em Pé vs Sentado",
  },
  "standing vs stacked w/ legs pinned": {
    slug: "em-pe-vs-empilhado-com-pernas-presas",
    nomeBR: "Em Pé vs Empilhado com Pernas Presas",
  },
  "standing vs supine butterfly": {
    slug: "em-pe-vs-deitado-guarda-de-gancho",
    nomeBR: "Em Pé vs Deitado Guarda de Gancho",
  },
  "standing w/ body lock": {
    slug: "em-pe-com-body-lock",
    nomeBR: "Em Pé com Body Lock",
  },
  "standing w/ collar tie and underhook": {
    slug: "em-pe-com-pegada-de-nuca-e-underhook",
    nomeBR: "Em Pé com Pegada de Nuca e Underhook",
  },
  "standing w/ one leg grabbed vs supine": {
    slug: "em-pe-com-uma-perna-agarrada-vs-deitado",
    nomeBR: "Em Pé com Uma Perna Agarrada vs Deitado",
  },
  "standing w/ whizzer": {
    slug: "em-pe-com-whizzer",
    nomeBR: "Em Pé com Whizzer",
  },
  "standing w/ wrist control and thai clinch": {
    slug: "em-pe-com-controle-de-punho-e-clinch-tailandes",
    nomeBR: "Em Pé com Controle de Punho e Clinch Tailandês",
  },
  "standing x vs near wrist control": {
    slug: "em-pe-x-vs-perto-controle-de-punho",
    nomeBR: "Em Pé X vs Perto Controle de Punho",
  },
  "stepped over t-rex": {
    slug: "passado-por-cima-t-rex",
    nomeBR: "Passado por Cima T-rex",
  },
  "stepping back from knee slice": {
    slug: "passando-costas-de-joelho-cortando",
    nomeBR: "Passando Costas de Joelho Cortando",
  },
  "stepping to side": {
    slug: "passando-para-lado",
    nomeBR: "Passando para Lado",
  },
  "stomp half guard": {
    slug: "pisar-meia-guarda",
    nomeBR: "Pisar Meia-guarda",
  },
  "stoner control": {
    slug: "stoner-control",
    nomeBR: "Stoner Control",
  },
  "straight back w/ seatbelt": {
    slug: "straight-costas-com-seatbelt",
    nomeBR: "Straight Costas com Seatbelt",
  },
  "strike threat from mount": {
    slug: "strike-ameaca-de-montada",
    nomeBR: "Strike Ameaça de Montada",
  },
  "supine butterfly homie": {
    slug: "deitado-guarda-de-gancho-homie",
    nomeBR: "Deitado Guarda de Gancho Homie",
  },
  "supine butterfly w/ over/under": {
    slug: "deitado-guarda-de-gancho-com-over-under",
    nomeBR: "Deitado Guarda de Gancho com Over-under",
  },
  "supine lower back control": {
    slug: "deitado-controle-das-costas-baixas",
    nomeBR: "Deitado Controle das Costas Baixas",
  },
  "suspended butterfly": {
    slug: "suspensa-guarda-de-gancho",
    nomeBR: "Suspensa Guarda de Gancho",
  },
  "sweep single": {
    slug: "raspagem-single",
    nomeBR: "Raspagem Single",
  },
  "switching to judo side": {
    slug: "trocando-para-cem-quilos-de-judo",
    nomeBR: "Trocando para Cem-Quilos de Judô",
  },
  "switching to regular side": {
    slug: "trocando-para-regular-lado",
    nomeBR: "Trocando para Regular Lado",
  },
  "threatened triangle w/ hands clasped": {
    slug: "ameacado-triangulo-com-maos-entrelacadas",
    nomeBR: "Ameaçado Triângulo com Mãos Entrelaçadas",
  },
  "throw finish": {
    slug: "finalizar-a-queda",
    nomeBR: "Finalizar a Queda",
  },
  "toe hold roll": {
    slug: "toe-hold-rolamento",
    nomeBR: "Toe Hold Rolamento",
  },
  "toe hold": {
    slug: "toe-hold",
    nomeBR: "Toe Hold",
  },
  "top 3/4 lockdown": {
    slug: "de-cima-3-4-lockdown",
    nomeBR: "De Cima 3/4 Lockdown",
  },
  "top attempting mount from side w/ open elbow": {
    slug: "de-cima-tentando-montada-de-lado-com-aberto-cotovelo",
    nomeBR: "De Cima Tentando Montada de Lado com Aberto Cotovelo",
  },
  "top gogo": {
    slug: "de-cima-gogoplata",
    nomeBR: "De Cima Gogoplata",
  },
  "top half lockdown vs double overs": {
    slug: "de-cima-half-lockdown-vs-duplo-por-cima",
    nomeBR: "De Cima Half Lockdown vs Duplo por Cima",
  },
  "top lock clinch": {
    slug: "de-cima-travar-clinch",
    nomeBR: "De Cima Travar Clinch",
  },
  "top lockdown vs single butterfly": {
    slug: "de-cima-lockdown-vs-single-guarda-de-gancho",
    nomeBR: "De Cima Lockdown vs Single Guarda de Gancho",
  },
  "top pulling away from x-guard": {
    slug: "de-cima-puxando-pra-fora-de-guarda-x",
    nomeBR: "De Cima Puxando pra Fora de Guarda-X",
  },
  "top shooting for underhooks in butterfly": {
    slug: "de-cima-atacando-pro-underhooks-na-guarda-de-gancho",
    nomeBR: "De Cima Atacando pro Underhooks na Guarda de Gancho",
  },
  "top turning to twister pass": {
    slug: "de-cima-virando-para-passagem-twister",
    nomeBR: "De Cima Virando para Passagem Twister",
  },
  "tornado guard": {
    slug: "tornado-guarda",
    nomeBR: "Tornado Guarda",
  },
  "tripped through knee control": {
    slug: "tripped-through-controle-de-joelho",
    nomeBR: "Tripped Through Controle de Joelho",
  },
  "truck": {
    slug: "truck",
    nomeBR: "Truck",
  },
  "turned in t-rex vs side vice": {
    slug: "virado-na-t-rex-vs-lado-vice",
    nomeBR: "Virado na T-rex vs Lado Vice",
  },
  "turning to twister pass from z": {
    slug: "virando-para-passagem-twister-de-z",
    nomeBR: "Virando para Passagem Twister de Z",
  },
  "turtle behind": {
    slug: "tartaruga-atras",
    nomeBR: "Tartaruga Atrás",
  },
  "turtle body lock": {
    slug: "tartaruga-body-lock",
    nomeBR: "Tartaruga Body Lock",
  },
  "turtle crucified w/ one leg": {
    slug: "tartaruga-crucificado-com-uma-perna",
    nomeBR: "Tartaruga Crucificado com Uma Perna",
  },
  "turtle shoulder roll w/ leg": {
    slug: "tartaruga-rolamento-de-ombro-com-perna",
    nomeBR: "Tartaruga Rolamento de Ombro com Perna",
  },
  "turtle stepping over": {
    slug: "tartaruga-passando-por-cima",
    nomeBR: "Tartaruga Passando por Cima",
  },
  "turtle vs darce": {
    slug: "tartaruga-vs-d-arce",
    nomeBR: "Tartaruga vs D'Arce",
  },
  "turtle w/ open elbow vs vice": {
    slug: "tartaruga-com-aberto-cotovelo-vs-vice",
    nomeBR: "Tartaruga com Aberto Cotovelo vs Vice",
  },
  "turtle w/ seat- belt and knee under elbow": {
    slug: "tartaruga-com-seatbelt-e-joelho-por-baixo-cotovelo",
    nomeBR: "Tartaruga com Seatbelt e Joelho por Baixo Cotovelo",
  },
  "turtle w/ seatbelt and near hook": {
    slug: "tartaruga-com-seatbelt-e-perto-gancho",
    nomeBR: "Tartaruga com Seatbelt e Perto Gancho",
  },
  "turtle w/ single-leg vs vice grip": {
    slug: "tartaruga-com-single-leg-vs-vice-grip",
    nomeBR: "Tartaruga com Single Leg vs Vice Grip",
  },
  "twister pass w/ arm inside": {
    slug: "passagem-twister-com-braco-por-dentro",
    nomeBR: "Passagem Twister com Braço por Dentro",
  },
  "twister pass w/ far arm stuffed": {
    slug: "passagem-twister-com-braco-de-longe-stuffed",
    nomeBR: "Passagem Twister com Braço de Longe Stuffed",
  },
  "twister roll halfway": {
    slug: "rolamento-twister-halfway",
    nomeBR: "Rolamento Twister Halfway",
  },
  "twister roll start": {
    slug: "rolamento-twister-inicio",
    nomeBR: "Rolamento Twister Início",
  },
  "twister side control w/ grapevine": {
    slug: "twister-cem-quilos-com-grapevine",
    nomeBR: "Twister Cem-Quilos com Grapevine",
  },
  "twister side control": {
    slug: "twister-cem-quilos",
    nomeBR: "Twister Cem-Quilos",
  },
  "twister side w/ bottom turned in": {
    slug: "twister-lado-com-de-baixo-virado-na",
    nomeBR: "Twister Lado com de Baixo Virado na",
  },
  "twister side w/ bottom underhook": {
    slug: "twister-lado-com-underhook-de-baixo",
    nomeBR: "Twister Lado com Underhook de Baixo",
  },
  "twister side w/ fishnet and love handle": {
    slug: "twister-lado-com-fishnet-e-love-handle",
    nomeBR: "Twister Lado com Fishnet e Love Handle",
  },
  "twister side w/ grapevine and fishnet": {
    slug: "twister-lado-com-grapevine-e-fishnet",
    nomeBR: "Twister Lado com Grapevine e Fishnet",
  },
  "upright z": {
    slug: "ereto-z",
    nomeBR: "Ereto Z",
  },
  "waiter sweep start": {
    slug: "raspagem-do-garcom-inicio",
    nomeBR: "Raspagem do Garçom Início",
  },
  "weak double unders vs head+tricep": {
    slug: "fraco-duplo-por-baixo-vs-cabeca-e-triceps",
    nomeBR: "Fraco Duplo por Baixo vs Cabeça e Tríceps",
  },
  "weak underhook vs head block": {
    slug: "underhook-fraco-vs-cabeca-bloquear",
    nomeBR: "Underhook Fraco vs Cabeça Bloquear",
  },
  "wide standing x-guard": {
    slug: "wide-em-pe-guarda-x",
    nomeBR: "Wide em Pé Guarda-X",
  },
  "wide upright standing x": {
    slug: "wide-ereto-em-pe-x",
    nomeBR: "Wide Ereto em Pé X",
  },
  "x guard w/o underhook": {
    slug: "guarda-x-sem-underhook",
    nomeBR: "Guarda-X sem Underhook",
  },
  "x-guard on knee leaning forward": {
    slug: "guarda-x-no-joelho-inclinando-pra-frente",
    nomeBR: "Guarda-X no Joelho Inclinando pra Frente",
  },
  "x-guard push sweep start": {
    slug: "guarda-x-raspagem-de-empurrao-inicio",
    nomeBR: "Guarda-X Raspagem de Empurrão Início",
  },
  "x-guard sweep": {
    slug: "guarda-x-raspagem",
    nomeBR: "Guarda-X Raspagem",
  },
  "z guard toe hold threat": {
    slug: "z-guarda-toe-hold-ameaca",
    nomeBR: "Z Guarda Toe Hold Ameaça",
  },
  "z guard vs wrist pin": {
    slug: "z-guarda-vs-punho-prender",
    nomeBR: "Z Guarda vs Punho Prender",
  },
  "z guard w/ neck frame and wrist control": {
    slug: "z-guarda-com-frame-no-pescoco-e-controle-de-punho",
    nomeBR: "Z Guarda com Frame no Pescoço e Controle de Punho",
  },
  "z guard w/ wrist and collar tie": {
    slug: "z-guarda-com-punho-e-pegada-de-nuca",
    nomeBR: "Z Guarda com Punho e Pegada de Nuca",
  },
  "¼ clinch knee battle": {
    slug: "clinch-joelho-disputa",
    nomeBR: "¼ Clinch Joelho Disputa",
  },
  "¼ clinch w/ knee on ground": {
    slug: "clinch-com-joelho-no-ground",
    nomeBR: "¼ Clinch com Joelho no Ground",
  },
  "¼ clinch w/ underhook": {
    slug: "clinch-com-underhook",
    nomeBR: "¼ Clinch com Underhook",
  },
  "¼ clinch": {
    slug: "clinch",
    nomeBR: "¼ Clinch",
  },
  "¾ mount w/ head&arm": {
    slug: "montada-com-cabeca-e-braco",
    nomeBR: "¾ Montada com Cabeça e Braço",
  },
  "¾ mount": {
    slug: "montada-2",
    nomeBR: "¾ Montada",
  },
  "(un)kneel": {
    slug: "un-kneel",
    nomeBR: "(un)kneel",
    tipo: "ataque",
  },
  "(un)pin knee": {
    slug: "un-pin-joelho",
    nomeBR: "(un)pin Joelho",
    tipo: "ataque",
  },
  "100%": {
    slug: "100",
    nomeBR: "100%",
    tipo: "ataque",
  },
  "acquire seatbelt": {
    slug: "pegar-seatbelt",
    nomeBR: "Pegar Seatbelt",
    tipo: "ataque",
  },
  "add other leg": {
    slug: "add-outro-perna",
    nomeBR: "Add Outro Perna",
    tipo: "ataque",
  },
  "adjust": {
    slug: "ajustar",
    nomeBR: "Ajustar",
    tipo: "ataque",
  },
  "air 300": {
    slug: "air-300",
    nomeBR: "Air 300",
    tipo: "ataque",
  },
  "alcatraz": {
    slug: "alcatraz",
    nomeBR: "Alcatraz",
    tipo: "ataque",
  },
  "anaconda": {
    slug: "anaconda",
    nomeBR: "Anaconda",
    tipo: "finalizacao",
  },
  "arm bar (wip)": {
    slug: "armlock-wip",
    nomeBR: "Armlock (wip)",
    tipo: "finalizacao",
  },
  "arm bar": {
    slug: "armlock-2",
    nomeBR: "Armlock",
    tipo: "finalizacao",
  },
  "arm crush": {
    slug: "braco-esmagar",
    nomeBR: "Braço Esmagar",
    tipo: "ataque",
  },
  "arm drag to half guard": {
    slug: "arm-drag-para-meia-guarda",
    nomeBR: "Arm Drag para Meia-guarda",
    tipo: "ataque",
  },
  "arm drag to shoulder pin": {
    slug: "arm-drag-para-ombro-preso",
    nomeBR: "Arm Drag para Ombro Preso",
    tipo: "ataque",
  },
  "arm drag": {
    slug: "arm-drag",
    nomeBR: "Arm Drag",
    tipo: "ataque",
  },
  "arm escapes": {
    slug: "braco-escapes",
    nomeBR: "Braço Escapes",
    tipo: "perda-de-guarda",
  },
  "arm pulled out": {
    slug: "braco-puxado-pra-fora",
    nomeBR: "Braço Puxado pra Fora",
    tipo: "ataque",
  },
  "arm triangle": {
    slug: "triangulo-de-braco",
    nomeBR: "Triângulo de Braço",
    tipo: "finalizacao",
  },
  "arm-in guillotine": {
    slug: "guilhotina-com-braco-dentro",
    nomeBR: "Guilhotina com Braço Dentro",
    tipo: "finalizacao",
  },
  "arm-in": {
    slug: "braco-dentro",
    nomeBR: "Braço Dentro",
    tipo: "ataque",
  },
  "arm-out": {
    slug: "braco-fora",
    nomeBR: "Braço Fora",
    tipo: "ataque",
  },
  "armbar": {
    slug: "armlock-3",
    nomeBR: "Armlock",
    tipo: "finalizacao",
  },
  "attack leg": {
    slug: "atacar-perna",
    nomeBR: "Atacar Perna",
    tipo: "ataque",
  },
  "attack legs": {
    slug: "atacar-pernas",
    nomeBR: "Atacar Pernas",
    tipo: "ataque",
  },
  "attempt sweep": {
    slug: "tentativa-raspagem",
    nomeBR: "Tentativa Raspagem",
    tipo: "raspagem",
  },
  "back roll": {
    slug: "rolamento-pra-tras",
    nomeBR: "Rolamento pra Trás",
    tipo: "ataque",
  },
  "back step pass": {
    slug: "back-step-passagem",
    nomeBR: "Back Step Passagem",
    tipo: "perda-de-guarda",
  },
  "back step w/o head ctrl": {
    slug: "back-step-sem-cabeca-controle",
    nomeBR: "Back Step sem Cabeça Controle",
    tipo: "ataque",
  },
  "back step": {
    slug: "back-step",
    nomeBR: "Back Step",
    tipo: "ataque",
  },
  "back to pre-web": {
    slug: "costas-para-pre-web",
    nomeBR: "Costas para Pre-web",
    tipo: "ataque",
  },
  "backdoor escape": {
    slug: "backdoor-fuga",
    nomeBR: "Backdoor Fuga",
    tipo: "perda-de-guarda",
  },
  "backdoor": {
    slug: "backdoor",
    nomeBR: "Backdoor",
    tipo: "ataque",
  },
  "backward arm drag": {
    slug: "pra-tras-arm-drag",
    nomeBR: "Pra Trás Arm Drag",
    tipo: "ataque",
  },
  "barzegar": {
    slug: "barzegar",
    nomeBR: "Barzegar",
    tipo: "ataque",
  },
  "base and trip": {
    slug: "apoiar-e-derrubar",
    nomeBR: "Apoiar e Derrubar",
    tipo: "ataque",
  },
  "berimbolo": {
    slug: "berimbolo",
    nomeBR: "Berimbolo",
    tipo: "ataque",
  },
  "blast to slx": {
    slug: "investida-para-slx",
    nomeBR: "Investida para Slx",
    tipo: "ataque",
  },
  "block first hook": {
    slug: "bloquear-primeiro-gancho",
    nomeBR: "Bloquear Primeiro Gancho",
    tipo: "ataque",
  },
  "block hip": {
    slug: "bloquear-quadril",
    nomeBR: "Bloquear Quadril",
    tipo: "ataque",
  },
  "block, seatbelt": {
    slug: "bloquear-seatbelt",
    nomeBR: "Bloquear, Seatbelt",
    tipo: "ataque",
  },
  "block": {
    slug: "bloquear",
    nomeBR: "Bloquear",
    tipo: "ataque",
  },
  "blocked by de la riva": {
    slug: "bloqueada-by-de-la-riva",
    nomeBR: "Bloqueada By de La Riva",
    tipo: "ataque",
  },
  "body lock": {
    slug: "body-lock",
    nomeBR: "Body Lock",
    tipo: "ataque",
  },
  "bottom bails out": {
    slug: "de-baixo-abandona-pra-fora",
    nomeBR: "De Baixo Abandona pra Fora",
    tipo: "ataque",
  },
  "bottom bails": {
    slug: "de-baixo-abandona",
    nomeBR: "De Baixo Abandona",
    tipo: "ataque",
  },
  "bottom blocks knee, top takes underhook": {
    slug: "de-baixo-bloqueia-knee-de-cima-pega-underhook",
    nomeBR: "De Baixo Bloqueia Knee, de Cima Pega Underhook",
    tipo: "ataque",
  },
  "bottom blocks pass": {
    slug: "de-baixo-bloqueia-passagem",
    nomeBR: "De Baixo Bloqueia Passagem",
    tipo: "perda-de-guarda",
  },
  "bottom blocks": {
    slug: "de-baixo-bloqueia",
    nomeBR: "De Baixo Bloqueia",
    tipo: "ataque",
  },
  "bottom body locks, top grabs neck": {
    slug: "de-baixo-body-locks-de-cima-agarra-pescoco",
    nomeBR: "De Baixo Body Locks, de Cima Agarra Pescoço",
    tipo: "ataque",
  },
  "bottom brings leg over": {
    slug: "de-baixo-traz-perna-por-cima",
    nomeBR: "De Baixo Traz Perna por Cima",
    tipo: "ataque",
  },
  "bottom clinches leg": {
    slug: "de-baixo-abraca-perna",
    nomeBR: "De Baixo Abraça Perna",
    tipo: "ataque",
  },
  "bottom comes up on single": {
    slug: "de-baixo-vem-pra-cima-no-single",
    nomeBR: "De Baixo Vem pra Cima no Single",
    tipo: "ataque",
  },
  "bottom drops shoulders to mat": {
    slug: "de-baixo-baixa-shoulders-para-tatame",
    nomeBR: "De Baixo Baixa Shoulders para Tatame",
    tipo: "ataque",
  },
  "bottom extends legs": {
    slug: "de-baixo-estende-pernas",
    nomeBR: "De Baixo Estende Pernas",
    tipo: "ataque",
  },
  "bottom frees leg": {
    slug: "de-baixo-libera-perna",
    nomeBR: "De Baixo Libera Perna",
    tipo: "ataque",
  },
  "bottom gets and uses two-on-one to get kimura": {
    slug: "de-baixo-pega-e-usa-2-em-1-para-pegar-kimura",
    nomeBR: "De Baixo Pega e Usa 2-em-1 para Pegar Kimura",
    tipo: "finalizacao",
  },
  "bottom gets arm inside": {
    slug: "de-baixo-pega-braco-por-dentro",
    nomeBR: "De Baixo Pega Braço por Dentro",
    tipo: "ataque",
  },
  "bottom gets butterfly": {
    slug: "de-baixo-pega-guarda-de-gancho",
    nomeBR: "De Baixo Pega Guarda de Gancho",
    tipo: "ataque",
  },
  "bottom gets c-cups": {
    slug: "de-baixo-pega-c-cups",
    nomeBR: "De Baixo Pega C-cups",
    tipo: "ataque",
  },
  "bottom gets homie": {
    slug: "de-baixo-pega-homie",
    nomeBR: "De Baixo Pega Homie",
    tipo: "ataque",
  },
  "bottom gets lockdown": {
    slug: "de-baixo-pega-lockdown",
    nomeBR: "De Baixo Pega Lockdown",
    tipo: "ataque",
  },
  "bottom gets reverse 2-on-1": {
    slug: "de-baixo-pega-invertida-2-em-1",
    nomeBR: "De Baixo Pega Invertida 2-em-1",
    tipo: "ataque",
  },
  "bottom gets to knees": {
    slug: "de-baixo-pega-para-joelhos",
    nomeBR: "De Baixo Pega para Joelhos",
    tipo: "ataque",
  },
  "bottom gets to single": {
    slug: "de-baixo-pega-para-single",
    nomeBR: "De Baixo Pega para Single",
    tipo: "ataque",
  },
  "bottom gets underhook": {
    slug: "de-baixo-pega-underhook",
    nomeBR: "De Baixo Pega Underhook",
    tipo: "ataque",
  },
  "bottom gets underhooks": {
    slug: "de-baixo-pega-underhooks",
    nomeBR: "De Baixo Pega Underhooks",
    tipo: "ataque",
  },
  "bottom gives up overhook": {
    slug: "de-baixo-gives-pra-cima-sobre-gancho",
    nomeBR: "De Baixo Gives pra Cima Sobre-Gancho",
    tipo: "ataque",
  },
  "bottom goes for single": {
    slug: "de-baixo-vai-pro-single",
    nomeBR: "De Baixo Vai pro Single",
    tipo: "ataque",
  },
  "bottom goes parallel": {
    slug: "de-baixo-vai-paralelo",
    nomeBR: "De Baixo Vai Paralelo",
    tipo: "ataque",
  },
  "bottom grabs arm": {
    slug: "de-baixo-agarra-braco",
    nomeBR: "De Baixo Agarra Braço",
    tipo: "ataque",
  },
  "bottom grabs leg": {
    slug: "de-baixo-agarra-perna",
    nomeBR: "De Baixo Agarra Perna",
    tipo: "ataque",
  },
  "bottom inverts": {
    slug: "de-baixo-inverte",
    nomeBR: "De Baixo Inverte",
    tipo: "ataque",
  },
  "bottom keeps neck frame": {
    slug: "de-baixo-mantem-frame-no-pescoco",
    nomeBR: "De Baixo Mantém Frame no Pescoço",
    tipo: "ataque",
  },
  "bottom progresses": {
    slug: "de-baixo-avanca",
    nomeBR: "De Baixo Avança",
    tipo: "ataque",
  },
  "bottom pulls out top's leg": {
    slug: "de-baixo-puxa-pra-fora-do-de-cima-perna",
    nomeBR: "De Baixo Puxa pra Fora do de Cima Perna",
    tipo: "ataque",
  },
  "bottom pushes hard": {
    slug: "de-baixo-empurra-hard",
    nomeBR: "De Baixo Empurra Hard",
    tipo: "ataque",
  },
  "bottom pushes head": {
    slug: "de-baixo-empurra-cabeca",
    nomeBR: "De Baixo Empurra Cabeça",
    tipo: "ataque",
  },
  "bottom pushes knee to ground": {
    slug: "de-baixo-empurra-joelho-para-ground",
    nomeBR: "De Baixo Empurra Joelho para Ground",
    tipo: "ataque",
  },
  "bottom pushes leg, top traps lat": {
    slug: "de-baixo-empurra-leg-de-cima-prende-dorsal",
    nomeBR: "De Baixo Empurra Leg, de Cima Prende Dorsal",
    tipo: "ataque",
  },
  "bottom puts feet on hips": {
    slug: "de-baixo-poe-pes-no-quadril",
    nomeBR: "De Baixo Põe Pés no Quadril",
    tipo: "ataque",
  },
  "bottom reaches turtle": {
    slug: "de-baixo-alcanca-tartaruga",
    nomeBR: "De Baixo Alcança Tartaruga",
    tipo: "ataque",
  },
  "bottom recovers": {
    slug: "de-baixo-recupera",
    nomeBR: "De Baixo Recupera",
    tipo: "ataque",
  },
  "bottom releases": {
    slug: "de-baixo-solta",
    nomeBR: "De Baixo Solta",
    tipo: "ataque",
  },
  "bottom resists": {
    slug: "de-baixo-resiste",
    nomeBR: "De Baixo Resiste",
    tipo: "ataque",
  },
  "bottom retracts arm": {
    slug: "de-baixo-recolhe-braco",
    nomeBR: "De Baixo Recolhe Braço",
    tipo: "ataque",
  },
  "bottom rolls away": {
    slug: "de-baixo-rola-pra-fora",
    nomeBR: "De Baixo Rola pra Fora",
    tipo: "ataque",
  },
  "bottom rolls backward": {
    slug: "de-baixo-rola-pra-tras",
    nomeBR: "De Baixo Rola pra Trás",
    tipo: "ataque",
  },
  "bottom rolls onto back": {
    slug: "de-baixo-rola-para-costas",
    nomeBR: "De Baixo Rola para Costas",
    tipo: "ataque",
  },
  "bottom rolls onto side and snatches foot": {
    slug: "de-baixo-rola-para-lado-e-rouba-pe",
    nomeBR: "De Baixo Rola para Lado e Rouba Pé",
    tipo: "ataque",
  },
  "bottom rolls onto side": {
    slug: "de-baixo-rola-para-lado",
    nomeBR: "De Baixo Rola para Lado",
    tipo: "ataque",
  },
  "bottom shoots for underhook": {
    slug: "de-baixo-ataca-pro-underhook",
    nomeBR: "De Baixo Ataca pro Underhook",
    tipo: "ataque",
  },
  "bottom sits up": {
    slug: "de-baixo-senta-pra-cima",
    nomeBR: "De Baixo Senta pra Cima",
    tipo: "ataque",
  },
  "bottom straightens leg": {
    slug: "de-baixo-estica-perna",
    nomeBR: "De Baixo Estica Perna",
    tipo: "ataque",
  },
  "bottom takes arm triangle": {
    slug: "de-baixo-pega-triangulo-de-braco",
    nomeBR: "De Baixo Pega Triângulo de Braço",
    tipo: "finalizacao",
  },
  "bottom takes overhook": {
    slug: "de-baixo-pega-sobre-gancho",
    nomeBR: "De Baixo Pega Sobre-Gancho",
    tipo: "ataque",
  },
  "bottom throws leg up": {
    slug: "de-baixo-joga-perna-pra-cima",
    nomeBR: "De Baixo Joga Perna pra Cima",
    tipo: "ataque",
  },
  "bottom throws up leg": {
    slug: "de-baixo-joga-pra-cima-perna",
    nomeBR: "De Baixo Joga pra Cima Perna",
    tipo: "ataque",
  },
  "bottom thwarts pass": {
    slug: "de-baixo-frustra-passagem",
    nomeBR: "De Baixo Frustra Passagem",
    tipo: "perda-de-guarda",
  },
  "bottom trades neck frame for overhook": {
    slug: "de-baixo-troca-frame-no-pescoco-pro-sobre-gancho",
    nomeBR: "De Baixo Troca Frame no Pescoço pro Sobre-Gancho",
    tipo: "ataque",
  },
  "bottom traps leg": {
    slug: "de-baixo-prende-perna",
    nomeBR: "De Baixo Prende Perna",
    tipo: "ataque",
  },
  "bottom tries to step over": {
    slug: "de-baixo-tenta-para-passo-por-cima",
    nomeBR: "De Baixo Tenta para Passo por Cima",
    tipo: "ataque",
  },
  "bottom turns away, top gets seatbelt": {
    slug: "de-baixo-vira-away-de-cima-pega-seatbelt",
    nomeBR: "De Baixo Vira Away, de Cima Pega Seatbelt",
    tipo: "ataque",
  },
  "bottom turns away": {
    slug: "de-baixo-vira-pra-fora",
    nomeBR: "De Baixo Vira pra Fora",
    tipo: "ataque",
  },
  "bottom turns back to mat and pimp arms": {
    slug: "de-baixo-vira-costas-para-tatame-e-pimp-bracos",
    nomeBR: "De Baixo Vira Costas para Tatame e Pimp Braços",
    tipo: "ataque",
  },
  "bottom turns in and gets underhook": {
    slug: "de-baixo-vira-na-e-pega-underhook",
    nomeBR: "De Baixo Vira na e Pega Underhook",
    tipo: "ataque",
  },
  "bottom turns in, top vice grips": {
    slug: "de-baixo-vira-in-de-cima-vice-pegadas",
    nomeBR: "De Baixo Vira In, de Cima Vice Pegadas",
    tipo: "ataque",
  },
  "bottom turns in": {
    slug: "de-baixo-vira-na",
    nomeBR: "De Baixo Vira na",
    tipo: "ataque",
  },
  "bottom uses whizzer and butterfly": {
    slug: "de-baixo-usa-whizzer-e-guarda-de-gancho",
    nomeBR: "De Baixo Usa Whizzer e Guarda de Gancho",
    tipo: "ataque",
  },
  "bottom wants underhook": {
    slug: "de-baixo-quer-underhook",
    nomeBR: "De Baixo Quer Underhook",
    tipo: "ataque",
  },
  "break & pass": {
    slug: "break-e-passagem",
    nomeBR: "Break e Passagem",
    tipo: "perda-de-guarda",
  },
  "break down": {
    slug: "derrubar-2",
    nomeBR: "Derrubar",
    tipo: "ataque",
  },
  "break grip": {
    slug: "quebrar-a-pegada",
    nomeBR: "Quebrar a Pegada",
    tipo: "ataque",
  },
  "break open": {
    slug: "abrir",
    nomeBR: "Abrir",
    tipo: "ataque",
  },
  "break posture": {
    slug: "quebrar-a-postura",
    nomeBR: "Quebrar a Postura",
    tipo: "perda-de-guarda",
  },
  "breakdown": {
    slug: "derrubada",
    nomeBR: "Derrubada",
    tipo: "perda-de-guarda",
  },
  "bridge and clinch": {
    slug: "ponte-e-clinch",
    nomeBR: "Ponte e Clinch",
    tipo: "ataque",
  },
  "bridge escape": {
    slug: "fuga-de-ponte",
    nomeBR: "Fuga de Ponte",
    tipo: "perda-de-guarda",
  },
  "bridge for underhook": {
    slug: "ponte-pro-underhook",
    nomeBR: "Ponte pro Underhook",
    tipo: "ataque",
  },
  "bridge": {
    slug: "ponte",
    nomeBR: "Ponte",
    tipo: "ataque",
  },
  "bring hips close": {
    slug: "trazer-quadril-close",
    nomeBR: "Trazer Quadril Close",
    tipo: "ataque",
  },
  "bring inside leg out": {
    slug: "trazer-por-dentro-perna-pra-fora",
    nomeBR: "Trazer por Dentro Perna pra Fora",
    tipo: "ataque",
  },
  "broomstick": {
    slug: "broomstick",
    nomeBR: "Broomstick",
    tipo: "ataque",
  },
  "bull fighter pass": {
    slug: "passagem-toureando",
    nomeBR: "Passagem Toureando",
    tipo: "perda-de-guarda",
  },
  "bump forward": {
    slug: "empurrar-pra-frente",
    nomeBR: "Empurrar pra Frente",
    tipo: "ataque",
  },
  "butterfly hook": {
    slug: "guarda-de-gancho-gancho",
    nomeBR: "Guarda de Gancho Gancho",
    tipo: "ataque",
  },
  "butterfly": {
    slug: "guarda-de-gancho",
    nomeBR: "Guarda de Gancho",
    tipo: "ataque",
  },
  "calf crank": {
    slug: "calf-slicer",
    nomeBR: "Calf Slicer",
    tipo: "finalizacao",
  },
  "cartwheel to back": {
    slug: "cartwheel-para-costas",
    nomeBR: "Cartwheel para Costas",
    tipo: "ataque",
  },
  "cement job": {
    slug: "cement-job",
    nomeBR: "Cement Job",
    tipo: "ataque",
  },
  "chair sit": {
    slug: "sentar-na-cadeira",
    nomeBR: "Sentar na Cadeira",
    tipo: "ataque",
  },
  "choke": {
    slug: "estrangulamento",
    nomeBR: "Estrangulamento",
    tipo: "finalizacao",
  },
  "clasp hands together": {
    slug: "entrelacar-maos-juntas",
    nomeBR: "Entrelaçar Mãos Juntas",
    tipo: "ataque",
  },
  "claw to quarter": {
    slug: "claw-para-quarto",
    nomeBR: "Claw para Quarto",
    tipo: "ataque",
  },
  "clear arm": {
    slug: "liberar-o-braco",
    nomeBR: "Liberar o Braço",
    tipo: "ataque",
  },
  "clear headlock": {
    slug: "liberar-a-gravata",
    nomeBR: "Liberar a Gravata",
    tipo: "ataque",
  },
  "clear leg with head": {
    slug: "liberar-a-perna-com-cabeca",
    nomeBR: "Liberar a Perna com Cabeça",
    tipo: "perda-de-guarda",
  },
  "clear neck": {
    slug: "liberar-o-pescoco",
    nomeBR: "Liberar o Pescoço",
    tipo: "ataque",
  },
  "clinch": {
    slug: "clinch-2",
    nomeBR: "Clinch",
    tipo: "ataque",
  },
  "clubbing sweep": {
    slug: "raspagem-clubbing",
    nomeBR: "Raspagem Clubbing",
    tipo: "raspagem",
  },
  "complete pass": {
    slug: "completar-a-passagem",
    nomeBR: "Completar a Passagem",
    tipo: "perda-de-guarda",
  },
  "complete sweep": {
    slug: "completar-raspagem",
    nomeBR: "Completar Raspagem",
    tipo: "raspagem",
  },
  "complete": {
    slug: "completar",
    nomeBR: "Completar",
    tipo: "ataque",
  },
  "completed": {
    slug: "concluida",
    nomeBR: "Concluída",
    tipo: "ataque",
  },
  "compress buttocks": {
    slug: "comprimir-o-quadril",
    nomeBR: "Comprimir o Quadril",
    tipo: "ataque",
  },
  "continue back step": {
    slug: "continuar-back-step",
    nomeBR: "Continuar Back Step",
    tipo: "ataque",
  },
  "continue roll": {
    slug: "continuar-rolamento",
    nomeBR: "Continuar Rolamento",
    tipo: "ataque",
  },
  "control head and wrist": {
    slug: "controlar-cabeca-e-punho",
    nomeBR: "Controlar Cabeça e Punho",
    tipo: "ataque",
  },
  "control hip and shoulder": {
    slug: "controlar-quadril-e-ombro",
    nomeBR: "Controlar Quadril e Ombro",
    tipo: "ataque",
  },
  "control knee+hip": {
    slug: "controle-joelho-e-quadril",
    nomeBR: "Controle Joelho e Quadril",
    tipo: "ataque",
  },
  "control leg and hip": {
    slug: "controlar-perna-e-quadril",
    nomeBR: "Controlar Perna e Quadril",
    tipo: "ataque",
  },
  "control leg": {
    slug: "controlar-a-perna",
    nomeBR: "Controlar a Perna",
    tipo: "ataque",
  },
  "control wrist and tricep": {
    slug: "controlar-punho-e-triceps",
    nomeBR: "Controlar Punho e Tríceps",
    tipo: "ataque",
  },
  "control wrist": {
    slug: "controlar-o-punho",
    nomeBR: "Controlar o Punho",
    tipo: "ataque",
  },
  "control wrists": {
    slug: "controlar-os-punhos",
    nomeBR: "Controlar os Punhos",
    tipo: "ataque",
  },
  "controls far wrist": {
    slug: "controla-punho-de-longe",
    nomeBR: "Controla Punho de Longe",
    tipo: "ataque",
  },
  "counter to wide base": {
    slug: "contra-ataque-para-wide-base",
    nomeBR: "Contra-ataque para Wide Base",
    tipo: "ataque",
  },
  "countered": {
    slug: "contra-atacada",
    nomeBR: "Contra-atacada",
    tipo: "ataque",
  },
  "cradle": {
    slug: "cradle",
    nomeBR: "Cradle",
    tipo: "ataque",
  },
  "cross grip": {
    slug: "cruzada-pegada",
    nomeBR: "Cruzada Pegada",
    tipo: "ataque",
  },
  "crossface": {
    slug: "crossface",
    nomeBR: "Crossface",
    tipo: "ataque",
  },
  "crotch rocket": {
    slug: "crotch-rocket",
    nomeBR: "Crotch Rocket",
    tipo: "ataque",
  },
  "crucify": {
    slug: "crucificar",
    nomeBR: "Crucificar",
    tipo: "finalizacao",
  },
  "cut corner": {
    slug: "cortar-o-angulo",
    nomeBR: "Cortar o Ângulo",
    tipo: "perda-de-guarda",
  },
  "defeat rdlr": {
    slug: "vencer-rdlr",
    nomeBR: "Vencer Rdlr",
    tipo: "ataque",
  },
  "dig under escape": {
    slug: "dig-por-baixo-fuga",
    nomeBR: "Dig por Baixo Fuga",
    tipo: "perda-de-guarda",
  },
  "dive": {
    slug: "mergulhar",
    nomeBR: "Mergulhar",
    tipo: "ataque",
  },
  "dlr sweep": {
    slug: "raspagem-da-de-la-riva",
    nomeBR: "Raspagem da de La Riva",
    tipo: "raspagem",
  },
  "don't isolate arm": {
    slug: "don-t-isolar-o-braco",
    nomeBR: "Don't Isolar o Braço",
    tipo: "ataque",
  },
  "donkey kick": {
    slug: "coice-de-mula",
    nomeBR: "Coice de Mula",
    tipo: "ataque",
  },
  "double elbow control": {
    slug: "double-cotovelo-controle",
    nomeBR: "Double Cotovelo Controle",
    tipo: "ataque",
  },
  "double leg drill (part 2)": {
    slug: "double-leg-treino-part-2",
    nomeBR: "Double Leg Treino (part 2)",
    tipo: "ataque",
  },
  "double leg drill": {
    slug: "double-leg-treino",
    nomeBR: "Double Leg Treino",
    tipo: "ataque",
  },
  "double leg": {
    slug: "double-leg",
    nomeBR: "Double Leg",
    tipo: "ataque",
  },
  "double overhooks": {
    slug: "duplo-sobre-gancho",
    nomeBR: "Duplo Sobre-Gancho",
    tipo: "ataque",
  },
  "drag down": {
    slug: "puxar-pra-baixo",
    nomeBR: "Puxar pra Baixo",
    tipo: "ataque",
  },
  "drag past": {
    slug: "arrastar-e-passar",
    nomeBR: "Arrastar e Passar",
    tipo: "ataque",
  },
  "drag": {
    slug: "arrastar",
    nomeBR: "Arrastar",
    tipo: "ataque",
  },
  "drive and dump": {
    slug: "dirigir-e-despejar",
    nomeBR: "Dirigir e Despejar",
    tipo: "ataque",
  },
  "drive down": {
    slug: "dirigir-pra-baixo",
    nomeBR: "Dirigir pra Baixo",
    tipo: "ataque",
  },
  "drive forward": {
    slug: "dirigir-pra-frente",
    nomeBR: "Dirigir pra Frente",
    tipo: "perda-de-guarda",
  },
  "drive through": {
    slug: "dirigir-through",
    nomeBR: "Dirigir Through",
    tipo: "perda-de-guarda",
  },
  "drop for double": {
    slug: "baixar-pro-double",
    nomeBR: "Baixar pro Double",
    tipo: "ataque",
  },
  "drop level slightly": {
    slug: "baixar-o-nivel-slightly",
    nomeBR: "Baixar o Nível Slightly",
    tipo: "ataque",
  },
  "drop seoi-nage": {
    slug: "seoi-nage-ajoelhado",
    nomeBR: "Seoi-nage Ajoelhado",
    tipo: "ataque",
  },
  "drop to knee": {
    slug: "baixar-para-joelho",
    nomeBR: "Baixar para Joelho",
    tipo: "ataque",
  },
  "drop to side": {
    slug: "baixar-para-lado",
    nomeBR: "Baixar para Lado",
    tipo: "ataque",
  },
  "duck under": {
    slug: "duck-under",
    nomeBR: "Duck Under",
    tipo: "ataque",
  },
  "elbow remains trapped": {
    slug: "cotovelo-remains-preso",
    nomeBR: "Cotovelo Remains Preso",
    tipo: "ataque",
  },
  "end in north/south": {
    slug: "end-na-norte-sul",
    nomeBR: "End na Norte-Sul",
    tipo: "ataque",
  },
  "end on side": {
    slug: "end-no-lado",
    nomeBR: "End no Lado",
    tipo: "ataque",
  },
  "enter judo side": {
    slug: "entrar-cem-quilos-de-judo",
    nomeBR: "Entrar Cem-Quilos de Judô",
    tipo: "ataque",
  },
  "enter regular side": {
    slug: "entrar-regular-lado",
    nomeBR: "Entrar Regular Lado",
    tipo: "ataque",
  },
  "enter z": {
    slug: "entrar-z",
    nomeBR: "Entrar Z",
    tipo: "ataque",
  },
  "escape and crucify": {
    slug: "fuga-e-crucificar",
    nomeBR: "Fuga e Crucificar",
    tipo: "finalizacao",
  },
  "escape hip": {
    slug: "fuga-quadril",
    nomeBR: "Fuga Quadril",
    tipo: "perda-de-guarda",
  },
  "escape roll": {
    slug: "fuga-rolamento",
    nomeBR: "Fuga Rolamento",
    tipo: "perda-de-guarda",
  },
  "escape start": {
    slug: "fuga-inicio",
    nomeBR: "Fuga Início",
    tipo: "perda-de-guarda",
  },
  "escape to honey": {
    slug: "fuga-para-honey",
    nomeBR: "Fuga para Honey",
    tipo: "perda-de-guarda",
  },
  "establish leg drag": {
    slug: "establish-leg-drag",
    nomeBR: "Establish Leg Drag",
    tipo: "ataque",
  },
  "extend arm": {
    slug: "estender-o-braco",
    nomeBR: "Estender o Braço",
    tipo: "ataque",
  },
  "extend leg": {
    slug: "estender-a-perna",
    nomeBR: "Estender a Perna",
    tipo: "ataque",
  },
  "fake-sweep and take overhook": {
    slug: "fake-sweep-e-pegar-sobre-gancho",
    nomeBR: "Fake-sweep e Pegar Sobre-Gancho",
    tipo: "raspagem",
  },
  "far arm brabo": {
    slug: "braco-de-longe-brabo",
    nomeBR: "Braço de Longe Brabo",
    tipo: "finalizacao",
  },
  "far knee finish": {
    slug: "joelho-de-longe-finalizar",
    nomeBR: "Joelho de Longe Finalizar",
    tipo: "finalizacao",
  },
  "far leg takedown": {
    slug: "longe-perna-queda",
    nomeBR: "Longe Perna Queda",
    tipo: "ataque",
  },
  "figure four": {
    slug: "figura-quatro",
    nomeBR: "Figura-quatro",
    tipo: "ataque",
  },
  "finish in quarter": {
    slug: "finalizar-na-quarto",
    nomeBR: "Finalizar na Quarto",
    tipo: "finalizacao",
  },
  "finish pass": {
    slug: "finalizar-a-passagem",
    nomeBR: "Finalizar a Passagem",
    tipo: "finalizacao",
  },
  "fireman's carry": {
    slug: "fireman-s-carry",
    nomeBR: "Fireman's Carry",
    tipo: "ataque",
  },
  "fireman": {
    slug: "fireman",
    nomeBR: "Fireman",
    tipo: "ataque",
  },
  "first hook": {
    slug: "primeiro-gancho",
    nomeBR: "Primeiro Gancho",
    tipo: "ataque",
  },
  "fishnet": {
    slug: "fishnet",
    nomeBR: "Fishnet",
    tipo: "ataque",
  },
  "flank and break grip": {
    slug: "flanquear-e-quebrar-a-pegada",
    nomeBR: "Flanquear e Quebrar a Pegada",
    tipo: "ataque",
  },
  "flank and takedown": {
    slug: "flanquear-e-queda",
    nomeBR: "Flanquear e Queda",
    tipo: "ataque",
  },
  "flank outside": {
    slug: "flanquear-por-fora",
    nomeBR: "Flanquear por Fora",
    tipo: "ataque",
  },
  "flank": {
    slug: "flanquear",
    nomeBR: "Flanquear",
    tipo: "ataque",
  },
  "flatten": {
    slug: "achatar",
    nomeBR: "Achatar",
    tipo: "ataque",
  },
  "flip-and- shoot": {
    slug: "flip-and-shoot",
    nomeBR: "Flip-and-shoot",
    tipo: "ataque",
  },
  "flying scissor": {
    slug: "tesoura-voadora",
    nomeBR: "Tesoura Voadora",
    tipo: "ataque",
  },
  "foot block knee pick": {
    slug: "pe-bloquear-knee-pick",
    nomeBR: "Pé Bloquear Knee Pick",
    tipo: "ataque",
  },
  "foot hook ankle pick": {
    slug: "pe-gancho-ankle-pick",
    nomeBR: "Pé Gancho Ankle Pick",
    tipo: "ataque",
  },
  "foot-over-foot pass finish": {
    slug: "foot-over-foot-passagem-finalizar",
    nomeBR: "Foot-over-foot Passagem Finalizar",
    tipo: "finalizacao",
  },
  "forearm block": {
    slug: "antebraco-bloquear",
    nomeBR: "Antebraço Bloquear",
    tipo: "ataque",
  },
  "frame": {
    slug: "frame",
    nomeBR: "Frame",
    tipo: "ataque",
  },
  "free leg": {
    slug: "liberar-perna",
    nomeBR: "Liberar Perna",
    tipo: "ataque",
  },
  "free outside leg": {
    slug: "liberar-por-fora-perna",
    nomeBR: "Liberar por Fora Perna",
    tipo: "ataque",
  },
  "funk": {
    slug: "funk",
    nomeBR: "Funk",
    tipo: "ataque",
  },
  "gangsta lean": {
    slug: "gangsta-lean-2",
    nomeBR: "Gangsta Lean",
    tipo: "ataque",
  },
  "gator roll": {
    slug: "gator-roll",
    nomeBR: "Gator Roll",
    tipo: "ataque",
  },
  "get body lock": {
    slug: "pegar-body-lock",
    nomeBR: "Pegar Body Lock",
    tipo: "ataque",
  },
  "get collar tie": {
    slug: "pegar-pegada-de-nuca",
    nomeBR: "Pegar Pegada de Nuca",
    tipo: "ataque",
  },
  "get double wrist lock": {
    slug: "pegar-double-punho-travar",
    nomeBR: "Pegar Double Punho Travar",
    tipo: "ataque",
  },
  "get to elbow": {
    slug: "pegar-para-cotovelo",
    nomeBR: "Pegar para Cotovelo",
    tipo: "ataque",
  },
  "get to knees": {
    slug: "pegar-para-joelhos",
    nomeBR: "Pegar para Joelhos",
    tipo: "ataque",
  },
  "get two-on-one": {
    slug: "pegar-2-em-1",
    nomeBR: "Pegar 2-em-1",
    tipo: "ataque",
  },
  "go ankle to ankle": {
    slug: "ir-tornozelo-a-tornozelo",
    nomeBR: "Ir Tornozelo a Tornozelo",
    tipo: "ataque",
  },
  "go deep": {
    slug: "ir-fundo",
    nomeBR: "Ir Fundo",
    tipo: "ataque",
  },
  "go parallel": {
    slug: "ir-paralelo",
    nomeBR: "Ir Paralelo",
    tipo: "ataque",
  },
  "godfather sweep": {
    slug: "raspagem-padrinho",
    nomeBR: "Raspagem Padrinho",
    tipo: "raspagem",
  },
  "grab arm and sweep": {
    slug: "agarrar-o-braco-e-raspagem",
    nomeBR: "Agarrar o Braço e Raspagem",
    tipo: "raspagem",
  },
  "grab collar tie and elbow": {
    slug: "agarrar-pegada-de-nuca-e-cotovelo",
    nomeBR: "Agarrar Pegada de Nuca e Cotovelo",
    tipo: "ataque",
  },
  "grab elbow": {
    slug: "agarrar-o-cotovelo",
    nomeBR: "Agarrar o Cotovelo",
    tipo: "ataque",
  },
  "grab near wrist": {
    slug: "agarrar-o-punho-de-perto",
    nomeBR: "Agarrar o Punho de Perto",
    tipo: "ataque",
  },
  "grab shoulder": {
    slug: "agarrar-o-ombro",
    nomeBR: "Agarrar o Ombro",
    tipo: "ataque",
  },
  "grab tricep": {
    slug: "agarrar-o-triceps",
    nomeBR: "Agarrar o Tríceps",
    tipo: "ataque",
  },
  "grab waist": {
    slug: "agarrar-a-cintura",
    nomeBR: "Agarrar a Cintura",
    tipo: "ataque",
  },
  "guillotine": {
    slug: "guilhotina",
    nomeBR: "Guilhotina",
    tipo: "finalizacao",
  },
  "hail mary escape": {
    slug: "hail-mary-fuga",
    nomeBR: "Hail Mary Fuga",
    tipo: "perda-de-guarda",
  },
  "half and half": {
    slug: "half-and-half",
    nomeBR: "Half and Half",
    tipo: "ataque",
  },
  "head drive": {
    slug: "cabeca-dirigir",
    nomeBR: "Cabeça Dirigir",
    tipo: "ataque",
  },
  "head inside": {
    slug: "cabeca-por-dentro",
    nomeBR: "Cabeça por Dentro",
    tipo: "ataque",
  },
  "head outside": {
    slug: "cabeca-por-fora",
    nomeBR: "Cabeça por Fora",
    tipo: "ataque",
  },
  "head to chest": {
    slug: "cabeca-para-peito",
    nomeBR: "Cabeça para Peito",
    tipo: "ataque",
  },
  "helicopter": {
    slug: "helicoptero",
    nomeBR: "Helicóptero",
    tipo: "ataque",
  },
  "high guard": {
    slug: "alto-guarda",
    nomeBR: "Alto Guarda",
    tipo: "ataque",
  },
  "hip bump sweep": {
    slug: "raspagem-de-quadril-2",
    nomeBR: "Raspagem de Quadril",
    tipo: "raspagem",
  },
  "hip escape": {
    slug: "fuga-de-quadril-2",
    nomeBR: "Fuga de Quadril",
    tipo: "perda-de-guarda",
  },
  "hip heist and force roll": {
    slug: "hip-heist-e-force-rolamento",
    nomeBR: "Hip Heist e Force Rolamento",
    tipo: "ataque",
  },
  "hip pop lift": {
    slug: "levantada-de-quadril",
    nomeBR: "Levantada de Quadril",
    tipo: "ataque",
  },
  "hip throw": {
    slug: "queda-de-quadril",
    nomeBR: "Queda de Quadril",
    tipo: "ataque",
  },
  "hop and turn": {
    slug: "pulinho-e-virar",
    nomeBR: "Pulinho e Virar",
    tipo: "ataque",
  },
  "hop": {
    slug: "pulinho",
    nomeBR: "Pulinho",
    tipo: "ataque",
  },
  "hug leg": {
    slug: "abracar-a-perna",
    nomeBR: "Abraçar a Perna",
    tipo: "ataque",
  },
  "imanari roll": {
    slug: "rolamento-imanari",
    nomeBR: "Rolamento Imanari",
    tipo: "ataque",
  },
  "insert hook": {
    slug: "encaixar-o-gancho",
    nomeBR: "Encaixar o Gancho",
    tipo: "ataque",
  },
  "insert hooks": {
    slug: "encaixar-os-ganchos",
    nomeBR: "Encaixar os Ganchos",
    tipo: "ataque",
  },
  "insert knee": {
    slug: "encaixar-o-joelho",
    nomeBR: "Encaixar o Joelho",
    tipo: "ataque",
  },
  "invert": {
    slug: "inverter",
    nomeBR: "Inverter",
    tipo: "ataque",
  },
  "isolate arm": {
    slug: "isolar-o-braco",
    nomeBR: "Isolar o Braço",
    tipo: "ataque",
  },
  "isolates arms": {
    slug: "isolates-bracos",
    nomeBR: "Isolates Braços",
    tipo: "ataque",
  },
  "jailbreak": {
    slug: "jailbreak",
    nomeBR: "Jailbreak",
    tipo: "ataque",
  },
  "jam knee and roll": {
    slug: "jam-joelho-e-rolamento",
    nomeBR: "Jam Joelho e Rolamento",
    tipo: "ataque",
  },
  "jaws of life": {
    slug: "jaws-of-life",
    nomeBR: "Jaws of Life",
    tipo: "ataque",
  },
  "jedi mind trick": {
    slug: "jedi-mind-trick",
    nomeBR: "Jedi Mind Trick",
    tipo: "ataque",
  },
  "jump guard": {
    slug: "saltar-pra-guarda",
    nomeBR: "Saltar pra Guarda",
    tipo: "ataque",
  },
  "jump to web": {
    slug: "saltar-para-web",
    nomeBR: "Saltar para Web",
    tipo: "ataque",
  },
  "jump": {
    slug: "saltar",
    nomeBR: "Saltar",
    tipo: "ataque",
  },
  "kick leg free": {
    slug: "chute-perna-liberar",
    nomeBR: "Chute Perna Liberar",
    tipo: "ataque",
  },
  "kick over sweep": {
    slug: "raspagem-de-chute-por-cima",
    nomeBR: "Raspagem de Chute por Cima",
    tipo: "raspagem",
  },
  "kick-up": {
    slug: "kick-up",
    nomeBR: "Kick-up",
    tipo: "ataque",
  },
  "kick-up2": {
    slug: "kick-up2",
    nomeBR: "Kick-up2",
    tipo: "ataque",
  },
  "knee bar": {
    slug: "chave-de-joelho",
    nomeBR: "Chave de Joelho",
    tipo: "finalizacao",
  },
  "knee in butt wiggle out": {
    slug: "joelho-na-butt-se-soltar",
    nomeBR: "Joelho na Butt se Soltar",
    tipo: "ataque",
  },
  "knee inside pass": {
    slug: "passagem-com-joelho-por-dentro",
    nomeBR: "Passagem com Joelho por Dentro",
    tipo: "perda-de-guarda",
  },
  "knee pin pass": {
    slug: "passagem-prensando-o-joelho",
    nomeBR: "Passagem Prensando o Joelho",
    tipo: "perda-de-guarda",
  },
  "knee push sweep": {
    slug: "raspagem-de-empurrao-no-joelho",
    nomeBR: "Raspagem de Empurrão no Joelho",
    tipo: "raspagem",
  },
  "knee slice but bottom turns in": {
    slug: "joelho-cortando-mas-de-baixo-vira-na",
    nomeBR: "Joelho Cortando mas de Baixo Vira na",
    tipo: "perda-de-guarda",
  },
  "knee slide": {
    slug: "joelho-cortando-2",
    nomeBR: "Joelho Cortando",
    tipo: "perda-de-guarda",
  },
  "knee-pick counter to arm pull": {
    slug: "knee-pick-contra-ataque-para-braco-puxar",
    nomeBR: "Knee-pick Contra-ataque para Braço Puxar",
    tipo: "ataque",
  },
  "knees not squeezed": {
    slug: "joelhos-nao-apertado",
    nomeBR: "Joelhos Não Apertado",
    tipo: "ataque",
  },
  "land in judo": {
    slug: "cair-na-judo",
    nomeBR: "Cair na Judô",
    tipo: "ataque",
  },
  "land traditional": {
    slug: "cair-tradicional",
    nomeBR: "Cair Tradicional",
    tipo: "ataque",
  },
  "land": {
    slug: "cair",
    nomeBR: "Cair",
    tipo: "ataque",
  },
  "lateral spin": {
    slug: "giro-lateral",
    nomeBR: "Giro Lateral",
    tipo: "ataque",
  },
  "launch": {
    slug: "lancar",
    nomeBR: "Lançar",
    tipo: "ataque",
  },
  "leg grab attempt intercepted by underhook": {
    slug: "perna-agarrar-tentativa-intercepted-by-underhook",
    nomeBR: "Perna Agarrar Tentativa Intercepted By Underhook",
    tipo: "ataque",
  },
  "leg hook sweep": {
    slug: "raspagem-com-gancho-de-perna",
    nomeBR: "Raspagem com Gancho de Perna",
    tipo: "raspagem",
  },
  "leg kick get up": {
    slug: "perna-chute-levantar",
    nomeBR: "Perna Chute Levantar",
    tipo: "perda-de-guarda",
  },
  "leg lever to back": {
    slug: "alavanca-de-perna-para-costas",
    nomeBR: "Alavanca de Perna para Costas",
    tipo: "ataque",
  },
  "leg lever to over/under": {
    slug: "alavanca-de-perna-para-over-under",
    nomeBR: "Alavanca de Perna para Over-under",
    tipo: "ataque",
  },
  "leg over head": {
    slug: "perna-sobre-a-cabeca",
    nomeBR: "Perna Sobre a Cabeça",
    tipo: "ataque",
  },
  "leg weave takedown": {
    slug: "leg-weave-queda",
    nomeBR: "Leg Weave Queda",
    tipo: "ataque",
  },
  "let head go": {
    slug: "let-cabeca-ir",
    nomeBR: "Let Cabeça Ir",
    tipo: "ataque",
  },
  "lie down": {
    slug: "deitar",
    nomeBR: "Deitar",
    tipo: "ataque",
  },
  "limp leg": {
    slug: "perna-mole",
    nomeBR: "Perna Mole",
    tipo: "ataque",
  },
  "lock down knee": {
    slug: "travar-o-joelho",
    nomeBR: "Travar o Joelho",
    tipo: "ataque",
  },
  "lock down": {
    slug: "travar-pra-baixo",
    nomeBR: "Travar pra Baixo",
    tipo: "ataque",
  },
  "lock figure four": {
    slug: "travar-a-figura-quatro",
    nomeBR: "Travar a Figura-quatro",
    tipo: "ataque",
  },
  "lock reverse triangle": {
    slug: "travar-o-triangulo-invertido",
    nomeBR: "Travar o Triângulo Invertido",
    tipo: "finalizacao",
  },
  "lock": {
    slug: "travar",
    nomeBR: "Travar",
    tipo: "ataque",
  },
  "lockdown": {
    slug: "lockdown",
    nomeBR: "Lockdown",
    tipo: "ataque",
  },
  "lose overhook, take crossface": {
    slug: "perder-o-sobre-gancho-pegar-crossface",
    nomeBR: "Perder o Sobre-Gancho, Pegar Crossface",
    tipo: "ataque",
  },
  "meat hook": {
    slug: "meat-hook",
    nomeBR: "Meat Hook",
    tipo: "ataque",
  },
  "millenium falcon": {
    slug: "millenium-falcon",
    nomeBR: "Millenium Falcon",
    tipo: "ataque",
  },
  "monoplata": {
    slug: "monoplata",
    nomeBR: "Monoplata",
    tipo: "finalizacao",
  },
  "mount low": {
    slug: "montada-baixa-2",
    nomeBR: "Montada Baixa",
    tipo: "ataque",
  },
  "move behind": {
    slug: "ir-pras-costas",
    nomeBR: "Ir pras Costas",
    tipo: "ataque",
  },
  "move closer": {
    slug: "chegar-mais-perto",
    nomeBR: "Chegar Mais Perto",
    tipo: "ataque",
  },
  "move head to other side": {
    slug: "move-cabeca-para-outro-lado",
    nomeBR: "Move Cabeça para Outro Lado",
    tipo: "ataque",
  },
  "move leg back": {
    slug: "recuar-a-perna",
    nomeBR: "Recuar a Perna",
    tipo: "ataque",
  },
  "near wrist control sweep": {
    slug: "raspagem-com-controle-do-punho-de-perto",
    nomeBR: "Raspagem com Controle do Punho de Perto",
    tipo: "raspagem",
  },
  "neck frame defense": {
    slug: "frame-no-pescoco-defense",
    nomeBR: "Frame no Pescoço Defense",
    tipo: "ataque",
  },
  "new": {
    slug: "novo",
    nomeBR: "Novo",
    tipo: "ataque",
  },
  "no hand pass": {
    slug: "passagem-sem-as-maos",
    nomeBR: "Passagem sem as Mãos",
    tipo: "perda-de-guarda",
  },
  "not flipped": {
    slug: "nao-girado",
    nomeBR: "Não Girado",
    tipo: "ataque",
  },
  "o-soto-gari": {
    slug: "o-soto-gari",
    nomeBR: "O-soto-gari",
    tipo: "ataque",
  },
  "open elbow escape": {
    slug: "aberto-cotovelo-fuga",
    nomeBR: "Aberto Cotovelo Fuga",
    tipo: "perda-de-guarda",
  },
  "open elbow": {
    slug: "aberto-cotovelo",
    nomeBR: "Aberto Cotovelo",
    tipo: "ataque",
  },
  "open near elbow": {
    slug: "aberto-perto-cotovelo",
    nomeBR: "Aberto Perto Cotovelo",
    tipo: "ataque",
  },
  "ouchi gari": {
    slug: "ouchi-gari",
    nomeBR: "Ouchi-gari",
    tipo: "ataque",
  },
  "overhook leg, head pushed": {
    slug: "sobre-gancho-leg-cabeca-empurrado",
    nomeBR: "Sobre-Gancho Leg, Cabeça Empurrado",
    tipo: "ataque",
  },
  "parallel": {
    slug: "paralelo",
    nomeBR: "Paralelo",
    tipo: "ataque",
  },
  "parry to single": {
    slug: "defesa-para-single",
    nomeBR: "Defesa para Single",
    tipo: "ataque",
  },
  "pass successful": {
    slug: "passagem-concluida",
    nomeBR: "Passagem Concluída",
    tipo: "perda-de-guarda",
  },
  "pass to side": {
    slug: "passar-pro-cem-quilos",
    nomeBR: "Passar pro Cem-Quilos",
    tipo: "ataque",
  },
  "pass toward side": {
    slug: "passagem-em-direcao-lado",
    nomeBR: "Passagem em Direção Lado",
    tipo: "perda-de-guarda",
  },
  "pass": {
    slug: "passagem",
    nomeBR: "Passagem",
    tipo: "perda-de-guarda",
  },
  "pick up and crucify": {
    slug: "levantar-e-crucificar",
    nomeBR: "Levantar e Crucificar",
    tipo: "finalizacao",
  },
  "pick up": {
    slug: "levantar-2",
    nomeBR: "Levantar",
    tipo: "perda-de-guarda",
  },
  "pin leg": {
    slug: "prender-a-perna",
    nomeBR: "Prender a Perna",
    tipo: "ataque",
  },
  "pin legs": {
    slug: "prender-as-pernas",
    nomeBR: "Prender as Pernas",
    tipo: "ataque",
  },
  "plant feet behind knees": {
    slug: "fincar-os-pes-atras-dos-joelhos",
    nomeBR: "Fincar os Pés Atrás dos Joelhos",
    tipo: "ataque",
  },
  "plant foot": {
    slug: "fincar-o-pe",
    nomeBR: "Fincar o Pé",
    tipo: "ataque",
  },
  "polish throw": {
    slug: "queda-polonesa",
    nomeBR: "Queda Polonesa",
    tipo: "ataque",
  },
  "post foot": {
    slug: "apoiar-o-pe",
    nomeBR: "Apoiar o Pé",
    tipo: "ataque",
  },
  "post leg": {
    slug: "apoiar-a-perna",
    nomeBR: "Apoiar a Perna",
    tipo: "ataque",
  },
  "post other foot": {
    slug: "apoiar-o-outro-pe",
    nomeBR: "Apoiar o Outro Pé",
    tipo: "ataque",
  },
  "posture and wedge": {
    slug: "postura-e-encaixe",
    nomeBR: "Postura e Encaixe",
    tipo: "ataque",
  },
  "pressure and switch base": {
    slug: "pressure-e-trocar-base",
    nomeBR: "Pressure e Trocar Base",
    tipo: "ataque",
  },
  "progress": {
    slug: "avancar",
    nomeBR: "Avançar",
    tipo: "ataque",
  },
  "pull forward": {
    slug: "puxar-pra-frente",
    nomeBR: "Puxar pra Frente",
    tipo: "ataque",
  },
  "pull head": {
    slug: "puxar-a-cabeca",
    nomeBR: "Puxar a Cabeça",
    tipo: "ataque",
  },
  "pull hips in": {
    slug: "puxar-o-quadril-pra-dentro",
    nomeBR: "Puxar o Quadril pra Dentro",
    tipo: "ataque",
  },
  "pull in": {
    slug: "puxar-pra-dentro",
    nomeBR: "Puxar pra Dentro",
    tipo: "ataque",
  },
  "pull to other side": {
    slug: "puxar-pro-outro-lado",
    nomeBR: "Puxar pro Outro Lado",
    tipo: "ataque",
  },
  "pull to side": {
    slug: "puxar-pro-lado",
    nomeBR: "Puxar pro Lado",
    tipo: "ataque",
  },
  "pummel arm inside": {
    slug: "pummel-braco-por-dentro",
    nomeBR: "Pummel Braço por Dentro",
    tipo: "ataque",
  },
  "pummel elbows": {
    slug: "pummel-cotovelos",
    nomeBR: "Pummel Cotovelos",
    tipo: "ataque",
  },
  "pummel knee inside": {
    slug: "pummel-joelho-por-dentro",
    nomeBR: "Pummel Joelho por Dentro",
    tipo: "ataque",
  },
  "pummel other knee inside": {
    slug: "pummel-outro-joelho-por-dentro",
    nomeBR: "Pummel Outro Joelho por Dentro",
    tipo: "ataque",
  },
  "pummel": {
    slug: "pummel",
    nomeBR: "Pummel",
    tipo: "ataque",
  },
  "push back sweep": {
    slug: "raspagem-empurrando-pra-tras",
    nomeBR: "Raspagem Empurrando pra Trás",
    tipo: "raspagem",
  },
  "push head to side": {
    slug: "empurrar-a-cabeca-pro-lado",
    nomeBR: "Empurrar a Cabeça pro Lado",
    tipo: "ataque",
  },
  "push head": {
    slug: "empurrar-a-cabeca",
    nomeBR: "Empurrar a Cabeça",
    tipo: "ataque",
  },
  "push knee inside": {
    slug: "empurrar-o-joelho-pra-dentro",
    nomeBR: "Empurrar o Joelho pra Dentro",
    tipo: "ataque",
  },
  "push off": {
    slug: "empurrar",
    nomeBR: "Empurrar",
    tipo: "ataque",
  },
  "push over": {
    slug: "empurrar-por-cima",
    nomeBR: "Empurrar por Cima",
    tipo: "ataque",
  },
  "push sweep": {
    slug: "raspagem-de-empurrao",
    nomeBR: "Raspagem de Empurrão",
    tipo: "raspagem",
  },
  "push, pull, lockdown": {
    slug: "empurrar-puxar-lockdown",
    nomeBR: "Empurrar, Puxar, Lockdown",
    tipo: "ataque",
  },
  "put weight on shoulder": {
    slug: "colocar-weight-no-ombro",
    nomeBR: "Colocar Weight no Ombro",
    tipo: "ataque",
  },
  "rear naked choke": {
    slug: "mata-leao",
    nomeBR: "Mata-Leão",
    tipo: "finalizacao",
  },
  "rear naked": {
    slug: "mata-leao-2",
    nomeBR: "Mata-Leão",
    tipo: "finalizacao",
  },
  "recover guard": {
    slug: "recuperar-a-guarda",
    nomeBR: "Recuperar a Guarda",
    tipo: "ataque",
  },
  "recover knee shield": {
    slug: "recuperar-o-escudo-de-joelho",
    nomeBR: "Recuperar o Escudo de Joelho",
    tipo: "ataque",
  },
  "recover": {
    slug: "recuperar",
    nomeBR: "Recuperar",
    tipo: "ataque",
  },
  "release head and arm": {
    slug: "soltar-cabeca-e-braco",
    nomeBR: "Soltar Cabeça e Braço",
    tipo: "ataque",
  },
  "release headlock": {
    slug: "soltar-headlock",
    nomeBR: "Soltar Headlock",
    tipo: "ataque",
  },
  "release leg": {
    slug: "soltar-perna",
    nomeBR: "Soltar Perna",
    tipo: "ataque",
  },
  "release lockdown": {
    slug: "soltar-lockdown",
    nomeBR: "Soltar Lockdown",
    tipo: "ataque",
  },
  "release neck and start base switch": {
    slug: "soltar-pescoco-e-inicio-base-trocar",
    nomeBR: "Soltar Pescoço e Início Base Trocar",
    tipo: "ataque",
  },
  "remove first butterfly hook": {
    slug: "remover-first-guarda-de-gancho-gancho",
    nomeBR: "Remover First Guarda de Gancho Gancho",
    tipo: "ataque",
  },
  "remove other hook": {
    slug: "remover-outro-gancho",
    nomeBR: "Remover Outro Gancho",
    tipo: "ataque",
  },
  "retract arms": {
    slug: "recolher-bracos",
    nomeBR: "Recolher Braços",
    tipo: "ataque",
  },
  "retract knee": {
    slug: "recolher-joelho",
    nomeBR: "Recolher Joelho",
    tipo: "ataque",
  },
  "retract one underhook": {
    slug: "recolher-uma-underhook",
    nomeBR: "Recolher Uma Underhook",
    tipo: "ataque",
  },
  "retract underhook": {
    slug: "recolher-underhook",
    nomeBR: "Recolher Underhook",
    tipo: "ataque",
  },
  "reversal": {
    slug: "reversao",
    nomeBR: "Reversão",
    tipo: "ataque",
  },
  "reverse butter to single x": {
    slug: "invertida-butter-para-single-x",
    nomeBR: "Invertida Butter para Single X",
    tipo: "ataque",
  },
  "reverse butterfly": {
    slug: "gancho-invertido",
    nomeBR: "Gancho Invertido",
    tipo: "ataque",
  },
  "reverse": {
    slug: "invertida",
    nomeBR: "Invertida",
    tipo: "ataque",
  },
  "ride leg": {
    slug: "montar-perna",
    nomeBR: "Montar Perna",
    tipo: "ataque",
  },
  "roll flipped": {
    slug: "rolar-girado",
    nomeBR: "Rolar Girado",
    tipo: "ataque",
  },
  "roll forward": {
    slug: "rolar-pra-frente",
    nomeBR: "Rolar pra Frente",
    tipo: "ataque",
  },
  "roll sideways": {
    slug: "rolar-de-lado",
    nomeBR: "Rolar de Lado",
    tipo: "ataque",
  },
  "roll to guard": {
    slug: "rolar-pra-guarda",
    nomeBR: "Rolar pra Guarda",
    tipo: "ataque",
  },
  "roll under": {
    slug: "rolar-por-baixo",
    nomeBR: "Rolar por Baixo",
    tipo: "ataque",
  },
  "roll": {
    slug: "rolamento",
    nomeBR: "Rolamento",
    tipo: "ataque",
  },
  "rotate": {
    slug: "rotacionar",
    nomeBR: "Rotacionar",
    tipo: "ataque",
  },
  "roundhouse kick": {
    slug: "chute-giratorio",
    nomeBR: "Chute Giratório",
    tipo: "ataque",
  },
  "rubber": {
    slug: "rubber",
    nomeBR: "Rubber",
    tipo: "ataque",
  },
  "running escape": {
    slug: "fuga-correndo",
    nomeBR: "Fuga Correndo",
    tipo: "perda-de-guarda",
  },
  "scissor": {
    slug: "tesoura",
    nomeBR: "Tesoura",
    tipo: "ataque",
  },
  "scoot away": {
    slug: "escorregar-pra-longe",
    nomeBR: "Escorregar pra Longe",
    tipo: "ataque",
  },
  "seatbelt": {
    slug: "seatbelt",
    nomeBR: "Seatbelt",
    tipo: "ataque",
  },
  "second hook not blocked": {
    slug: "segundo-gancho-nao-bloqueada",
    nomeBR: "Segundo Gancho Não Bloqueada",
    tipo: "ataque",
  },
  "secure far hook": {
    slug: "garantir-o-gancho-de-longe",
    nomeBR: "Garantir o Gancho de Longe",
    tipo: "ataque",
  },
  "settle": {
    slug: "acomodar",
    nomeBR: "Acomodar",
    tipo: "ataque",
  },
  "shoot for double": {
    slug: "atacar-pro-double",
    nomeBR: "Atacar pro Double",
    tipo: "ataque",
  },
  "shoot for high double": {
    slug: "atacar-pro-double-alto",
    nomeBR: "Atacar pro Double Alto",
    tipo: "ataque",
  },
  "shoot for high single": {
    slug: "atacar-pro-single-alto",
    nomeBR: "Atacar pro Single Alto",
    tipo: "ataque",
  },
  "shoot for single leg": {
    slug: "atacar-pro-single-leg",
    nomeBR: "Atacar pro Single Leg",
    tipo: "ataque",
  },
  "shoot for single": {
    slug: "atacar-pro-single",
    nomeBR: "Atacar pro Single",
    tipo: "ataque",
  },
  "shoots for underhooks": {
    slug: "ataca-pro-underhooks",
    nomeBR: "Ataca pro Underhooks",
    tipo: "ataque",
  },
  "shoulder roll": {
    slug: "rolamento-de-ombro",
    nomeBR: "Rolamento de Ombro",
    tipo: "ataque",
  },
  "shovel": {
    slug: "shovel",
    nomeBR: "Shovel",
    tipo: "ataque",
  },
  "shrug and get two-on-one": {
    slug: "encolher-e-pegar-2-em-1",
    nomeBR: "Encolher e Pegar 2-em-1",
    tipo: "ataque",
  },
  "shrug and grab arm": {
    slug: "encolher-e-agarrar-o-braco",
    nomeBR: "Encolher e Agarrar o Braço",
    tipo: "ataque",
  },
  "shrug arm": {
    slug: "encolher-braco",
    nomeBR: "Encolher Braço",
    tipo: "ataque",
  },
  "sit in": {
    slug: "sit-in",
    nomeBR: "Sit in",
    tipo: "ataque",
  },
  "sit out": {
    slug: "sit-out",
    nomeBR: "Sit Out",
    tipo: "ataque",
  },
  "sit to hip": {
    slug: "sentar-pro-quadril",
    nomeBR: "Sentar pro Quadril",
    tipo: "ataque",
  },
  "sit to mono": {
    slug: "sentar-pra-mono",
    nomeBR: "Sentar pra Mono",
    tipo: "ataque",
  },
  "slice": {
    slug: "cortar",
    nomeBR: "Cortar",
    tipo: "ataque",
  },
  "slide": {
    slug: "deslizar",
    nomeBR: "Deslizar",
    tipo: "ataque",
  },
  "slow triangle": {
    slug: "triangulo-lento",
    nomeBR: "Triângulo Lento",
    tipo: "finalizacao",
  },
  "smash and sprawl": {
    slug: "esmagar-e-dar-sprawl",
    nomeBR: "Esmagar e Dar Sprawl",
    tipo: "ataque",
  },
  "smash butterfly": {
    slug: "esmagar-a-guarda-de-gancho",
    nomeBR: "Esmagar a Guarda de Gancho",
    tipo: "ataque",
  },
  "smash legs": {
    slug: "esmagar-as-pernas",
    nomeBR: "Esmagar as Pernas",
    tipo: "ataque",
  },
  "snapdown": {
    slug: "puxada-de-nuca",
    nomeBR: "Puxada de Nuca",
    tipo: "ataque",
  },
  "snapdown2": {
    slug: "snapdown2",
    nomeBR: "Snapdown2",
    tipo: "ataque",
  },
  "sorcerer": {
    slug: "sorcerer",
    nomeBR: "Sorcerer",
    tipo: "ataque",
  },
  "spiral": {
    slug: "espiral",
    nomeBR: "Espiral",
    tipo: "ataque",
  },
  "spladle throw": {
    slug: "queda-spladle",
    nomeBR: "Queda Spladle",
    tipo: "ataque",
  },
  "spladle": {
    slug: "spladle",
    nomeBR: "Spladle",
    tipo: "ataque",
  },
  "sprawl and circle to back": {
    slug: "sprawl-e-circular-pras-costas",
    nomeBR: "Sprawl e Circular pras Costas",
    tipo: "ataque",
  },
  "sprawl and circle": {
    slug: "sprawl-e-circular",
    nomeBR: "Sprawl e Circular",
    tipo: "ataque",
  },
  "sprawl to head&arm": {
    slug: "sprawl-para-cabeca-e-braco",
    nomeBR: "Sprawl para Cabeça e Braço",
    tipo: "ataque",
  },
  "sprawl to single": {
    slug: "sprawl-pro-single",
    nomeBR: "Sprawl pro Single",
    tipo: "ataque",
  },
  "sprawl": {
    slug: "sprawl",
    nomeBR: "Sprawl",
    tipo: "ataque",
  },
  "square up": {
    slug: "se-enquadrar",
    nomeBR: "Se Enquadrar",
    tipo: "ataque",
  },
  "squeeze knees": {
    slug: "apertar-joelhos",
    nomeBR: "Apertar Joelhos",
    tipo: "ataque",
  },
  "stabilize": {
    slug: "estabilizar",
    nomeBR: "Estabilizar",
    tipo: "ataque",
  },
  "stack pass": {
    slug: "passagem-empilhando",
    nomeBR: "Passagem Empilhando",
    tipo: "perda-de-guarda",
  },
  "stack, escape, and pass": {
    slug: "stack-escape-e-passagem",
    nomeBR: "Stack, Escape, e Passagem",
    tipo: "perda-de-guarda",
  },
  "stack": {
    slug: "empilhar",
    nomeBR: "Empilhar",
    tipo: "ataque",
  },
  "stagger": {
    slug: "stagger",
    nomeBR: "Stagger",
    tipo: "ataque",
  },
  "stand up and turn away": {
    slug: "ficar-de-pe-e-virar-pra-fora",
    nomeBR: "Ficar de Pé e Virar pra Fora",
    tipo: "perda-de-guarda",
  },
  "stand up and turn in": {
    slug: "ficar-de-pe-e-virar-na",
    nomeBR: "Ficar de Pé e Virar na",
    tipo: "perda-de-guarda",
  },
  "stand up escape": {
    slug: "fuga-ficando-de-pe",
    nomeBR: "Fuga Ficando de Pé",
    tipo: "perda-de-guarda",
  },
  "stand up further": {
    slug: "ficar-de-pe-mais",
    nomeBR: "Ficar de Pé Mais",
    tipo: "perda-de-guarda",
  },
  "stand up to arm drag": {
    slug: "ficar-de-pe-para-arm-drag",
    nomeBR: "Ficar de Pé para Arm Drag",
    tipo: "perda-de-guarda",
  },
  "stand up to guard jump": {
    slug: "ficar-de-pe-para-salto-pra-guarda",
    nomeBR: "Ficar de Pé para Salto pra Guarda",
    tipo: "perda-de-guarda",
  },
  "stand up to south paw": {
    slug: "ficar-de-pe-para-south-paw",
    nomeBR: "Ficar de Pé para South Paw",
    tipo: "perda-de-guarda",
  },
  "stand-up": {
    slug: "ficar-de-pe-2",
    nomeBR: "Ficar de Pé",
    tipo: "perda-de-guarda",
  },
  "start knee slice pass": {
    slug: "comecar-a-passagem-de-joelho-cortando",
    nomeBR: "Começar a Passagem de Joelho Cortando",
    tipo: "perda-de-guarda",
  },
  "step closer": {
    slug: "passo-mais-perto",
    nomeBR: "Passo Mais Perto",
    tipo: "ataque",
  },
  "step over legs": {
    slug: "passo-por-cima-pernas",
    nomeBR: "Passo por Cima Pernas",
    tipo: "ataque",
  },
  "step over near leg": {
    slug: "passo-por-cima-perto-perna",
    nomeBR: "Passo por Cima Perto Perna",
    tipo: "ataque",
  },
  "step over": {
    slug: "passo-por-cima",
    nomeBR: "Passo por Cima",
    tipo: "ataque",
  },
  "stomp and sweep": {
    slug: "pisar-e-raspar",
    nomeBR: "Pisar e Raspar",
    tipo: "raspagem",
  },
  "stomp": {
    slug: "pisar",
    nomeBR: "Pisar",
    tipo: "ataque",
  },
  "stoner control sweep": {
    slug: "stoner-control-raspagem",
    nomeBR: "Stoner Control Raspagem",
    tipo: "raspagem",
  },
  "strike threat": {
    slug: "strike-ameaca",
    nomeBR: "Strike Ameaça",
    tipo: "ataque",
  },
  "stub": {
    slug: "stub",
    nomeBR: "Stub",
    tipo: "ataque",
  },
  "stuff": {
    slug: "bloquear-2",
    nomeBR: "Bloquear",
    tipo: "ataque",
  },
  "submit": {
    slug: "finalizar-2",
    nomeBR: "Finalizar",
    tipo: "finalizacao",
  },
  "supine knee bar": {
    slug: "deitado-chave-de-joelho",
    nomeBR: "Deitado Chave de Joelho",
    tipo: "finalizacao",
  },
  "sweep success": {
    slug: "raspagem-success",
    nomeBR: "Raspagem Success",
    tipo: "raspagem",
  },
  "sweep successful": {
    slug: "raspagem-successful",
    nomeBR: "Raspagem Successful",
    tipo: "raspagem",
  },
  "sweep thwarted": {
    slug: "raspagem-frustrada",
    nomeBR: "Raspagem Frustrada",
    tipo: "raspagem",
  },
  "swim to gogo": {
    slug: "swim-para-gogoplata",
    nomeBR: "Swim para Gogoplata",
    tipo: "ataque",
  },
  "swing leg outside": {
    slug: "swing-perna-por-fora",
    nomeBR: "Swing Perna por Fora",
    tipo: "ataque",
  },
  "switch arm and trip": {
    slug: "trocar-braco-e-rasteira",
    nomeBR: "Trocar Braço e Rasteira",
    tipo: "ataque",
  },
  "switch base": {
    slug: "trocar-base",
    nomeBR: "Trocar Base",
    tipo: "ataque",
  },
  "switch frame": {
    slug: "trocar-frame",
    nomeBR: "Trocar Frame",
    tipo: "ataque",
  },
  "switch grips": {
    slug: "trocar-pegadas",
    nomeBR: "Trocar Pegadas",
    tipo: "ataque",
  },
  "switch head side": {
    slug: "trocar-cabeca-lado",
    nomeBR: "Trocar Cabeça Lado",
    tipo: "ataque",
  },
  "switch near leg control": {
    slug: "trocar-perto-controle-de-perna",
    nomeBR: "Trocar Perto Controle de Perna",
    tipo: "ataque",
  },
  "switch neck grip": {
    slug: "trocar-pescoco-pegada",
    nomeBR: "Trocar Pescoço Pegada",
    tipo: "ataque",
  },
  "switch side": {
    slug: "trocar-lado",
    nomeBR: "Trocar Lado",
    tipo: "ataque",
  },
  "switch stance": {
    slug: "trocar-stance",
    nomeBR: "Trocar Stance",
    tipo: "ataque",
  },
  "switch sweep": {
    slug: "raspagem-de-troca",
    nomeBR: "Raspagem de Troca",
    tipo: "raspagem",
  },
  "switch to double under pass": {
    slug: "trocar-para-passagem-com-duplo-por-baixo",
    nomeBR: "Trocar para Passagem com Duplo por Baixo",
    tipo: "perda-de-guarda",
  },
  "switch to judo": {
    slug: "trocar-para-judo",
    nomeBR: "Trocar para Judô",
    tipo: "ataque",
  },
  "switch to lower back": {
    slug: "trocar-para-costas-baixas",
    nomeBR: "Trocar para Costas Baixas",
    tipo: "ataque",
  },
  "switch to regular": {
    slug: "trocar-para-regular",
    nomeBR: "Trocar para Regular",
    tipo: "ataque",
  },
  "switch to triangle": {
    slug: "trocar-para-triangulo",
    nomeBR: "Trocar para Triângulo",
    tipo: "finalizacao",
  },
  "switch": {
    slug: "trocar",
    nomeBR: "Trocar",
    tipo: "ataque",
  },
  "take back": {
    slug: "tomar-as-costas",
    nomeBR: "Tomar as Costas",
    tipo: "perda-de-guarda",
  },
  "takedown sweep": {
    slug: "raspagem-em-queda",
    nomeBR: "Raspagem em Queda",
    tipo: "raspagem",
  },
  "takedown to crucifix": {
    slug: "queda-para-crucifixo",
    nomeBR: "Queda para Crucifixo",
    tipo: "finalizacao",
  },
  "takedown": {
    slug: "queda",
    nomeBR: "Queda",
    tipo: "ataque",
  },
  "the homer": {
    slug: "the-homer",
    nomeBR: "The Homer",
    tipo: "ataque",
  },
  "thread the needle": {
    slug: "passar-a-linha",
    nomeBR: "Passar a Linha",
    tipo: "ataque",
  },
  "throw": {
    slug: "queda-2",
    nomeBR: "Queda",
    tipo: "ataque",
  },
  "tie knees": {
    slug: "amarrar-os-joelhos",
    nomeBR: "Amarrar os Joelhos",
    tipo: "ataque",
  },
  "to 50/50": {
    slug: "para-50-50",
    nomeBR: "Para 50/50",
    tipo: "ataque",
  },
  "to ankle pick": {
    slug: "para-ankle-pick",
    nomeBR: "Para Ankle Pick",
    tipo: "ataque",
  },
  "to arm drag": {
    slug: "para-arm-drag",
    nomeBR: "Para Arm Drag",
    tipo: "ataque",
  },
  "to ashi": {
    slug: "para-ashi",
    nomeBR: "Para Ashi",
    tipo: "ataque",
  },
  "to back roll": {
    slug: "para-rolamento-pra-tras",
    nomeBR: "Para Rolamento pra Trás",
    tipo: "ataque",
  },
  "to boston": {
    slug: "para-boston",
    nomeBR: "Para Boston",
    tipo: "ataque",
  },
  "to butterfly": {
    slug: "para-guarda-de-gancho",
    nomeBR: "Para Guarda de Gancho",
    tipo: "ataque",
  },
  "to combat base": {
    slug: "para-base-de-combate",
    nomeBR: "Para Base de Combate",
    tipo: "ataque",
  },
  "to dogfight": {
    slug: "para-dogfight",
    nomeBR: "Para Dogfight",
    tipo: "ataque",
  },
  "to double c-cup": {
    slug: "para-double-c-cup",
    nomeBR: "Para Double C-cup",
    tipo: "ataque",
  },
  "to double leg": {
    slug: "para-double-leg",
    nomeBR: "Para Double Leg",
    tipo: "ataque",
  },
  "to double under pass": {
    slug: "para-passagem-com-duplo-por-baixo",
    nomeBR: "Para Passagem com Duplo por Baixo",
    tipo: "perda-de-guarda",
  },
  "to double under": {
    slug: "para-duplo-por-baixo-2",
    nomeBR: "Para Duplo por Baixo",
    tipo: "ataque",
  },
  "to double": {
    slug: "para-double",
    nomeBR: "Para Double",
    tipo: "ataque",
  },
  "to front headlock": {
    slug: "para-gravata-frontal",
    nomeBR: "Para Gravata Frontal",
    tipo: "ataque",
  },
  "to funk": {
    slug: "para-funk",
    nomeBR: "Para Funk",
    tipo: "ataque",
  },
  "to half": {
    slug: "para-half",
    nomeBR: "Para Half",
    tipo: "ataque",
  },
  "to high": {
    slug: "para-alto",
    nomeBR: "Para Alto",
    tipo: "ataque",
  },
  "to honey": {
    slug: "para-honey",
    nomeBR: "Para Honey",
    tipo: "ataque",
  },
  "to judo side": {
    slug: "para-cem-quilos-de-judo",
    nomeBR: "Para Cem-Quilos de Judô",
    tipo: "ataque",
  },
  "to k-control": {
    slug: "para-k-control",
    nomeBR: "Para K-control",
    tipo: "ataque",
  },
  "to knee bar": {
    slug: "para-chave-de-joelho",
    nomeBR: "Para Chave de Joelho",
    tipo: "finalizacao",
  },
  "to leg drag": {
    slug: "para-leg-drag",
    nomeBR: "Para Leg Drag",
    tipo: "ataque",
  },
  "to mono": {
    slug: "para-mono",
    nomeBR: "Para Mono",
    tipo: "ataque",
  },
  "to mount": {
    slug: "para-montada",
    nomeBR: "Para Montada",
    tipo: "ataque",
  },
  "to north/south": {
    slug: "para-norte-sul",
    nomeBR: "Para Norte-Sul",
    tipo: "ataque",
  },
  "to omoplata": {
    slug: "para-omoplata",
    nomeBR: "Para Omoplata",
    tipo: "finalizacao",
  },
  "to over/under pass": {
    slug: "para-passagem-over-under",
    nomeBR: "Para Passagem Over-under",
    tipo: "perda-de-guarda",
  },
  "to over/under": {
    slug: "para-over-under",
    nomeBR: "Para Over-under",
    tipo: "ataque",
  },
  "to quarter": {
    slug: "para-quarto",
    nomeBR: "Para Quarto",
    tipo: "ataque",
  },
  "to regular side": {
    slug: "para-regular-lado",
    nomeBR: "Para Regular Lado",
    tipo: "ataque",
  },
  "to s-mount": {
    slug: "para-s-mount",
    nomeBR: "Para S-mount",
    tipo: "ataque",
  },
  "to side control": {
    slug: "para-cem-quilos",
    nomeBR: "Para Cem-Quilos",
    tipo: "ataque",
  },
  "to single leg": {
    slug: "para-single-leg",
    nomeBR: "Para Single Leg",
    tipo: "ataque",
  },
  "to single": {
    slug: "para-single",
    nomeBR: "Para Single",
    tipo: "ataque",
  },
  "to slx": {
    slug: "para-slx",
    nomeBR: "Para Slx",
    tipo: "ataque",
  },
  "to spider web": {
    slug: "para-spider-web",
    nomeBR: "Para Spider Web",
    tipo: "ataque",
  },
  "to spider": {
    slug: "para-aranha",
    nomeBR: "Para Aranha",
    tipo: "ataque",
  },
  "to spiderweb": {
    slug: "para-spider-web-2",
    nomeBR: "Para Spider Web",
    tipo: "ataque",
  },
  "to sweep single": {
    slug: "para-raspagem-single",
    nomeBR: "Para Raspagem Single",
    tipo: "raspagem",
  },
  "to traditional": {
    slug: "para-tradicional",
    nomeBR: "Para Tradicional",
    tipo: "ataque",
  },
  "to truck": {
    slug: "para-truck",
    nomeBR: "Para Truck",
    tipo: "ataque",
  },
  "to upper back": {
    slug: "para-costas-altas",
    nomeBR: "Para Costas Altas",
    tipo: "ataque",
  },
  "to x": {
    slug: "para-x",
    nomeBR: "Para X",
    tipo: "ataque",
  },
  "to x-guard": {
    slug: "para-guarda-x",
    nomeBR: "Para Guarda-X",
    tipo: "ataque",
  },
  "to/from kimura": {
    slug: "para-de-kimura",
    nomeBR: "Para/de Kimura",
    tipo: "finalizacao",
  },
  "tony montana": {
    slug: "tony-montana",
    nomeBR: "Tony Montana",
    tipo: "ataque",
  },
  "top attacks leg": {
    slug: "de-cima-ataca-perna",
    nomeBR: "De Cima Ataca Perna",
    tipo: "ataque",
  },
  "top attempts mount": {
    slug: "de-cima-tenta-montada",
    nomeBR: "De Cima Tenta Montada",
    tipo: "ataque",
  },
  "top bases bottom triangles": {
    slug: "de-cima-bases-de-baixo-triangles",
    nomeBR: "De Cima Bases de Baixo Triangles",
    tipo: "finalizacao",
  },
  "top bends": {
    slug: "de-cima-bends",
    nomeBR: "De Cima Bends",
    tipo: "ataque",
  },
  "top blocks with chest": {
    slug: "de-cima-bloqueia-com-peito",
    nomeBR: "De Cima Bloqueia com Peito",
    tipo: "ataque",
  },
  "top blocks with elbow": {
    slug: "de-cima-bloqueia-com-cotovelo",
    nomeBR: "De Cima Bloqueia com Cotovelo",
    tipo: "ataque",
  },
  "top blocks with head": {
    slug: "de-cima-bloqueia-com-cabeca",
    nomeBR: "De Cima Bloqueia com Cabeça",
    tipo: "ataque",
  },
  "top climbs further": {
    slug: "de-cima-sobe-mais",
    nomeBR: "De Cima Sobe Mais",
    tipo: "ataque",
  },
  "top controls wrist": {
    slug: "de-cima-controla-punho",
    nomeBR: "De Cima Controla Punho",
    tipo: "ataque",
  },
  "top defeats c-cups": {
    slug: "de-cima-vence-c-cups",
    nomeBR: "De Cima Vence C-cups",
    tipo: "ataque",
  },
  "top defeats far arm": {
    slug: "de-cima-vence-braco-de-longe",
    nomeBR: "De Cima Vence Braço de Longe",
    tipo: "ataque",
  },
  "top defeats pimp-arm": {
    slug: "de-cima-vence-pimp-arm",
    nomeBR: "De Cima Vence Pimp Arm",
    tipo: "ataque",
  },
  "top drops for over/under": {
    slug: "de-cima-baixa-pro-over-under",
    nomeBR: "De Cima Baixa pro Over-under",
    tipo: "ataque",
  },
  "top drops to both knees": {
    slug: "de-cima-baixa-para-os-dois-joelhos",
    nomeBR: "De Cima Baixa para os Dois Joelhos",
    tipo: "ataque",
  },
  "top drops to judo side": {
    slug: "de-cima-baixa-para-cem-quilos-de-judo",
    nomeBR: "De Cima Baixa para Cem-Quilos de Judô",
    tipo: "ataque",
  },
  "top drops to over/under": {
    slug: "de-cima-baixa-para-over-under",
    nomeBR: "De Cima Baixa para Over-under",
    tipo: "ataque",
  },
  "top drops to side": {
    slug: "de-cima-baixa-para-lado",
    nomeBR: "De Cima Baixa para Lado",
    tipo: "ataque",
  },
  "top faces legs": {
    slug: "de-cima-encara-pernas",
    nomeBR: "De Cima Encara Pernas",
    tipo: "ataque",
  },
  "top falls to hands": {
    slug: "de-cima-cai-para-maos",
    nomeBR: "De Cima Cai para Mãos",
    tipo: "ataque",
  },
  "top falls to knees": {
    slug: "de-cima-cai-para-joelhos",
    nomeBR: "De Cima Cai para Joelhos",
    tipo: "ataque",
  },
  "top finishes slice": {
    slug: "de-cima-finaliza-cortar",
    nomeBR: "De Cima Finaliza Cortar",
    tipo: "finalizacao",
  },
  "top flattens bottom": {
    slug: "de-cima-flattens-de-baixo",
    nomeBR: "De Cima Flattens de Baixo",
    tipo: "ataque",
  },
  "top frees knee and threatens mount": {
    slug: "de-cima-libera-joelho-e-ameaca-montada",
    nomeBR: "De Cima Libera Joelho e Ameaça Montada",
    tipo: "ataque",
  },
  "top frees leg": {
    slug: "de-cima-libera-perna",
    nomeBR: "De Cima Libera Perna",
    tipo: "ataque",
  },
  "top frees legs": {
    slug: "de-cima-libera-pernas",
    nomeBR: "De Cima Libera Pernas",
    tipo: "ataque",
  },
  "top gets fishnet and love handle": {
    slug: "de-cima-pega-fishnet-e-love-handle",
    nomeBR: "De Cima Pega Fishnet e Love Handle",
    tipo: "ataque",
  },
  "top gets foot under armpit": {
    slug: "de-cima-pega-pe-por-baixo-axila",
    nomeBR: "De Cima Pega Pé por Baixo Axila",
    tipo: "ataque",
  },
  "top gets head&arm": {
    slug: "de-cima-pega-cabeca-e-braco",
    nomeBR: "De Cima Pega Cabeça e Braço",
    tipo: "ataque",
  },
  "top gets mount": {
    slug: "de-cima-pega-montada",
    nomeBR: "De Cima Pega Montada",
    tipo: "ataque",
  },
  "top gets seatbelt": {
    slug: "de-cima-pega-seatbelt",
    nomeBR: "De Cima Pega Seatbelt",
    tipo: "ataque",
  },
  "top gets to knees": {
    slug: "de-cima-pega-para-joelhos",
    nomeBR: "De Cima Pega para Joelhos",
    tipo: "ataque",
  },
  "top gets up": {
    slug: "de-cima-pega-pra-cima",
    nomeBR: "De Cima Pega pra Cima",
    tipo: "ataque",
  },
  "top gets vice grip": {
    slug: "de-cima-pega-vice-grip",
    nomeBR: "De Cima Pega Vice Grip",
    tipo: "ataque",
  },
  "top gets vice": {
    slug: "de-cima-pega-vice",
    nomeBR: "De Cima Pega Vice",
    tipo: "ataque",
  },
  "top gives up underhook": {
    slug: "de-cima-gives-pra-cima-underhook",
    nomeBR: "De Cima Gives pra Cima Underhook",
    tipo: "ataque",
  },
  "top goes for knees": {
    slug: "de-cima-vai-pro-joelhos",
    nomeBR: "De Cima Vai pro Joelhos",
    tipo: "ataque",
  },
  "top goes for toes": {
    slug: "de-cima-vai-pro-toes",
    nomeBR: "De Cima Vai pro Toes",
    tipo: "ataque",
  },
  "top grabs legs": {
    slug: "de-cima-agarra-pernas",
    nomeBR: "De Cima Agarra Pernas",
    tipo: "ataque",
  },
  "top grabs neck": {
    slug: "de-cima-agarra-pescoco",
    nomeBR: "De Cima Agarra Pescoço",
    tipo: "ataque",
  },
  "top grabs reverse leg": {
    slug: "de-cima-agarra-invertida-perna",
    nomeBR: "De Cima Agarra Invertida Perna",
    tipo: "ataque",
  },
  "top grabs under armpit": {
    slug: "de-cima-agarra-por-baixo-axila",
    nomeBR: "De Cima Agarra por Baixo Axila",
    tipo: "ataque",
  },
  "top horse stances, bottom goes x": {
    slug: "de-cima-horse-stances-de-baixo-vai-x",
    nomeBR: "De Cima Horse Stances, de Baixo Vai X",
    tipo: "ataque",
  },
  "top inserts first hook": {
    slug: "de-cima-encaixa-primeiro-gancho",
    nomeBR: "De Cima Encaixa Primeiro Gancho",
    tipo: "ataque",
  },
  "top is faster": {
    slug: "de-cima-is-faster",
    nomeBR: "De Cima Is Faster",
    tipo: "ataque",
  },
  "top isolates arm": {
    slug: "de-cima-isola-o-braco",
    nomeBR: "De Cima Isola o Braço",
    tipo: "ataque",
  },
  "top isolates near arm": {
    slug: "de-cima-isolates-braco-de-perto",
    nomeBR: "De Cima Isolates Braço de Perto",
    tipo: "ataque",
  },
  "top lands in side control": {
    slug: "de-cima-cai-na-cem-quilos",
    nomeBR: "De Cima Cai na Cem-Quilos",
    tipo: "ataque",
  },
  "top leans forward": {
    slug: "de-cima-inclina-pra-frente",
    nomeBR: "De Cima Inclina pra Frente",
    tipo: "ataque",
  },
  "top lets bottom push leg": {
    slug: "de-cima-deixa-de-baixo-empurrar-perna",
    nomeBR: "De Cima Deixa de Baixo Empurrar Perna",
    tipo: "ataque",
  },
  "top limp arms": {
    slug: "de-cima-bracos-moles",
    nomeBR: "De Cima Braços Moles",
    tipo: "ataque",
  },
  "top locks hands": {
    slug: "de-cima-trava-maos",
    nomeBR: "De Cima Trava Mãos",
    tipo: "ataque",
  },
  "top mounts": {
    slug: "de-cima-monta",
    nomeBR: "De Cima Monta",
    tipo: "ataque",
  },
  "top opens up": {
    slug: "de-cima-abre-pra-cima",
    nomeBR: "De Cima Abre pra Cima",
    tipo: "ataque",
  },
  "top posts foot": {
    slug: "de-cima-apoia-pe",
    nomeBR: "De Cima Apoia Pé",
    tipo: "ataque",
  },
  "top posts one foot": {
    slug: "de-cima-apoia-uma-pe",
    nomeBR: "De Cima Apoia Uma Pé",
    tipo: "ataque",
  },
  "top posts": {
    slug: "de-cima-apoia",
    nomeBR: "De Cima Apoia",
    tipo: "ataque",
  },
  "top progresses": {
    slug: "de-cima-avanca-2",
    nomeBR: "De Cima Avança",
    tipo: "ataque",
  },
  "top pulls free": {
    slug: "de-cima-puxa-liberar",
    nomeBR: "De Cima Puxa Liberar",
    tipo: "ataque",
  },
  "top pulls weight away": {
    slug: "de-cima-puxa-weight-pra-fora",
    nomeBR: "De Cima Puxa Weight pra Fora",
    tipo: "ataque",
  },
  "top pummels to leg drag": {
    slug: "de-cima-pummels-para-leg-drag",
    nomeBR: "De Cima Pummels para Leg Drag",
    tipo: "ataque",
  },
  "top pushes knee": {
    slug: "de-cima-empurra-joelho",
    nomeBR: "De Cima Empurra Joelho",
    tipo: "ataque",
  },
  "top raises knee": {
    slug: "de-cima-levanta-joelho",
    nomeBR: "De Cima Levanta Joelho",
    tipo: "ataque",
  },
  "top recedes, bottom sits": {
    slug: "de-cima-recedes-de-baixo-senta",
    nomeBR: "De Cima Recedes, de Baixo Senta",
    tipo: "ataque",
  },
  "top recedes": {
    slug: "de-cima-recua",
    nomeBR: "De Cima Recua",
    tipo: "ataque",
  },
  "top regains posture": {
    slug: "de-cima-recupera-postura",
    nomeBR: "De Cima Recupera Postura",
    tipo: "ataque",
  },
  "top releases seatbelt": {
    slug: "de-cima-solta-seatbelt",
    nomeBR: "De Cima Solta Seatbelt",
    tipo: "ataque",
  },
  "top retracts arm, bottom shoots": {
    slug: "de-cima-recolhe-arm-de-baixo-ataca",
    nomeBR: "De Cima Recolhe Arm, de Baixo Ataca",
    tipo: "ataque",
  },
  "top rises, bottom goes deep": {
    slug: "de-cima-rises-de-baixo-vai-profundo",
    nomeBR: "De Cima Rises, de Baixo Vai Profundo",
    tipo: "ataque",
  },
  "top rolls to back": {
    slug: "de-cima-rola-para-costas",
    nomeBR: "De Cima Rola para Costas",
    tipo: "ataque",
  },
  "top rolls": {
    slug: "de-cima-rola",
    nomeBR: "De Cima Rola",
    tipo: "ataque",
  },
  "top settles in side": {
    slug: "de-cima-acomoda-na-lado",
    nomeBR: "De Cima Acomoda na Lado",
    tipo: "ataque",
  },
  "top sits to hip and takes crossface": {
    slug: "de-cima-senta-para-quadril-e-pega-crossface",
    nomeBR: "De Cima Senta para Quadril e Pega Crossface",
    tipo: "ataque",
  },
  "top slices, whizzers, and smashes": {
    slug: "de-cima-slices-whizzers-e-esmaga",
    nomeBR: "De Cima Slices, Whizzers, e Esmaga",
    tipo: "ataque",
  },
  "top smashes": {
    slug: "de-cima-esmaga",
    nomeBR: "De Cima Esmaga",
    tipo: "ataque",
  },
  "top snatches arm": {
    slug: "de-cima-rouba-braco",
    nomeBR: "De Cima Rouba Braço",
    tipo: "ataque",
  },
  "top stands up": {
    slug: "de-cima-levanta-pra-cima",
    nomeBR: "De Cima Levanta pra Cima",
    tipo: "perda-de-guarda",
  },
  "top starts inserting first hook": {
    slug: "de-cima-comeca-encaixando-primeiro-gancho",
    nomeBR: "De Cima Começa Encaixando Primeiro Gancho",
    tipo: "ataque",
  },
  "top steps around": {
    slug: "de-cima-passa-ao-redor",
    nomeBR: "De Cima Passa ao Redor",
    tipo: "ataque",
  },
  "top steps over": {
    slug: "de-cima-passa-por-cima",
    nomeBR: "De Cima Passa por Cima",
    tipo: "ataque",
  },
  "top switches side": {
    slug: "de-cima-troca-lado",
    nomeBR: "De Cima Troca Lado",
    tipo: "ataque",
  },
  "top takes seatbelt": {
    slug: "de-cima-pega-seatbelt-2",
    nomeBR: "De Cima Pega Seatbelt",
    tipo: "ataque",
  },
  "top takes underhook": {
    slug: "de-cima-pega-underhook-2",
    nomeBR: "De Cima Pega Underhook",
    tipo: "ataque",
  },
  "top tries to free leg": {
    slug: "de-cima-tenta-para-liberar-perna",
    nomeBR: "De Cima Tenta para Liberar Perna",
    tipo: "ataque",
  },
  "top tries to get around c-cups": {
    slug: "de-cima-tenta-para-pegar-ao-redor-c-cups",
    nomeBR: "De Cima Tenta para Pegar ao Redor C-cups",
    tipo: "ataque",
  },
  "top turns to face legs": {
    slug: "de-cima-vira-para-face-pernas",
    nomeBR: "De Cima Vira para Face Pernas",
    tipo: "ataque",
  },
  "top whizzers and frames": {
    slug: "de-cima-aplica-whizzer-e-frames",
    nomeBR: "De Cima Aplica Whizzer e Frames",
    tipo: "ataque",
  },
  "top whizzers": {
    slug: "de-cima-aplica-whizzer",
    nomeBR: "De Cima Aplica Whizzer",
    tipo: "ataque",
  },
  "tornado pass": {
    slug: "passagem-tornado",
    nomeBR: "Passagem Tornado",
    tipo: "perda-de-guarda",
  },
  "toward headlocks": {
    slug: "em-direcao-headlocks",
    nomeBR: "Em Direção Headlocks",
    tipo: "ataque",
  },
  "trap arm and choke": {
    slug: "prender-o-braco-e-estrangular",
    nomeBR: "Prender o Braço e Estrangular",
    tipo: "ataque",
  },
  "trap arm and roll escape": {
    slug: "prender-o-braco-e-fuga-de-rolamento",
    nomeBR: "Prender o Braço e Fuga de Rolamento",
    tipo: "perda-de-guarda",
  },
  "trap arm": {
    slug: "prender-o-braco-2",
    nomeBR: "Prender o Braço",
    tipo: "ataque",
  },
  "trap far arm": {
    slug: "prender-o-braco-de-longe",
    nomeBR: "Prender o Braço de Longe",
    tipo: "ataque",
  },
  "trap leg": {
    slug: "prender-a-perna-2",
    nomeBR: "Prender a Perna",
    tipo: "ataque",
  },
  "trip": {
    slug: "rasteira",
    nomeBR: "Rasteira",
    tipo: "ataque",
  },
  "tripod": {
    slug: "tripe",
    nomeBR: "Tripé",
    tipo: "ataque",
  },
  "turn escape": {
    slug: "virar-fuga",
    nomeBR: "Virar Fuga",
    tipo: "perda-de-guarda",
  },
  "turn in escape countered with side control": {
    slug: "virar-na-fuga-contra-atacada-com-cem-quilos",
    nomeBR: "Virar na Fuga Contra-atacada com Cem-Quilos",
    tipo: "perda-de-guarda",
  },
  "turn the corner": {
    slug: "virar-a-quina",
    nomeBR: "Virar a Quina",
    tipo: "ataque",
  },
  "turn to knees": {
    slug: "virar-para-joelhos",
    nomeBR: "Virar para Joelhos",
    tipo: "ataque",
  },
  "turn to side": {
    slug: "virar-para-lado",
    nomeBR: "Virar para Lado",
    tipo: "ataque",
  },
  "turn": {
    slug: "virar",
    nomeBR: "Virar",
    tipo: "ataque",
  },
  "turtle topples": {
    slug: "tartaruga-topples",
    nomeBR: "Tartaruga Topples",
    tipo: "ataque",
  },
  "twister roll": {
    slug: "rolamento-twister",
    nomeBR: "Rolamento Twister",
    tipo: "ataque",
  },
  "twister": {
    slug: "twister",
    nomeBR: "Twister",
    tipo: "ataque",
  },
  "uchi-mata": {
    slug: "uchi-mata",
    nomeBR: "Uchi-mata",
    tipo: "ataque",
  },
  "uncountered": {
    slug: "sem-contra-ataque",
    nomeBR: "Sem Contra-ataque",
    tipo: "ataque",
  },
  "underhook arm": {
    slug: "underhook-braco",
    nomeBR: "Underhook Braço",
    tipo: "ataque",
  },
  "underhook leg": {
    slug: "underhook-perna",
    nomeBR: "Underhook Perna",
    tipo: "ataque",
  },
  "underhook": {
    slug: "underhook",
    nomeBR: "Underhook",
    tipo: "ataque",
  },
  "unintercepted": {
    slug: "nao-interceptado",
    nomeBR: "Não Interceptado",
    tipo: "ataque",
  },
  "whip up": {
    slug: "chicotear-pra-cima",
    nomeBR: "Chicotear pra Cima",
    tipo: "ataque",
  },
  "whizzer": {
    slug: "whizzer",
    nomeBR: "Whizzer",
    tipo: "ataque",
  },
  "wiggle out": {
    slug: "se-soltar",
    nomeBR: "Se Soltar",
    tipo: "ataque",
  },
  "wip": {
    slug: "wip",
    nomeBR: "Wip",
    tipo: "ataque",
  },
  "wrist and neck control": {
    slug: "punho-e-controle-de-pescoco",
    nomeBR: "Punho e Controle de Pescoço",
    tipo: "ataque",
  },
  "wrist control to double": {
    slug: "controle-de-punho-para-double",
    nomeBR: "Controle de Punho para Double",
    tipo: "ataque",
  },
  "wrist control": {
    slug: "controle-de-punho",
    nomeBR: "Controle de Punho",
    tipo: "ataque",
  },
  "x pass": {
    slug: "passagem-x",
    nomeBR: "Passagem-x",
    tipo: "perda-de-guarda",
  },
  "x-pass": {
    slug: "passagem-x-2",
    nomeBR: "Passagem-x",
    tipo: "perda-de-guarda",
  },
  "yank brings in rear leg": {
    slug: "puxao-traz-na-rear-perna",
    nomeBR: "Puxão Traz na Rear Perna",
    tipo: "ataque",
  },
  "yank": {
    slug: "puxao",
    nomeBR: "Puxão",
    tipo: "ataque",
  },
};
