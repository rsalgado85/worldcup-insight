interface FlagImageProps {
  flag?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

export function FlagImage({ flag, alt = '', className = '', size = 'md' }: FlagImageProps) {
  if (!flag) return <span className={className || sizeMap[size]}>🏳</span>;
  return (
    <img
      src={flag}
      alt={alt}
      className={`${sizeMap[size]} object-cover rounded-sm ${className}`}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
        (e.target as HTMLImageElement).parentElement!.innerHTML = '🏳';
      }}
    />
  );
}
