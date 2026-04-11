

# Plano de Implementação Completo — Modernização do Peregrino

## Resumo
Implementar os 5 itens de modernização + sistema de TTS em 2 camadas (Google Cloud TTS + ElevenLabs) + Web Speech API como fallback. Sem monetização/viralização (item 6 excluído conforme solicitado).

---

## Pré-requisitos de API

Antes de implementar o áudio, você precisará:

1. **Google Cloud TTS** — Criar conta no Google Cloud, ativar a API Text-to-Speech, gerar uma API key. O plano gratuito cobre 1M caracteres/mês (WaveNet). Exige cartão de crédito (não cobra dentro do limite).

2. **ElevenLabs** — Criar conta gratuita em elevenlabs.io. Copiar a API key do dashboard. 10k créditos grátis/mês — usados somente para 5-8 momentos épicos.

Ambas as keys serão armazenadas como secrets seguros no Lovable Cloud (via edge functions).

---

## Etapa 1: Beats Narrativos (Visual Novel Mode)

**O que muda:** Atualmente, cada item do array `narrative[]` aparece individualmente a cada clique. Isso causa "tap fatigue" com frases curtas, ou paredes de texto com frases longas.

**Solução:**
- Modificar `ScenePage.tsx` para agrupar automaticamente 2-3 frases consecutivas em um único "beat"
- Cada beat aparece com animação suave de fade-in por frase (com delay escalonado de 200ms entre cada linha)
- O botão "Continuar" avança o beat inteiro, não frase por frase
- Frases com markup especial (`{{shout}}`, `{{divine}}`, etc.) aparecem sozinhas como "beat solo" para manter o impacto dramático
- Adicionar indicador visual de progresso estilo "3/8 ✦" com barra sutil

**Arquivos:** `ScenePage.tsx` (lógica de agrupamento e renderização)

---

## Etapa 2: Momentos Épicos (5-8 cenas-chave)

**O que muda:** Cenas como a Cruz, Apolião e Cidade Celestial usam o mesmo layout de todas as outras cenas.

**Solução:**
- Criar componente `EpicMoment.tsx` — tela cheia imersiva com:
  - Background da cena com efeito parallax
  - Texto centralizado com tipografia dramática extra-grande
  - Interações especiais por momento (ex: segurar 3s na Cruz para "soltar o fardo", swipe para desviar de Apolião)
  - Música/SFX intensificados
- Cenas marcadas como épicas no `story.ts` via novo campo `epicMoment?: EpicMomentConfig`
- Cenas alvo: `cena15` (Cruz), `fase3-cena3/4/5` (Apolião), `fase4-cena6` (Julgamento de Fiel), `fase5-cena6` (Chave da Promessa), `fase6-cena8/9` (Cidade Celestial)
- Cada momento tem mecânica única (hold, swipe, tap rápido) integrada à narrativa

**Arquivos:** Novo `EpicMoment.tsx`, modificar `story.ts` (flags de cenas épicas), `ScenePage.tsx` (renderizar EpicMoment quando aplicável)

---

## Etapa 3: Recap Cinematográfico

**O que muda:** Ao abrir o app, o jogador vai direto para o menu sem contexto do que aconteceu antes.

**Solução:**
- Criar componente `CinematicRecap.tsx` com:
  - Fundo escuro com imagem da última cena visitada (blur suave)
  - Texto dramático de 1-2 frases: "Última vez: Você enfrentou Apolião e sobreviveu..."
  - Animação de typewriter lento + fade
  - Botão "Continuar Jornada" que leva direto à última cena
  - Exibido apenas quando `progress.visitedChapters.length > 2` e o jogador retorna após ausência
- Mapeamento de textos recap por fase/cena no `story.ts` (novo campo `recapText?: string`)

**Arquivos:** Novo `CinematicRecap.tsx`, modificar `Index.tsx` (mostrar recap ao retornar)

---

## Etapa 4: Diálogos com Tom de Voz

**O que muda:** Atualmente as escolhas são ações ("Fugir", "Enfrentar"). Falta a dimensão de COMO o jogador responde.

