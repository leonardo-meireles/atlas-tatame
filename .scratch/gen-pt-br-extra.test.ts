import { readFileSync, writeFileSync } from "node:fs";
import { test, expect } from "vitest";
import { parseGrappleMap } from "../src/lib/grapplemap/parser";
import { gmKey, PT_BR_NAMES_CURATED } from "../src/lib/grapplemap/pt-br-names";

// Baseline = ONLY the hand-curated map. The backlog is everything NOT in it.
// (We must not read the merged PT_BR_NAMES here: it already includes the EXTRA
// we are regenerating, which would make the backlog appear empty.)
const PT_BR_NAMES = PT_BR_NAMES_CURATED;

// ---------------------------------------------------------------------------
// Deterministic EN->pt-BR translator for GrappleMap names, following the house
// conventions established in the hand-curated PT_BR_NAMES (~250 entries) and
// research/gm-translations.md + research/traducao-bjj-corpus.md.
//
// Strategy: phrase-level glossary (longest match first) over a tokenised name.
// Brazilian BJJ keeps most anglicisms/proper nouns; we translate the core
// position/action vocabulary. Output is Title-Cased with lowercase connectors.
// ---------------------------------------------------------------------------

type Tipo = "raspagem" | "finalizacao" | "ataque" | "perda-de-guarda";

// Connectors rendered lowercase in Title Case (pt-BR + kept English glue).
const LOWER = new Set([
  "vs", "de", "da", "do", "das", "dos", "e", "com", "sem", "na", "no", "nas",
  "nos", "a", "o", "as", "os", "pra", "pro", "pras", "pros", "para", "em",
  "por", "ao", "à", "que", "se", "mas", "the", "of", "to", "and", "in", "on",
  "from", "w/", "w/o",
]);

