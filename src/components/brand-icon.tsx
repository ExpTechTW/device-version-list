import { 
  Smartphone, 
  Apple, 
  Chrome,
  Circle,
  Hexagon,
  Square,
  Triangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandIconProps {
  brand: string;
  className?: string;
  size?: number;
}

export function BrandIcon({ brand, className, size = 24 }: BrandIconProps) {
  const brandLower = brand.toLowerCase();
  
  // 使用不同的圖示和顏色來代表不同廠牌
  const brandConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
    'google': {
      icon: Chrome,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    'xiaomi': {
      icon: Circle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    'redmi': {
      icon: Circle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    'samsung': {
      icon: Hexagon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
    'oneplus': {
      icon: Square,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10'
    },
    'oppo': {
      icon: Circle,
      color: 'text-green-600',
      bgColor: 'bg-green-600/10'
    },
    'vivo': {
      icon: Triangle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    'ios': {
      icon: Apple,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-900/10 dark:bg-gray-100/10'
    },
    'iphone': {
      icon: Apple,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-900/10 dark:bg-gray-100/10'
    }
  };

  const config = brandConfig[brandLower] || {
    icon: Smartphone,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  };

  const Icon = config.icon;

  return (
    <div className={cn("p-2 rounded-lg transition-colors", config.bgColor, className)}>
      <Icon className={cn("transition-colors", config.color)} size={size} />
    </div>
  );
}

