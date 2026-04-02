// ═══════════════════════════════════════════════════════
// TIPOS DO SISTEMA RPG — O MESTRE DO JOGO
// ═══════════════════════════════════════════════════════

export type Difficulty = 'aprendiz' | 'peregrino' | 'veterano';

export type ResponseMode =
  | 'individual_solo'       // Sorteado responde sozinho, sem ajuda
  | 'individual_group_help' // Sorteado responde, grupo pode ajudar
  | 'group_consensus'       // Grupo decide junto
  | 'secret_vote'           // Cada um vota secretamente
  | 'group_picks_one';      // Grupo escolhe quem responde

export type TileEventType =
  | 'scripture'    // Pergunta bíblica contextualizada
  | 'riddle'       // Charada/enigma bíblico
  | 'challenge'    // Desafio ativo (mímica, recitar, achar na Bíblia)
  | 'dilemma'      // Dilema moral com consequências ocultas
  | 'boss'         // Confronto com antagonista
  | 'refuge'       // Refúgio — descanso e bênção
  | 'trap'         // Armadilha — punição
  | 'special'      // Evento especial surpresa
  | 'narrative';   // Casa narrativa (fixa, conta a história)

export interface ScriptureQuestion {
  id: string;
  difficulty: Difficulty;
  context: string;           // Contextualização narrativa antes da pergunta
  question: string;          // A pergunta em si
  options: string[];         // 4 alternativas
  correctIndex: number;      // Índice da resposta correta (0-3)
  bibleReference: string;    // Referência bíblica (ex: "João 3:16")
  explanation: string;       // Explicação após resposta
  timerSeconds: number;      // Tempo após clicar no cronômetro
  narrativeLink?: string;    // Conexão com cena da Parte 1
}

export interface Riddle {
  id: string;
  difficulty: Difficulty;
  context: string;           // Contextualização
  riddle: string;            // O enigma
  hints: string[];           // Até 3 dicas progressivas
  answer: string;            // Resposta
  bibleReference: string;
  explanation: string;
  timerSeconds: number;
}

export interface MoralDilemma {
  id: string;
  difficulty: Difficulty;
  context: string;           // Contextualização narrativa
  situation: string;         // A situação
  choices: {
    text: string;
    consequence: string;     // Revelado após escolha
    effect: DilemmaEffect;
  }[];
  bibleReference: string;
  lesson: string;            // Lição espiritual
}

export interface DilemmaEffect {
  type: 'advance' | 'retreat' | 'stun' | 'boost' | 'penalty' | 'group_effect';
  positions?: number;        // Casas para avançar/retroceder
  stunTurns?: number;
  attribute?: string;
  amount?: number;
  affectsGroup?: boolean;    // Se afeta todo o grupo (modo cooperativo)
}

export interface ActiveChallenge {
  id: string;
  difficulty: Difficulty;
  context: string;
  type: 'mime' | 'recite' | 'find_verse' | 'draw' | 'sing' | 'debate' | 'rapid_fire';
  title: string;
  description: string;       // O que o jogador deve fazer
  successCriteria: string;   // Como o grupo julga sucesso
  timerSeconds: number;
  reward: DilemmaEffect;
  penalty: DilemmaEffect;
}

export interface BossEncounter {
  id: string;
  difficulty: Difficulty;
  bossName: string;
  bossImage?: string;        // Referência à imagem
  narrative: string;         // Narração dramática de entrada
  phases: BossPhase[];       // Fases do confronto
  defeatNarrative: string;   // Se o grupo perde
  victoryNarrative: string;  // Se o grupo vence
  bibleReference: string;
}

export interface BossPhase {
  description: string;       // Narração da fase
  question: string;          // Pergunta ou desafio da fase
  options?: string[];        // Se for pergunta
  correctIndex?: number;
  timerSeconds: number;
  failPenalty: DilemmaEffect;
}

export interface SpecialEvent {
  id: string;
  difficulty: Difficulty;
  title: string;
  narrative: string;
  effect: DilemmaEffect;
  emoji: string;
  soundEffect?: string;
}

export interface TrapEvent {
  id: string;
  title: string;
  narrative: string;
  effect: DilemmaEffect;
  escapeChallenge?: {        // Chance de escapar
    question: string;
    options: string[];
    correctIndex: number;
    timerSeconds: number;
  };
  emoji: string;
}

export interface RefugeEvent {
  id: string;
  title: string;
  narrative: string;
  effect: DilemmaEffect;
  bibleVerse: string;        // Versículo de consolo
  emoji: string;
}

// Estado de rotação (anti-repetição)
export interface RotationState {
  usedQuestions: Set<string>;
  usedRiddles: Set<string>;
  usedDilemmas: Set<string>;
  usedChallenges: Set<string>;
  usedBosses: Set<string>;
  usedSpecials: Set<string>;
  usedTraps: Set<string>;
  usedRefuges: Set<string>;
}
