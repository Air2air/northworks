import { getContentBySlug, getContentByType } from '@/lib/content';
import { ArticleFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import { PageTitle } from '@/components/ui';
import ContentListComponent, { parseArticlesFromMarkdown } from '@/components/ContentListComponent';
import { cleanTitle } from '@/lib/pathUtils';
import Link from 'next/link';
import Image from 'next/image';

export default function ArticlesPage() {
  // Get both the articles index and individual articles
  const articlesIndexData = getContentBySlug('c_articles');
  const individualArticles = getContentByType('article');

  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Articles', href: '/articles', active: true }
  ];

  const mockFrontmatter = {
    id: 'articles',
    title: 'Articles & Features',
    type: 'article' as const,
    seo: {
      title: 'Music Articles & Features - NorthWorks',
      description: 'In-depth articles about classical music, performers, and the music industry.',
      keywords: ['classical music articles', 'music features', 'music journalism', 'performer profiles']
    },
    navigation: defaultNavigation,
    breadcrumbs
  };

  // Parse articles from the index if available
  let indexArticles: any[] = [];
  if (articlesIndexData) {
    const frontmatter = articlesIndexData.frontmatter as ArticleFrontmatter;
    indexArticles = parseArticlesFromMarkdown(
      articlesIndexData.content, 
      frontmatter.images || []
    );
  }

  return (
    <ContentLayout frontmatter={mockFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          title="Articles & Features"
          description="In-depth articles and feature stories about classical music, performers, and the cultural landscape of the performing arts."
          align="center"
          size="medium"
        />

        {/* Show index-based articles if available */}
        {indexArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Featured Articles Collection</h2>
              <Link 
                href="/articles-index" 
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                View Full Collection →
              </Link>
            </div>
            <ContentListComponent 
              items={indexArticles.slice(0, 8)} // Show first 8
              title=""
              showThumbnails={true}
              layout="grid"
              contentType="articles"
            />
          </div>
        )}

        {/* Show individual article files */}
        {individualArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {indexArticles.length > 0 ? 'Additional Features' : 'All Articles'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {individualArticles.map((article) => {
                const frontmatter = article.frontmatter as ArticleFrontmatter;
                const heroImage = frontmatter.images?.[0];
                
                return (
                  <article key={article.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {heroImage && (
                      <div className="aspect-video relative">
                        <Image
                          src={heroImage.src}
                          alt={heroImage.alt || cleanTitle(frontmatter.title)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/articles/${article.slug}`}
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
                          {frontmatter.subjects.slice(0, 3).map((subject, index) => (
                            <span 
                              key={index}
                              className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.content.substring(0, 150).replace(/[#*_]/g, '')}...
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {indexArticles.length === 0 && individualArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found.</p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
