"use client";

import OptimizedImage from '@/components/ui/OptimizedImage';

interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

interface SimpleImageGalleryProps {
  images: ContentImage[];
  showCaptions?: boolean;
  layout?: 'float' | 'inline' | 'grid';
}

export default function SimpleImageGallery({ 
  images, 
  showCaptions = true,
  layout = 'float'
}: SimpleImageGalleryProps) {
  if (!images?.length) return null;

  const containerClass = {
    float: 'float-right ml-6 mb-4 max-w-sm clear-right',
    inline: 'my-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 gap-4 my-6'
  }[layout];

  return (
    <div className={containerClass}>
      <div className="space-y-4">
        {images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <OptimizedImage
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              width={image.width || 300}
              height={image.height || 200}
              className="w-full h-auto"
              priority={index === 0}
            />
            {showCaptions && image.caption && (
              <figcaption className="p-3 text-sm text-gray-600">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
