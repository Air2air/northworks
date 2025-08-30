"use client";

import OptimizedImage from '@/components/ui/OptimizedImage';

interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

interface ImageGalleryProps {
  images: ContentImage[];
  showCaptions?: boolean;
  inline?: boolean;
}

export default function ImageGallery({ 
  images, 
  showCaptions = true,
  inline = true
}: ImageGalleryProps) {
  console.log('ImageGallery: received images:', images);
  
  if (!images?.length) {
    console.log('ImageGallery: no images found');
    return null;
  }

  // Use different layouts based on inline prop
  const containerClasses = inline 
    ? "float-right ml-6 mb-4 max-w-sm clear-right"
    : "my-6 max-w-full";

  return (
    <aside className={containerClasses}>
      <div className="space-y-4">
        {images.map((image, index) => (
          <figure 
            key={`${image.src}-${index}`} 
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
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
    </aside>
  );
}
