/**
 * sceneEmotions — Maps scene IDs to TTS emotion types for contextual narration.
 * Used by useTTS to deliver emotionally appropriate neural voices.
 */

export type TTSEmotion = 'neutral' | 'dramatic' | 'solemn' | 'urgent' | 'celestial' | 'villain';

/** Default emotion per scene — drives voice tone, speed, stability */
export const sceneEmotions: Record<string, TTSEmotion> = {
  // ═══ FASE 1 — O Despertar ═══
  'cena1': 'solemn',        // Despertar com o fardo
  'cena1b': 'solemn',       // Angústia em casa e nas ruas
  'cena2': 'dramatic',      // Obstinado e Flexível
  'cena3': 'urgent',        // Fuga da Cidade da Destruição
  'cena4': 'dramatic',      // O peso aumenta em casa
  'cena5': 'solemn',        // Evangelista
  'cena5b': 'solemn',       // Peso da partida
  'cena6': 'solemn',        // Sozinho com o fardo
  'cena7': 'dramatic',      // Encruzilhada e porta ao longe
  'cena7b': 'urgent',       // Flechas na Porta
  'cena8': 'villain',       // Prudência Mundana
  'cena9': 'celestial',     // Porta Estreita
  'cena9b': 'solemn',       // Instrução de Boa-Vontade
  'cena10': 'dramatic',     // Monte Sinai tremendo
  'cena11': 'urgent',       // Pântano do Desânimo
  'cena11b': 'villain',     // Vozes na lama
  'cena12': 'solemn',       // Degraus ocultos
  'cena13': 'urgent',       // Quase morrendo
  'cena14': 'celestial',    // O Auxílio chega
  'cena14b': 'solemn',      // Explicação do resgate
  'cena15': 'celestial',    // A Cruz! O fardo cai!
  'cena15b': 'celestial',   // Três Resplandecentes

  // ═══ FASE 2 — Casa do Intérprete ═══
  'fase2-cena1': 'solemn',
  'fase2-cena2': 'celestial',
  'fase2-cena3': 'solemn',
  'fase2-cena4': 'dramatic',
  'fase2-cena5': 'celestial',
  'fase2-cena6': 'celestial',
  'fase2-cena7': 'solemn',
  'fase2-cena8': 'villain',    // Homem na Gaiola de Ferro
  'fase2-cena9': 'dramatic',   // Armadura de Deus
  'fase2-cena10': 'dramatic',
  'fase2-cena11': 'dramatic',
  'fase2-cena12': 'villain',
  'fase2-cena13': 'villain',
  'fase2-cena14': 'urgent',    // Leões

  // ═══ FASE 3 — Vale da Sombra ═══
  'fase3-cena1': 'dramatic',
  'fase3-cena2': 'villain',
  'fase3-cena3': 'villain',    // Apolião surge
  'fase3-cena4': 'urgent',     // Batalha
  'fase3-cena5': 'dramatic',   // Clímax da batalha
  'fase3-cena6': 'celestial',  // Cura pós-batalha
  'fase3-cena7': 'villain',    // Vale da Sombra da Morte
  'fase3-cena8': 'solemn',     // Encontro com Fiel
  'fase3-cena9': 'villain',
  'fase3-cena10': 'villain',

  // ═══ FASE 4 — Feira da Vaidade ═══
  'fase4-cena1': 'dramatic',   // Chegada à Feira
  'fase4-cena2': 'villain',    // Tentações
  'fase4-cena3': 'villain',
  'fase4-cena4': 'urgent',     // Prisão
  'fase4-cena5': 'dramatic',
  'fase4-cena6': 'dramatic',   // Julgamento de Fiel
  'fase4-cena7': 'solemn',     // Martírio
  'fase4-cena8': 'celestial',  // Esperança aparece
  'fase4-cena9': 'solemn',
  'fase4-cena10': 'villain',   // Demas
  'fase4-cena11': 'villain',   // Mina perigosa
  'fase4-cena12': 'celestial',

  // ═══ FASE 5 — Castelo da Dúvida ═══
  'fase5-cena1': 'dramatic',
  'fase5-cena2': 'villain',
  'fase5-cena3': 'villain',    // Gigante Desespero
  'fase5-cena4': 'urgent',     // Calabouço
  'fase5-cena5': 'dramatic',
  'fase5-cena6': 'celestial',  // Chave da Promessa!
  'fase5-cena7': 'dramatic',   // Fuga
  'fase5-cena8': 'solemn',
  'fase5-cena9': 'celestial',  // Montanhas Deleitosas
  'fase5-cena10': 'solemn',
  'fase5-cena11': 'villain',   // Lisonjeiro
  'fase5-cena12': 'dramatic',
  'fase5-cena13': 'villain',
  'fase5-cena14': 'celestial', // País de Beulá

  // ═══ FASE 6 — Rio da Morte e Cidade Celestial ═══
  'fase6-cena1': 'dramatic',   // Rio da Morte
  'fase6-cena2': 'urgent',     // Águas profundas
  'fase6-cena3': 'solemn',     // Esperança no rio
  'fase6-cena4': 'dramatic',   // Atravessando
  'fase6-cena5': 'celestial',  // Outra margem
  'fase6-cena6': 'celestial',
  'fase6-cena7': 'celestial',  // Portões à vista
  'fase6-cena8': 'celestial',  // Cidade Celestial!
  'fase6-cena9': 'celestial',  // Glória final

  // ═══ PARTE 2 ═══
  'p2-cena1': 'solemn',
  'p2-cena2': 'solemn',
  'p2-cena3': 'urgent',
  'p2-cena4': 'urgent',
  'p2-cena5': 'dramatic',
  'p2-cena6': 'celestial',
  'p2-fase2-cena1': 'celestial',
  'p2-fase2-cena2': 'celestial',  // Cruz
  'p2-fase2-cena3': 'dramatic',
  'p2-fase2-cena4': 'urgent',
  'p2-fase2-cena5': 'celestial',
  'p2-fase3-cena1': 'dramatic',
  'p2-fase3-cena2': 'villain',
  'p2-fase3-cena3': 'villain',    // Gigante Maul
  'p2-fase3-cena4': 'solemn',
  'p2-fase3-cena5': 'dramatic',   // Gigante Mata-Bons
  'p2-fase3-cena6': 'villain',
  'p2-fase4-cena1': 'solemn',
  'p2-fase4-cena2': 'villain',    // Demas
  'p2-fase4-cena3': 'dramatic',   // Valente
  'p2-fase4-cena4': 'solemn',
  'p2-fase5-cena1': 'villain',    // Castelo Dúvida
  'p2-fase5-cena2': 'dramatic',   // Destruição
  'p2-fase5-cena3': 'solemn',
  'p2-fase5-cena4': 'celestial',  // Libertação
  'p2-fase5-cena5': 'celestial',  // Montanhas
  'p2-fase6-cena1': 'dramatic',
  'p2-fase6-cena2': 'solemn',
  'p2-fase6-cena3': 'dramatic',   // Rio
  'p2-fase6-cena4': 'solemn',
  'p2-fase6-cena5': 'urgent',     // Atravessando
  'p2-fase6-cena6': 'celestial',  // Cidade Celestial!
};