// Multi-word phrase glossary. KEYS are gmKey-normalised English fragments
// (lowercase, spaces). Longest keys are tried first. Values are pt-BR Title-ish
// fragments (final title-casing is applied at the end, so casing here is only
// to preserve proper nouns / accents the title-caser would otherwise lowercase).
const PHRASES: [string, string][] = [
  // ---- compound positions / controls ----
  ["rear naked choke", "mata-leão"],
  ["rear naked", "mata-leão"],
  ["arm-in guillotine", "guilhotina com braço dentro"],
  ["arm-out guillotine", "guilhotina sem braço"],
  ["north/south choke", "estrangulamento norte-sul"],
  ["north south choke", "estrangulamento norte-sul"],
  ["north/south", "norte-sul"],
  ["north south", "norte-sul"],
  ["knee on belly", "joelho na barriga"],
  ["knee-on-belly", "joelho na barriga"],
  ["side control", "cem-quilos"],
  ["judo side", "cem-quilos de judô"],
  ["traditional side control", "cem-quilos tradicional"],
  ["back mount", "pegada nas costas"],
  ["back control", "pegada nas costas"],
  ["lower back control", "controle das costas baixas"],
  ["lower back", "costas baixas"],
  ["upper back", "costas altas"],
  ["half guard", "meia-guarda"],
  ["half-guard", "meia-guarda"],
  ["deep half", "deep half"],
  ["closed guard", "guarda fechada"],
  ["full guard", "guarda fechada"],
  ["open guard", "guarda aberta"],
  ["spider guard", "guarda-aranha"],
  ["spider web", "spider web"],
  ["combat base", "base de combate"],
  ["de la riva", "de la riva"],
  ["reverse dlr", "de la riva invertida"],
  ["arm triangle", "triângulo de braço"],
  ["arm bar", "armlock"],
  ["knee bar", "chave de joelho"],
  ["heel hook", "heel hook"],
  ["toe hold", "toe hold"],
  ["calf crank", "calf slicer"],
  ["body lock", "body lock"],
  ["collar tie", "pegada de nuca"],
  ["wrist control", "controle de punho"],
  // <body> <verb> → <verb-noun> de <body> — fixa "Bíceps Controle" → "Controle de Bíceps"
  ["bicep control", "controle de bíceps"],
  ["biceps control", "controle de bíceps"],
  ["ankle control", "controle de tornozelo"],
  ["hip block", "bloqueio de quadril"],
  ["hip lock", "trava de quadril"],
  ["arm trap", "braço preso"],
  ["arm pin", "braço preso"],
  ["lat control", "controle do dorsal"],
  ["lat lock", "trava do dorsal"],
  ["lat pin", "dorsal preso"],
  ["waist lock", "trava de cintura"],
  ["waist control", "controle de cintura"],
  ["shoulder control", "controle de ombro"],
  ["shoulder pin", "ombro preso"],
  ["neck control", "controle de pescoço"],
  ["knee control", "controle de joelho"],
  ["leg control", "controle de perna"],
  ["double leg", "double leg"],
  ["single leg", "single leg"],
  ["single-leg", "single leg"],
  ["high single", "single alto"],
  ["high double", "double alto"],
  ["low double", "double baixo"],
  ["low single", "single baixo"],
  ["ankle pick", "ankle pick"],
  ["knee pick", "knee pick"],
  ["leg drag", "leg drag"],
  ["x-guard", "guarda-x"],
  ["x guard", "guarda-x"],
  ["single leg x", "single leg x"],
  ["single-x", "single-x"],
  ["front headlock", "gravata frontal"],
  ["arm drag", "arm drag"],
  ["double under", "duplo por baixo"],
  ["double unders", "duplo por baixo"],
  ["double overs", "duplo por cima"],
  ["double overhooks", "duplo sobre-gancho"],
  ["fireman's carry", "fireman's carry"],
  ["seat belt", "seatbelt"],
  ["seat-belt", "seatbelt"],
  ["o-soto-gari", "o-soto-gari"],
  ["uchi-mata", "uchi-mata"],
  ["ouchi gari", "ouchi-gari"],
  ["drop seoi-nage", "seoi-nage ajoelhado"],
  ["hip bump sweep", "raspagem de quadril"],
  ["hip bump", "raspagem de quadril"],
  ["scarf hold", "kesa-gatame"],
  ["kuzure kesa gatame", "kuzure-kesa-gatame"],
  ["neck crank", "gravata de pescoço"],
  ["figure four", "figura-quatro"],
  ["figure-four", "figura-quatro"],
  ["meat hook", "meat hook"],
  ["chest pass", "passagem pelo peito"],
  ["bull fighter pass", "passagem toureando"],
  ["over/under pass", "passagem over-under"],
  ["over/under", "over-under"],
  ["double under pass", "passagem com duplo por baixo"],
  ["knee slice", "joelho cortando"],
  ["knee slide", "joelho cortando"],
  ["knee inside pass", "passagem com joelho por dentro"],
  ["knee pin pass", "passagem prensando o joelho"],
  ["knee pin", "joelho prensado"],
  ["no hand pass", "passagem sem as mãos"],
  ["stack pass", "passagem empilhando"],
  ["tornado pass", "passagem tornado"],
  ["twister pass", "passagem twister"],
  ["x pass", "passagem-x"],
  ["x-pass", "passagem-x"],
  ["leg weave", "leg weave"],
  ["leg lever", "alavanca de perna"],
  ["leg smash", "esmagamento de perna"],
  ["back step", "back step"],
  // ---- positional descriptors ----
  ["head&arm", "cabeça-e-braço"],
  ["head & arm", "cabeça-e-braço"],
  ["head and arm", "cabeça e braço"],
  ["head&armpit", "cabeça-e-axila"],
  ["head and armpit", "cabeça e axila"],
  ["head+arm", "cabeça-e-braço"],
  ["head + arm", "cabeça-e-braço"],
  ["head inside", "cabeça por dentro"],
  ["head outside", "cabeça por fora"],
  ["head on chest", "cabeça no peito"],
  ["arm trapped", "braço preso"],
  ["leg trapped", "perna presa"],
  ["arm pinned", "braço preso"],
  ["isolated arm", "braço isolado"],
  ["isolate arm", "isolar o braço"],
  ["isolates arm", "isola o braço"],
  ["far underhook", "underhook longe"],
  ["near underhook", "underhook perto"],
  ["deep underhook", "underhook profundo"],
  ["weak underhook", "underhook fraco"],
  ["bottom underhook", "underhook de baixo"],
  ["top underhook", "underhook de cima"],
  ["far arm", "braço de longe"],
  ["near arm", "braço de perto"],
  ["far wrist", "punho de longe"],
  ["near wrist", "punho de perto"],
  ["far hook", "gancho de longe"],
  ["far knee", "joelho de longe"],
  ["first hook", "primeiro gancho"],
  ["second hook", "segundo gancho"],
  ["one hook", "um gancho"],
  ["both knees", "os dois joelhos"],
  ["one leg", "uma perna"],
  ["legs pinned", "pernas presas"],
  ["leg grabbed", "perna agarrada"],
  ["leg over shoulder", "perna sobre o ombro"],
  ["leg over head", "perna sobre a cabeça"],
  ["neck frame", "frame no pescoço"],
  ["elbow frame", "frame no cotovelo"],
  ["hip control", "controle de quadril"],
  ["hip pinned", "quadril preso"],
  ["knee+hip control", "controle de joelho e quadril"],
  ["knee+hip", "joelho e quadril"],
  ["vice grip", "vice grip"],
  ["whizzer", "whizzer"],
  ["crossface", "crossface"],
  ["underhook", "underhook"],
  ["underhooks", "underhooks"],
  ["overhook", "sobre-gancho"],
  ["lockdown", "lockdown"],
  ["grapevine", "grapevine"],
  ["seatbelt", "seatbelt"],
  ["pimp-arm", "pimp arm"],
  ["pimp arm", "pimp arm"],
  ["t-rex", "t-rex"],
  ["t rex", "t-rex"],
  ["c-cups", "c-cups"],
  ["c-cup", "c-cup"],
  ["2-on-1", "2-em-1"],
  ["two-on-one", "2-em-1"],
  ["2-em-1", "2-em-1"],
  ["thai clinch", "clinch tailandês"],
  // ---- standalone position names / proper nouns ----
  ["imanari roll", "rolamento imanari"],
  ["gator roll", "gator roll"],
  ["kimura roll", "rolamento de kimura"],
  ["shoulder roll", "rolamento de ombro"],
  ["back roll", "rolamento pra trás"],
  ["forward roll", "rolamento pra frente"],
  ["twister roll", "rolamento twister"],
  ["roll escape", "fuga de rolamento"],
  ["bridge escape", "fuga de ponte"],
  ["hip escape", "fuga de quadril"],
  ["stand up escape", "fuga ficando de pé"],
  ["stand-up", "ficar de pé"],
  ["stand up", "ficar de pé"],
  ["get up", "levantar"],
  ["sit up", "sentar"],
  ["sit out", "sit out"],
  ["sit in", "sit in"],
  ["electric chair", "electric chair"],
  ["electric cradle", "electric cradle"],
  ["honey hole", "honey hole"],
  ["new jersey", "new jersey"],
  ["japanese necktie", "japanese necktie"],
  ["baseball bat", "gravata de taco"],
  ["jaws of life", "jaws of life"],
  ["jedi mind trick", "jedi mind trick"],
  ["millenium falcon", "millenium falcon"],
  ["tony montana", "tony montana"],
  ["crotch rocket", "crotch rocket"],
  ["gangsta-lean", "gangsta lean"],
  ["gangsta lean", "gangsta lean"],
  ["crab ride", "crab ride"],
  ["leg ride", "leg ride"],
  ["bicep ride", "bicep ride"],
  ["stoner control", "stoner control"],
  ["safe haven", "safe haven"],
  ["running escape", "fuga correndo"],
  ["running survival posture", "postura de sobrevivência correndo"],
  ["spladle", "spladle"],
  ["funk", "funk"],
  ["truck", "truck"],
  ["twister", "twister"],
  ["berimbolo", "berimbolo"],
  ["monoplata", "monoplata"],
  ["omoplata", "omoplata"],
  ["kimura", "kimura"],
  ["anaconda", "anaconda"],
  ["darce", "d'arce"],
  ["brabo", "brabo"],
  ["guillotine", "guilhotina"],
  ["triangle", "triângulo"],
  ["armbar", "armlock"],
  ["crucifix", "crucifixo"],
  ["crucify", "crucificar"],
  ["jailbreak", "jailbreak"],
  ["broomstick", "broomstick"],
  ["sorcerer", "sorcerer"],
  ["helicopter", "helicóptero"],
  ["godfather sweep", "raspagem padrinho"],
  ["clubbing sweep", "raspagem clubbing"],
  ["clubbing butterfly sweep", "raspagem de gancho clubbing"],
  ["waiter sweep", "raspagem do garçom"],
  ["kick over sweep", "raspagem de chute por cima"],
  ["push sweep", "raspagem de empurrão"],
  ["push back sweep", "raspagem empurrando pra trás"],
  ["knee push sweep", "raspagem de empurrão no joelho"],
  ["leg hook sweep", "raspagem com gancho de perna"],
  ["stomp and sweep", "pisar e raspar"],
  ["takedown sweep", "raspagem em queda"],
  ["dlr sweep", "raspagem da de la riva"],
  ["switch sweep", "raspagem de troca"],
  ["pendulum sweep", "raspagem de pêndulo"],
  ["butterfly sweep", "raspagem de gancho"],
  ["reverse butterfly", "gancho invertido"],
  ["near wrist control sweep", "raspagem com controle do punho de perto"],
  ["chair sit", "sentar na cadeira"],
  ["donkey kick", "coice de mula"],
  ["roundhouse kick", "chute giratório"],
  ["roundhouse", "chute giratório"],
  ["hip throw", "queda de quadril"],
  ["polish throw", "queda polonesa"],
  ["spladle throw", "queda spladle"],
  ["kimura throw/sweep", "kimura queda/raspagem"],
  ["throw finish", "finalizar a queda"],
  ["hip pop lift", "levantada de quadril"],
  ["hip heist", "hip heist"],
  ["flying scissor", "tesoura voadora"],
  ["scissor", "tesoura"],
  ["snapdown", "puxada de nuca"],
  ["snapped down", "puxado pela nuca"],
  ["snapping down", "puxando pela nuca"],
  ["snap down", "puxar a nuca"],
  ["duck under", "duck under"],
  ["drop level", "baixar o nível"],
  ["level dropped", "nível baixado"],
  ["thread the needle", "passar a linha"],
  ["wiggle out", "se soltar"],
  ["limp arm", "braço mole"],
  ["limp arms", "braços moles"],
  ["pull guard", "puxar pra guarda"],
  ["pulling guard", "puxando pra guarda"],
  ["jump guard", "saltar pra guarda"],
  ["guard jump", "salto pra guarda"],
  ["recover guard", "recuperar a guarda"],
  ["recover knee shield", "recuperar o escudo de joelho"],
  ["knee shield", "escudo de joelho"],
  ["pass to side", "passar pro cem-quilos"],
  ["complete pass", "completar a passagem"],
  ["finish pass", "finalizar a passagem"],
  ["start knee slice pass", "começar a passagem de joelho cortando"],
  ["pass successful", "passagem concluída"],
  ["break & pass", "abrir e passar"],
  ["break and pass", "abrir e passar"],
  ["break grip", "quebrar a pegada"],
  ["break open", "abrir"],
  ["break posture", "quebrar a postura"],
  ["break down", "derrubar"],
  ["breakdown", "derrubada"],
  ["mount low", "montada baixa"],
  ["low mount", "montada baixa"],
  ["high mount", "montada alta"],
  ["mount", "montada"],
  ["mounted", "montado"],
  ["mounting", "montando"],
  ["take back", "tomar as costas"],
  ["takedown", "queda"],
  ["arm-in", "braço dentro"],
  ["arm-out", "braço fora"],
  ["trip", "rasteira"],
  ["tripod", "tripé"],
  ["unintercepted", "não interceptado"],
  ["uncountered", "sem contra-ataque"],
  ["block, seatbelt", "bloquear, seatbelt"],
  ["push, pull, lockdown", "empurrar, puxar, lockdown"],
  ["to/from kimura", "para/de kimura"],
  ["cop landing", "cop landing"],
  ["old school", "old school"],
  ["safe haven", "safe haven"],
  ["jaws of life", "jaws of life"],
  ["jedi mind trick", "jedi mind trick"],
  ["millenium falcon", "millenium falcon"],
  ["the homer", "the homer"],
  ["cement job", "cement job"],
  ["half and half", "half and half"],
  ["reverse leg drag", "leg drag invertido"],
  ["reverse knee on belly", "joelho na barriga invertido"],
  ["reverse triangle", "triângulo invertido"],
  ["reverse butterfly sweep", "raspagem de gancho invertida"],
  // ---- transition verbs / glue that should translate ----
  ["clear headlock", "liberar a gravata"],
  ["clear neck", "liberar o pescoço"],
  ["clear arm", "liberar o braço"],
  ["clear leg", "liberar a perna"],
  ["cut corner", "cortar o ângulo"],
  ["turn the corner", "virar a quina"],
  ["base and trip", "apoiar e derrubar"],
  ["bump forward", "empurrar pra frente"],
  ["compress buttocks", "comprimir o quadril"],
  ["sprawl and circle to back", "sprawl e circular pras costas"],
  ["sprawl and circle", "sprawl e circular"],
  ["sprawl to single", "sprawl pro single"],
  ["sprawl to head&arm", "sprawl pro cabeça-e-braço"],
  ["smash and sprawl", "esmagar e dar sprawl"],
  ["drag past", "arrastar e passar"],
  ["drag down", "puxar pra baixo"],
  ["drag", "arrastar"],
  ["thread the needle", "passar a linha"],
  ["the homer", "the homer"],
  ["fireman's carry", "fireman's carry"],
  ["fireman", "fireman"],
  ["lose overhook, take crossface", "perder o sobre-gancho, pegar crossface"],
  ["sit to mono", "sentar pra mono"],
  ["sit to hip", "sentar pro quadril"],
  ["sit in", "sit in"],
  ["sit out", "sit out"],
  ["slow triangle", "triângulo lento"],
  ["lateral spin", "giro lateral"],
  ["square up", "se enquadrar"],
  ["squared up", "enquadrado"],
  ["pick up", "levantar"],
  ["whip up", "chicotear pra cima"],
  ["lie down", "deitar"],
  ["scoot away", "escorregar pra longe"],
  ["limp leg", "perna mole"],
  ["limp arm", "braço mole"],
  ["hug leg", "abraçar a perna"],
  ["roll under", "rolar por baixo"],
  ["roll to guard", "rolar pra guarda"],
  ["roll forward", "rolar pra frente"],
  ["roll sideways", "rolar de lado"],
  ["roll flipped", "rolar girado"],
  ["move behind", "ir pras costas"],
  ["move closer", "chegar mais perto"],
  ["move leg back", "recuar a perna"],
  ["go deep", "ir fundo"],
  ["go parallel", "ir paralelo"],
  ["go ankle to ankle", "ir tornozelo a tornozelo"],
  ["pull in", "puxar pra dentro"],
  ["pull forward", "puxar pra frente"],
  ["pull head", "puxar a cabeça"],
  ["pull hips in", "puxar o quadril pra dentro"],
  ["pull to side", "puxar pro lado"],
  ["pull to other side", "puxar pro outro lado"],
  ["push off", "empurrar"],
  ["push over", "empurrar por cima"],
  ["push head", "empurrar a cabeça"],
  ["push head to side", "empurrar a cabeça pro lado"],
  ["push knee inside", "empurrar o joelho pra dentro"],
  ["pin leg", "prender a perna"],
  ["pin legs", "prender as pernas"],
  ["plant foot", "fincar o pé"],
  ["plant feet behind knees", "fincar os pés atrás dos joelhos"],
  ["post foot", "apoiar o pé"],
  ["post leg", "apoiar a perna"],
  ["post other foot", "apoiar o outro pé"],
  ["extend arm", "estender o braço"],
  ["extend leg", "estender a perna"],
  ["trap arm", "prender o braço"],
  ["trap far arm", "prender o braço de longe"],
  ["trap leg", "prender a perna"],
  ["trap arm and choke", "prender o braço e estrangular"],
  ["grab arm", "agarrar o braço"],
  ["grab leg", "agarrar a perna"],
  ["grab elbow", "agarrar o cotovelo"],
  ["grab shoulder", "agarrar o ombro"],
  ["grab tricep", "agarrar o tríceps"],
  ["grab waist", "agarrar a cintura"],
  ["grab near wrist", "agarrar o punho de perto"],
  ["insert hook", "encaixar o gancho"],
  ["insert hooks", "encaixar os ganchos"],
  ["insert knee", "encaixar o joelho"],
  ["secure far hook", "garantir o gancho de longe"],
  ["lock figure four", "travar a figura-quatro"],
  ["lock down knee", "travar o joelho"],
  ["lock reverse triangle", "travar o triângulo invertido"],
  ["tie knees", "amarrar os joelhos"],
  ["control leg", "controlar a perna"],
  ["control wrist", "controlar o punho"],
  ["control wrists", "controlar os punhos"],
  ["control head and wrist", "controlar cabeça e punho"],
  ["control hip and shoulder", "controlar quadril e ombro"],
  ["control leg and hip", "controlar perna e quadril"],
  ["control wrist and tricep", "controlar punho e tríceps"],
  ["smash legs", "esmagar as pernas"],
  ["smash butterfly", "esmagar a guarda de gancho"],
  ["stack", "empilhar"],
  ["flatten", "achatar"],
  ["slice", "cortar"],
  ["slide", "deslizar"],
  ["stomp", "pisar"],
  ["stuff", "bloquear"],
  ["throw", "queda"],
  ["adjust", "ajustar"],
  ["settle", "acomodar"],
  ["stabilize", "estabilizar"],
  ["rotate", "rotacionar"],
  ["reversal", "reversão"],
  ["recover", "recuperar"],
  ["progress", "avançar"],
  ["land", "cair"],
  ["bridge", "ponte"],
  ["invert", "inverter"],
  ["scissor", "tesoura"],
  ["spiral", "espiral"],
  ["jump", "saltar"],
  ["hop", "pulinho"],
  ["dive", "mergulhar"],
  ["launch", "lançar"],
  ["sprawl", "sprawl"],
  ["sweep", "raspagem"],
  ["pass", "passagem"],
  ["escape", "fuga"],
  ["clinch", "clinch"],
  ["sprawl", "sprawl"],
  ["pummel", "pummel"],
  ["frame", "frame"],
  ["turtle", "tartaruga"],
  ["butterfly", "guarda de gancho"],
  ["choke", "estrangulamento"],
  ["submit", "finalizar"],
  ["submission", "finalização"],
];

