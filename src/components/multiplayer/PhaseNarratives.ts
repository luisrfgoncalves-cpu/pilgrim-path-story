// Phase-specific contextual narratives for tile events
// Each phase has unique flavor text for each tile type

export interface PhaseNarrative {
  [tileType: string]: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

const PHASE_NARRATIVES: Record<number, Record<string, string[]>> = {
  // Phase 0 — Cidade da Destruição
  0: {
    refuge: ['🏠 Uma casa piedosa te acolhe na beira da estrada. Recupere suas forças!', '🏠 Auxílio surge do pântano e te puxa para terra firme!'],
    trap: ['🔙 O Pântano do Desânimo te engole! Você afunda na lama da dúvida!', '🔙 Prudência Mundana te desvia do caminho!'],
    blessing: ['⭐ Evangelista aponta o caminho da Porta Estreita! Avance com fé!', '⭐ Uma luz divina ilumina a estrada à sua frente!'],
    surprise: ['🎁 Você encontra um pergaminho escondido na estrada!', '🎁 Um viajante misterioso cruza seu caminho...'],
    giant: ['💀 Um guardião da Cidade da Destruição surge para impedir sua fuga!', '💀 As sombras da cidade ganham forma e atacam!'],
    challenge: ['⚔️ Obstinado e Flexível tentam te convencer a voltar!', '⚔️ O porteiro da Porta Estreita te testa!'],
    scripture: ['📖 As palavras de Evangelista ecoam em sua mente...', '📖 Um versículo brilha na pedra do caminho!'],
    current: ['🌊 O rio ao lado do caminho puxa seus pés...', '🌊 Uma correnteza inesperada atravessa a estrada!'],
    shield: ['🛡️ Você encontra a armadura do peregrino iniciante!', '🛡️ Uma benção protetora envolve seus passos!'],
    swap: ['🔄 Um redemoinho místico troca os caminhos dos peregrinos!', '🔄 O Pântano confunde as trilhas!'],
  },
  // Phase 1 — Pântano e Provações
  1: {
    refuge: ['🏠 A Casa do Intérprete abre suas portas! Descanse e aprenda.', '🏠 O Palácio Belo oferece abrigo e provisões!'],
    trap: ['🔙 Uma armadilha do inimigo no vale escuro!', '🔙 Falsas visões te desviam do caminho verdadeiro!'],
    blessing: ['⭐ O Intérprete revela verdades que fortalecem sua alma!', '⭐ A Cruz resplandece — seu fardo cai!'],
    surprise: ['🎁 Uma visão na Casa do Intérprete...', '🎁 Um tesouro escondido no Palácio Belo!'],
    giant: ['💀 As sombras do vale ganham forma monstruosa!', '💀 Um demônio bloqueia a saída do vale!'],
    challenge: ['⚔️ O Intérprete te desafia com um enigma espiritual!', '⚔️ Uma prova de fé no Palácio Belo!'],
    scripture: ['📖 As paredes do Palácio revelam escrituras sagradas!', '📖 Um livro antigo brilha na biblioteca!'],
    current: ['🌊 Uma correnteza de graça te empurra adiante!', '🌊 As águas do batismo te envolvem!'],
    shield: ['🛡️ A Armadura de Deus está disponível no Palácio Belo!', '🛡️ Proteção divina ativada pelo Intérprete!'],
    swap: ['🔄 As visões do Intérprete confundem as posições!', '🔄 Um portal místico no Palácio troca caminhos!'],
  },
  // Phase 2 — Vale da Sombra da Morte
  2: {
    refuge: ['🏠 Uma caverna iluminada oferece refúgio no vale sombrio!', '🏠 Uma fogueira sagrada aquece o peregrino no escuro!'],
    trap: ['🔙 As trevas do vale te envolvem! Seus pés tropeçam!', '🔙 Vozes demoníacas te confundem na escuridão!'],
    blessing: ['⭐ Uma luz celestial rompe as trevas do vale!', '⭐ Anjos guardiões te protegem na escuridão!'],
    surprise: ['🎁 Algo brilha entre as sombras do vale...', '🎁 Um eco estranho revela algo inesperado!'],
    giant: ['💀 O Gigante Desespero emerge das trevas! Prepare-se!', '💀 Apolião descende sobre o vale com fúria!'],
    challenge: ['⚔️ As trevas te testam! Enfrente seus medos mais profundos!', '⚔️ Um demônio inferior desafia sua coragem!'],
    scripture: ['📖 Na escuridão, um versículo brilha como estrela!', '📖 A voz de Deus ecoa pelo vale tenebroso!'],
    current: ['🌊 Ventos sobrenaturais varrem o vale!', '🌊 Uma força invisível empurra o peregrino!'],
    shield: ['🛡️ A espada do Espírito reluz nas trevas!', '🛡️ Uma armadura celestial se materializa!'],
    swap: ['🔄 A escuridão confunde todos os peregrinos!', '🔄 O vale distorce o espaço e troca posições!'],
  },
  // Phase 3 — Feira da Vaidade
  3: {
    refuge: ['🏠 Uma igreja escondida na feira oferece refúgio!', '🏠 Cristãos fiéis te abrigam da perseguição!'],
    trap: ['🔙 Mercadores desonestos te enganam e te desviam!', '🔙 A multidão da feira te arrasta na direção errada!'],
    blessing: ['⭐ O testemunho de Fiel inspira toda a feira!', '⭐ A verdade resplandece em meio à vaidade!'],
    surprise: ['🎁 Um mercador oferece algo especial...', '🎁 Algo cai de uma barraca da feira!'],
    giant: ['💀 O Juiz da Feira decreta punição aos peregrinos!', '💀 Um carrasco avança contra os fiéis!'],
    challenge: ['⚔️ O tribunal da feira te julga! Defenda sua fé!', '⚔️ Tentações luxuosas testam seu coração!'],
    scripture: ['📖 As palavras de Fiel ecoam no tribunal!', '📖 Um pergaminho sagrado é encontrado na feira!'],
    current: ['🌊 A multidão te empurra para todos os lados!', '🌊 Uma onda de gente carrega o peregrino!'],
    shield: ['🛡️ A fé inabalável de Fiel te protege!', '🛡️ Esperança cobre você com um manto protetor!'],
    swap: ['🔄 A confusão da feira troca as posições dos peregrinos!', '🔄 Um tumulto na praça bagunça tudo!'],
  },
  // Phase 4 — Castelo da Dúvida
  4: {
    refuge: ['🏠 Uma cela esquecida no castelo oferece descanso!', '🏠 Você encontra as Montanhas Deleitosas e pastores bondosos!'],
    trap: ['🔙 As masmorras do castelo te prendem!', '🔙 O Gigante Desespero te encontra nos corredores!'],
    blessing: ['⭐ A Chave da Promessa brilha em seu bolso!', '⭐ Os pastores das montanhas te abençoam!'],
    surprise: ['🎁 Um segredo escondido nas paredes do castelo!', '🎁 Uma passagem secreta se revela!'],
    giant: ['💀 O Gigante Desespero surge furioso! Batalha inevitável!', '💀 A Giganta Desconfiança ataca sem piedade!'],
    challenge: ['⚔️ O castelo te testa com ilusões de desespero!', '⚔️ Um enigma tranca a porta da liberdade!'],
    scripture: ['📖 A Chave da Promessa revela um versículo salvador!', '📖 Gravuras sagradas nas paredes do castelo!'],
    current: ['🌊 Correntes de ar gelado sopram pelos corredores!', '🌊 Uma força arrasta o peregrino pelo castelo!'],
    shield: ['🛡️ A fé se torna escudo nas masmorras!', '🛡️ Grande-Coração te empresta sua armadura!'],
    swap: ['🔄 Os corredores labirínticos confundem os peregrinos!', '🔄 Uma armadilha mágica troca posições!'],
  },
  // Phase 5 — Cidade Celestial
  5: {
    refuge: ['🏠 As margens do Rio da Morte oferecem um último descanso!', '🏠 Anjos te sustentam antes da travessia final!'],
    trap: ['🔙 As águas geladas do Rio da Morte te puxam para baixo!', '🔙 Dúvidas finais assaltam seu coração!'],
    blessing: ['⭐ Trombetas celestiais soam! A Cidade se aproxima!', '⭐ Uma coroa de glória brilha ao longe!'],
    surprise: ['🎁 Uma visão celestial se revela...', '🎁 Anjos trazem uma mensagem inesperada!'],
    giant: ['💀 A Dúvida Final se ergue nas águas do Rio!', '💀 O último inimigo tenta impedir sua entrada!'],
    challenge: ['⚔️ A travessia do Rio é o último teste de fé!', '⚔️ Os portões celestiais exigem prova final!'],
    scripture: ['📖 As palavras eternas ressoam nos portões de ouro!', '📖 Toda a Escritura se ilumina em glória!'],
    current: ['🌊 As águas do Rio da Morte te carregam!', '🌊 Uma corrente celestial empurra os peregrinos!'],
    shield: ['🛡️ Proteção angelical total para a travessia!', '🛡️ A armadura completa de Deus resplandece!'],
    swap: ['🔄 As águas do Rio misturam os caminhos finais!', '🔄 O véu entre mundos confunde posições!'],
  },
};

export function getPhaseNarrative(phaseIdx: number, tileType: string, seed: number): string | null {
  const phase = PHASE_NARRATIVES[phaseIdx];
  if (!phase) return null;
  const narratives = phase[tileType];
  if (!narratives || narratives.length === 0) return null;
  return narratives[seed % narratives.length];
}
