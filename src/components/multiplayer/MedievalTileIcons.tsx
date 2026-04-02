/**
 * Medieval-themed SVG icons for board tiles
 */
import { TileType } from './ImmersiveBoardTypes';

interface IconProps {
  size?: number;
  color?: string;
  glowColor?: string;
}

function SvgIcon({ children, size = 28, color = '#fff', glowColor }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined }}
    >
      {children}
    </svg>
  );
}

// 🏠 Refuge - medieval cottage
function RefugeIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M16 4L3 14h4v12h18V14h4L16 4z" fill={p.color || '#4CAF50'} opacity={0.85}/>
      <rect x="13" y="18" width="6" height="8" rx="1" fill="#2E7D32"/>
      <rect x="8" y="16" width="4" height="4" rx="0.5" fill="#81C784" opacity={0.6}/>
      <path d="M16 4L3 14h4v12h18V14h4L16 4z" stroke={p.color || '#4CAF50'} strokeWidth="0.8" fill="none"/>
    </SvgIcon>
  );
}

// ⚔️ Challenge - crossed swords
function ChallengeIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <line x1="6" y1="6" x2="26" y2="26" stroke={p.color || '#EF5350'} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="26" y1="6" x2="6" y2="26" stroke={p.color || '#EF5350'} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="6" cy="6" r="2.5" fill={p.color || '#EF5350'} opacity={0.7}/>
      <circle cx="26" cy="6" r="2.5" fill={p.color || '#EF5350'} opacity={0.7}/>
      <circle cx="6" cy="26" r="2.5" fill={p.color || '#EF5350'} opacity={0.7}/>
      <circle cx="26" cy="26" r="2.5" fill={p.color || '#EF5350'} opacity={0.7}/>
      <circle cx="16" cy="16" r="3" fill={p.color || '#EF5350'} opacity={0.5}/>
    </SvgIcon>
  );
}

// 🎁 Surprise - treasure chest
function SurpriseIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect x="6" y="14" width="20" height="12" rx="2" fill={p.color || '#FFD54F'} opacity={0.85}/>
      <rect x="6" y="12" width="20" height="6" rx="2" fill={p.color || '#FFD54F'}/>
      <rect x="14" y="12" width="4" height="14" rx="1" fill="#F9A825" opacity={0.5}/>
      <circle cx="16" cy="19" r="2" fill="#F57F17"/>
      <path d="M8 12 Q16 6 24 12" stroke={p.color || '#FFD54F'} strokeWidth="1.5" fill="none"/>
    </SvgIcon>
  );
}

// 📖 Scripture - open book
function ScriptureIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M4 8v18c0 1 1 2 2 2h8V6H6C5 6 4 7 4 8z" fill={p.color || '#42A5F5'} opacity={0.8}/>
      <path d="M28 8v18c0 1-1 2-2 2h-8V6h8c1 0 2 1 2 2z" fill={p.color || '#42A5F5'} opacity={0.65}/>
      <line x1="16" y1="6" x2="16" y2="28" stroke="#fff" strokeWidth="0.8" opacity={0.4}/>
      <line x1="8" y1="12" x2="13" y2="12" stroke="#fff" strokeWidth="0.6" opacity={0.5}/>
      <line x1="8" y1="15" x2="12" y2="15" stroke="#fff" strokeWidth="0.6" opacity={0.5}/>
      <line x1="19" y1="12" x2="24" y2="12" stroke="#fff" strokeWidth="0.6" opacity={0.5}/>
      <line x1="19" y1="15" x2="23" y2="15" stroke="#fff" strokeWidth="0.6" opacity={0.5}/>
      <circle cx="16" cy="8" r="2.5" fill="#FFD54F" opacity={0.6}/>
    </SvgIcon>
  );
}

