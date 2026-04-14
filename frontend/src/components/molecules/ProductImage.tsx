import { Package } from 'lucide-react';

interface ProductImageProps {
  imageUrl?: string;
  alt: string;
  className?: string;
}

export function ProductImage({ imageUrl, alt, className = '' }: ProductImageProps) {
  return (
    <div
      className={[
        'flex items-center justify-center overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-muted)]',
        className,
      ].join(' ')}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <Package size={44} className="text-[var(--color-ink-muted)]" />
      )}
    </div>
  );
}
