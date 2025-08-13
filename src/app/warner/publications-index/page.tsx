import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Publications Index | NorthWorks',
  description: 'Complete index of academic publications, National Academy reports, and research papers by Dr. D. Warner North.',
  keywords: ['Warner North publications', 'National Academy reports', 'risk analysis papers', 'academic research']
};

// Parse publications from markdown content
function parsePublicationsFromMarkdown(content: string, images: any[]) {
  const publications: any[] = [];
  
  // Look for publication patterns in the content
  const bookMatches = content.match(/\[(.*?)\]\((.*?)\)/g) || [];
  const descriptionMatches = content.split(/National Academy Press|National Research Council/);
  
  bookMatches.forEach((match, index) => {
    const titleMatch = match.match(/\[(.*?)\]/);
    const linkMatch = match.match(/\((.*?)\)/);
    
    if (titleMatch && linkMatch) {
      publications.push({
        id: `pub-${index}`,
        title: titleMatch[1],
        link: linkMatch[1],
        type: 'book',
        publisher: 'National Academy Press'
      });
    }
  });
  
  return publications;
}

export default function PublicationsIndexPage() {
  const publicationsData = getContentBySlug('w_pub');
  const nrcData = getContentBySlug('w_projects_nrc');
  
  if (!publicationsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications Index</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = publicationsData.frontmatter as ContentFrontmatter;
  
  // Parse publications from the content
  const publications = parsePublicationsFromMarkdown(
    publicationsData.content, 
    (frontmatter as any).images || []
  );

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Publications Index', href: '/warner/publications-index', active: true }
  ];

  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Publications Index',
    breadcrumbs,
    navigation,
    seo: {
      title: metadata.title as string,
      description: metadata.description as string,
      keywords: metadata.keywords as string[]
    }
  };

  // Major National Academy reports
  const majorReports = [
    {
      title: 'Risk Assessment in the Federal Government: Managing the Process',
      year: '1983',
      pages: '191 pages',
      description: 'Foundational report on federal risk assessment methodology',
      link: 'http://www.nap.edu/catalog/366.html'
    },
    {
      title: 'Improving Risk Communication',
      year: '1989', 
      pages: '331 pages',
      description: 'Guidelines for effective communication of risk information',
      link: 'http://www.nap.edu/catalog/1189.html'
    },
    {
      title: 'Science and Judgment in Risk Assessment',
      year: '1994',
      pages: '651 pages', 
      description: 'Comprehensive framework for risk assessment methodology',
      link: 'http://www.nap.edu/catalog/2125.html'
    },
    {
      title: 'Understanding Risk: Informing Decisions in a Democratic Society',
      year: '1996',
      pages: '249 pages',
      description: 'Public participation in risk-based decision making',
      link: 'http://www.nap.edu/catalog/5138.html'
    },
    {
      title: 'Public Participation in Environmental Assessment and Decision Making',
      year: '2008',
      pages: '322 pages',
      description: 'Framework for inclusive environmental decision processes',
      link: 'http://www.nap.edu/catalog.php?record_id=12434'
    }
  ];

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications Index</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive collection of academic publications, National Academy reports, and research papers 
            spanning over 50 years of work in risk analysis and environmental policy.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-sm text-blue-800">Years Publishing</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
            <div className="text-sm text-green-800">NRC Reports</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
            <div className="text-sm text-purple-800">Academic Papers</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
            <div className="text-sm text-orange-800">Major Books</div>
          </div>
        </div>

        {/* Major National Academy Reports */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Major National Academy Reports</h2>
            <Link 
              href="/warner/publications" 
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              View All Publications →
            </Link>
          </div>
          
          <div className="grid gap-6">
            {majorReports.map((report, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <a 
                        href={report.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {report.title}
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {report.year}</span>
                      <span>📄 {report.pages}</span>
                      <span>🏛️ National Academy Press</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-6">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Major Report
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link 
            href="/warner/publications/risk-analysis"
            className="block bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Analysis Papers</h3>
              <p className="text-gray-600 text-sm">Peer-reviewed publications on quantitative risk assessment methods</p>
            </div>
          </Link>

          <Link 
            href="/warner/publications/environmental"
            className="block bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Environmental Policy</h3>
              <p className="text-gray-600 text-sm">Publications on environmental decision making and policy analysis</p>
            </div>
          </Link>

          <Link 
            href="/warner/publications/nuclear"
            className="block bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-red-300 transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nuclear Safety</h3>
              <p className="text-gray-600 text-sm">Research on nuclear waste management and reactor safety</p>
            </div>
          </Link>
        </div>

        {/* Recent Work */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibent text-gray-900 mb-6">Recent Publications (2010-2020)</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">Biotechnology Risk Assessment Review</h4>
              <p className="text-gray-600 text-sm">Peer reviewer for "Preparing for Future Products of Biotechnology" (2017)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">EPA Science Program Review</h4>
              <p className="text-gray-600 text-sm">Review of "Environmental Protection Agency's Science to Achieve Results Program" (2017)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">National Academies Continuing Work</h4>
              <p className="text-gray-600 text-sm">Ongoing contributions to National Research Council reports and reviews</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <Link 
              href="/warner"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to D. Warner North
            </Link>
            
            <div className="text-sm text-gray-500">
              Academic Publications & Research
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