// Single-word glossary (fallback after phrase pass). gmKey-normalised.
const WORDS: Record<string, string> = {
  bottom: "de baixo", top: "de cima",
  arm: "braço", arms: "braços", leg: "perna", legs: "pernas",
  knee: "joelho", knees: "joelhos", hip: "quadril", hips: "quadril",
  head: "cabeça", neck: "pescoço", wrist: "punho", wrists: "punhos",
  elbow: "cotovelo", elbows: "cotovelos", shoulder: "ombro", chest: "peito",
  foot: "pé", feet: "pés", ankle: "tornozelo", ankles: "tornozelos",
  hook: "gancho", hooks: "ganchos", grip: "pegada", grips: "pegadas",
  collar: "gola", tricep: "tríceps", bicep: "bíceps", armpit: "axila",
  back: "costas", side: "lado", reverse: "invertida", reversal: "reversão",
  guard: "guarda", standing: "em pé", seated: "sentado", supine: "deitado",
  kneeling: "ajoelhado", crouching: "agachado", flat: "estendido",
  flattened: "estendido", postured: "postura", posture: "postura",
  block: "bloquear", blocks: "bloqueia", blocked: "bloqueada",
  control: "controle", controls: "controla", controlling: "controlando",
  trap: "prender", traps: "prende", trapped: "preso",
  pin: "prender", pins: "prende", pinned: "preso",
  grab: "agarrar", grabs: "agarra", grabbed: "agarrado",
  push: "empurrar", pushes: "empurra", pushed: "empurrado",
  pull: "puxar", pulls: "puxa", pulled: "puxado",
  roll: "rolamento", rolls: "rola", rolled: "rolado", rolling: "rolando",
  turn: "virar", turns: "vira", turned: "virado", turning: "virando",
  step: "passo", steps: "passa", stepping: "passando", stepped: "passado",
  drop: "baixar", drops: "baixa", dropped: "baixado",
  stand: "levantar", stands: "levanta", lift: "levantar",
  switch: "trocar", switches: "troca", switching: "trocando",
  release: "soltar", releases: "solta", free: "liberar", frees: "libera",
  recover: "recuperar", recovers: "recupera", recovered: "recuperada",
  insert: "encaixar", inserts: "encaixa", inserting: "encaixando",
  retract: "recolher", retracts: "recolhe", remove: "remover",
  enter: "entrar", entering: "entrando", finish: "finalizar",
  finishes: "finaliza", finished: "finalizada", complete: "completar",
  completed: "concluída", attempt: "tentativa", attempts: "tenta",
  attempting: "tentando", threat: "ameaça", threatened: "ameaçado",
  threatens: "ameaça", attack: "atacar", attacks: "ataca",
  defeats: "vence", defeat: "vencer", defeated: "vencida",
  countered: "contra-atacada", counter: "contra-ataque", uncountered: "sem contra",
  gets: "pega", get: "pegar", takes: "pega", take: "pegar",
  goes: "vai", go: "ir", going: "indo",
  takedown: "queda", takedowns: "quedas", sliced: "cortada",
  cross: "cruzada", above: "acima", further: "mais", forward: "pra frente",
  backward: "pra trás", sideways: "de lado", together: "juntas",
  extended: "estendido", free: "liberar", but: "mas", new: "novo",
  comes: "vem", coming: "vindo", shoots: "ataca", shoot: "atacar",
  shooting: "atacando", tries: "tenta", try: "tentar", trying: "tentando",
  rises: "sobe", raises: "levanta", leans: "inclina", leaning: "inclinando",
  smash: "esmagar", smashes: "esmaga", smashed: "esmagado",
  stack: "empilhar", stacked: "empilhado", land: "cair", lands: "cai",
  bridge: "ponte", scramble: "scramble", invert: "inverter",
  inverts: "inverte", inverted: "invertida", flip: "girar",
  flipped: "girado", spin: "giro", spiral: "espiral", jump: "salto",
  hop: "pulinho", dive: "mergulho", launch: "lançar", spider: "aranha",
  near: "perto", far: "longe", deep: "profundo", high: "alto", low: "baixo",
  loose: "frouxo", tight: "apertado", weak: "fraco", parallel: "paralelo",
  flanking: "flanqueando", flank: "flanquear", judo: "judô",
  traditional: "tradicional", regular: "regular", electric: "elétrica",
  posting: "apoiando", post: "apoiar", posts: "apoia", base: "base",
  squeeze: "apertar", squeezed: "apertado", clasp: "entrelaçar",
  rotate: "rotacionar", settle: "acomodar", stabilize: "estabilizar",
  progress: "avançar", progresses: "avança", recede: "recuar",
  recedes: "recua", "fetal": "fetal", prone: "de bruços", waist: "cintura",
  spladle: "spladle", cradle: "cradle", lockdown: "lockdown",
  whizzer: "whizzer", crossface: "crossface", overhook: "sobre-gancho",
  underhook: "underhook", clinch: "clinch", frame: "frame", pummel: "pummel",
  cocoon: "cocoon", harness: "harness", crucifix: "crucifixo",
  monoplata: "monoplata", omoplata: "omoplata", kimura: "kimura",
  triangle: "triângulo", guillotine: "guilhotina", armbar: "armlock",
  berimbolo: "berimbolo", truck: "truck", twister: "twister",
  funk: "funk", anaconda: "anaconda", slx: "slx", gogo: "gogoplata",
  spiderweb: "spider web", rnc: "mata-leão", kob: "joelho na barriga",
  homie: "homie", crab: "crab", rubber: "rubber", brabo: "brabo",
  octopus: "octopus", boston: "boston", barzegar: "barzegar",
  fishnet: "fishnet", grapevine: "grapevine", shovel: "shovel",
  stub: "stub", crush: "esmagar",
  // glue / prepositions / leftover English connectors
  to: "para", from: "de", and: "e", on: "no", "in": "na", "for": "pro",
  but: "mas", "with": "com", not: "não",
  into: "para", onto: "para", off: "de", away: "pra fora",
  behind: "atrás", front: "frente", outside: "por fora", inside: "por dentro",
  over: "por cima", under: "por baixo", around: "ao redor", toward: "em direção",
  further: "mais", closer: "mais perto", up: "pra cima", down: "pra baixo",
  out: "pra fora", other: "outro", both: "ambos", same: "mesmo",
  start: "início", starts: "começa", starting: "começando",
  battle: "disputa", level: "nível", drape: "drapeado", center: "centro",
  dragging: "arrastando", grabbing: "agarrando", locked: "travado",
  handfight: "disputa de pegada", footsies: "footsies", south: "south",
  paw: "paw", neutral: "neutro", upright: "ereto", dominant: "dominante",
  approaching: "aproximando", coming: "subindo", going: "indo",
  freeing: "liberando", removing: "removendo", inserting: "encaixando",
  bails: "abandona", clinches: "abraça", extends: "estende",
  brings: "traz", straightens: "estica", keeps: "mantém", wants: "quer",
  uses: "usa", throws: "joga", throwing: "jogando", puts: "põe",
  reaches: "alcança", sits: "senta", sitting: "sentando", resists: "resiste",
  thwarts: "frustra", thwarted: "frustrada", trades: "troca", lets: "deixa",
  faces: "encara", falls: "cai", climbs: "sobe", mounts: "monta",
  opens: "abre", regains: "recupera", releases: "solta", snatches: "rouba",
  smashes: "esmaga", whizzers: "aplica whizzer", slices: "corta",
  finishes: "finaliza", settles: "acomoda", crucified: "crucificado",
  wedge: "encaixe", weave: "trançar", lat: "dorsal", neck: "pescoço",
  vice: "vice", chestlock: "chave de peito", chest: "peito",
  hippo: "hippo", hippoplatamus: "hippoplatamus", boston: "boston",
  alcatraz: "alcatraz", anaconda: "anaconda", web: "web", spladle: "spladle",
  spiral: "espiral", reversal: "reversão", parry: "defesa", drive: "dirigir",
  dump: "despejar", launch: "lançar", squared: "quadrado", russian: "russa",
  open: "aberto", blast: "investida", k: "k", control_: "controle",
  ride: "montar", k_control: "k-control", love: "love", handle: "handle",
  fishnet: "fishnet", bridged: "em ponte", suspended: "suspensa",
  shrugged: "encolhido", shrug: "encolher", crab: "crab", off_: "de",
  yank: "puxão", limp: "molenga", hug: "abraçar", pick: "pick",
  acquire: "pegar", secure: "garantir", lock: "travar", tie: "amarrar",
  defeating: "vencendo", defeat: "vencer", new: "novo", old: "velho",
  school: "escola", quarter: "quarto", half: "half", deep: "profundo",
  drill: "treino", part: "parte", complete: "completar", continue: "continuar",
  duck: "duck", base: "base", trip: "trip", chair: "cadeira", lie: "deitar",
  kick: "chute", roundhouse: "giratório", forearm: "antebraço",
  // Agente #3: traduzir mat/hand/one/ctrl + gerundios + verbos que estavam vazando.
  ctrl: "controle", mat: "tatame", hand: "mão", hands: "mãos",
  one: "uma", "top's": "do de cima", "turtle's": "da tartaruga",
  against: "contra", bring: "trazer", put: "colocar",
  posturing: "postureando", passing: "passagem", blocking: "bloqueando",
  pulling: "puxando", cupping: "encaixando", flying: "voador",
  incoming: "entrando", clasped: "entrelaçadas", armed: "armado",
  broken: "quebrada", locks: "trava", clasp: "entrelaçar",
};

