import { getContentBySlug, getContentByType } from '@/lib/content';
import { InterviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import InterviewsListComponent, { parseInterviewsFromMarkdown } from '@/components/InterviewsListComponent';
import { cleanTitle } from '@/lib/pathUtils';
import Link from 'next/link';
import Image from 'next/image';

export default function InterviewsPage() {
  // Get both the interviews index and individual interviews
  const interviewsIndexData = getContentBySlug('c_interviews');
  const individualInterviews = getContentByType('interview');

  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Interviews', href: '/interviews', active: true }
  ];

  const mockFrontmatter = {
    id: 'interviews',
    title: 'Classical Music Interviews',
    type: 'article' as const,
    seo: {
      title: 'Classical Music Interviews - NorthWorks',
      description: 'Interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene.',
      keywords: ['classical music', 'interviews', 'opera', 'symphony', 'musicians']
    },
    navigation: defaultNavigation,
    breadcrumbs
  };

  // Parse interviews from the index if available
  let indexInterviews: any[] = [];
  if (interviewsIndexData) {
    const frontmatter = interviewsIndexData.frontmatter as InterviewFrontmatter;
    indexInterviews = parseInterviewsFromMarkdown(
      interviewsIndexData.content, 
      frontmatter.images || []
    );
  }

  return (
    <ContentLayout frontmatter={mockFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          title="Classical Music Interviews"
          description="Interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene."
          align="center"
          size="medium"
        />

        {/* Show index-based interviews if available */}
        {indexInterviews.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Featured Interview Collection</h2>
              <Link 
                href="/interviews" 
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                View Full Collection →
              </Link>
            </div>
            <InterviewsListComponent 
              interviews={indexInterviews.slice(0, 12)} // Show first 12
              title=""
              showThumbnails={true}
              layout="grid"
            />
          </div>
        )}

        {/* Show individual interview files */}
        {individualInterviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {indexInterviews.length > 0 ? 'Additional Interviews' : 'All Interviews'}
            </h2>
            <div className="grid gap-6">
              {individualInterviews.map((interview) => {
                const frontmatter = interview.frontmatter as InterviewFrontmatter;
                const heroImage = frontmatter.images?.[0];
                
                return (
                  <article key={interview.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      {heroImage && (
                        <div className="flex-shrink-0 w-48 h-32 relative">
                          <Image
                            src={heroImage.src}
                            alt={heroImage.alt || cleanTitle(frontmatter.title)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link 
                            href={`/interviews/${interview.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {cleanTitle(frontmatter.title)}
                          </Link>
                        </h3>
                        
                        {frontmatter.publication && (
                          <div className="text-sm text-gray-500 mb-3">
                            {frontmatter.publication.date && (
                              <span>{frontmatter.publication.date}</span>
                            )}
                            {frontmatter.publication.publisher && (
                              <span> • {frontmatter.publication.publisher}</span>
                            )}
                            {frontmatter.publication.author && (
                              <span> • By {frontmatter.publication.author}</span>
                            )}
                          </div>
                        )}

                        {frontmatter.subjects && frontmatter.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {frontmatter.subjects.slice(0, 5).map((subject, index) => (
                              <span 
                                key={index}
                                className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-gray-600 text-sm">
                          {interview.content.substring(0, 200).replace(/[#*_]/g, '')}...
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {indexInterviews.length === 0 && individualInterviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No interviews found.</p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
