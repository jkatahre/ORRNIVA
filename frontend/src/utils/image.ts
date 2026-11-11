import { IMAGE_FOLDERS } from '../data/imageIndex';

/** Resolve an image key to its full-size or small WebP path. */
const folderOf = (key: string) => IMAGE_FOLDERS[key] ?? IMAGE_FOLDERS[key.replace(/-detail$/, '')] ?? 'collections';

export function imageSrc(key: string, size: 'sm' | 'lg' = 'lg') {
  const folder = folderOf(key);
  return `/images/${folder}/${key}${size === 'sm' ? '-sm' : ''}.webp`;
}

export function imageSrcSet(key: string) {
  return `${imageSrc(key, 'sm')} 540w, ${imageSrc(key)} 1080w`;
}
