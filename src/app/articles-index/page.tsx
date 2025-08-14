import { getContentBySlug } from '@/lib/content';
import { ArticleFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import { PageTitle } from '@/components/ui';
import ContentListComponent, { parseArticlesFromMarkdown } from '@/components/ContentListComponent';

export default function ArticlesIndexPage() {
  // Get the articles index content
  const articlesData = getContentBySlug('c_articles');
  
  if (!articlesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = articlesData.frontmatter as ArticleFrontmatter;
  
  // Parse the articles from the markdown content
  const articles = parseArticlesFromMarkdown(
    articlesData.content, 
    frontmatter.images || []
  );

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Articles', href: '/articles', active: true }
  ];

  // Enhanced frontmatter for layout
  const enhancedFrontmatter = {
    ...frontmatter,
    title: 'Classical Music Articles',
    seo: {
      title: 'Classical Music Articles - Cheryl North - NorthWorks',
      description: 'Feature articles about classical music, opera, composers, and musical trends by music journalist Cheryl North.',
      keywords: ['classical music articles', 'opera articles', 'music features', 'composer profiles', 'musical analysis', 'Cheryl North']
    },
    breadcrumbs
  };

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {frontmatter.images?.[0] && (
            <div className="mb-6">
              <img
                src={`/${frontmatter.images[0].src}`}
                alt="Articles"
                className="mx-auto"
                width={frontmatter.images[0].width}
                height={frontmatter.images[0].height}
              />
            </div>
          )}
          
          <div className="max-w-3xl mx-auto">
            <PageTitle
              title="Classical Music Articles"
              description="In-depth feature articles exploring classical music trends, composer profiles, opera productions, and the cultural impact of music in our lives"
              align="center"
              size="large"
            />
            
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About the Articles</h3>
              <p className="text-blue-800">
                These feature articles delve deeper into the world of classical music, covering everything 
                from world premieres and composer spotlights to the intersection of technology and music. 
                Many were originally published in Bay Area News Group publications and international magazines.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{articles.length}</div>
            <div className="text-gray-600">Feature Articles</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">Opera</div>
            <div className="text-gray-600">& Symphony</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
            <div className="text-gray-600">Years Span</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">Global</div>
            <div className="text-gray-600">Perspective</div>
          </div>
        </div>

        {/* Articles List */}
        <ContentListComponent 
          items={articles}
          title=""
          showThumbnails={false}
          layout="list"
          contentType="articles"
        />

        {/* Topics Covered */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Topics Covered</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="text-gray-700">World Premieres</div>
            <div className="text-gray-700">Composer Profiles</div>
            <div className="text-gray-700">Opera Productions</div>
            <div className="text-gray-700">Music & Technology</div>
            <div className="text-gray-700">Cultural Analysis</div>
            <div className="text-gray-700">Musical Trends</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Articles originally published in Bay Area News Group publications, ANG Newspapers, 
            and international publications including Opera Now (UK).
          </p>
        </div>
      </div>
    </ContentLayout>
  );
}
