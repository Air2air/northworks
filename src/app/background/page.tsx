import Link from 'next/link';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';
import { BackgroundFrontmatter } from '@/types/content';

export default function BackgroundIndexPage() {
  const slugs = getAllContentSlugs();
  
  // Filter for background content only
  const backgroundContent = slugs
    .map(slug => {
      const content = getContentBySlug(slug, false);
      if (content?.frontmatter.type === 'background') {
        return {
          slug,
          frontmatter: content.frontmatter as BackgroundFrontmatter
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Background Information</h1>
        
        <div className="grid gap-6">
          {backgroundContent.map((item) => item && (
            <div key={item.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <Link 
                  href={`/background/${item.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.frontmatter.title}
                </Link>
              </h2>
              
              {(item.frontmatter.profession || item.frontmatter.education || item.frontmatter.affiliations) && (
                <div className="text-gray-600 space-y-1">
                  {item.frontmatter.profession && (
                    <p><strong>Profession:</strong> {item.frontmatter.profession}</p>
                  )}
                  {item.frontmatter.education && (
                    <p><strong>Education:</strong> {item.frontmatter.education}</p>
                  )}
                  {item.frontmatter.affiliations && (
                    <p><strong>Affiliations:</strong> {item.frontmatter.affiliations.join(', ')}</p>
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