**Solução:**
- Adicionar opções de tom em cenas de diálogo selecionadas (8-12 cenas-chave) via novo campo `toneOptions` nas choices:
  ```
  toneOptions: [
    { tone: 'humble', emoji: '🙏', label: 'Com humildade', npcReaction: 'Evangelista sorri...' },
    { tone: 'firm', emoji: '😤', label: 'Com firmeza', npcReaction: 'Evangelista ergue a sobrancelha...' },
  ]
  ```
- O tom escolhido altera o texto de consequência e pode afetar atributos levemente
- UI: chips horizontais com emoji + label, seleção antes de confirmar a escolha principal

**Arquivos:** Modificar tipos em `story.ts`, adicionar toneOptions em 8-12 cenas, `ScenePage.tsx` (UI de seleção de tom)

---

## Etapa 5: Tela de Derrota Épica

**O que muda:** Quando o jogador falha (mini-game perdido, efeitos negativos), aparece apenas um toast simples com "-2 Coragem".

**Solução:**
- Criar componente `EpicDefeatScreen.tsx`:
  - Overlay full-screen com fundo vermelho escuro pulsante
  - Avatar do peregrino caído/ferido
  - Texto dramático contextual (ex: "Apolião ri enquanto você cai...")
  - Botão "Levantar-se" que exige **segurar 3 segundos** (barra de progresso circular)
  - Ao completar, animação de "levantar" com SFX de esperança
  - Pequeno bônus de +1 Perseverança por se levantar (recompensa pela resiliência)
- Disparado em falhas graves de mini-game ou quando atributos caem abaixo de threshold

**Arquivos:** Novo `EpicDefeatScreen.tsx`, modificar `ScenePage.tsx` (integrar em momentos de falha)

---

## Etapa 6: Sistema de TTS em 2 Camadas + Fallback

**Implementação em 3 partes:**

### 6a. Edge Function — Google Cloud TTS
- Criar `supabase/functions/google-tts/index.ts`
- Recebe texto + configuração de voz (WaveNet pt-BR)
- Suporta SSML para controle de emoção (`<prosody>`, `<emphasis>`, `<break>`)
- Retorna áudio MP3

### 6b. Edge Function — ElevenLabs TTS
- Criar `supabase/functions/elevenlabs-tts/index.ts`
- Usado apenas para momentos épicos (5-8 cenas)
- Modelo `eleven_multilingual_v2`, voz dramática PT-BR
- Voice settings ajustados por tipo de cena (stability baixa para drama)

### 6c. Hook `useTTS.ts` — Sistema de cascata no cliente
- Tenta ElevenLabs (se cena é épica e dentro do limite mensal)
- Fallback para Google Cloud TTS
- Fallback final para Web Speech API (já implementada)
- Cache de áudio em memória para evitar chamadas repetidas
- Botão de play/pause por beat narrativo
- Auto-play opcional (configurável pelo usuário)

### 6d. Integração no ScenePage
- Cada beat narrativo tem botão de áudio discreto (ícone de alto-falante)
- Momentos épicos auto-play com voz ElevenLabs
- Mapeamento de emoção por cena para SSML (tom solene, urgente, celestial)

**Arquivos:** 2 novas edge functions, novo `useTTS.ts`, modificar `ScenePage.tsx`

---

## Ordem de Implementação

1. **Beats Narrativos** — impacto imediato na experiência de leitura
2. **Tela de Derrota Épica** — componente isolado, sem dependências
3. **Recap Cinematográfico** — componente isolado
4. **Diálogos com Tom** — modificações nos dados + UI
5. **Momentos Épicos** — o mais complexo, depende dos beats
6. **Sistema TTS** — depende das API keys (você configura enquanto codifico os itens 1-5)

---

## Notas Técnicas

- Nenhuma alteração no avatar, layout base, fluxo de navegação ou funcionalidades existentes (conforme regra de integridade)
- Narrativa de Bunyan preservada — adaptações apenas no ritmo e apresentação
- Parte 1 e Parte 2 recebem as mesmas melhorias (paridade)
- Mini-games existentes mantidos — o recap pós-mini-game será adicionado para reconectar o jogador à narrativa
- Todas as cenas continuam funcionando normalmente mesmo sem TTS (fallback gracioso)

