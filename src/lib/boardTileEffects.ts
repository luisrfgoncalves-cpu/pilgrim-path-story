import { TileType, IMMERSIVE_BOARD_SIZE } from '@/components/multiplayer/ImmersiveBoardTypes';
import { TileEventType as RPGTileEventType } from '@/data/rpg/types';
import { getPhaseNarrative } from '@/components/multiplayer/PhaseNarratives';
import { getCharacter, checkPassive } from '@/data/rpg/characters';
import { LocalPlayer, PlayerStats } from './boardPlayerTypes';

// Only tiles that require INTERACTIVE Q&A trigger the RPG popup.
export const TILE_TO_RPG_EVENT: Partial<Record<TileType, RPGTileEventType>> = {
  scripture: 'scripture',
  challenge: 'challenge',
  giant: 'boss',
  trap: 'trap',
};

// River of Death tiles: last 5 tiles before finish
export const RIVER_ZONE_START = IMMERSIVE_BOARD_SIZE - 6;

export function getMiniGameEventKey(event: { playerIdx: number; prevPosition: number; newPosition: number; tileType: TileType }) {
  return `${event.playerIdx}:${event.tileType}:${event.prevPosition}:${event.newPosition}`;
}

export function getRpgEventKey(event: {
  playerIdx: number;
  prevPosition: number;
  newPosition: number;
  tileType: RPGTileEventType;
  sourceTileType: TileType;
}) {
  return `${event.playerIdx}:${event.tileType}:${event.sourceTileType}:${event.prevPosition}:${event.newPosition}`;
}

