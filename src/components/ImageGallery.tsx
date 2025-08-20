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
      <div className="sm:float-none sm:ml-0 sm:mb-8 sm:max-w-full md:float-right md:ml-6 md:mb-8" style={{ maxWidth: '300px' }}>
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} style={{ maxWidth: '300px', width: '100%' }}>
              <div className="relative group" style={{ maxWidth: '300px' }}>
                <Image
                  src={image.src}
                  alt={image.alt || `Image ${index + 1}`}
                  width={300}
                  height={200}
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
                  style={{ maxWidth: '300px', width: '100%', height: 'auto' }}
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
