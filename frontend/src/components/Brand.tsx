import type { ReactNode } from 'react';

export const brandAssetPaths = {
  mark: '/dwellsafe-brand.png',
  favicon: '/favicon.png',
} as const;

export type BrandIconId = keyof typeof brandAssetPaths;

export function BrandIcon({
  icon,
  className,
}: {
  icon: BrandIconId;
  className?: string;
}) {
  return <img className={className} src={brandAssetPaths[icon]} alt="" aria-hidden="true" />;
}

export function BrandLink({ children }: { children?: ReactNode }) {
  return (
    <a className="brand" href="/" aria-label="DwellSafe home">
      <BrandIcon icon="mark" />
      {children ?? <span className="brand-name">Dwell<span>Safe</span></span>}
    </a>
  );
}
