// pt-BR canonical names for the GrappleMap closed-guard neighbourhood.
//
// "A gente já tem as posições, só precisa traduzir." This is the curated
// translation layer: each English GrappleMap position/transition name is mapped
// to the term a Brazilian jiu-jitsu practitioner actually uses on the mat
// (BR-canonical — a mix of pt + accepted anglicisms, per CONTEXT.md), plus an
// ASCII slug for URLs/IDs.
//
// Source: the closed-guard 1-hop neighbourhood from
//   closedGuardNeighbourhood(parseGrappleMap(GrappleMap.txt), { hops: 1 })
//   => 106 positions + 172 transitions (121 distinct transition names).
// Keyed by the lowercased GrappleMap name (gmName). Names are cleaned of the
// literal "\n" line-break marker and whitespace-collapsed before lookup.
//
// Pure data — no I/O, no deps. The eventual GMPosition/GMTransition -> Posicao/
// Transicao adapter reads `nome` from here for display and `slug` for routing.
//
// Translation rationale + flagged uncertainties: research/gm-translations.md.

import { PT_BR_NAMES_EXTRA } from "./pt-br-names-extra";

export interface PtBrName {
  /** ASCII pt-BR slug, no accents (URLs/IDs). e.g. "guarda-fechada". */
  slug: string;
  /** Display name, pt-BR with accents. e.g. "Guarda Fechada". */
  nomeBR: string;
  /**
   * For transitions only: domain edge type derived from GrappleMap tags/name.
   *   raspagem        — sweep (reverses dominance from a guard)
   *   finalizacao     — submission entry/finish (joint lock or choke)
   *   ataque          — offensive setup / threat / control advance (non-terminal)
   *   perda-de-guarda — guard pass / guard break / getting up out of guard
   * Omitted for positions.
   */
  tipo?: "raspagem" | "finalizacao" | "ataque" | "perda-de-guarda";
}

/**
 * Normalise a raw GrappleMap name to the lookup key: drop the literal "\n"
 * line-break marker, collapse whitespace, lowercase. Use this on
 * GMPosition.name / GMTransition.name before indexing PT_BR_NAMES.
 */
