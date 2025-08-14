import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  FaTrophy, 
  FaBook, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaUsers, 
  FaUniversity 
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'D. Warner North - National Academies Work | NorthWorks',
  description: 'Complete overview of Dr. D. Warner North\'s extensive work with the National Research Council, National Academy of Sciences, and related organizations.',
  keywords: ['Warner North National Academies', 'National Research Council', 'NAS', 'NAE', 'risk assessment reports', 'National Associate']
};

// Parse NRC activities and reports
function parseNRCActivities(content: string) {
  const activities: any[] = [];
  
  // Split by NRC logo markers
  const sections = content.split(/!\[.*?\]\(images\/logo_nrc\.gif\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const firstLine = lines[0].replace(/\*\*/g, '').trim();
      
      if (firstLine) {
        let title = firstLine;
        let description = '';
        let years = '';
        let reportTitle = '';
        let reportLink = '';
        
        // Extract committee/board name
        if (title.includes('****')) {
          const parts = title.split('****');
          title = parts[0].trim();
          if (parts[1]) {
            description = parts[1].trim();
          }
        }
        
        // Extract years from parentheses or text
        const yearMatch = section.match(/\(([^)]*\d{4}[^)]*)\)|(\d{4}[\s-]*\d{4})/);
        if (yearMatch) {
          years = yearMatch[1] || yearMatch[2];
        }
        
        // Extract report links
        const linkMatch = section.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          reportTitle = linkMatch[1];
          reportLink = linkMatch[2];
        }
        
        // Get full description
        const fullDescription = lines.slice(1)
          .join(' ')
          .replace(/\*\*/g, '')
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .trim();
        
        activities.push({
          id: `nrc-${index}`,
          title: title.substring(0, 80),
          description: description || fullDescription.substring(0, 200),
          years,
          reportTitle,
          reportLink,
          type: title.includes('Committee') ? 'committee' : 
                title.includes('Board') ? 'board' : 
                title.includes('Commission') ? 'commission' : 'other'
        });
      }
    }
  });
  
  return activities;
}

