// Simplified and consolidated image types

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  type?: 'portrait' | 'landscape' | 'square' | 'thumbnail';
}

export interface ImageGalleryConfig {
  images: ImageAsset[];
  showCaptions?: boolean;
  layout?: 'float' | 'inline' | 'grid';
  priority?: boolean;
}

export interface OptimizedImageConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}