const SWEEP_RX = /raspag|sweep|hip bump|pendulum|godfather|clubbing|waiter|kick over|push sweep|stoner control sweep|tornado sweep|switch sweep|near wrist control sweep/;
const FINISH_RX = /finaliza|armlock|kimura|omoplata|monoplata|triângulo|triangle|guilhotina|mata-leão|estrangulamento|crucifix|crucific|chave de joelho|heel hook|toe hold|calf|necktie|brabo|anaconda|d'arce|darce|electric chair|knee bar|baseball|neck crank|honey hole heel/;
const PASS_RX = /passagem|abrir a guarda|abrir e passar|quebrar a postura|ficar de pé|fuga|escape|knee slice|joelho cortando|levantar|get up|stand|complete pass|finish pass|breakdown|derrubada|take back|tomar as costas|cut corner|drive (forward|through)|clear (the )?(guard|leg)/;

function inferTipo(en: string, br: string): Tipo {
  const k = (en + " " + br).toLowerCase();
  if (SWEEP_RX.test(k)) return "raspagem";
  if (FINISH_RX.test(k)) return "finalizacao";
  if (PASS_RX.test(k)) return "perda-de-guarda";
  return "ataque";
}

// Tokenise on spaces but keep glue tokens; translate phrase-first then word.
const sortedPhrases = [...PHRASES].sort((a, b) => b[0].length - a[0].length);