/** Get emotion for a scene, with fallback detection by prefix */
export function getSceneEmotion(sceneId: string): TTSEmotion {
  if (sceneEmotions[sceneId]) return sceneEmotions[sceneId];

  // Fallback by prefix
  if (sceneId.includes('celestial') || sceneId.includes('gloria')) return 'celestial';
  if (sceneId.includes('apolion') || sceneId.includes('gigante') || sceneId.includes('villain')) return 'villain';
  if (sceneId.includes('batalha') || sceneId.includes('luta')) return 'urgent';
  if (sceneId.startsWith('fase6')) return 'dramatic';
  if (sceneId.startsWith('fase3')) return 'dramatic';

  return 'neutral';
}

/** Scenes where TTS auto-plays (epic/critical moments) */
export const autoNarrateScenes = new Set([
  // PARTE 1
  'cena1',        // Despertar — abertura
  'cena15',       // A Cruz
  'cena15b',      // Três Resplandecentes
  'fase2-cena1',  // Casa do Intérprete
  'fase2-cena8',  // Homem na Gaiola
  'fase2-cena9',  // Armadura de Deus
  'fase3-cena3',  // Apolião surge
  'fase3-cena5',  // Clímax Apolião
  'fase3-cena8',  // Encontro com Fiel
  'fase4-cena1',  // Feira da Vaidade
  'fase4-cena6',  // Julgamento de Fiel
  'fase4-cena7',  // Martírio de Fiel
  'fase5-cena3',  // Gigante Desespero
  'fase5-cena6',  // Chave da Promessa
  'fase5-cena9',  // Montanhas Deleitosas
  'fase6-cena1',  // Rio da Morte
  'fase6-cena7',  // Portões à vista
  'fase6-cena8',  // Cidade Celestial
  'fase6-cena9',  // Glória final
  // PARTE 2
  'p2-cena1',       // Sonho e Carta — abertura
  'p2-cena2',       // Misericórdia
  'p2-cena4',       // Portão Estreito
  'p2-cena6',       // Banho e Vestes
  'p2-fase2-cena1', // Grande-Coração
  'p2-fase2-cena2', // Cruz (Parte 2)
  'p2-fase3-cena3', // Gigante Maul
  'p2-fase3-cena5', // Gigante Mata-Bons
  'p2-fase4-cena3', // Valente-pela-Verdade
  'p2-fase5-cena2', // Batalha Gigante Desespero
  'p2-fase5-cena4', // Demolição do Castelo
  'p2-fase6-cena1', // Firme e Madame Bolha
  'p2-fase6-cena3', // Chamado Individual
  'p2-fase6-cena4', // Despedidas (palavras de Valente)
  'p2-fase6-cena5', // Travessia de Cristã
  'p2-fase6-cena6', // Cidade Celestial (Parte 2)
]);
