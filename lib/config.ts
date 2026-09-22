// ============================================================
// CONFIGURAÇÃO DA TUA APP OPERACIONAL
// ------------------------------------------------------------
// A skill /esystem-operacao preenche isto a partir do teu
// desenho — que módulos activos, que entidades vivem no meio
// da app, que estados por módulo, se tens tutora IA.
// Edita à mão sempre que quiseres afinar textos.
// ============================================================

export const PLATAFORMA = {
  /** Nome que aparece no topo, no separador do browser e como título grande no login */
  nome: "eSystem Operação",

  /** Iniciais (1-3 letras) para o logo pequeno */
  iniciais: "eO",

  /** Marca-mãe (chapéu pequeno acima do nome grande no login) — deixa string vazia para esconder */
  marcaMae: "",

  /** Frase-âncora — aparece na landing pública, no primeiro ecrã */
  fraseAncora: "A tua operação, viva e sob controlo.",

  /** Subtítulo curto — aparece na landing por baixo da frase-âncora */
  subtitulo: "Regista, acompanha, resolve. Um sítio só.",

  /** Nome de quem tu és — a founder atrás desta app */
  founder: {
    nome: "A Founder",
    email: "tu@teudominio.pt",
  },

  /** Password inicial que dás às empresas cliente para o primeiro login. */
  passwordInicial: "muda-me-2026",

  /**
   * As 3 entidades possíveis que os registos podem apontar.
   * Colaboradores é sempre true. Ativa clientes/fornecedores se os módulos
   * precisam de os ligar. A skill acrescenta automaticamente Fornecedor
   * se activares o módulo Fornecedores.
   */
  entidades: {
    colaboradores: true,
    clientes: false,
    fornecedores: false,
  },

  /**
   * Os 4 módulos possíveis nesta v1. Ativa só os que fazem sentido.
   * O menu, o dashboard e o admin mostram só os activos.
   * Podes renomear o rótulo em `labels`.
   */
  modulos: {
    ocorrencias: true,
    riscos: true,
    acoes: true,
    fornecedores: false,
  },

  /** Módulo âncora — o que aparece em destaque na home. Tem de estar activo. */
  ancora: "ocorrencias" as "ocorrencias" | "riscos" | "acoes" | "fornecedores",

  /** Estados por módulo. Primeiro é o default ao criar. */
  estados: {
    ocorrencias: [
      "Aberto",
      "Em análise",
      "Causa raiz identificada",
      "Ações em curso",
      "Resolvido",
      "A avaliar eficácia",
      "Fechado",
    ] as string[],
    riscos: [
      "Identificado",
      "Analisado",
      "Tratamento definido",
      "Em tratamento",
      "Sob monitorização",
      "Fechado",
    ] as string[],
    acoes: [
      "Definida",
      "Em curso",
      "Concluída",
      "Verificada",
      "Fechada",
    ] as string[],
    fornecedores: [
      "Em qualificação",
      "Qualificado",
      "Sob observação",
      "Requalificação",
      "Desqualificado",
    ] as string[],
  },

  /** Nomes que aparecem no menu e no dashboard. Personaliza pela tua voz. */
  labels: {
    ocorrencias: "Ocorrências",
    riscos: "Riscos",
    acoes: "Ações",
    fornecedores: "Fornecedores",
  },

  /**
   * Tutora IA — opcional. Escondida num canto. Responde na voz da founder,
   * sem citar número de requisito da norma.
   */
  tutora: {
    activa: false,
    /** Ex: "ISO 9001", "Manual interno da qualidade", "FAQ interno" */
    fonte: "",
  },
} as const;

export type ModuloKey = keyof typeof PLATAFORMA.modulos;
export type EntidadeKey = keyof typeof PLATAFORMA.entidades;

export const NIVEIS_PRIORIDADE = ["Baixa", "Média", "Alta", "Crítica"] as const;
export type Prioridade = (typeof NIVEIS_PRIORIDADE)[number];

export const SEVERIDADE = ["Baixa", "Média", "Alta", "Crítica"] as const;
export const FREQUENCIA = ["Isolada", "Ocasional", "Recorrente", "Constante"] as const;
export const PROBABILIDADE = ["Rara", "Improvável", "Possível", "Provável", "Quase certa"] as const;
export const IMPACTO = ["Insignificante", "Menor", "Moderado", "Maior", "Catastrófico"] as const;

export const ORIGENS_OCORRENCIA = [
  "Reclamação de cliente",
  "Auditoria interna",
  "Auditoria externa",
  "Observação",
  "Verificação de processo",
  "Outra",
] as const;

export const CATEGORIAS_RISCO = [
  "Operacional",
  "Financeiro",
  "Estratégico",
  "Conformidade",
  "Reputacional",
  "Tecnológico",
] as const;

export const TIPOS_ACAO = ["Correctiva", "Preventiva", "Melhoria"] as const;