function translate(en: string): string {
  let s = " " + en.toLowerCase().replace(/\s+/g, " ").trim() + " ";
  // Limpeza: strip do char-de-controle \b (vazamento de regex no GrappleMap.txt),
  // re-merge de palavras hifenizadas quebradas em linha (gmKey vira `seat-\nbelt`
  // em `seat- belt`), e a captura `off of` ANTES do word-pass que vira "de of".
  s = s
    .replace(/\x08/g, "")
    .replace(/\\b/g, "") // GrappleMap.txt tem `\b` literal (2 chars) em alguns nomes
    .replace(/(\w)-\s+(\w)/g, "$1-$2")
    .replace(/ off of /g, " de ")
    .replace(/ out of /g, " de ")
    .replace(/ jump to guard /g, " puxar guarda ");
  // Normalise glue.
  s = s
    .replace(/ w\/ /g, " com ")
    .replace(/ w\/o /g, " sem ")
    .replace(/ vs /g, " vs ")
    .replace(/ & /g, " e ")
    .replace(/&/g, " e ")
    .replace(/ \+ /g, " e ")
    .replace(/\+/g, " e ");
  // Phrase pass (longest first), bounded by spaces. The replacement's internal
  // spaces are joined with US (unit-separator) so the whole phrase output is a
  // SINGLE token in the word pass — this protects e.g. "body lock" from having
  // its "lock" re-translated. Advance the cursor PAST each replacement so a
  // phrase mapping to a string containing the needle can't loop forever.
  const US = "";
  for (const [en2, br] of sortedPhrases) {
    const needle = " " + en2 + " ";
    const repl = " " + br.replace(/ /g, US) + " ";
    let from = 0;
    let idx;
    while ((idx = s.indexOf(needle, from)) !== -1) {
      s = s.slice(0, idx) + repl + s.slice(idx + needle.length);
      from = idx + repl.length - 1;
    }
  }
  // Word pass on leftover single English tokens. Protected phrase outputs carry
  // the US separator so they won't match WORDS keys; they pass through, then we
  // restore their internal spaces.
  const out = s
    .split(" ")
    .map((tok) => (tok.includes(US) ? tok : WORDS[tok] ?? tok))
    .join(" ")
    .replace(new RegExp(US, "g"), " ");
  return out.replace(/\s+/g, " ").trim();
}

