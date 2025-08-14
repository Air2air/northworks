import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import NavigationCard from '@/components/ui/NavigationCard';
import type { NavigationCardProps } from '@/components/ui/NavigationCard';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// Local type definitions
interface StatItem {
  value: string;
  label: string;
  color: string;
}

interface QuickAccessItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}
import { 
  FaChartBar, 
  FaGlobe, 
  FaAtom, 
  FaUniversity, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaStar,
  FaBook
} from 'react-icons/fa';

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
          <PageTitle 
            title="Publications Index"
            description="Content not found"
            size="medium"
            align="center"
          />
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

  // Define statistics
  const stats: StatItem[] = [
    { value: '5', label: 'Major NRC Reports', color: 'blue' },
    { value: '50+', label: 'Research Papers', color: 'green' },
    { value: '25+', label: 'Years Publishing', color: 'purple' },
    { value: '3', label: 'Research Areas', color: 'orange' }
  ];

  // Quick access items
  const quickAccessItems: QuickAccessItem[] = [
    {
      title: 'Government Projects',
      description: 'EPA and federal agency work',
      href: '/warner/projects/government',
      icon: <FaUniversity className="text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Stanford Research',
      description: 'Academic publications and work',
      href: '/warner/stanford-index',
      icon: <FaBook className="text-red-600" />,
      color: 'red'
    },
    {
      title: 'National Academies',
      description: 'NRC committees and service',
      href: '/warner/nrc-index',
      icon: <FaStar className="text-purple-600" />,
      color: 'purple'
    }
  ];

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
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1" /> {report.year}
                      </span>
                      <span className="flex items-center">
                        <FaFileAlt className="mr-1" /> {report.pages}
                      </span>
                      <span className="flex items-center">
                        <FaUniversity className="mr-1" /> National Academy Press
                      </span>
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
          <NavigationCard
            title="Risk Analysis Papers"
            description="Peer-reviewed publications on quantitative risk assessment methods"
            href="/warner/publications/risk-analysis"
            icon={<FaChartBar className="text-blue-600" />}
            color="blue"
            size="medium"
          />
          <NavigationCard
            title="Environmental Policy"
            description="Publications on environmental decision making and policy analysis"
            href="/warner/publications/environmental"
            icon={<FaGlobe className="text-green-600" />}
            color="green"
            size="medium"
          />
          <NavigationCard
            title="Nuclear Safety"
            description="Research on nuclear waste management and reactor safety"
            href="/warner/publications/nuclear"
            icon={<FaAtom className="text-red-600" />}
            color="red"
            size="medium"
          />
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