export default function NRCIndexPage() {
  const nrcData = getContentBySlug('w_projects_nrc');
  
  if (!nrcData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">National Academies Work</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = nrcData.frontmatter as ContentFrontmatter;
  const activities = parseNRCActivities(nrcData.content);
  
  // Categorize activities
  const committees = activities.filter(a => a.type === 'committee');
  const boards = activities.filter(a => a.type === 'board');
  const commissions = activities.filter(a => a.type === 'commission');
  const withReports = activities.filter(a => a.reportTitle && a.reportLink);

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'National Academies', href: '/warner/nrc-index', active: true }
  ];

  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'National Academies Work',
    breadcrumbs,
    navigation,
    seo: {
      title: metadata.title as string,
      description: metadata.description as string,
      keywords: metadata.keywords as string[]
    }
  };

  // Major reports with publication info
  const majorReports = [
    {
      title: 'Risk Assessment in the Federal Government: Managing the Process',
      year: '1983',
      pages: '191 pages',
      image: 'book_government.gif',
      link: 'http://www.nap.edu/catalog/366.html',
      description: 'Landmark report establishing federal risk assessment methodology'
    },
    {
      title: 'Improving Risk Communication',
      year: '1989',
      pages: '331 pages', 
      image: 'book_communication.gif',
      link: 'http://www.nap.edu/catalog/1189.html',
      description: 'Guidelines for effective public communication of risk information'
    },
    {
      title: 'Science and Judgment in Risk Assessment',
      year: '1994',
      pages: '651 pages',
      image: 'book_judgement.gif', 
      link: 'http://www.nap.edu/catalog/2125.html',
      description: 'Comprehensive framework for scientific risk assessment'
    },
    {
      title: 'Understanding Risk: Informing Decisions in a Democratic Society',
      year: '1996',
      pages: '249 pages',
      image: 'book_understanding.gif',
      link: 'http://www.nap.edu/catalog/5138.html',
      description: 'Public participation in risk-based decision making'
    },
    {
      title: 'Public Participation in Environmental Assessment and Decision Making',
      year: '2008',
      pages: '322 pages',
      image: 'public participation image.gif',
      link: 'http://www.nap.edu/catalog.php?record_id=12434',
      description: 'Framework for inclusive environmental decision processes'
    }
  ];

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with National Academies branding */}
        <div className="mb-12">
          <PageTitle
            title="The National Academies"
            description="50+ years of service to the nation's premier scientific advisory organizations, designated as a National Associate in 2003 for 'extraordinary contributions'"
            align="center"
            size="large"
          />
          <div className="text-center mb-8">
            <h2 className="text-2xl text-blue-600 font-semibold mb-4">
              National Research Council • National Academy of Sciences • National Academy of Engineering
            </h2>
          </div>

          {/* National Associate Honor */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                <FaTrophy />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">National Associate (2003)</h3>
            <p className="text-center text-gray-700 max-w-3xl mx-auto">
              Designated as a <strong>National Associate</strong> of the National Research Council in 2003 
              for "extraordinary contributions" to the work of the National Academies. Less than 1,000 people 
              have received this honor among the ~6,500 Academy members.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md border border-blue-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-sm text-blue-800">Years Service</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-blue-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{committees.length}</div>
            <div className="text-sm text-blue-800">Committees</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-blue-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{boards.length}</div>
            <div className="text-sm text-blue-800">Boards</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-blue-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{withReports.length}</div>
            <div className="text-sm text-blue-800">Major Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-blue-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2003</div>
            <div className="text-sm text-blue-800">National Associate</div>
          </div>
        </div>

        {/* Major Publications */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Major Publications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majorReports.map((report, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                {/* Book cover if available */}
                {(frontmatter as any).images && (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="text-6xl">
                      <FaBook className="text-blue-600" />
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    <a 
                      href={report.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {report.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" /> {report.year}
                    </span>
                    <span className="flex items-center">
                      <FaFileAlt className="mr-1" /> {report.pages}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Committees */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <div className="text-2xl">
                  <FaUsers className="text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Committee Service</h3>
                <p className="text-gray-600">Expert committees on specific topics</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Risk Assessment:</strong> Multiple committees on federal risk methodology
              </div>
              <div className="text-sm text-gray-600">
                <strong>Environmental:</strong> Hazardous air pollutants, particulate matter
              </div>
              <div className="text-sm text-gray-600">
                <strong>Nuclear Safety:</strong> Chemical munitions, radioactive waste
              </div>
              <div className="text-sm text-gray-600">
                <strong>Biotechnology:</strong> Recent work on biotech risk assessment
              </div>
            </div>
          </div>

          {/* Boards */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <div className="text-2xl">
                  <FaUniversity className="text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Board Leadership</h3>
                <p className="text-gray-600">Long-term advisory board service</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Radioactive Waste Management:</strong> Multiple board appointments
              </div>
              <div className="text-sm text-gray-600">
                <strong>Environmental Studies:</strong> Environmental toxicology boards
              </div>
              <div className="text-sm text-gray-600">
                <strong>Life Sciences:</strong> Biosafety and infectious disease work
              </div>
              <div className="text-sm text-gray-600">
                <strong>Transportation:</strong> Vehicle safety research committee chair
              </div>
            </div>
          </div>
        </div>

        {/* Timeline of Service */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Five Decades of Service</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                70s
              </div>
              <div className="text-sm font-medium text-gray-900">Early Career</div>
              <div className="text-xs text-gray-600">First NRC assignments</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                80s
              </div>
              <div className="text-sm font-medium text-gray-900">Foundation Work</div>
              <div className="text-xs text-gray-600">Federal risk assessment</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                90s
              </div>
              <div className="text-sm font-medium text-gray-900">Major Reports</div>
              <div className="text-xs text-gray-600">Risk communication</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                00s
              </div>
              <div className="text-sm font-medium text-gray-900">National Associate</div>
              <div className="text-xs text-gray-600">Extraordinary service</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                10s
              </div>
              <div className="text-sm font-medium text-gray-900">Continued Impact</div>
              <div className="text-xs text-gray-600">Recent reviews</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <Link 
              href="/warner/projects-index"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Projects Index
            </Link>
            
            <div className="flex space-x-4">
              <Link 
                href="/warner/publications-index"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                View Publications →
              </Link>
              <Link 
                href="/warner/stanford-index"
                className="text-red-600 hover:text-red-800 transition-colors font-medium"
              >
                Stanford Work →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
