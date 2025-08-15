import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import { getAllContentSlugs, getContentBySlug } from '@/lib/content';
import { ProfessionalFrontmatter } from '@/types/content';

export default function ProfessionalIndexPage() {
  const slugs = getAllContentSlugs();
  
  // Filter for professional content only
  const professionalContent = slugs
    .map(slug => {
      const content = getContentBySlug(slug, false);
      if (content?.frontmatter.type === 'professional') {
        return {
          slug,
          frontmatter: content.frontmatter as ProfessionalFrontmatter
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <PageTitle 
          title="Professional Experience"
          description="Career history and professional accomplishments"
          align="left"
        />
        
        <div className="grid gap-6">
          {professionalContent.map((item) => item && (
            <div key={item.slug} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <Link 
                  href={`/professional/${item.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.frontmatter.title}
                </Link>
              </h2>
              
              {item.frontmatter.organization && (
                <p className="text-gray-600 mb-2">
                  <strong>Organization:</strong> {item.frontmatter.organization}
                </p>
              )}
              
              {item.frontmatter.position && (
                <p className="text-gray-600 mb-2">
                  <strong>Position:</strong> {item.frontmatter.position}
                </p>
              )}
              
              {item.frontmatter.duration && (
                <p className="text-gray-600">
                  <strong>Duration:</strong> {item.frontmatter.duration}
                </p>
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
