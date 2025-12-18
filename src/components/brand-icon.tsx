import { Apple, Smartphone } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandIconProps {
  brand: string;
  className?: string;
  size?: number;
}

// 品牌 Logo URL (使用 Simple Icons CDN)
// Simple Icons CDN 支援 /iconname/color 格式，深色模式使用較亮的顏色
const brandLogos: Record<string, { lightLogo: string; darkLogo: string; bgColor: string }> = {
  'google': {
    lightLogo: 'https://cdn.simpleicons.org/google/4285F4',
    darkLogo: 'https://cdn.simpleicons.org/google/8AB4F8',
    bgColor: 'bg-blue-500/10'
  },
  'xiaomi': {
    lightLogo: 'https://cdn.simpleicons.org/xiaomi/FF6900',
    darkLogo: 'https://cdn.simpleicons.org/xiaomi/FF9F5A',
    bgColor: 'bg-orange-500/10'
  },
  'redmi': {
    lightLogo: 'https://cdn.simpleicons.org/xiaomi/FF0000',
    darkLogo: 'https://cdn.simpleicons.org/xiaomi/FF6666',
    bgColor: 'bg-red-500/10'
  },
  'samsung': {
    lightLogo: 'https://cdn.simpleicons.org/samsung/1428A0',
    darkLogo: 'https://cdn.simpleicons.org/samsung/6B9FFF',
    bgColor: 'bg-blue-600/10'
  },
  'oneplus': {
    lightLogo: 'https://cdn.simpleicons.org/oneplus/F5010C',
    darkLogo: 'https://cdn.simpleicons.org/oneplus/FF6B6B',
    bgColor: 'bg-red-600/10'
  },
  'oppo': {
    lightLogo: 'https://cdn.simpleicons.org/oppo/00A550',
    darkLogo: 'https://cdn.simpleicons.org/oppo/4ADE80',
    bgColor: 'bg-green-600/10'
  },
  'vivo': {
    lightLogo: 'https://cdn.simpleicons.org/vivo/415FFF',
    darkLogo: 'https://cdn.simpleicons.org/vivo/818CF8',
    bgColor: 'bg-blue-500/10'
  }
};

export function BrandIcon({ brand, className, size = 24 }: BrandIconProps) {
  const brandLower = brand.toLowerCase();

  // iOS/iPhone 使用 Lucide Apple 圖示
  if (brandLower === 'ios' || brandLower === 'iphone') {
    return (
      <div className={cn("p-2 rounded-lg bg-gray-900/10 dark:bg-gray-100/10", className)}>
        <Apple className="text-gray-900 dark:text-gray-100" size={size} />
      </div>
    );
  }

  // Android 預設圖示
  if (brandLower === 'android') {
    return (
      <div className={cn("p-2 rounded-lg bg-green-500/10", className)}>
        <Smartphone className="text-green-600 dark:text-green-400" size={size} />
      </div>
    );
  }

  const config = brandLogos[brandLower];

  if (config) {
    return (
      <div className={cn("p-2 rounded-lg flex items-center justify-center", config.bgColor, className)}>
        {/* Light mode logo */}
        <Image
          src={config.lightLogo}
          alt={`${brand} logo`}
          width={size}
          height={size}
          className="object-contain block dark:hidden"
          unoptimized
        />
        {/* Dark mode logo */}
        <Image
          src={config.darkLogo}
          alt={`${brand} logo`}
          width={size}
          height={size}
          className="object-contain hidden dark:block"
          unoptimized
        />
      </div>
    );
  }

  // 預設圖示
  return (
    <div className={cn("p-2 rounded-lg bg-primary/10", className)}>
      <Smartphone className="text-primary" size={size} />
    </div>
  );
}
