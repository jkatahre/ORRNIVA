import { useCallback, useState, type MouseEvent } from 'react';
import { Maximize2, X } from 'lucide-react';
import { imageSrc } from '../../utils/image';
import { Img } from '../common';
import { useEscape, useLockBody } from '../../hooks';

/** Product image: shows the main image only, with hover-zoom and a fullscreen viewer. */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const image = images[0];
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const closeFs = useCallback(() => setFullscreen(false), []);
  useEscape(fullscreen, closeFs);
  useLockBody(fullscreen);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  if (!image) return null;

  return (
    <div className="relative">
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden bg-cream"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setFullscreen(true)}
      >
        <Img
          key={image}
          imageKey={image}
          alt={name}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* hover zoom lens (desktop) */}
        {zoom && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block"
            style={{
              backgroundImage: `url(${imageSrc(image)})`,
              backgroundSize: '220%',
              backgroundPosition: `${zoom.x}% ${zoom.y}%`,
            }}
          />
        )}
        <span className="pointer-events-none absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/85 text-charcoal">
          <Maximize2 size={15} />
        </span>
      </div>

      {fullscreen && (
        <div role="dialog" aria-modal="true" aria-label={name} className="fixed inset-0 z-[90] flex animate-fade-in items-center justify-center bg-ink/95">
          <button onClick={closeFs} aria-label="Close" className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-ivory hover:bg-ivory/10">
            <X size={22} />
          </button>
          <img src={imageSrc(image)} alt={name} className="max-h-[88vh] max-w-[92vw] object-contain" />
        </div>
      )}
    </div>
  );
}
