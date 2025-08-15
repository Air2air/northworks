import Link from 'next/link';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';
import { PublicationFrontmatter } from '@/types/content';

export default function PublicationsIndexPage() {
  const slugs = getAllContentSlugs();
  
  // Filter for publication content only
  const publicationContent = slugs
    .map(slug => {
      const content = getContentBySlug(slug, false);
      if (content?.frontmatter.type === 'publication') {
        return {
          slug,
          frontmatter: content.frontmatter as PublicationFrontmatter
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Publications</h1>
        
        <div className="grid gap-6">
          {publicationContent.map((item) => item && (
            <div key={item.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <Link 
                  href={`/publications/${item.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.frontmatter.title}
                </Link>
              </h2>
              
              {item.frontmatter.publication && (
                <div className="text-gray-600 space-y-1">
                  {item.frontmatter.publication.publisher && (
                    <p><strong>Publisher:</strong> {item.frontmatter.publication.publisher}</p>
                  )}
                  {item.frontmatter.publication.date && (
                    <p><strong>Date:</strong> {item.frontmatter.publication.date}</p>
                  )}
                  {item.frontmatter.publication.author && (
                    <p><strong>Author:</strong> {item.frontmatter.publication.author}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/warner"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to D. Warner North
          </Link>
        </div>
      </div>
    </div>
  );
}