// 🔙 Trap - bear trap
function TrapIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <ellipse cx="16" cy="20" rx="10" ry="6" fill="none" stroke={p.color || '#AB47BC'} strokeWidth="2"/>
      <path d="M8 16l3 4M12 14l2 6M16 13v7M20 14l-2 6M24 16l-3 4" stroke={p.color || '#AB47BC'} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 20l-3 4M22 20l3 4" stroke={p.color || '#AB47BC'} strokeWidth="1.2" opacity={0.6}/>
    </SvgIcon>
  );
}

// 💀 Giant - skull
function GiantIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <circle cx="16" cy="14" r="10" fill={p.color || '#424242'} opacity={0.9}/>
      <ellipse cx="12" cy="12" rx="2.5" ry="3" fill="#000" opacity={0.8}/>
      <ellipse cx="20" cy="12" rx="2.5" ry="3" fill="#000" opacity={0.8}/>
      <ellipse cx="12" cy="12" rx="1.2" ry="1.5" fill="#EF5350" opacity={0.7}/>
      <ellipse cx="20" cy="12" rx="1.2" ry="1.5" fill="#EF5350" opacity={0.7}/>
      <path d="M12 19h8" stroke="#000" strokeWidth="1.5"/>
      <path d="M13 19v3M15 19v3M17 19v3M19 19v3" stroke="#000" strokeWidth="1" opacity={0.7}/>
      <path d="M16 15v3" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
    </SvgIcon>
  );
}

// 🛡️ Shield
function ShieldIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M16 3L5 8v8c0 7 5 12 11 14 6-2 11-7 11-14V8L16 3z" fill={p.color || '#B0BEC5'} opacity={0.85}/>
      <path d="M16 3L5 8v8c0 7 5 12 11 14 6-2 11-7 11-14V8L16 3z" stroke="#fff" strokeWidth="0.8" fill="none" opacity={0.3}/>
      <path d="M16 8l-6 3v5c0 4 3 7 6 8 3-1 6-4 6-8v-5l-6-3z" fill="#fff" opacity={0.15}/>
      <path d="M14 15l2 3 4-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.8}/>
    </SvgIcon>
  );
}

// ⭐ Blessing - radiant star
function BlessingIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <polygon points="16,2 19.5,11.5 29,12 22,19 24,29 16,24 8,29 10,19 3,12 12.5,11.5" fill={p.color || '#FFD54F'} opacity={0.9}/>
      <polygon points="16,7 18,13 24,13.5 19.5,18 21,24 16,20.5 11,24 12.5,18 8,13.5 14,13" fill="#fff" opacity={0.2}/>
    </SvgIcon>
  );
}

// 🔄 Swap - circular arrows
function SwapIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M22 10a8 8 0 01-1 11" stroke={p.color || '#E91E63'} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M10 22a8 8 0 01 1-11" stroke={p.color || '#E91E63'} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <polygon points="24,8 22,13 19,9" fill={p.color || '#E91E63'}/>
      <polygon points="8,24 10,19 13,23" fill={p.color || '#E91E63'}/>
    </SvgIcon>
  );
}

// 🎲 Double Dice
function DoubleDiceIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect x="3" y="8" width="14" height="14" rx="2.5" fill={p.color || '#FF7043'} opacity={0.85} transform="rotate(-10 10 15)"/>
      <rect x="15" y="10" width="14" height="14" rx="2.5" fill={p.color || '#FF7043'} opacity={0.65} transform="rotate(8 22 17)"/>
      <circle cx="8" cy="13" r="1.3" fill="#fff" opacity={0.7}/>
      <circle cx="12" cy="18" r="1.3" fill="#fff" opacity={0.7}/>
      <circle cx="22" cy="15" r="1.3" fill="#fff" opacity={0.7}/>
      <circle cx="24" cy="20" r="1.3" fill="#fff" opacity={0.7}/>
      <circle cx="20" cy="20" r="1.3" fill="#fff" opacity={0.7}/>
    </SvgIcon>
  );
}

// 🌊 Current - waves
function CurrentIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M3 14c3-3 6 0 9-3s6 0 9-3" stroke={p.color || '#26C6DA'} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M3 20c3-3 6 0 9-3s6 0 9-3" stroke={p.color || '#26C6DA'} strokeWidth="2" fill="none" strokeLinecap="round" opacity={0.6}/>
      <path d="M3 26c3-3 6 0 9-3s6 0 9-3" stroke={p.color || '#26C6DA'} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity={0.3}/>
    </SvgIcon>
  );
}

