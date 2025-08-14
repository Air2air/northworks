import { getContentBySlug } from '@/lib/content';
import { InterviewFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import { PageTitle } from '@/components/ui';
import InterviewsListComponent, { parseInterviewsFromMarkdown } from '@/components/InterviewsListComponent';

export default function InterviewsIndexPage() {
  // Get the interviews index content
  const interviewsData = getContentBySlug('c_interviews');
  
  if (!interviewsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interviews</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = interviewsData.frontmatter as InterviewFrontmatter;
  
  // Parse the interviews from the markdown content
  const interviews = parseInterviewsFromMarkdown(
    interviewsData.content, 
    frontmatter.images || []
  );

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Interviews', href: '/interviews', active: true }
  ];

  // Enhanced frontmatter for layout
  const enhancedFrontmatter = {
    ...frontmatter,
    title: 'Classical Music Interviews',
    seo: {
      title: 'Classical Music Interviews - Cheryl North - NorthWorks',
      description: 'Comprehensive collection of interviews with major figures in classical music, opera, and symphony by music journalist Cheryl North.',
      keywords: ['classical music interviews', 'opera singers', 'conductors', 'musicians', 'Cheryl North', 'San Francisco Opera', 'San Francisco Symphony']
    },
    breadcrumbs
  };

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {frontmatter.images?.[0] && (
            <div className="mb-6">
              <img
                src={`/${frontmatter.images[0].src}`}
                alt="Interviews"
                className="mx-auto"
                width={frontmatter.images[0].width}
                height={frontmatter.images[0].height}
              />
            </div>
          )}
          
          <PageTitle
            title="Classical Music Interviews"
            description="Profile interviews with major figures on the international, national, and local San Francisco Bay Area classical music scene"
            align="center"
            size="large"
          />
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About the Collection</h3>
              <p className="text-blue-800">
                This collection features interviews with renowned classical musicians, opera singers, 
                conductors, and composers. Many of these interviews were originally published in the 
                Oakland Tribune and other Bay Area News Group publications.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{interviews.length}</div>
            <div className="text-gray-600">Total Interviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
            <div className="text-gray-600">Years of Coverage</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">SF Bay</div>
            <div className="text-gray-600">Area Focus</div>
          </div>
        </div>

        {/* Interviews Grid */}
        <InterviewsListComponent 
          interviews={interviews}
          title=""
          showThumbnails={true}
          layout="grid"
        />

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Interviews originally published in various publications including the Oakland Tribune, 
            San Francisco Examiner, and Bay Area News Group papers.
          </p>
        </div>
      </div>
    </ContentLayout>
  );
}