const STOP_LOWER = LOWER;
function titleCase(s: string): string {
  const parts = s.split(" ");
  return parts
    .map((w, i) => {
      if (!w) return w;
      const lw = w.toLowerCase();
      // keep tokens with internal hyphen capitalised per segment, but leave
      // proper-noun hyphenated terms (de-la-riva etc.) handled by glossary.
      if (i > 0 && STOP_LOWER.has(lw)) return lw;
      // capitalise first letter, keep rest as-is (preserves accents & casing).
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

// slug: ASCII-kebab from the pt-BR display, accent-free (mirrors fallbackSlug).
function toSlug(br: string): string {
  return br
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("gera src/lib/grapplemap/pt-br-names-extra.ts", () => {
  const txt = readFileSync("source_repos/GrappleMap/GrappleMap.txt", "utf8");
  const data = parseGrappleMap(txt);

  const posKeys = new Map<string, string>();
  for (const p of data.positions) {
    const k = gmKey(p.name);
    if (!PT_BR_NAMES[k] && !posKeys.has(k)) posKeys.set(k, p.name);
  }
  const trKeys = new Map<string, string>();
  for (const t of data.transitions) {
    const k = gmKey(t.name);
    if (!PT_BR_NAMES[k] && !trKeys.has(k)) trKeys.set(k, t.name);
  }

  const usedSlugs = new Set<string>();
  // seed with existing slugs to avoid collisions across files
  for (const v of Object.values(PT_BR_NAMES)) usedSlugs.add(v.slug);

  const entries: { key: string; slug: string; nomeBR: string; tipo?: Tipo }[] = [];
  const flagged: string[] = [];

  function build(key: string, raw: string, isTransition: boolean) {
    const cleaned = gmKey(raw);
    const brRaw = translate(cleaned);
    let nomeBR = titleCase(brRaw);
    // fix proper-noun casing that title-caser misses inside hyphenated terms
    nomeBR = nomeBR
      .replace(/\bD'arce\b/g, "D'Arce")
      .replace(/\bDe La Riva\b/g, "De la Riva")
      .replace(/\bO-soto-gari\b/g, "O-soto-gari")
      .replace(/\bUchi-mata\b/g, "Uchi-mata")
      .replace(/\bOuchi-gari\b/g, "Ouchi-gari")
      .replace(/\bSeoi-nage\b/g, "Seoi-nage")
      .replace(/\bKuzure-kesa-gatame\b/g, "Kuzure-kesa-gatame")
      .replace(/\bKesa-gatame\b/g, "Kesa-gatame")
      .replace(/\bNew Jersey\b/g, "New Jersey")
      // Hifenizados canônicos: segundo segmento MAIÚSCULO (estilo curated).
      .replace(/\bCem-quilos\b/g, "Cem-Quilos")
      .replace(/\bSobre-gancho\b/g, "Sobre-Gancho")
      .replace(/\bMata-leão\b/g, "Mata-Leão")
      .replace(/\bNorte-sul\b/g, "Norte-Sul")
      .replace(/\bGuarda-x\b/g, "Guarda-X")
      .replace(/\bGuarda-z\b/g, "Guarda-Z")
      .replace(/\bGuarda-aranha\b/g, "Guarda-Aranha");
    let slug = toSlug(nomeBR) || toSlug(cleaned) || "transicao";
    // de-dupe slugs (keep stable & unique)
    let base = slug, n = 2;
    while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
    usedSlugs.add(slug);

    const entry: { key: string; slug: string; nomeBR: string; tipo?: Tipo } = {
      key,
      slug,
      nomeBR,
    };
    if (isTransition) entry.tipo = inferTipo(cleaned, brRaw);

    // flag suspicious leftovers: still has English-y tokens we didn't map
    if (/[a-z]/.test(cleaned) && nomeBR === titleCase(cleaned)) {
      flagged.push(`${isTransition ? "T" : "P"} ${key} -> ${nomeBR}`);
    }
    entries.push(entry);
  }

  // A gmKey can label BOTH a position and a transition (e.g. "monoplata",
  // "truck", "twister"). The object key must be unique, so — matching the
  // curated convention — such a key is emitted ONCE as a transition (so it
  // carries `tipo`). Positions-only keys are emitted as positions.
  const sharedKeys = new Set<string>();
  for (const k of posKeys.keys()) if (trKeys.has(k)) sharedKeys.add(k);

  for (const [k, raw] of [...posKeys.entries()].sort()) {
    if (sharedKeys.has(k)) continue; // emitted via the transition pass below
    build(k, raw, false);
  }
  for (const [k, raw] of [...trKeys.entries()].sort()) build(k, raw, true);

  // Emit the TS file.
  const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const lines: string[] = [];
  for (const e of entries) {
    lines.push(`  ${JSON.stringify(e.key)}: {`);
    lines.push(`    slug: "${esc(e.slug)}",`);
    lines.push(`    nomeBR: "${esc(e.nomeBR)}",`);
    if (e.tipo) lines.push(`    tipo: "${e.tipo}",`);
    lines.push(`  },`);
  }
  const header =
    "// pt-BR names — EXTRA backlog layer (auto-gerado por .scratch/gen-pt-br-extra.test.ts).\n" +
    "//\n" +
    "// Cobre TODAS as posições/transições do GrappleMap que NÃO estavam no\n" +
    "// PT_BR_NAMES hand-curado (~250 entradas). Mesmas convenções de casa\n" +
    "// (ver research/traducao-bjj-corpus.md): mantém anglicismos/nomes próprios\n" +
    "// que o brasileiro fala no tatame, traduz o vocabulário core de posição/ação.\n" +
    "// Tradutor determinístico via glossário de frases (match mais longo primeiro).\n" +
    "//\n" +
    "// É feito MERGE em PT_BR_NAMES (spread) em pt-br-names.ts, então gmKey lookups\n" +
    "// pegam estas entradas. Regenerar quando o glossário mudar; revisão à mão bem-vinda.\n\n" +
    'import type { PtBrName } from "./pt-br-names";\n\n' +
    "export const PT_BR_NAMES_EXTRA: Record<string, PtBrName> = {\n";
  const out = header + lines.join("\n") + "\n};\n";
  writeFileSync("src/lib/grapplemap/pt-br-names-extra.ts", out);

  console.log(
    `EXTRA: ${posKeys.size} posições + ${trKeys.size} transições = ${entries.length} entradas`,
  );
  if (flagged.length) {
    console.log(`FLAGGED (${flagged.length} possibly-untranslated):`);
    for (const f of flagged) console.log("  " + f);
  }
  writeFileSync(
    "research/extra-flagged.txt",
    `flagged: ${flagged.length}\n` + flagged.join("\n") + "\n",
  );

  // Every distinct backlog key emitted exactly once; shared keys folded.
  expect(entries.length).toBe(posKeys.size + trKeys.size - sharedKeys.size);
  const keySet = new Set(entries.map((e) => e.key));
  expect(keySet.size).toBe(entries.length); // no duplicate object keys
  const slugSet = new Set(entries.map((e) => e.slug));
  expect(slugSet.size).toBe(entries.length); // no duplicate slugs
});