// 🏰 Checkpoint - castle tower
function CheckpointIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect x="10" y="10" width="12" height="18" fill={p.color || '#D4AF37'} opacity={0.85}/>
      <rect x="8" y="6" width="16" height="6" fill={p.color || '#D4AF37'}/>
      <rect x="8" y="4" width="3" height="4" fill={p.color || '#D4AF37'}/>
      <rect x="14.5" y="4" width="3" height="4" fill={p.color || '#D4AF37'}/>
      <rect x="21" y="4" width="3" height="4" fill={p.color || '#D4AF37'}/>
      <rect x="13" y="20" width="6" height="8" rx="3" fill="#8D6E3A"/>
      <circle cx="17.5" cy="24" r="0.8" fill="#FFD54F"/>
    </SvgIcon>
  );
}

// 🏠 Start - gate
function StartIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M6 28V12L16 4l10 8v16" stroke={p.color || '#D4AF37'} strokeWidth="2" fill="none"/>
      <rect x="12" y="18" width="8" height="10" rx="4" fill={p.color || '#D4AF37'} opacity={0.6}/>
      <path d="M6 12h20" stroke={p.color || '#D4AF37'} strokeWidth="1.5"/>
      <circle cx="16" cy="6" r="2" fill="#FFD54F" opacity={0.8}/>
    </SvgIcon>
  );
}

// ✨ Finish - crown
function FinishIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M4 24h24l-3-12-5 5-4-9-4 9-5-5-3 12z" fill={p.color || '#FFD700'} opacity={0.9}/>
      <rect x="4" y="24" width="24" height="4" rx="1" fill={p.color || '#FFD700'}/>
      <circle cx="8" cy="26" r="1.2" fill="#fff" opacity={0.4}/>
      <circle cx="16" cy="26" r="1.2" fill="#fff" opacity={0.4}/>
      <circle cx="24" cy="26" r="1.2" fill="#fff" opacity={0.4}/>
    </SvgIcon>
  );
}

// · Normal - simple path stone
function NormalIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <ellipse cx="16" cy="16" rx="8" ry="6" fill={p.color || '#666'} opacity={0.5}/>
      <ellipse cx="16" cy="15" rx="7" ry="5" fill={p.color || '#888'} opacity={0.3}/>
    </SvgIcon>
  );
}

// ─── Icon map ───
const ICON_MAP: Record<TileType, (p: IconProps) => JSX.Element> = {
  start: StartIcon,
  finish: FinishIcon,
  refuge: RefugeIcon,
  challenge: ChallengeIcon,
  surprise: SurpriseIcon,
  scripture: ScriptureIcon,
  trap: TrapIcon,
  giant: GiantIcon,
  shield: ShieldIcon,
  blessing: BlessingIcon,
  swap: SwapIcon,
  double_dice: DoubleDiceIcon,
  current: CurrentIcon,
  checkpoint: CheckpointIcon,
  back_to_start: TrapIcon,
  normal: NormalIcon,
  // Narrative story tiles — reuse thematic icons
  wicket_gate: StartIcon,
  interpreter_house: ScriptureIcon,
  hill_difficulty: ChallengeIcon,
  palace_beautiful: RefugeIcon,
  valley_humiliation: ChallengeIcon,
  valley_shadow: GiantIcon,
  vanity_fair: SurpriseIcon,
  doubting_castle: GiantIcon,
  delectable_mountains: BlessingIcon,
  enchanted_ground: TrapIcon,
  beulah_land: BlessingIcon,
};

export function MedievalTileIcon({ tileType, size = 28, color, glowColor }: { tileType: TileType } & IconProps) {
  const IconComponent = ICON_MAP[tileType] || NormalIcon;
  return <IconComponent size={size} color={color} glowColor={glowColor} />;
}
