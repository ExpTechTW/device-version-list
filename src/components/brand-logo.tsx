import { BrandIcon } from "./brand-icon";

interface BrandLogoProps {
  brand: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 20,
  md: 24,
  lg: 32
};

export function BrandLogo({ brand, size = 'md', showLabel = false, className }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <BrandIcon brand={brand} size={sizeMap[size]} />
      {showLabel && (
        <span className="font-medium">{brand}</span>
      )}
    </div>
  );
}

