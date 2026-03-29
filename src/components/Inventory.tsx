import { storyItems, StoryItem } from '@/data/items';
import { Backpack } from 'lucide-react';

interface InventoryProps {
  items: string[];
  compact?: boolean;
}

const rarityColors: Record<string, string> = {
  common: 'border-muted-foreground/30 bg-muted/30',
  rare: 'border-blue-500/30 bg-blue-500/10',
  legendary: 'border-primary/40 bg-primary/10 shadow-[0_0_10px_hsl(var(--primary)/0.15)]',
};

const Inventory = ({ items, compact = false }: InventoryProps) => {
  if (items.length === 0) return null;

  const resolvedItems = items.map(id => storyItems[id]).filter(Boolean);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {resolvedItems.map(item => (
          <span
            key={item.id}
            title={`${item.name}: ${item.description}`}
            className={`text-sm px-1.5 py-0.5 rounded border ${rarityColors[item.rarity]} cursor-help transition-transform hover:scale-110`}
          >
            {item.icon}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Backpack className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Inventário</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {resolvedItems.map(item => (
          <div
            key={item.id}
            className={`p-2.5 rounded-lg border ${rarityColors[item.rarity]} transition-all duration-300`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