export function gmKey(name: string): string {
  return name.replace(/\\n/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * BR-canonical names keyed by lowercased, line-break-cleaned GrappleMap name.
 * Covers the full closed-guard 1-hop neighbourhood (106 positions + every
 * distinct transition name reachable in 1 hop).
 *
 * Hand-curado. O backlog completo (todo o resto do GrappleMap) vive em
 * PT_BR_NAMES_EXTRA e é mesclado abaixo em PT_BR_NAMES (curado vence).
 */
export const PT_BR_NAMES_CURATED: Record<string, PtBrName> = {
  // ===================== POSITIONS (106) =====================

  "6 o'clock homie": {
    slug: "homie-6-horas",
    nomeBR: "Homie às 6 Horas",
  },
  "angled out full guard": {
    slug: "guarda-fechada-angulada",
    nomeBR: "Guarda Fechada Angulada",
  },
  "arm dragged turtle": {
    slug: "tartaruga-com-arm-drag",
    nomeBR: "Tartaruga com Arm Drag",
  },
  "arm lock": {
    slug: "armlock",
    nomeBR: "Armlock",
  },
  ashi: {
    slug: "ashi",
    nomeBR: "Ashi",
  },
  "blocked butterfly overhook sweep": {
    slug: "raspagem-de-gancho-com-sobre-gancho-bloqueada",
    nomeBR: "Raspagem de Gancho com Sobre-Gancho Bloqueada",
  },
  "blocked full guard kimura": {
    slug: "kimura-da-guarda-fechada-bloqueada",
    nomeBR: "Kimura da Guarda Fechada Bloqueada",
  },
  "blocked invisible collar": {
    slug: "gola-invisivel-bloqueada",
    nomeBR: "Gola Invisível Bloqueada",
  },
  "boston handshake": {
    slug: "boston-handshake",
    nomeBR: "Boston Handshake",
  },
  "boston handshake triangle": {
    slug: "triangulo-boston-handshake",
    nomeBR: "Triângulo Boston Handshake",
  },
  "boston handshake w/ grapevine": {
    slug: "boston-handshake-com-grapevine",
    nomeBR: "Boston Handshake com Grapevine",
  },
  "bottom armbar vs figure four": {
    slug: "armlock-de-baixo-vs-figura-quatro",
    nomeBR: "Armlock de Baixo vs Figura-Quatro",
  },
  "bottom defeating hip post in closed guard": {
    slug: "guarda-fechada-vencendo-o-apoio-de-quadril",
    nomeBR: "Guarda Fechada Vencendo o Apoio de Quadril",
  },
  "butterflies engaged w/ double unders": {
    slug: "guarda-de-gancho-com-duplo-por-baixo",
    nomeBR: "Guarda de Gancho com Duplo por Baixo",
  },
  "chill dog": {
    slug: "chill-dog",
    nomeBR: "Chill Dog",
  },
  "clamp guard": {
    slug: "guarda-clamp",
    nomeBR: "Guarda Clamp",
  },
  "closed guard homie": {
    slug: "homie-na-guarda-fechada",
    nomeBR: "Homie na Guarda Fechada",
  },
  "closed guard w/ 100%": {
    slug: "guarda-fechada-com-cem-por-cento",
    nomeBR: "Guarda Fechada com 100%",
  },
  "closed guard w/ arm trapped": {
    slug: "guarda-fechada-com-braco-preso",
    nomeBR: "Guarda Fechada com Braço Preso",
  },
  "closed guard w/ double under collar": {
    slug: "guarda-fechada-com-duplo-por-baixo-na-gola",
    nomeBR: "Guarda Fechada com Duplo por Baixo na Gola",
  },
  "closed guard w/ double unders": {
    slug: "guarda-fechada-com-duplo-por-baixo",
    nomeBR: "Guarda Fechada com Duplo por Baixo",
  },
  "closed guard w/ head&arm vs neck frame": {
    slug: "guarda-fechada-cabeca-e-braco-vs-frame-no-pescoco",
    nomeBR: "Guarda Fechada Cabeça-e-Braço vs Frame no Pescoço",
  },
  "closed guard w/ over/under collar": {
    slug: "guarda-fechada-com-gola-por-cima-e-por-baixo",
    nomeBR: "Guarda Fechada com Gola por Cima e por Baixo",
  },
  "closed guard w/ overhook + collar tie": {
    slug: "guarda-fechada-com-sobre-gancho-e-pegada-de-nuca",
    nomeBR: "Guarda Fechada com Sobre-Gancho e Pegada de Nuca",
  },
  "closed guard w/ overhook vs arm pin": {
    slug: "guarda-fechada-com-sobre-gancho-vs-braco-preso",
    nomeBR: "Guarda Fechada com Sobre-Gancho vs Braço Preso",
  },
  "combat base vs freshly broken guard": {
    slug: "base-de-combate-vs-guarda-recem-aberta",
    nomeBR: "Base de Combate vs Guarda Recém-Aberta",
  },
  "distance closed guard": {
    slug: "guarda-fechada-a-distancia",
    nomeBR: "Guarda Fechada à Distância",
  },
  "distance closed guard w/ 2-on-1": {
    slug: "guarda-fechada-a-distancia-com-2-em-1",
    nomeBR: "Guarda Fechada à Distância com 2-em-1",
  },
  "distance seated butterfly": {
    slug: "guarda-de-gancho-sentada-a-distancia",
    nomeBR: "Guarda de Gancho Sentada à Distância",
  },
  "double bagged chill dog": {
    slug: "chill-dog-double-bag",
    nomeBR: "Chill Dog Double Bag",
  },
  "double bagged mission control": {
    slug: "mission-control-double-bag",
    nomeBR: "Mission Control Double Bag",
  },
  "foot-over-foot pass start": {
    slug: "inicio-de-passagem-pe-sobre-pe",
    nomeBR: "Início de Passagem Pé-sobre-Pé",
  },
  "full guard clinch": {
    slug: "clinch-na-guarda-fechada",
    nomeBR: "Clinch na Guarda Fechada",
  },
  "full guard kimura": {
    slug: "kimura-da-guarda-fechada",
    nomeBR: "Kimura da Guarda Fechada",
  },
  "full guard kimura threat": {
    slug: "ameaca-de-kimura-da-guarda-fechada",
    nomeBR: "Ameaça de Kimura da Guarda Fechada",
  },
  "full guard kimura vs body-lock": {
    slug: "kimura-da-guarda-fechada-vs-body-lock",
    nomeBR: "Kimura da Guarda Fechada vs Body Lock",
  },
  "full guard knee slice": {
    slug: "joelho-cortando-na-guarda-fechada",
    nomeBR: "Joelho Cortando na Guarda Fechada",
  },
  "full guard octopus hip bump": {
    slug: "raspagem-de-quadril-octopus-na-guarda-fechada",
    nomeBR: "Raspagem de Quadril Octopus na Guarda Fechada",
  },
  "full guard shoulder pin w/ bicep ride": {
    slug: "ombro-preso-na-guarda-fechada-com-bicep-ride",
    nomeBR: "Ombro Preso na Guarda Fechada com Bicep Ride",
  },
  "full guard w/ bicep control vs double collar": {
    slug: "guarda-fechada-controle-de-biceps-vs-gola-dupla",
    nomeBR: "Guarda Fechada com Controle de Bíceps vs Gola Dupla",
  },
  "half guard arm triangle": {
    slug: "triangulo-de-braco-na-meia-guarda",
    nomeBR: "Triângulo de Braço na Meia-Guarda",
  },
  "half guard w/ crossface vs neck frame": {
    slug: "meia-guarda-com-crossface-vs-frame-no-pescoco",
    nomeBR: "Meia-Guarda com Crossface vs Frame no Pescoço",
  },
  "halfway pendulum sweep": {
    slug: "raspagem-de-pendulo-pela-metade",
    nomeBR: "Raspagem de Pêndulo pela Metade",
  },
  "hip bump sweep w/ elbow post": {
    slug: "raspagem-de-quadril-com-apoio-de-cotovelo",
    nomeBR: "Raspagem de Quadril com Apoio de Cotovelo",
  },
  "hip bump sweep w/ hand post": {
    slug: "raspagem-de-quadril-com-apoio-de-mao",
    nomeBR: "Raspagem de Quadril com Apoio de Mão",
  },
  "homie w/ arm shucked": {
    slug: "homie-com-braco-jogado-pra-fora",
    nomeBR: "Homie com Braço Jogado pra Fora",
  },
  // "inside trip" exists as both a position and a transition in the data; one
  // keyed entry serves both. tipo reflects the transition (a guard exit/pass).
  "inside trip": {
    slug: "rasteira-por-dentro",
    nomeBR: "Rasteira por Dentro",
    tipo: "perda-de-guarda",
  },
  "invisible collar": {
    slug: "gola-invisivel",
    nomeBR: "Gola Invisível",
  },
  "invisible collar w/o hand-on-mat": {
    slug: "gola-invisivel-sem-mao-no-chao",
    nomeBR: "Gola Invisível sem Mão no Chão",
  },
  // Also a transition (collar-choke entry) of the same name; one entry serves both.
  "irish collar": {
    slug: "gola-irlandesa",
    nomeBR: "Gola Irlandesa",
    tipo: "finalizacao",
  },
  "irish collar w/ wrist control": {
    slug: "gola-irlandesa-com-controle-de-punho",
    nomeBR: "Gola Irlandesa com Controle de Punho",
  },
  "judo side vs double c-cups": {
    slug: "cem-quilos-de-judo-vs-duplo-c-cup",
    nomeBR: "Cem Quilos de Judô vs Duplo C-cup",
  },
  "jumping guard w/ overhook": {
    slug: "puxar-para-guarda-pulando-com-sobre-gancho",
    nomeBR: "Puxar para Guarda Pulando com Sobre-Gancho",
  },
  "k-control": {
    slug: "k-control",
    nomeBR: "K-control",
  },
  "knee on belly w/ head&arm": {
    slug: "joelho-na-barriga-cabeca-e-braco",
    nomeBR: "Joelho na Barriga Cabeça-e-Braço",
  },
  "knee slice vs t-rex": {
    slug: "joelho-cortando-vs-t-rex",
    nomeBR: "Joelho Cortando vs T-rex",
  },
  "kneeling in full w/ leg+wrist": {
    slug: "ajoelhado-na-guarda-fechada-com-perna-e-punho",
    nomeBR: "Ajoelhado na Guarda Fechada com Perna e Punho",
  },
  "kneeling vs seated open guard w/ 2-on-1": {
    slug: "ajoelhado-vs-guarda-aberta-sentada-com-2-em-1",
    nomeBR: "Ajoelhado vs Guarda Aberta Sentada com 2-em-1",
  },
  "middle double bag": {
    slug: "double-bag-no-meio",
    nomeBR: "Double Bag no Meio",
  },
  "mission control": {
    slug: "mission-control",
    nomeBR: "Mission Control",
  },
  // Also a transition ("reach mount" = a guard pass); one entry serves both.
  mount: {
    slug: "montada",
    nomeBR: "Montada",
    tipo: "perda-de-guarda",
  },
  "mount w/ head&arm": {
    slug: "montada-cabeca-e-braco",
    nomeBR: "Montada Cabeça-e-Braço",
  },
  "muddy waters": {
    slug: "muddy-waters",
    nomeBR: "Muddy Waters",
  },
  "new york": {
    slug: "new-york",
    nomeBR: "New York",
  },
  "new york crackhead": {
    slug: "new-york-crackhead",
    nomeBR: "New York Crackhead",
  },
  "octopus closed guard": {
    slug: "guarda-fechada-octopus",
    nomeBR: "Guarda Fechada Octopus",
  },
  "omoplata on side": {
    slug: "omoplata-de-lado",
    nomeBR: "Omoplata de Lado",
  },
  "omoplata w/ bottom leg free": {
    slug: "omoplata-com-perna-de-baixo-livre",
    nomeBR: "Omoplata com Perna de Baixo Livre",
  },
  "parallel turtle w/ seatbelt": {
    slug: "tartaruga-paralela-com-cinto",
    nomeBR: "Tartaruga Paralela com Cinto de Segurança",
  },
  "perpendicular triangle": {
    slug: "triangulo-perpendicular",
    nomeBR: "Triângulo Perpendicular",
  },
  "posture broken full guard": {
    slug: "guarda-fechada-com-postura-quebrada",
    nomeBR: "Guarda Fechada com Postura Quebrada",
  },
  "posture broken full guard w/ hand on mat": {
    slug: "guarda-fechada-postura-quebrada-com-mao-no-chao",
    nomeBR: "Guarda Fechada com Postura Quebrada e Mão no Chão",
  },
  "postured up mount": {
    slug: "montada-com-postura",
    nomeBR: "Montada com Postura",
  },
  "power dogfight": {
    slug: "dogfight-de-forca",
    nomeBR: "Dogfight de Força",
  },
  "rat guard": {
    slug: "rat-guard",
    nomeBR: "Rat Guard",
  },
  "recovering guard": {
    slug: "recuperando-a-guarda",
    nomeBR: "Recuperando a Guarda",
  },
  "seated butterfly homie": {
    slug: "homie-na-guarda-de-gancho-sentada",
    nomeBR: "Homie na Guarda de Gancho Sentada",
  },
  "seated closed guard w/ double unders": {
    slug: "guarda-fechada-sentada-com-duplo-por-baixo",
    nomeBR: "Guarda Fechada Sentada com Duplo por Baixo",
  },
  "seated full guard guillotine": {
    slug: "guilhotina-na-guarda-fechada-sentada",
    nomeBR: "Guilhotina na Guarda Fechada Sentada",
  },
  "side control w/ head&arm vs hip block + neck frame": {
    slug: "cem-quilos-cabeca-e-braco-vs-bloqueio-de-quadril-e-frame",
    nomeBR: "Cem Quilos Cabeça-e-Braço vs Bloqueio de Quadril e Frame",
  },
  "side half w/ lockdown and deep underhook": {
    slug: "meia-guarda-de-lado-com-lockdown-e-underhook-profundo",
    nomeBR: "Meia-Guarda de Lado com Lockdown e Underhook Profundo",
  },
  "side half w/ lockdown, double unders vs whizzer": {
    slug: "meia-guarda-de-lado-com-lockdown-duplo-por-baixo-vs-whizzer",
    nomeBR: "Meia-Guarda de Lado com Lockdown, Duplo por Baixo vs Whizzer",
  },
  "side half w/ lockdown, overhook and pimp-arm": {
    slug: "meia-guarda-de-lado-com-lockdown-sobre-gancho-e-pimp-arm",
    nomeBR: "Meia-Guarda de Lado com Lockdown, Sobre-Gancho e Pimp-arm",
  },
  "sit up guard": {
    slug: "guarda-sentada",
    nomeBR: "Guarda Sentada",
  },
  "sit-up guard": {
    slug: "guarda-sentada-sit-up",
    nomeBR: "Guarda Sentada (Sit-up)",
  },
  "spider guard w/ shins against biceps": {
    slug: "guarda-aranha-com-canelas-nos-biceps",
    nomeBR: "Guarda-Aranha com Canelas nos Bíceps",
  },
  "spiderweb w/ s-grip and w/o leg control": {
    slug: "spiderweb-com-s-grip-sem-controle-de-perna",
    nomeBR: "Spiderweb com S-grip sem Controle de Perna",
  },
  "standing between legs": {
    slug: "em-pe-entre-as-pernas",
    nomeBR: "Em Pé entre as Pernas",
  },
  "standing inside w/ knee and hip pinned": {
    slug: "em-pe-por-dentro-com-joelho-e-quadril-presos",
    nomeBR: "Em Pé por Dentro com Joelho e Quadril Presos",
  },
  "standing knee pinch": {
    slug: "em-pe-prensando-o-joelho",
    nomeBR: "Em Pé Prensando o Joelho",
  },
  "standing outside w/ knee and hip pinned": {
    slug: "em-pe-por-fora-com-joelho-e-quadril-presos",
    nomeBR: "Em Pé por Fora com Joelho e Quadril Presos",
  },
  "standing vs arm-pinnen closed guard": {
    slug: "em-pe-vs-guarda-fechada-com-braco-preso",
    nomeBR: "Em Pé vs Guarda Fechada com Braço Preso",
  },
  "standing vs closed guard": {
    slug: "em-pe-vs-guarda-fechada",
    nomeBR: "Em Pé vs Guarda Fechada",
  },
  "standing vs de la riva": {
    slug: "em-pe-vs-de-la-riva",
    nomeBR: "Em Pé vs De la Riva",
  },
  "standing vs freshly broken guard": {
    slug: "em-pe-vs-guarda-recem-aberta",
    nomeBR: "Em Pé vs Guarda Recém-Aberta",
  },
  "standing vs supine w/ legs extended": {
    slug: "em-pe-vs-de-costas-com-pernas-estendidas",
    nomeBR: "Em Pé vs De Costas com Pernas Estendidas",
  },
  "standing vs wide open guard": {
    slug: "em-pe-vs-guarda-bem-aberta",
    nomeBR: "Em Pé vs Guarda Bem Aberta",
  },
  staredown: {
    slug: "encarada",
    nomeBR: "Encarada",
  },
  "swim move": {
    slug: "swim-move",
    nomeBR: "Swim Move",
  },
  "symmetric staggered standing": {
    slug: "em-pe-escalonado-simetrico",
    nomeBR: "Em Pé Escalonado Simétrico",
  },
  "thwarted half guard pass": {
    slug: "passagem-de-meia-guarda-frustrada",
    nomeBR: "Passagem de Meia-Guarda Frustrada",
  },
  "triangle broken by knee in butt": {
    slug: "triangulo-quebrado-por-joelho-no-bumbum",
    nomeBR: "Triângulo Quebrado por Joelho no Bumbum",
  },
  "triangle threat": {
    slug: "ameaca-de-triangulo",
    nomeBR: "Ameaça de Triângulo",
  },
  "turtle w/ lower back control": {
    slug: "tartaruga-com-controle-da-lombar",
    nomeBR: "Tartaruga com Controle da Lombar",
  },
  "underhook shoulder pin": {
    slug: "ombro-preso-com-underhook",
    nomeBR: "Ombro Preso com Underhook",
  },
  "z-guard vs cross-grip and wrist": {
    slug: "z-guard-vs-pegada-cruzada-e-punho",
    nomeBR: "Z-guard vs Pegada Cruzada e Punho",
  },

  // ===================== TRANSITIONS (121 distinct names) =====================

  "...": {
    // Placeholder/unnamed transition in the source data (literal "...").
    slug: "transicao-sem-nome",
    nomeBR: "Transição sem Nome",
    tipo: "finalizacao", // union tags carry armbar/arm_choke/guillotine
  },
  "(un)mount": {
    // GrappleMap idiom: the back-and-forth between side control and mount.
    slug: "montar-ou-desmontar",
    nomeBR: "Montar / Desmontar",
    tipo: "perda-de-guarda",
  },
  "aldo pass": {
    // Named after José Aldo's spinning/step-over pass technique.
    slug: "passagem-aldo",
    nomeBR: "Passagem Aldo",
    tipo: "perda-de-guarda",
  },
  "ankle pick": {
    slug: "ankle-pick",
    nomeBR: "Ankle Pick",
    tipo: "perda-de-guarda",
  },
  "arm shuck": {
    slug: "arm-shuck",
    nomeBR: "Arm Shuck",
    tipo: "ataque",
  },
  backtake: {
    // Clinching/reaching to take the back (octopus tag).
    slug: "tomada-das-costas",
    nomeBR: "Tomada das Costas",
    tipo: "ataque",
  },
  "be like rubber": {
    slug: "be-like-rubber",
    nomeBR: "Be Like Rubber",
    tipo: "ataque",
  },
  begin: {
    slug: "comecar",
    nomeBR: "Começar",
    tipo: "ataque",
  },
  "bicep ride": {
    slug: "bicep-ride",
    nomeBR: "Bicep Ride",
    tipo: "ataque",
  },
  "bottom retracts leg": {
    // De baixo recolhe a perna (saindo da meia-guarda).
    slug: "de-baixo-recolhe-a-perna",
    nomeBR: "De Baixo Recolhe a Perna",
    tipo: "ataque",
  },
  "bottom stands up": {
    // De baixo levanta (saída pelo baixo).
    slug: "de-baixo-levanta",
    nomeBR: "De Baixo Levanta",
    tipo: "perda-de-guarda",
  },
  "bottom angles out": {
    slug: "de-baixo-faz-angulo",
    nomeBR: "De Baixo Faz Ângulo",
    tipo: "ataque",
  },
  "bottom closes guard": {
    slug: "de-baixo-fecha-a-guarda",
    nomeBR: "De Baixo Fecha a Guarda",
    tipo: "ataque",
  },
  "bottom gets 2-on-1": {
    slug: "de-baixo-pega-2-em-1",
    nomeBR: "De Baixo Pega 2-em-1",
    tipo: "ataque",
  },
  "bottom gets double unders": {
    slug: "de-baixo-pega-duplo-por-baixo",
    nomeBR: "De Baixo Pega Duplo por Baixo",
    tipo: "ataque",
  },
  "bottom goes back": {
    slug: "de-baixo-volta",
    nomeBR: "De Baixo Volta",
    tipo: "ataque",
  },
  "bottom goes octopus": {
    slug: "de-baixo-vai-pra-octopus",
    nomeBR: "De Baixo Vai pra Octopus",
    tipo: "ataque",
  },
  "bottom grabs both arms": {
    slug: "de-baixo-pega-os-dois-bracos",
    nomeBR: "De Baixo Pega os Dois Braços",
    tipo: "ataque",
  },
  "bottom hooks feet": {
    slug: "de-baixo-engancha-os-pes",
    nomeBR: "De Baixo Engancha os Pés",
    tipo: "ataque",
  },
  "bottom hooks legs": {
    slug: "de-baixo-engancha-as-pernas",
    nomeBR: "De Baixo Engancha as Pernas",
    tipo: "ataque",
  },
  "bottom keeps quarter": {
    slug: "de-baixo-segura-quarto-de-guarda",
    nomeBR: "De Baixo Segura o Quarto de Guarda",
    tipo: "ataque",
  },
  "bottom kicks leg": {
    slug: "de-baixo-chuta-a-perna",
    nomeBR: "De Baixo Chuta a Perna",
    tipo: "ataque",
  },
  "bottom leg freed": {
    slug: "perna-de-baixo-liberada",
    nomeBR: "Perna de Baixo Liberada",
    tipo: "finalizacao", // omoplata
  },
  "bottom pulls and scoots": {
    slug: "de-baixo-puxa-e-arrasta-o-quadril",
    nomeBR: "De Baixo Puxa e Arrasta o Quadril",
    tipo: "ataque",
  },
  "bottom pummels": {
    slug: "de-baixo-faz-pummel",
    nomeBR: "De Baixo Faz Pummel",
    tipo: "ataque",
  },
  "bottom recovers full guard": {
    slug: "de-baixo-recupera-a-guarda-fechada",
    nomeBR: "De Baixo Recupera a Guarda Fechada",
    tipo: "ataque",
  },
  "bottom scoots for angle": {
    slug: "de-baixo-arrasta-pro-angulo",
    nomeBR: "De Baixo Arrasta pro Ângulo",
    tipo: "ataque",
  },
  "bottom trades underhook": {
    slug: "de-baixo-troca-underhook",
    nomeBR: "De Baixo Troca o Underhook",
    tipo: "ataque",
  },
  "bottom traps arm": {
    slug: "de-baixo-prende-o-braco",
    nomeBR: "De Baixo Prende o Braço",
    tipo: "ataque",
  },
  "capoeira pass": {
    // The spinning capoeira-style guard pass.
    slug: "passagem-capoeira",
    nomeBR: "Passagem Capoeira",
    tipo: "perda-de-guarda",
  },
  "break dlr": {
    slug: "abrir-de-la-riva",
    nomeBR: "Abrir a De la Riva",
    tipo: "perda-de-guarda",
  },
  "break guard": {
    slug: "abrir-a-guarda",
    nomeBR: "Abrir a Guarda",
    tipo: "perda-de-guarda",
  },
  "break guard using knee": {
    slug: "abrir-a-guarda-com-o-joelho",
    nomeBR: "Abrir a Guarda com o Joelho",
    tipo: "perda-de-guarda",
  },
  "break open guard": {
    slug: "abrir-a-guarda-aberta",
    nomeBR: "Abrir a Guarda Aberta",
    tipo: "perda-de-guarda",
  },
  // "continue" appears as an arm_drag chain step (meia-guarda → tartaruga etc.)
  continue: {
    slug: "continuar",
    nomeBR: "Continuar",
    tipo: "ataque",
  },
  clamp: {
    slug: "clamp",
    nomeBR: "Clamp",
    tipo: "ataque",
  },
  "clear the neck": {
    slug: "tirar-do-pescoco",
    nomeBR: "Tirar a Cabeça do Pescoço",
    tipo: "perda-de-guarda",
  },
  "cop sweep": {
    slug: "cop-sweep",
    nomeBR: "Cop Sweep",
    tipo: "raspagem", // sweep
  },
  darce: {
    // D'Arce choke (arm triangle from top). BR practitioners say "Darce" or "D'Arce".
    slug: "darce",
    nomeBR: "D'Arce",
    tipo: "finalizacao",
  },
  "drag & flank": {
    // Arm drag seguido de flanquear (ir para o ângulo de trás).
    slug: "arm-drag-e-flanquear",
    nomeBR: "Arm Drag e Flanquear",
    tipo: "ataque",
  },
  "drop knee": {
    // Baixar o joelho (de joelho na barriga para cem quilos).
    slug: "queda-de-joelho",
    nomeBR: "Queda de Joelho",
    tipo: "perda-de-guarda",
  },
  "double bag": {
    slug: "double-bag",
    nomeBR: "Double Bag",
    tipo: "ataque",
  },
  "double swim inside": {
    slug: "swim-duplo-por-dentro",
    nomeBR: "Swim Duplo por Dentro",
    tipo: "ataque",
  },
  "end in judo side": {
    slug: "terminar-no-cem-quilos-de-judo",
    nomeBR: "Terminar no Cem Quilos de Judô",
    tipo: "perda-de-guarda", // knee_slice
  },
  "enter deep half": {
    // Entrar na deep half guard.
    slug: "entrar-na-deep-half",
    nomeBR: "Entrar na Deep Half",
    tipo: "ataque",
  },
  "enter rat": {
    slug: "entrar-na-rat-guard",
    nomeBR: "Entrar na Rat Guard",
    tipo: "ataque",
  },
  escape: {
    slug: "escapar",
    nomeBR: "Escapar",
    tipo: "perda-de-guarda",
  },
  "flanking arm drag": {
    // Arm drag flanqueando (indo para o ângulo lateral).
    slug: "arm-drag-flanqueando",
    nomeBR: "Arm Drag Flanqueando",
    tipo: "ataque",
  },
  "fake pendulum sweep to shoulder pin": {
    slug: "finta-de-raspagem-de-pendulo-para-ombro-preso",
    nomeBR: "Finta de Raspagem de Pêndulo para Ombro Preso",
    tipo: "raspagem",
  },
  finish: {
    slug: "finalizar",
    nomeBR: "Finalizar",
    tipo: "finalizacao",
  },
  heisman: {
    // The stiff-arm push (Heisman pose) used to create distance / pass guard.
    // GrappleMap coined term; no clean pt-BR equivalent on the mat.
    slug: "heisman",
    nomeBR: "Heisman",
    tipo: "perda-de-guarda",
  },
  "free new york": {
    slug: "liberar-new-york",
    nomeBR: "Liberar New York",
    tipo: "ataque",
  },
  "get 100%": {
    slug: "pegar-cem-por-cento",
    nomeBR: "Pegar 100%",
    tipo: "ataque",
  },
  "get up": {
    slug: "levantar",
    nomeBR: "Levantar",
    tipo: "perda-de-guarda",
  },
  "grab leg": {
    slug: "pegar-a-perna",
    nomeBR: "Pegar a Perna",
    tipo: "ataque",
  },
  "grab neck": {
    slug: "pegar-o-pescoco",
    nomeBR: "Pegar o Pescoço",
    tipo: "ataque",
  },
  "granby to back": {
    slug: "granby-para-as-costas",
    nomeBR: "Granby para as Costas",
    tipo: "ataque",
  },
  grapevine: {
    slug: "grapevine",
    nomeBR: "Grapevine",
    tipo: "ataque",
  },
  "grapevine and hip post": {
    slug: "grapevine-e-apoio-de-quadril",
    nomeBR: "Grapevine e Apoio de Quadril",
    tipo: "ataque",
  },
  "hip bump": {
    slug: "raspagem-de-quadril",
    nomeBR: "Raspagem de Quadril",
    tipo: "raspagem", // hip_bump
  },
  "hip heist": {
    slug: "hip-heist",
    nomeBR: "Hip Heist",
    tipo: "perda-de-guarda",
  },
  // "inside trip" and "irish collar" (transitions) are keyed above alongside the
  // positions of the same name — see the POSITIONS block.
  "leg over pass": {
    // Passagem por cima da perna (pass_over tag).
    slug: "passagem-por-cima-da-perna",
    nomeBR: "Passagem por Cima da Perna",
    tipo: "perda-de-guarda",
  },
  "kick through triangle": {
    slug: "chutar-para-o-triangulo",
    nomeBR: "Chutar para o Triângulo",
    tipo: "finalizacao",
  },
  kimura: {
    slug: "kimura-entrada",
    nomeBR: "Kimura",
    tipo: "finalizacao",
  },
  "knee pummel": {
    slug: "pummel-de-joelho",
    nomeBR: "Pummel de Joelho",
    tipo: "perda-de-guarda",
  },
  "knee slice": {
    slug: "joelho-cortando",
    nomeBR: "Joelho Cortando",
    tipo: "perda-de-guarda", // knee_slice
  },
  "knee-pummel": {
    slug: "pummel-de-joelho-alt",
    nomeBR: "Pummel de Joelho",
    tipo: "perda-de-guarda",
  },
  kneel: {
    slug: "ajoelhar",
    nomeBR: "Ajoelhar",
    tipo: "ataque",
  },
  "kung fu move": {
    slug: "kung-fu-move",
    nomeBR: "Kung Fu Move",
    tipo: "finalizacao", // omoplata
  },
  "leg lace": {
    slug: "leg-lace",
    nomeBR: "Leg Lace",
    tipo: "perda-de-guarda", // pass_around
  },
  "modified crab pass": {
    slug: "passagem-de-caranguejo-modificada",
    nomeBR: "Passagem de Caranguejo Modificada",
    tipo: "perda-de-guarda",
  },
  // "mount" (transition) is keyed above alongside the position of the same name.
  "omoplata": {
    slug: "omoplata-entrada",
    nomeBR: "Omoplata",
    tipo: "finalizacao", // omoplata
  },
  "open guard": {
    slug: "abrir-para-guarda-aberta",
    nomeBR: "Abrir para Guarda Aberta",
    tipo: "ataque",
  },
  "pendulum sweep start": {
    slug: "inicio-da-raspagem-de-pendulo",
    nomeBR: "Início da Raspagem de Pêndulo",
    tipo: "raspagem",
  },
  "pin arm": {
    slug: "prender-o-braco",
    nomeBR: "Prender o Braço",
    tipo: "ataque",
  },
  "pin knee": {
    slug: "prender-o-joelho",
    nomeBR: "Prender o Joelho",
    tipo: "perda-de-guarda", // knee_pin
  },
  "pin shoulder": {
    slug: "prender-o-ombro",
    nomeBR: "Prender o Ombro",
    tipo: "ataque",
  },
  "posture up": {
    slug: "subir-a-postura",
    nomeBR: "Subir a Postura",
    tipo: "perda-de-guarda",
  },
  "pull guard": {
    slug: "puxar-para-guarda",
    nomeBR: "Puxar para a Guarda",
    tipo: "ataque", // guard_pull
  },
  "push away and get up": {
    slug: "empurrar-e-levantar",
    nomeBR: "Empurrar e Levantar",
    tipo: "perda-de-guarda",
  },
  "recover full": {
    slug: "recuperar-guarda-fechada-curto",
    nomeBR: "Recuperar a Guarda Fechada",
    tipo: "ataque",
  },
  "second hook": {
    // Colocar o segundo gancho (tornozelo) para completar o back control.
    slug: "segundo-gancho",
    nomeBR: "Segundo Gancho",
    tipo: "ataque",
  },
  "recover full guard": {
    slug: "recuperar-a-guarda-fechada",
    nomeBR: "Recuperar a Guarda Fechada",
    tipo: "ataque",
  },
  "reverse technical stand-up": {
    slug: "levantada-tecnica-invertida",
    nomeBR: "Levantada Técnica Invertida",
    tipo: "perda-de-guarda",
  },
  "rubber guard": {
    slug: "rubber-guard-entrada",
    nomeBR: "Rubber Guard",
    tipo: "ataque", // rubber_guard
  },
  "shrimp escape": {
    slug: "fuga-de-quadril",
    nomeBR: "Fuga de Quadril",
    tipo: "perda-de-guarda",
  },
  "sit up": {
    slug: "sentar",
    nomeBR: "Sentar",
    tipo: "ataque",
  },
  "solidify combat base": {
    slug: "firmar-base-de-combate",
    nomeBR: "Firmar a Base de Combate",
    tipo: "ataque",
  },
  "successful escape+sweep": {
    // Fuga + raspagem bem-sucedidas (tartaruga → cem quilos ou posição superior).
    slug: "fuga-e-raspagem",
    nomeBR: "Fuga e Raspagem",
    tipo: "raspagem",
  },
  "stand up": {
    slug: "ficar-de-pe",
    nomeBR: "Ficar de Pé",
    tipo: "perda-de-guarda", // stand_up
  },
  "step in/out": {
    slug: "entrar-e-sair-com-o-pe",
    nomeBR: "Entrar e Sair com o Pé",
    tipo: "ataque",
  },
  "strike attempt": {
    slug: "tentativa-de-golpe",
    nomeBR: "Tentativa de Golpe",
    tipo: "ataque",
  },
  "strike attempt to octopus": {
    slug: "tentativa-de-golpe-para-octopus",
    nomeBR: "Tentativa de Golpe para Octopus",
    tipo: "ataque",
  },
  sweep: {
    slug: "raspagem",
    nomeBR: "Raspagem",
    tipo: "raspagem", // butterfly_sweep
  },
  "sweep finish": {
    slug: "finalizar-a-raspagem",
    nomeBR: "Finalizar a Raspagem",
    tipo: "raspagem",
  },
  "sweep thwart countered": {
    slug: "contra-de-defesa-de-raspagem",
    nomeBR: "Contra de Defesa de Raspagem",
    tipo: "raspagem", // rubber_guard chain
  },
  swim: {
    slug: "swim",
    nomeBR: "Swim",
    tipo: "ataque",
  },
  tap: {
    slug: "bater",
    nomeBR: "Bater",
    tipo: "finalizacao",
  },
  "tap-through triangle": {
    slug: "triangulo-com-tap-through",
    nomeBR: "Triângulo com Tap-through",
    tipo: "finalizacao", // triangle
  },
  "tip toe mount": {
    // Subir para a montada na ponta do pé (transitional step).
    slug: "montar-na-ponta-do-pe",
    nomeBR: "Montar na Ponta do Pé",
    tipo: "perda-de-guarda",
  },
  "the county": {
    slug: "the-county",
    nomeBR: "The County",
    tipo: "raspagem", // sweep
  },
  "threaten triangle": {
    slug: "ameacar-triangulo",
    nomeBR: "Ameaçar o Triângulo",
    tipo: "finalizacao",
  },
  "to back": {
    slug: "para-as-costas",
    nomeBR: "Para as Costas",
    tipo: "ataque",
  },
  "to knee on belly": {
    // Transição de cem quilos para joelho na barriga.
    slug: "para-o-joelho-na-barriga",
    nomeBR: "Para o Joelho na Barriga",
    tipo: "ataque",
  },
  "to lower back": {
    // Ir para o controle da lombar / pegada nas costas.
    slug: "para-o-controle-da-lombar",
    nomeBR: "Para o Controle da Lombar",
    tipo: "ataque",
  },
  "to side": {
    // Passar para o cem quilos (de meia-guarda ou montada).
    slug: "para-o-lado",
    nomeBR: "Para o Lado",
    tipo: "perda-de-guarda",
  },
  "to turtle": {
    // Ir para a tartaruga.
    slug: "para-a-tartaruga",
    nomeBR: "Para a Tartaruga",
    tipo: "ataque",
  },
  "to closed guard": {
    slug: "para-a-guarda-fechada",
    nomeBR: "Para a Guarda Fechada",
    tipo: "ataque",
  },
  "to double unders": {
    slug: "para-duplo-por-baixo",
    nomeBR: "Para o Duplo por Baixo",
    tipo: "ataque",
  },
  "to foot-over-foot": {
    slug: "para-pe-sobre-pe",
    nomeBR: "Para o Pé-sobre-Pé",
    tipo: "perda-de-guarda",
  },
  "to full guard": {
    slug: "para-a-guarda-fechada-cheia",
    nomeBR: "Para a Guarda Fechada",
    tipo: "ataque",
  },
  "to new york": {
    slug: "para-new-york",
    nomeBR: "Para a New York",
    tipo: "ataque",
  },
  "to triangle": {
    slug: "para-o-triangulo",
    nomeBR: "Para o Triângulo",
    tipo: "finalizacao",
  },
  "top intercepts": {
    // De cima intercepta o movimento de baixo.
    slug: "de-cima-intercepta",
    nomeBR: "De Cima Intercepta",
    tipo: "perda-de-guarda",
  },
  "top steps to other side": {
    // De cima passa o pé para o outro lado (passagem ao redor).
    slug: "de-cima-passa-para-o-outro-lado",
    nomeBR: "De Cima Passa para o Outro Lado",
    tipo: "perda-de-guarda",
  },
  topple: {
    // Derrubar / quebrar o equilíbrio do oponente.
    slug: "derrubar",
    nomeBR: "Derrubar",
    tipo: "ataque",
  },
  "top advances": {
    slug: "de-cima-avanca",
    nomeBR: "De Cima Avança",
    tipo: "perda-de-guarda",
  },
  "top blocks": {
    slug: "de-cima-bloqueia",
    nomeBR: "De Cima Bloqueia",
    tipo: "perda-de-guarda",
  },
  "top body-locks": {
    slug: "de-cima-faz-body-lock",
    nomeBR: "De Cima Faz Body Lock",
    tipo: "perda-de-guarda",
  },
  "top breaks collar": {
    slug: "de-cima-quebra-a-gola",
    nomeBR: "De Cima Quebra a Pegada na Gola",
    tipo: "perda-de-guarda",
  },
  "top drives in": {
    slug: "de-cima-pressiona-pra-dentro",
    nomeBR: "De Cima Pressiona pra Dentro",
    tipo: "perda-de-guarda",
  },
  "top frames against hip": {
    slug: "de-cima-faz-frame-no-quadril",
    nomeBR: "De Cima Faz Frame no Quadril",
    tipo: "perda-de-guarda", // frame
  },
  "top frees arm": {
    slug: "de-cima-libera-o-braco",
    nomeBR: "De Cima Libera o Braço",
    tipo: "perda-de-guarda",
  },
  "top gets underhook": {
    slug: "de-cima-pega-underhook",
    nomeBR: "De Cima Pega o Underhook",
    tipo: "perda-de-guarda",
  },
  "top goes for ankle": {
    slug: "de-cima-vai-no-tornozelo",
    nomeBR: "De Cima Vai no Tornozelo",
    tipo: "perda-de-guarda",
  },
  "top goes for legs": {
    slug: "de-cima-vai-nas-pernas",
    nomeBR: "De Cima Vai nas Pernas",
    tipo: "perda-de-guarda",
  },
  "top hides arm": {
    slug: "de-cima-esconde-o-braco",
    nomeBR: "De Cima Esconde o Braço",
    tipo: "perda-de-guarda",
  },
  "top pins arm": {
    slug: "de-cima-prende-o-braco",
    nomeBR: "De Cima Prende o Braço",
    tipo: "perda-de-guarda",
  },
  "top posts, bottom kimuras": {
    slug: "de-cima-apoia-de-baixo-aplica-kimura",
    nomeBR: "De Cima Apoia, De Baixo Aplica a Kimura",
    tipo: "finalizacao",
  },
  "top postures up": {
    slug: "de-cima-sobe-a-postura",
    nomeBR: "De Cima Sobe a Postura",
    tipo: "perda-de-guarda",
  },
  "top pulls out": {
    slug: "de-cima-se-solta",
    nomeBR: "De Cima Se Solta",
    tipo: "perda-de-guarda",
  },
  "top pummels": {
    slug: "de-cima-faz-pummel",
    nomeBR: "De Cima Faz Pummel",
    tipo: "perda-de-guarda",
  },
  "top pushes": {
    slug: "de-cima-empurra",
    nomeBR: "De Cima Empurra",
    tipo: "perda-de-guarda",
  },
  "top retracts arm": {
    slug: "de-cima-recolhe-o-braco",
    nomeBR: "De Cima Recolhe o Braço",
    tipo: "perda-de-guarda",
  },
  triangle: {
    slug: "triangulo-entrada",
    nomeBR: "Triângulo",
    tipo: "finalizacao",
  },
  "triangle counter to arm escape": {
    slug: "triangulo-contra-fuga-de-braco",
    nomeBR: "Triângulo contra a Fuga de Braço",
    tipo: "finalizacao",
  },
  "unidentified pass": {
    // Passagem não identificada (pass_around tag).
    slug: "passagem-nao-identificada",
    nomeBR: "Passagem não Identificada",
    tipo: "perda-de-guarda",
  },
  "upa escape": {
    // Upa para sair da montada (bridge escape).
    slug: "upa-para-sair",
    nomeBR: "Upa para Sair",
    tipo: "ataque",
  },
  "upa to get arm back": {
    slug: "upa-para-recuperar-o-braco",
    nomeBR: "Upa para Recuperar o Braço",
    tipo: "ataque", // bridge
  },
  "upa to unbalance": {
    slug: "upa-para-desequilibrar",
    nomeBR: "Upa para Desequilibrar",
    tipo: "raspagem",
  },
  "whizzer sweep": {
    slug: "raspagem-de-whizzer",
    nomeBR: "Raspagem de Whizzer",
    tipo: "raspagem",
  },
  "wrist control escape": {
    slug: "fuga-do-controle-de-punho",
    nomeBR: "Fuga do Controle de Punho",
    tipo: "perda-de-guarda",
  },
  "yank free": {
    slug: "puxar-pra-soltar",
    nomeBR: "Puxar pra Soltar",
    tipo: "perda-de-guarda",
  },
  zombie: {
    slug: "zombie",
    nomeBR: "Zombie",
    tipo: "ataque",
  },
};

/**
 * Mapa efetivo de lookup: backlog auto-gerado primeiro, curado por cima
 * (curado SEMPRE vence em caso de chave repetida). Todo gmKey lookup —
 * em to-grafo.ts e concept-collapse.ts — passa por aqui.
 */
export const PT_BR_NAMES: Record<string, PtBrName> = {
  ...PT_BR_NAMES_EXTRA,
  ...PT_BR_NAMES_CURATED,
};

/** Total distinct gmName keys covered (positions + transitions). */
export const PT_BR_NAMES_COUNT = Object.keys(PT_BR_NAMES).length;
