import { PlayerAttributes } from '@/hooks/useStoryProgress';

export type FinalResult = 'complete' | 'difficult' | 'incomplete';

export interface PerformanceAnalysis {
  result: FinalResult;
  title: string;
  message: string;
  details: string[];
  score: number;
}

export function analyzePerformance(
  attributes: PlayerAttributes,
  choicesMade: number,
  visitedChapters: string[],
  flags: Record<string, boolean>,
  endingType?: string
): PerformanceAnalysis {
  const { fe, perseveranca, discernimento, coragem } = attributes;
  const total = fe + perseveranca + discernimento + coragem;
  const avg = total / 4;

  // Incomplete: didn't reach the celestial city
  if (endingType === 'final_bad') {
    const details: string[] = [];
    if (fe <= 3) details.push("Sua fé foi abalada ao longo do caminho.");
    if (coragem <= 3) details.push("O medo impediu você de avançar nos momentos decisivos.");
    if (perseveranca <= 3) details.push("Faltou persistência para superar os obstáculos.");
    if (details.length === 0) details.push("A jornada exigiu mais do que você estava preparado para dar.");

    return {
      result: 'incomplete',
      title: 'Jornada Interrompida',
      message: 'Você não conseguiu concluir a jornada. Mas cada passo dado foi uma lição. A estrada ainda espera por você.',
      details,
      score: Math.round((avg / 15) * 100),
    };
  }

  // Complete with difficulty: reached the end but struggled
  if (avg < 6 || fe < 5 || perseveranca < 5) {
    const details: string[] = [];
    details.push("Você chegou ao final, mas o caminho foi marcado por tropeços.");
    if (fe < 5) details.push("Sua fé vacilou em momentos cruciais.");
    if (perseveranca < 5) details.push("A perseverança foi testada além dos seus limites.");
    if (discernimento < 5) details.push("Algumas decisões poderiam ter sido mais sábias.");
    if (coragem < 5) details.push("O medo influenciou algumas das suas escolhas.");
    if (flags['escolheu_caminho_facil']) details.push("Escolher o caminho fácil teve consequências duradouras.");
    if (flags['ignorou_inquietacao']) details.push("Ignorar a inquietação inicial tornou o caminho mais difícil.");

    return {
      result: 'difficult',
      title: 'Jornada com Provações',
      message: 'Você chegou ao final, mas com muitas falhas no caminho. Sua jornada foi marcada por dúvidas e tropeços — mas você não desistiu.',
      details,
      score: Math.round((avg / 15) * 100),
    };
  }

  // Complete: strong performance
  const details: string[] = [];
  details.push("Você completou a jornada com firmeza e consistência.");
  if (fe >= 8) details.push("Sua fé foi inabalável nos momentos mais difíceis.");
  if (perseveranca >= 8) details.push("Sua perseverança te sustentou quando tudo parecia impossível.");
  if (discernimento >= 8) details.push("Seu discernimento guiou suas decisões com sabedoria.");
  if (coragem >= 8) details.push("Sua coragem nunca falhou, mesmo diante do desconhecido.");
  if (flags['entrou_casa_interprete']) details.push("As lições do Intérprete foram fundamentais para sua jornada.");
  if (flags['enfrentou_presenca']) details.push("Enfrentar o vale provou a força da sua decisão.");
  if (flags['aceitou_custo_feira']) details.push("Na feira, você mostrou que o propósito vale mais que o conforto.");
  if (flags['escapou_castelo_fe']) details.push("A fé foi sua chave no castelo da dúvida.");
  if (flags['confiou_rio']) details.push("Confiar no rio final selou sua jornada com convicção.");

  return {
    result: 'complete',
    title: 'Jornada Completa',
    message: 'Você completou a jornada com firmeza e consistência. Suas decisões moldaram um caminho de fé, coragem e perseverança.',
    details,
    score: Math.round((avg / 15) * 100),
  };
}