export function resolveTileEffect(
  tileType: TileType,
  player: LocalPlayer,
  allPlayers: LocalPlayer[],
  seed: number,
  phaseIdx: number,
): {
  posAdjust: number;
  attrChanges: Record<string, number>;
  stun: boolean;
  stunTurns: number;
  shield: boolean;
  extraTurn: boolean;
  resetToCheckpoint: boolean;
  resetToStart: boolean;
  message: string;
  emoji: string;
  statUpdate: Partial<PlayerStats>;
  collectiveEffect?: { type: 'blessing_all' | 'curse_all'; message: string };
  passiveTriggered?: string;
} {
  const rng = ((seed * 1103515245 + 12345) & 0x7fffffff) % 100;
  const result: ReturnType<typeof resolveTileEffect> = {
    posAdjust: 0, attrChanges: {} as Record<string, number>,
    stun: false, stunTurns: 0, shield: false, extraTurn: false,
    resetToCheckpoint: false, resetToStart: false, message: '', emoji: '',
    statUpdate: { tilesVisited: 1 },
  };

  const narrative = getPhaseNarrative(phaseIdx, tileType, seed);

  // Get character passive
  const char = player.characterId ? getCharacter(player.characterId) : undefined;
  const passive = char?.passive.effect;

  switch (tileType) {
    case 'refuge': {
      let feBonus = 1, persBonus = 1;
      if (passive?.type === 'healing_touch') {
        feBonus = passive.attrRestore;
        persBonus = passive.attrRestore;
        result.passiveTriggered = `⚡ ${char!.passive.name}: ${char!.name} cura o grupo com mãos abençoadas! +${passive.attrRestore} em todos os atributos!`;
        result.attrChanges = { fe: feBonus, perseveranca: persBonus, discernimento: passive.attrRestore, coragem: passive.attrRestore };
      } else {
        result.attrChanges = { fe: feBonus, perseveranca: persBonus };
      }
      result.message = narrative || '🏠 Um lugar de descanso se revela no caminho — muros antigos, uma lareira crepitante e o silêncio que só a paz verdadeira oferece. Suas forças se renovam como raízes que encontram água após longa seca.';
      result.emoji = '🏠';
      break;
    }
    case 'challenge':
      if (rng >= 40) {
        result.posAdjust = 3;
        result.attrChanges = { coragem: 2 };
        result.message = narrative || '⚔️ O desafio era brutal — mas algo dentro de você se ergueu mais forte que o medo. Com determinação que surpreendeu até a você mesmo, a vitória foi conquistada! O caminho adiante se abre com 3 passos de vantagem!';
        result.statUpdate.challengesWon = 1;
      } else {
        result.posAdjust = -2;
        result.attrChanges = { coragem: -1 };
        result.message = narrative || '⚔️ O adversário era mais astuto do que parecia. O golpe veio de onde não se esperava, e a derrota cobra seu preço — 2 passos para trás, e a coragem precisa ser reconstruída.';
        result.statUpdate.challengesLost = 1;
      }
      result.emoji = '⚔️';
      break;
    case 'surprise':
      if (rng >= 50) {
        result.posAdjust = 2;
        result.attrChanges = { fe: 1 };
        result.message = narrative || '🎁 O inesperado nem sempre é inimigo! Uma provisão divina aparece onde menos se esperava — como maná no deserto. Avance 2 casas com a fé renovada de quem sabe que não caminha sozinho!';
        if (rng > 80) {
          result.collectiveEffect = {
            type: 'blessing_all',
            message: '✨ A bênção transborda! Como chuva que não escolhe onde cai, todos os peregrinos são alcançados. Cada alma ganha +1 em Fé — pois onde um é abençoado, todos celebram!',
          };
        }
      } else {
        result.posAdjust = -1;
        result.message = narrative || '🎁 Nem toda surpresa é presente — esta veio com espinhos. O caminho que parecia promissor era desvio, e o preço é 1 passo para trás. Mas até os tropeços ensinam algo a quem presta atenção.';
        if (rng < 15) {
          result.collectiveEffect = {
            type: 'curse_all',
            message: '⚠️ Uma provação coletiva se abate como nuvem escura sobre todos os peregrinos! A perseverança de cada um é testada — todos perdem -1 em Perseverança. Resistam juntos!',
          };
        }
      }
      result.emoji = '🎁';
      break;
    case 'scripture':
      if (rng >= 35) {
        result.posAdjust = 2;
        result.attrChanges = { discernimento: 2, fe: 1 };
        result.message = narrative || '📖 As palavras sagradas se abrem como chave em fechadura — o entendimento inunda sua mente como rio que rompe represa! Discernimento +2, Fé +1, e o caminho à frente se ilumina com 2 passos de avanço!';
        result.statUpdate.scripturesCorrect = 1;
      } else {
        result.attrChanges = { discernimento: -1 };
        result.message = narrative || '📖 A resposta escapou como areia entre os dedos... As escrituras são profundas e nem sempre revelam seus segredos na primeira leitura. O discernimento diminui, mas a lição permanece.';
        result.statUpdate.scripturesWrong = 1;
      }
      result.emoji = '📖';
      break;
    case 'trap':
      if (player.hasShield) {
        result.message = '🛡️ A armadilha se arma com violência — mas o escudo da fé absorve o golpe como rocha absorve a chuva! O inimigo preparou o ataque, mas não contava com a proteção que você carrega!';
        result.emoji = '🛡️';
      } else if (passive?.type === 'trap_resistance' && checkPassive(passive, 'trap_resistance')) {
        result.message = `⚡ ${char!.passive.name}! O fardo que caiu na Cruz te protege — a armadilha se desarma diante de quem já foi liberto! ${player.name} ignora a armadilha!`;
        result.emoji = '⚡';
        result.passiveTriggered = `⚡ ${char!.passive.name} ativado!`;
      } else {
        result.posAdjust = -3;
        result.attrChanges = { perseveranca: -1 };
        result.message = narrative || '🔙 O chão cede sob seus pés! Uma armadilha engenhosamente disfarçada — quando você percebe, já caiu 3 casas para trás. A perseverança sangra, mas peregrinos de verdade se levantam.';
        result.emoji = '🔙';
        result.statUpdate.trapsHit = 1;
      }
      break;
    case 'giant':
      if (player.hasShield) {
        result.message = '🛡️ O Gigante ataca com fúria descomunal — mas seu escudo resplandece com luz que cega a criatura! O monstro recua urra de dor, incapaz de penetrar a proteção divina!';
        result.emoji = '🛡️';
      } else if (rng >= 70) {
        let stunAmount = 1;
        if (passive?.type === 'stun_reduction') {
          stunAmount = Math.max(0, stunAmount - passive.amount);
          result.passiveTriggered = `⚡ ${char!.passive.name}: A esperança brilha mesmo nas trevas! Paralisia reduzida!`;
        }
        result.stun = stunAmount > 0;
        result.stunTurns = stunAmount;
        result.message = narrative || '💀 O Gigante te captura com mãos do tamanho de troncos! Seus dedos se fecham como gaiolas de ferro. Você perde 1 turno preso em suas garras — ore para que a libertação venha antes que seja tarde.';
        result.emoji = '💀';
        result.statUpdate.giantsLost = 1;
      } else {
        result.resetToCheckpoint = true;
        result.attrChanges = { coragem: -2 };
        result.message = narrative || '💀 O golpe do Gigante é devastador — como montanha desabando. Seus ossos tremem, sua visão escurece. Quando acorda, está de volta ao último checkpoint, com a coragem em frangalhos. Mas viver para contar a história já é vitória.';
        result.emoji = '💀';
        result.statUpdate.giantsLost = 1;
      }
      break;
    case 'shield':
      result.shield = true;
      result.attrChanges = { coragem: 1 };
      result.message = narrative || '🛡️ A Armadura de Deus se materializa diante de seus olhos — cada peça pulsando com poder ancestral! Ao vesti-la, seus ombros se endireitam, sua coluna se firma. Você não é mais apenas um viajante — é um guerreiro protegido pelo próprio Criador.';
      result.emoji = '🛡️';
      result.statUpdate.shieldsGained = 1;
      break;
    case 'blessing': {
      let blessingMove = 4;
      if (passive?.type === 'faithful_stride') {
        blessingMove += passive.extraMove;
        result.passiveTriggered = `⚡ ${char!.passive.name}: Evangelista vê além! +${passive.extraMove} casa extra de avanço!`;
      }
      result.posAdjust = blessingMove;
      result.attrChanges = { fe: 2 };
      result.message = narrative || `⭐ Uma bênção inconfundível desce sobre você como chuva dourada em pleno deserto! O ar muda, o passo se torna leve, e o caminho que antes parecia infinito agora mostra ${blessingMove} casas a menos entre você e a glória. A fé explode como fogo sagrado!`;
      result.emoji = '⭐';
      result.statUpdate.blessingsReceived = 1;
      if (rng < 25) {
        result.collectiveEffect = {
          type: 'blessing_all',
          message: '🌟 A bênção é tão poderosa que irradia para todos os peregrinos como sol nascendo no horizonte! Todos ganham +1 em TODOS os atributos — porque quando Deus abençoa, Ele abençoa abundantemente!',
        };
      }
      break;
    }
    case 'swap': {
      const others = allPlayers.filter(p => p.id !== player.id && !p.finished);
      if (others.length > 0) {
        const target = others[Math.floor(Math.random() * others.length)];
        result.posAdjust = target.position - player.position;
        result.message = narrative || `🔄 O caminho se distorce como espelho d'água perturbado — quando a realidade se estabiliza, ${player.name} e ${target.name} percebem que trocaram de lugar! O destino tem senso de humor.`;
      } else {
        result.message = narrative || '🔄 Uma força tenta trocar seu lugar, mas não encontra com quem... Você permanece firme!';
      }
      result.emoji = '🔄';
      result.statUpdate.swapsTriggered = 1;
      break;
    }
    case 'double_dice':
      result.extraTurn = true;
      result.message = '🎲 Os dados tremem com energia sobrenatural — eles QUEREM ser lançados novamente! Uma segunda chance, uma jogada extra. O destino sorri para você: jogue novamente, peregrino!';
      result.emoji = '🎲';
      break;
    case 'current':
      if (rng >= 50) {
        result.posAdjust = 3;
        result.message = narrative || '🌊 Uma corrente poderosa — não de água, mas de propósito — agarra seus pés e te impulsiona adiante com força irresistível! 3 casas avançadas num instante glorioso! O vento está a seu favor!';
      } else {
        result.posAdjust = -2;
        result.message = narrative || '🌊 A correnteza vira traiçoeira sem aviso — o que parecia águas calmas revela força brutal na direção errada! 2 casas para trás antes que você consiga fincar os pés. A corrente não pede licença.';
      }
      result.emoji = '🌊';
      break;
    case 'checkpoint':
      result.attrChanges = { perseveranca: 1 };
      result.message = '🏰 Um marco de pedra se ergue no caminho — antigo, gravado com os nomes de mil peregrinos que passaram antes de você. Ao tocá-lo, sua posição é salva como âncora na rocha. Perseverança +1, pois quem chega até aqui não é qualquer um.';
      result.emoji = '🏰';
      break;
    case 'back_to_start':
      if (player.hasShield) {
        result.message = '🛡️ Uma força maligna tenta arrastá-lo de volta ao início — mas o escudo da fé irrompe em luz tão intensa que a maldição se despedaça como vidro! Você permanece firme. O inimigo uiva de frustração.';
        result.emoji = '🛡️';
      } else {
        result.resetToStart = true;
        result.stun = true;
        result.stunTurns = 1;
        result.attrChanges = { coragem: -2, perseveranca: -1 };
        result.message = '☠️ MALDIÇÃO DEVASTADORA! Uma força sombria — antiga e implacável — te agarra como corrente de ferro e te ARRASTA de volta ao início da jornada! Cada metro percorrido de volta é uma ferida na alma. Coragem despedaçada, perseverança em frangalhos. Mas lembre-se: peregrinos caem. Peregrinos de verdade se levantam.';
        result.emoji = '☠️';
        result.statUpdate.backToStartCount = 1;
      }
      break;
    // Narrative story tiles
    case 'wicket_gate':
      result.attrChanges = { fe: 1 };
      result.message = '🚪 A Porta Estreita! Boa Vontade abre com urgência: "Entre depressa, pois flechas do inimigo voam nesta direção!" A passagem é apertada, mas do outro lado, o ar é diferente — limpo, livre, cheio de promessa.';
      result.emoji = '🚪'; break;
    case 'interpreter_house':
      result.attrChanges = { discernimento: 2 };
      result.message = '🏛️ O Intérprete conduz vocês por salões repletos de quadros vivos que revelam verdades que os olhos carnais jamais perceberiam. Cada cômodo é uma revelação. Cada parede, um sermão.';
      result.emoji = '🏛️'; break;
    case 'hill_difficulty':
      result.attrChanges = { perseveranca: 1 };
      result.message = '⛰️ O Monte Dificuldade se ergue como muralha natural — íngreme, escorregadio, impiedoso. Mas cada metro escalado fortalece músculos que você nem sabia que tinha. No topo, a vista é recompensa que vale cada gota de suor.';
      result.emoji = '⛰️'; break;
    case 'palace_beautiful':
      result.attrChanges = { fe: 1, coragem: 1 };
      result.message = '🏰 O Palácio Belo! Prudência, Piedade e Caridade descem as escadarias com braços abertos e olhos brilhantes. Mesa farta, conversas profundas, armadura preparada. Aqui, peregrinos feridos se tornam guerreiros prontos.';
      result.emoji = '🏰'; break;
    case 'valley_humiliation':
      result.attrChanges = { coragem: -1 };
      result.message = '⚔️ O Vale da Humilhação se abre como goela de fera — e lá no fundo, asas de couro se desdobram. Apolião se levanta. Seus olhos são fornalhas, sua voz é terremoto. "AQUI É MEU TERRITÓRIO!"';
      result.emoji = '⚔️'; break;
    case 'valley_shadow':
      result.attrChanges = { fe: -1 };
      result.message = '💀 O Vale da Sombra da Morte engole a luz como boca faminta. À esquerda, pântano sem fundo. À direita, abismo sem fim. E por todos os lados, vozes que não são deste mundo sussurram coisas que congelam o sangue.';
      result.emoji = '💀'; break;
    case 'vanity_fair':
      result.message = '🎪 A Feira da Vaidade! Cada barraca é uma tentação perfeitamente embalada — riqueza, poder, prazer, fama — tudo com etiqueta de preço em forma de alma. O barulho é ensurdecedor. A sedução, quase irresistível.';
      result.emoji = '🎪'; break;
    case 'doubting_castle':
      result.attrChanges = { coragem: -2 }; result.stun = true; result.stunTurns = 1;
      result.message = '🏴 O Castelo da Dúvida! Gigante Desespero captura os peregrinos com mãos que parecem feitas da própria escuridão. Sua masmorra é fria, úmida, e cheira a desespero. "NINGUÉM SAI DAQUI", ele cospe. Mas no fundo do bolso... há uma chave.';
      result.emoji = '🏴'; break;
    case 'delectable_mountains':
      result.attrChanges = { fe: 2, discernimento: 1 };
      result.message = '🏔️ As Montanhas Deleitosas! Os pastores Conhecimento, Experiência, Vigia e Sincero mostram através de telescópios sagrados a Cidade Celestial brilhando no horizonte. O coração explode de saudade por um lugar onde ainda não esteve.';
      result.emoji = '🏔️'; break;
    case 'enchanted_ground':
      result.stun = true; result.stunTurns = 1;
      result.message = '😴 A Terra Encantada! O ar aqui é pesado como mel e doce como veneno. Os olhos pesam, as pernas amolecem. "Durma... descanse... esqueça a jornada..." — a tentação do conforto é o último teste antes da glória.';
      result.emoji = '😴'; break;
    case 'beulah_land':
      result.attrChanges = { fe: 2, coragem: 2, perseveranca: 1 };
      result.message = '🌸 Terra de Beulá! O ar é perfume vivo, flores eternas cobrem cada centímetro de chão, e a Cidade Celestial brilha tão perto que seus portões dourados já são visíveis a olho nu. Toda dor vivida na jornada começa a fazer sentido.';
      result.emoji = '🌸'; break;
    case 'slough_despond':
      result.attrChanges = { perseveranca: -1 }; result.posAdjust = -2;
      result.message = '🏚️ O Pântano do Desânimo! A lama não é feita de barro — é feita de culpa, dúvida e autopiedade. Cada passo afunda mais. As vozes no pântano conhecem seu nome e seus fracassos. 2 casas perdidas para o barro do desespero.';
      result.emoji = '🏚️'; break;
    case 'cross_sepulchre':
      result.attrChanges = { fe: 3, perseveranca: 1 };
      result.message = '✝️ A Cruz e o Sepulcro! Aqui, neste lugar sagrado, seu fardo — aquele peso impossível nas costas — se solta sozinho e rola morro abaixo até desaparecer para sempre numa fenda escura. Liberdade. Liberdade real. Lágrimas de uma alegria que não cabe em palavras.';
      result.emoji = '✝️'; break;
    case 'simple_sloth_presumption':
      result.stun = true; result.stunTurns = 1;
      result.message = '😴 Simples, Preguiça e Presunção! Três figuras acorrentadas dormem à beira do caminho — e suas correntes são contagiosas. O sono deles puxa o seu. Cuidado: a indiferença é a armadilha mais silenciosa de todas.';
      result.emoji = '😴'; break;
    case 'hill_lucre':
      result.attrChanges = { discernimento: -1 }; result.posAdjust = -2;
      result.message = '💰 A Mina de Demas! Prata brilha nas paredes como estrelas caídas. "Venham! Um desvio rápido! Fiquem ricos!" — mas o chão é traiçoeiro, e quem entra descobre que o brilho era isca. 2 passos perdidos para a ganância.';
      result.emoji = '💰'; break;
    case 'by_path_meadow':
      result.posAdjust = -3;
      result.message = '🌿 O Prado do Atalho! A grama é macia, o caminho parece mais fácil, e os pés agradecem. Mas atalhos na jornada da fé sempre cobram preço — e este cobra 3 casas de retrocesso quando o caminho suave termina em espinheiro.';
      result.emoji = '🌿'; break;
    case 'flatterer_net':
      result.posAdjust = -2; result.attrChanges = { discernimento: -1 };
      result.message = '🕸️ A Rede do Lisonjeiro! Palavras doces como mel envolvem seus ouvidos: "Vocês são tão fortes, tão sábios..." — mas cada elogio é um fio de teia. Quando percebe, está preso. 2 casas perdidas e o discernimento abalado.';
      result.emoji = '🕸️'; break;
    case 'atheist_encounter':
      result.attrChanges = { fe: -1 };
      result.message = '🤷 O Ateu surge rindo às gargalhadas: "Cidade Celestial? Eu procurei por vinte anos e nunca achei nada! Vocês são tolos!" Suas palavras são ácido na fé — mas tolos são os que desistem quando a Cidade já brilha no horizonte.';
      result.emoji = '🤷'; break;
    case 'ignorance_path':
      result.attrChanges = { discernimento: -1 };
      result.message = '🚶 Ignorância aparece por um atalho lateral, sorrindo com a confiança de quem nunca questionou nada. "Eu sei o caminho!", diz — sem jamais ter consultado o mapa. Seu exemplo é uma armadilha para o discernimento dos incautos.';
      result.emoji = '🚶'; break;
    case 'little_faith':
      result.attrChanges = { fe: -1, coragem: -1 };
      result.message = '😰 Pouca-Fé jaz caído à beira do caminho, roubado por Covarde, Desconfiança e Culpa. "Levaram minhas joias...", chora. "Levaram tudo menos minha salvação." Sua história é um aviso que pesa no coração e drena a coragem.';
      result.emoji = '😰'; break;
    case 'river_of_life':
      result.attrChanges = { fe: 1, perseveranca: 1 };
      result.message = '💧 O Rio da Vida! Águas cristalinas que parecem líquido de estrela — cada gole restaura o que pensava perdido, cada mergulho lava feridas que remédio nenhum curava. A alma bebe e se sacia de uma sede que carregava há jornadas inteiras.';
      result.emoji = '💧'; break;
    default:
      result.message = 'O caminho segue em silêncio... mas até o silêncio tem algo a ensinar ao peregrino atento.';
      result.emoji = '·';
  }
  return result;
}
