import { ContentImage } from '@/types/content';
import Image from 'next/image';

interface ImageGalleryProps {
  images: ContentImage[];
  showCaptions?: boolean;
  inline?: boolean;
}

export default function ImageGallery({ 
  images, 
  showCaptions = true,
  inline = false
}: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // For inline floating images
  if (inline) {
    return (
      <div className="float-right ml-4 mb-4 max-w-[200px] sm:max-w-[280px] sm:ml-6">
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="w-full">
              <div className="relative group w-full">
                <Image
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  width={280}
                  height={0}
                  sizes="(max-width: 640px) 200px, 280px"
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                  style={{ 
                    width: 'auto',
                    height: 'auto' 
                  }}
                />
                {showCaptions && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs sm:text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
              {showCaptions && image.caption && (
                <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default gallery layout (non-inline)
  return (
    <div className="my-8">
      <div className="space-y-4">
        {images.map((image, index) => (
          <div key={index}>
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
            {showCaptions && image.caption && (
              <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
