import { ContentImage } from '@/types/content';
import Image from 'next/image';

interface ImageGalleryProps {
  images: ContentImage[];
  layout?: 'grid' | 'carousel' | 'masonry';
  showCaptions?: boolean;
}

export default function ImageGallery({ 
  images, 
  layout = 'grid', 
  showCaptions = true 
}: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const getImageClass = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      case 'carousel':
        return 'flex overflow-x-auto space-x-4 pb-4';
      case 'masonry':
        return 'columns-2 md:columns-3 lg:columns-4 gap-4';
      default:
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
    }
  };

  return (
    <div className="my-8">
      <div className={getImageClass()}>
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''} ${layout === 'carousel' ? 'flex-none' : ''}`}
          >
            <div className="relative group">
              <Image
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                width={image.width || 300}
                height={image.height || 200}
                className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover w-full"
              />
              {showCaptions && image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
            {showCaptions && image.caption && layout !== 'carousel' && (
              <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
