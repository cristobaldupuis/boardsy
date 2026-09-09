import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Backpack,
  Briefcase,
  Bus,
  Coffee,
  Coins,
  Droplets,
  Heart,
  Home,
  Landmark,
  Layers,
  Leaf,
  Plane,
  Ship,
  Snowflake,
  Sparkles,
  Thermometer,
  TrainFront,
  Trees,
  Utensils,
  Wifi,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const GLYPH_ICONS: Record<string, LucideIcon> = {
  "arrow-up": ArrowUp,
  "arrow-right": ArrowRight,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  plane: Plane,
  train: TrainFront,
  bus: Bus,
  ship: Ship,
  backpack: Backpack,
  briefcase: Briefcase,
  home: Home,
  trees: Trees,
  wine: Wine,
  utensils: Utensils,
  zap: Zap,
  drop: Droplets,
  wifi: Wifi,
  thermo: Thermometer,
  mug: Coffee,
  leaf: Leaf,
  snow: Snowflake,
  bank: Landmark,
  coins: Coins,
  draw: Layers,
  spark: Sparkles,
  heart: Heart,
};

export const STATION_GLYPH_OPTIONS = ["plane", "train", "bus", "ship", "backpack", "briefcase", "home", "trees"];
export const UTILITY_GLYPH_OPTIONS = ["zap", "drop", "wifi", "thermo", "mug", "utensils", "leaf", "snow"];
export const BANK_GLYPH_OPTIONS = ["bank", "coins"];
export const DRAW_GLYPH_OPTIONS = ["draw", "spark", "heart"];

export function Glyph({ id, className }: { id?: string; className?: string }) {
  if (!id) return null;
  const Icon = GLYPH_ICONS[id];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={1.6} />;
}
