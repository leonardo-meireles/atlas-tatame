import type { Grafo } from "@/lib/types";

// Conteúdo do MVP: grafo da Guarda Fechada (pt-BR, termos BR-canônicos).
// Editado à mão, versionado no git. Prosa longa migra pra MDX depois.

export const grafo: Grafo = {
  posicoes: [
    {
      slug: "guarda-fechada",
      nome: "Guarda Fechada",
      raiz: true,
      familia: "guarda",
      polo: "baixo",
      video: {
        youtubeId: "X3j7OWFyAB4",
        titulo: "Sequência de ataques da guarda fechada (faixa branca)",
        canal: "Knight Jiu-Jitsu",
      },
      acesso: "free",
      resumo:
        "De costas no chão, pernas em volta do tronco do oponente com os tornozelos cruzados. Por baixo, mas no controle: plataforma de ataque, raspagem e finalização.",
      principios: [
        "Quebrar a postura vem primeiro: oponente ereto ataca e passa; oponente curvado só se defende.",
        "Controlar sempre um braço e um lado — nunca deixar o oponente postar as duas mãos livres.",
        "Trabalhar em ângulo: girar o quadril abre os ataques, ficar de frente fecha tudo.",
        "Pés cruzados controlam; descruzar só quando for atacar ou raspar.",
      ],
      imagem: "/stills/guarda-fechada.png",
      views: [
        { angulo: "3/4", src: "/stills/views/closed-guard-w-100/0.png" },
        { angulo: "Lado", src: "/stills/views/closed-guard-w-100/1.png" },
        { angulo: "Costas", src: "/stills/views/closed-guard-w-100/2.png" },
        { angulo: "Cima", src: "/stills/views/closed-guard-w-100/3.png" },
      ],
      setas: [
        {
          tipo: "pressao",
          x: 64,
          y: 18,
          dx: -10,
          dy: 14,
          rotulo: "quebrar a postura",
          porque: "Puxar o tronco do oponente pra frente tira a base e mata a defesa dele.",
        },
        {
          tipo: "pegada",
          x: 56,
          y: 44,
          rotulo: "pegada na gola",
          porque: "Controlar a gola puxa pra baixo e ajuda a manter a postura quebrada.",
        },
        {
          tipo: "pegada",
          x: 38,
          y: 50,
          rotulo: "pegada na manga",
          porque: "Prender um braço impede o oponente de postar as duas mãos livres.",
        },
        {
          tipo: "direcao",
          x: 34,
          y: 66,
          dx: 15,
          dy: -4,
          rotulo: "ângulo do quadril",
          porque: "Girar o quadril abre armlock e triângulo; de frente, os ataques fecham.",
        },
      ],
    },
    {
      slug: "montada",
      nome: "Montada",
      familia: "controle",
      polo: "cima",
      video: {
        youtubeId: "gaKsKu6HXoc",
        titulo: "Estabilização e finalização na montada",
        canal: "Marcelo Galdino",
      },
      acesso: "free",
      resumo:
        "Sentado sobre o tronco do oponente, joelhos altos nas axilas dele — a posição de cima mais dominante do jiu-jitsu. Daqui se finaliza ou se vai às costas; por baixo, o objetivo é só sobreviver e raspar.",
      principios: [
        "Peso no quadril, não nas mãos — afundar o quadril nele tira o espaço pra fugir.",
        "Joelhos altos, colados nas axilas — quanto mais alto a montada, menos ele recompõe a guarda.",
        "Base larga e mãos prontas pra postar — defender a ponte e a fuga antes de partir pro ataque.",
      ],
      imagem: "/stills/montada.png",
      views: [
        { angulo: "3/4", src: "/stills/views/mounted-triangle/0.png" },
        { angulo: "Lado", src: "/stills/views/mounted-triangle/1.png" },
        { angulo: "Costas", src: "/stills/views/mounted-triangle/2.png" },
        { angulo: "Cima", src: "/stills/views/mounted-triangle/3.png" },
      ],
    },
    {
      slug: "meia-guarda",
      nome: "Meia-Guarda",
      familia: "guarda",
      polo: "baixo",
      video: {
        youtubeId: "ezh23FoMsGc",
        titulo: "Meia-guarda por baixo: raspagens e finalizações (faixa branca)",
        canal: "SOLONBJJ",
      },
      acesso: "free",
      resumo:
        "Uma perna do oponente presa entre as suas — meio caminho entre ter a guarda e ser passado. Por baixo, mas com jogo: daqui você recompõe a guarda, raspa pra cima ou vai às costas.",
      principios: [
        "Underhook e enquadramento: o braço por baixo da axila do oponente destrava raspagem e costas.",
        "Joelho-escudo (knee shield) entre vocês controla a distância e impede o esmagamento.",
        "Quadril de lado, nunca de barriga pra cima — de lado você levanta e raspa; de costas, é passado.",
        "Recuperar a guarda ou raspar antes do oponente fixar o peito e a cabeça.",
      ],
    },
    {
      // Campo de batalha da passagem: guarda aberta, ainda por baixo. Daqui o guardeiro
      // raspa e ataca; daqui o oponente entra na cadeia de passagens.
      // DIFERIDA (passagem fica pra depois — ver DIFERIDOS em pose-meta.ts).
      slug: "guarda-aberta",
      nome: "Guarda Aberta",
      familia: "guarda",
      polo: "baixo",
      video: {
        youtubeId: "a91r0GKHeGM",
        titulo: "Abertura da guarda fechada em pé",
        canal: "YouTube",
      },
      acesso: "free",
      resumo:
        "Pernas livres controlando o oponente sem travar os pés — o oponente já rompeu a guarda fechada. Daqui é decisão: o guardeiro raspa ou recompõe; o oponente entra pra passar.",
      principios: [
        "Pés e mãos como ganchos: controlar a distância antes do oponente encostar o peito.",
        "Reagir cedo — passagem se mata no primeiro passo, não no último.",
        "Quadril móvel: girar por baixo pra recolocar a guarda ou disparar a raspagem.",
      ],
    },
    {
      // Controle de topo logo após a passagem — o fim da cadeia de passagens.
      slug: "cem-quilos",
      nome: "Cem-Quilos",
      familia: "controle",
      polo: "cima",
      video: {
        youtubeId: "Sj_qO3ESizo",
        titulo: "7 finalizações do cem-quilos",
        canal: "Jean Feijó",
      },
      acesso: "free",
      resumo:
        "Cem-quilos (side control): cento e um quilos de pressão atravessada por cima, peito no peito, logo depois de vencer a guarda. Controle dominante — daqui se monta, vai às costas ou finaliza.",
      principios: [
        "Peso morto no peito, não nas mãos — esmagar antes de atacar.",
        "Bloquear o quadril e o enquadramento do oponente pra ele não recompor a guarda.",
        "Caminhar pra montada ou norte-sul quando o controle estiver firme.",
      ],
    },
  ],
  transicoes: [
    // ----- Finalizações (folhas: para = null) -----
    {
      slug: "armlock-da-guarda",
      nome: "Armlock da Guarda",
      tipo: "finalizacao",
      dificuldade: "intermediario",
      de: "guarda-fechada",
      para: null,
      acesso: "free",
      video: { youtubeId: "NSqMHNQkzEc", titulo: "Armlock e triângulo da guarda fechada", canal: "SOLONBJJ" },
      passos: [
        "Controle uma manga (o punho dele) e quebre a postura — puxe o oponente pra frente até ele curvar e perder a base.",
        "Suba o quadril e jogue a perna por cima da cabeça/ombro, do mesmo lado do braço que você vai atacar.",
        "Prenda o braço colado ao seu peito, com o polegar dele apontando pra cima — assim o cotovelo trava na direção certa.",
        "Quadril alto, joelhos fechados, estenda devagar até o tap (a batida que pede pra parar).",
      ],
    },
    {
      slug: "triangulo",
      nome: "Triângulo",
      tipo: "finalizacao",
      dificuldade: "avancado",
      de: "guarda-fechada",
      para: null,
      acesso: "free",
      // O id anterior (KISGv_r_OzI) dava LOGIN_REQUIRED (embed quebrado). Trocado pelo vídeo
      // da SOLONBJJ que ensina armlock + TRIÂNGULO da guarda fechada (público, pt-BR, parte 2 = triângulo).
      video: { youtubeId: "NSqMHNQkzEc", titulo: "Triângulo da guarda fechada", canal: "SOLONBJJ" },
      passos: [
        "Controle um braço dentro, um fora; quebre a postura.",
        "Suba uma perna no ombro dele e prenda o pescoço junto com um braço (um braço dentro, um fora).",
        "Trave a canela atrás do joelho (figura-4), puxe a cabeça.",
        "Ajuste o ângulo (gire o quadril) e aperte até o tap.",
      ],
    },
    {
      slug: "kimura-da-guarda",
      nome: "Kimura da Guarda",
      tipo: "finalizacao",
      dificuldade: "intermediario",
      de: "guarda-fechada",
      para: null,
      acesso: "paid",
      video: { youtubeId: "k26bhbE2ScQ", titulo: "Kimura da guarda fechada (faixa branca)", canal: "LifeStyle Jiu-Jitsu" },
      passos: [
        "Quando o oponente posta a mão no chão, agarre o punho dele.",
        "Sente em ângulo e passe o outro braço por trás, fechando a figura-4.",
        "Leve a mão dele às costas e gire o ombro até o tap.",
      ],
    },
    {
      slug: "estrangulamento-cruzado",
      nome: "Estrangulamento Cruzado",
      tipo: "finalizacao",
      dificuldade: "intermediario",
      de: "guarda-fechada",
      para: null,
      acesso: "paid",
      video: { youtubeId: "DL-0wE1UOD0", titulo: "Estrangulamento da guarda fechada", canal: "BJJPROTECH" },
      passos: [
        "Pegada profunda na gola, palma pra cima.",
        "Segunda mão na outra gola, cruzando os antebraços.",
        "Puxe o oponente pra baixo e gire os punhos pra dentro até o tap.",
      ],
    },
    {
      // Curadoria própria (2026-05-31) — finalização clássica de faixa-branca da guarda fechada.
      // Sem vídeo curado ainda → cai no placeholder honesto. Conteúdo de livro-texto.
      slug: "guilhotina-da-guarda",
      nome: "Guilhotina da Guarda",
      tipo: "finalizacao",
      dificuldade: "iniciante",
      de: "guarda-fechada",
      para: null,
      acesso: "free",
      passos: [
        "Quando o oponente abaixa a cabeça (postura quebrada), passe um braço por baixo do queixo, em volta do pescoço.",
        "Junte as mãos (a palma da que envolve o pescoço na outra mão) e encoste o antebraço na traqueia.",
        "Mantenha os tornozelos cruzados, suba o peito e puxe os cotovelos pra cima até o tap.",
      ],
    },
    {
      // Curadoria própria (2026-05-31) — chave de ombro pelas pernas; aparece muito da guarda.
      slug: "omoplata-da-guarda",
      nome: "Omoplata da Guarda",
      tipo: "finalizacao",
      dificuldade: "avancado",
      de: "guarda-fechada",
      para: null,
      acesso: "paid",
      passos: [
        "Controle uma manga e gire o quadril pro lado desse braço, abrindo a guarda.",
        "Passe a perna do mesmo lado por cima do ombro do oponente, prendendo o braço dele entre suas pernas.",
        "Sente em direção aos pés dele e leve o quadril pra frente, girando o ombro até o tap (ou a raspagem se ele rolar).",
      ],
    },
    // ----- Raspagens (mudam a dominância: viram pra cima) -----
    {
      slug: "raspagem-de-tesoura",
      nome: "Raspagem de Tesoura",
      tipo: "raspagem",
      dificuldade: "iniciante",
      de: "guarda-fechada",
      para: "montada",
      acesso: "free",
      video: { youtubeId: "sJjNfnQDjUs", titulo: "Raspagem tesoura na guarda fechada (iniciante)", canal: "JIU JITSU CLASS" },
      passos: [
        "Pegue manga e gola e quebre a postura, puxando o oponente pra frente.",
        "Abra a guarda e atravesse uma canela na barriga dele; o outro pé desce pra fora do joelho.",
        "Faça a tesoura: a canela de cima empurra o tronco, a perna de baixo varre a base.",
        "Acompanhe a queda e assente a montada.",
      ],
    },
    {
      slug: "raspagem-de-quadril",
      nome: "Raspagem de Quadril (Hip Bump)",
      tipo: "raspagem",
      dificuldade: "iniciante",
      de: "guarda-fechada",
      para: "montada",
      acesso: "free",
      // Vídeo removido (C2): onRLg2d42z0 era EN/"Kids BJJ" — vídeo errado engana o aluno,
      // pior que ausência (cai no "em breve" honesto). Recurar com hip bump pt-BR adulto.
      passos: [
        "Sente em direção a um lado, apoiando uma mão atrás.",
        "Com o outro braço, abrace por cima o braço/ombro do oponente.",
        "Jogue o quadril pra cima e por cima, derrubando-o de costas.",
        "Acompanhe a queda e assente a montada.",
      ],
    },
    {
      slug: "raspagem-de-balao",
      nome: "Raspagem de Pêndulo (Flor)",
      tipo: "raspagem",
      dificuldade: "avancado",
      de: "guarda-fechada",
      para: "montada",
      acesso: "paid",
      video: { youtubeId: "F0Qz-DcqxJw", titulo: "Pendulum sweep (raspagem de pêndulo) da guarda fechada", canal: "Chewjitsu" },
      passos: [
        "Controle a manga e a calça/perna do mesmo lado e quebre a postura.",
        "Balance o quadril como pêndulo, levando a perna sob a coxa do oponente.",
        "Use o embalo pra jogá-lo por cima do ombro.",
        "Acompanhe e caia montado.",
      ],
    },
    // ----- Meia-guarda: jogo do guardeiro por baixo (raspar, finalizar, recompor) -----
    {
      slug: "raspagem-de-meia-guarda",
      nome: "Raspagem Velha-Guarda (Old School)",
      tipo: "raspagem",
      de: "meia-guarda",
      para: "montada",
      acesso: "free",
      video: { youtubeId: "KERNYvHzl3o", titulo: "Old school sweep da meia-guarda", canal: "Industrial Strength Gym" },
      passos: [
        "Pegue o underhook do lado da perna presa e suba o ombro, saindo de baixo do peito dele.",
        "Agarre o tornozelo de longe (mesma perna que você controla) e jogue o ombro nele.",
        "Empurre o joelho dele com a perna de dentro e role por cima do ombro levando o tornozelo — derruba e você sobe por cima.",
        "Acompanhe e estabilize por cima.",
      ],
    },
    {
      slug: "kimura-da-meia-guarda",
      nome: "Kimura da Meia-Guarda",
      tipo: "finalizacao",
      de: "meia-guarda",
      para: null,
      acesso: "paid",
      // Vídeo removido (C3): izuzpIOdNNE não era kimura-finalização (raspagem/grip-break/armbar) —
      // vídeo off-topic engana; melhor sem vídeo. Recurar com kimura da meia-guarda pt-BR de finalização.
      passos: [
        "Quando o oponente apoia a mão no chão, feche a pegada kimura (figura-4) no punho dele.",
        "Suba o quadril de lado e prenda o braço colado ao corpo.",
        "Gire o ombro levando a mão dele às costas até o tap (ou use pra raspar se ele resistir).",
      ],
    },
    {
      slug: "recompor-guarda-fechada",
      nome: "Recompor a Guarda Fechada",
      tipo: "ataque",
      de: "meia-guarda",
      para: "guarda-fechada",
      acesso: "free",
      passos: [
        "Enquadre no ombro e no quadril do oponente pra criar espaço.",
        "Enfie o joelho de dentro entre vocês e puxe a perna presa pra fora, girando o quadril de frente.",
        "Suba as duas canelas pra recompor a guarda e cruze os tornozelos pra fechar.",
      ],
    },
    // ----- Perda de guarda: o oponente abre a guarda fechada (DIFERIDA — passagem depois) -----
    {
      slug: "abertura-e-passagem",
      nome: "Abertura da Guarda",
      tipo: "perda-de-guarda",
      de: "guarda-fechada",
      para: "guarda-aberta",
      acesso: "free",
      video: { youtubeId: "ckQ_0l_xYdU", titulo: "Como sair da guarda fechada: passo a passo", canal: "YouTube" },
      passos: [
        "Se o oponente ergue a postura, ele enfia o cotovelo no seu joelho e força os seus pés a descruzar — a guarda fechada abre.",
        "Você cai na guarda aberta — ainda por baixo, mas agora é corrida: raspar/recompor antes que ele passe.",
      ],
    },
    // ----- Guarda aberta: o guardeiro ainda reage -----
    {
      slug: "raspagem-de-gancho",
      nome: "Raspagem de Gancho",
      tipo: "raspagem",
      de: "guarda-aberta",
      para: "montada",
      acesso: "free",
      passos: [
        "Enganche os pés por dentro das coxas do oponente (borboleta) e controle um braço.",
        "Caia pro lado puxando o braço preso e elevando com o gancho.",
        "Acompanhe por cima e termine montado.",
      ],
    },
    // ----- Cadeia de passagens: o oponente vence a guarda aberta (tipo passagem) -----
    {
      slug: "passagem-de-toreando",
      nome: "Passagem de Toreando",
      tipo: "passagem",
      de: "guarda-aberta",
      para: "cem-quilos",
      acesso: "free",
      video: { youtubeId: "JdjTWEwq7_8", titulo: "Passagem de guarda eficiente", canal: "YouTube" },
      passos: [
        "Em pé, agarre as duas pernas na altura das canelas/calça e jogue-as pra um lado.",
        "Toureie: desvie das pernas como capa de toureiro e corra pro lado livre.",
        "Crave o peito no peito e feche o cem-quilos antes dele recompor.",
      ],
    },
    {
      slug: "passagem-de-joelho-cortando",
      nome: "Passagem de Joelho Cortando",
      tipo: "passagem",
      de: "guarda-aberta",
      para: "cem-quilos",
      acesso: "free",
      passos: [
        "Pressione uma perna pra baixo e fure o joelho atravessado sobre a coxa do oponente.",
        "Underhook do lado de cima, lâmina do joelho cortando a meia-guarda.",
        "Deslize o joelho até o chão e assente o cem-quilos.",
      ],
    },
    {
      slug: "passagem-empilhando",
      nome: "Passagem Empilhando",
      tipo: "passagem",
      de: "guarda-aberta",
      para: "cem-quilos",
      acesso: "paid",
      passos: [
        "Pegada dupla por baixo das pernas, levante o quadril do oponente do chão.",
        "Empilhe-o sobre os próprios ombros, tirando o ângulo de defesa.",
        "Caminhe pro lado e desça o peso já no cem-quilos.",
      ],
    },
    {
      slug: "rodado",
      nome: "Rodado (Leg Drag)",
      tipo: "passagem",
      de: "guarda-aberta",
      para: "cem-quilos",
      acesso: "paid",
      passos: [
        "Puxe uma perna do oponente atravessada sobre a sua coxa, prendendo o quadril dele rotacionado.",
        "Controle o quadril e a lapela/braço pra matar o giro de recomposição.",
        "Contorne pra cima da linha das costas e assente o cem-quilos.",
      ],
    },
    // ----- Cem-quilos: controle de topo, saídas ofensivas -----
    {
      slug: "americana-do-cem-quilos",
      nome: "Americana",
      tipo: "finalizacao",
      de: "cem-quilos",
      para: null,
      acesso: "free",
      video: { youtubeId: "Rg27AlsTGS0", titulo: "Americana (chave de ombro) — faixa branca", canal: "YouTube" },
      passos: [
        "Prenda o punho do oponente no chão ao lado da cabeça dele.",
        "Passe o outro braço por baixo do cotovelo e segure o próprio punho (figura-4).",
        "Arraste a mão dele em direção ao quadril, levantando o cotovelo até o tap.",
      ],
    },
    {
      slug: "montar-do-cem-quilos",
      nome: "Subir pra Montada",
      tipo: "ataque",
      de: "cem-quilos",
      para: "montada",
      acesso: "free",
      passos: [
        "Controle a cabeça e o quadril, mate o enquadramento do oponente.",
        "Passe o joelho por cima da barriga, escorregando pra montada.",
        "Assente o peso e feche a montada.",
      ],
    },
    // ----- Montada: saídas ofensivas (curadoria própria 2026-05-31, técnicas-padrão de
    // faixa-branca). Antes a montada era só destino; agora tem ataque. Sem vídeo curado → placeholder. -----
    {
      slug: "estrangulamento-cruzado-da-montada",
      nome: "Estrangulamento Cruzado da Montada",
      tipo: "finalizacao",
      dificuldade: "iniciante",
      de: "montada",
      para: null,
      acesso: "free",
      passos: [
        "Da montada, abra a gola do oponente com uma mão.",
        "Enfie a outra mão fundo na gola do mesmo lado, palma pra cima, cruzando os antebraços.",
        "Caia o peito em cima e gire os cotovelos pra fora, fechando o X no pescoço até o tap.",
      ],
    },
    {
      slug: "americana-da-montada",
      nome: "Americana da Montada",
      tipo: "finalizacao",
      dificuldade: "iniciante",
      de: "montada",
      para: null,
      acesso: "free",
      passos: [
        "Prenda o punho do oponente no chão ao lado da cabeça dele.",
        "Passe o outro braço por baixo do cotovelo e segure o próprio punho (figura-4).",
        "Arraste a mão dele em direção ao quadril, levantando o cotovelo até o tap.",
      ],
    },
    {
      slug: "armlock-da-montada",
      nome: "Armlock da Montada",
      tipo: "finalizacao",
      dificuldade: "intermediario",
      de: "montada",
      para: null,
      acesso: "paid",
      passos: [
        "Quando o oponente empurra seu peito, controle um braço com as duas mãos.",
        "Gire pro lado do braço, sente alto e passe a perna por cima da cabeça dele.",
        "Deite pra trás prendendo o braço entre as pernas, joelhos fechados, e estenda até o tap.",
      ],
    },
  ],
};
