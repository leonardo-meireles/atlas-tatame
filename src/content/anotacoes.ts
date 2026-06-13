// Anotações didáticas das posições — os "callouts" que o instrutor aponta na figura.
// Objetivo: uma figura sozinha não explica o conceito; estas anotações marcam as
// juntas, pegadas e pontos de pressão que DEFINEM a posição, pra UI desenhar por cima.
// Conteúdo pt-BR, termos BR-canônicos (ver CONTEXT.md). Ground em BJJ real.

/** Que tipo de detalhe a anotação destaca na figura. */
export type TipoAnotacao = "junta" | "pressao" | "pegada" | "controle";

/** Uma anotação: um ponto que o instrutor apontaria na ilustração da posição. */
export interface Anotacao {
  /** O foco anatômico/mecânico, ex: "tornozelos cruzados atrás das costas". */
  foco: string;
  /** O tipo de detalhe destacado. */
  tipo: TipoAnotacao;
  /** Uma linha do porquê tático — por que isso importa na posição. */
  porque: string;
}

/**
 * Anotações por slug de Posição. Cobre o set MVP da guarda fechada + a vizinhança
 * imediata (posições pra onde se cai ou de onde se chega). 4-7 anotações por conceito.
 */
export const ANOTACOES: Record<string, Anotacao[]> = {
  "guarda-fechada": [
    {
      foco: "tornozelos cruzados atrás das costas do oponente",
      tipo: "junta",
      porque: "A trava de pernas prende o quadril dele e segura a posição com pouco esforço.",
    },
    {
      foco: "joelhos apertando as costelas do oponente",
      tipo: "pressao",
      porque: "Fechar os joelhos suga o oponente pra frente e tira a base dele.",
    },
    {
      foco: "pegada na manga (punho do oponente)",
      tipo: "pegada",
      porque: "Controlar um braço impede que ele poste as duas mãos e se defenda livre.",
    },
    {
      foco: "pegada na gola, puxando pra baixo",
      tipo: "pegada",
      porque: "Quebra a postura: puxa o tronco pra frente e mata a defesa do oponente.",
    },
    {
      foco: "cotovelos colados ao próprio corpo",
      tipo: "controle",
      porque: "Cotovelos colados protegem contra passagem e mantêm os ataques curtos e fortes.",
    },
    {
      foco: "quadril em ângulo (saída pro lado)",
      tipo: "controle",
      porque: "Trabalhar de ângulo abre armlock e triângulo; ficar de frente fecha os ataques.",
    },
  ],

  montada: [
    {
      foco: "joelhos colados nas axilas do oponente",
      tipo: "controle",
      porque: "Subir os joelhos altos tira o espaço pro oponente recuperar a guarda.",
    },
    {
      foco: "peito pressionando o esterno do oponente",
      tipo: "pressao",
      porque: "Jogar o peso pra cima do peito esmaga a respiração e impede o levantamento.",
    },
    {
      foco: "pés ganchados por dentro das coxas do oponente",
      tipo: "junta",
      porque: "Ganchar os pés por dentro ancora a montada e segura contra a ponte.",
    },
    {
      foco: "mãos/base aberta tipo tripé",
      tipo: "controle",
      porque: "Base larga e mãos no chão impedem a raspagem de ponte ou de upa.",
    },
    {
      foco: "controle do braço (espremendo pra cima)",
      tipo: "pegada",
      porque: "Isolar um braço abre a montada técnica e finalizações como o armlock.",
    },
  ],

  "meia-guarda": [
    {
      foco: "pernas trançando uma perna do oponente",
      tipo: "junta",
      porque: "Prender uma perna trava a passagem e dá tempo pra recuperar guarda ou raspar.",
    },
    {
      foco: "joelho-escudo entre os corpos",
      tipo: "controle",
      porque: "O joelho na frente cria moldura e impede o oponente de colar o peito.",
    },
    {
      foco: "underhook (braço por baixo da axila)",
      tipo: "pegada",
      porque: "O underhook é a chave da meia-guarda: dá ângulo, costas e raspagem.",
    },
    {
      foco: "antebraço bloqueando o quadril do oponente",
      tipo: "controle",
      porque: "Bloquear o quadril impede que ele avance e achate você no chão.",
    },
    {
      foco: "deitado de lado, ombro fora do chão",
      tipo: "controle",
      porque: "Ficar de lado, e não de costas, mantém a mobilidade pra atacar a perna.",
    },
  ],

  "cem-quilos": [
    {
      foco: "peito sobre o peito, peso afundando",
      tipo: "pressao",
      porque: "É a essência do cem-quilos: cravar o peso no peito tira o ar e a mobilidade.",
    },
    {
      foco: "braço de baixo cravado no pescoço (cross-face)",
      tipo: "pressao",
      porque: "O cross-face vira a cabeça do oponente e desliga a fuga de quadril.",
    },
    {
      foco: "braço por baixo do braço/axila do oponente (underhook)",
      tipo: "pegada",
      porque: "Costurar o braço por baixo prende o ombro e bloqueia a recomposição de guarda.",
    },
    {
      foco: "joelhos colados ao quadril do oponente",
      tipo: "controle",
      porque: "Fechar o espaço com os joelhos impede o oponente de enfiar a perna e voltar pra guarda.",
    },
    {
      foco: "quadril baixo e pernas espalhadas (base)",
      tipo: "controle",
      porque: "Base larga e quadril no chão neutralizam a ponte e a tentativa de raspagem.",
    },
  ],

  "joelho-na-barriga": [
    {
      foco: "joelho cravado na barriga/plexo do oponente",
      tipo: "pressao",
      porque: "O joelho na barriga concentra todo o peso num ponto e força o oponente a reagir.",
    },
    {
      foco: "pé de baixo postado, perna estendida em base",
      tipo: "controle",
      porque: "A perna postada equilibra a posição e deixa subir e descer o peso à vontade.",
    },
    {
      foco: "pegada na gola, puxando pra cima",
      tipo: "pegada",
      porque: "Puxar a gola arqueia o tronco do oponente e aumenta a pressão do joelho.",
    },
    {
      foco: "pegada na manga ou cintura",
      tipo: "pegada",
      porque: "Controlar o braço impede o empurrão do joelho e a recuperação de guarda.",
    },
    {
      foco: "postura ereta, peito alto",
      tipo: "controle",
      porque: "Manter-se em pé sobre o joelho deixa girar pro armlock ou pular pra montada.",
    },
  ],

  "pegada-nas-costas": [
    {
      foco: "ganchos: peitos dos pés dentro das coxas do oponente",
      tipo: "junta",
      porque: "Os ganchos prendem você nas costas e impedem o oponente de escapar pro lado.",
    },
    {
      foco: "braço por cima do ombro (seatbelt superior)",
      tipo: "controle",
      porque: "O seatbelt cruza o tronco e dá o controle que leva ao estrangulamento.",
    },
    {
      foco: "braço por baixo da axila (seatbelt inferior)",
      tipo: "pegada",
      porque: "O braço de baixo fecha a alça e impede que o oponente gire por cima desse lado.",
    },
    {
      foco: "peito colado nas costas do oponente",
      tipo: "pressao",
      porque: "Manter o peito grudado tira o espaço e segue o oponente em qualquer giro.",
    },
    {
      foco: "queixo escondido atrás do ombro",
      tipo: "controle",
      porque: "Esconder o queixo protege contra a cotovelada e a defesa de pescoço do oponente.",
    },
    {
      foco: "mão controlando o punho da mão de defesa",
      tipo: "pegada",
      porque: "Matar a mão que defende o pescoço abre o caminho pro estrangulamento.",
    },
  ],
};
