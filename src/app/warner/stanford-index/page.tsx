import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import { PageTitle } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  FaCalendarAlt, 
  FaGraduationCap, 
  FaUsers, 
  FaGlobe 
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'D. Warner North - Stanford University Work | NorthWorks',
  description: 'Complete overview of Dr. D. Warner North\'s 35+ years at Stanford University including teaching, research, and academic contributions.',
  keywords: ['Warner North Stanford', 'Stanford University', 'Management Science Engineering', 'decision analysis teaching', 'academic research']
};

// Parse Stanford activities from markdown
function parseStanfordActivities(content: string) {
  const activities: any[] = [];
  
  // Split by Stanford logo markers
  const sections = content.split(/!\[.*?\]\(images\/logo_stan\.gif\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const firstLine = lines[0].replace(/\*\*/g, '').trim();
      
      if (firstLine) {
        // Extract course/activity info
        let title = firstLine;
        let description = '';
        let courseNumber = '';
        let years = '';
        
        // Look for course numbers like "MS&E 453"
        const courseMatch = firstLine.match(/(Management Science and Engineering|MS&E|Biology|EES&OR)\s*(\d+)/);
        if (courseMatch) {
          courseNumber = courseMatch[0];
        }
        
        // Extract years from parentheses
        const yearMatch = section.match(/\(([^)]*\d{4}[^)]*)\)/);
        if (yearMatch) {
          years = yearMatch[1];
        }
        
        // Get description from remaining content
        description = lines.slice(1)
          .join(' ')
          .replace(/\*\*/g, '')
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .trim()
          .substring(0, 300);
        
        activities.push({
          id: `stanford-${index}`,
          title: title.substring(0, 80),
          description,
          courseNumber,
          years,
          type: courseNumber ? 'course' : firstLine.includes('research') ? 'research' : 'service'
        });
      }
    }
  });
  
  return activities;
}

export default function StanfordIndexPage() {
  const stanfordData = getContentBySlug('w_projects_stanford');
  
  if (!stanfordData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Stanford University Work</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = stanfordData.frontmatter as ContentFrontmatter;
  const activities = parseStanfordActivities(stanfordData.content);
  
  // Categorize activities
  const courses = activities.filter(a => a.type === 'course');
  const research = activities.filter(a => a.type === 'research');
  const service = activities.filter(a => a.type === 'service');

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Stanford University', href: '/warner/stanford-index', active: true }
  ];

  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Stanford University Work',
    breadcrumbs,
    navigation,
    seo: {
      title: metadata.title as string,
      description: metadata.description as string,
      keywords: metadata.keywords as string[]
    }
  };

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Stanford branding */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            {/* Stanford Logo if available */}
            {(frontmatter as any).images && (frontmatter as any).images.length > 8 && (
              <Image
                src={`/${(frontmatter as any).images[8].src}`}
                alt="Stanford University"
                width={(frontmatter as any).images[8].width || 220}
                height={(frontmatter as any).images[8].height || 175}
                className="mx-auto"
              />
            )}
          </div>
          <PageTitle
            title="Stanford University"
            description="35+ years of academic service (1976-2009) as Consulting Associate Professor and Consulting Professor"
            align="center"
            size="large"
          />
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl text-red-600 font-semibold mb-4">Department of Management Science and Engineering</h2>
          </div>
        </div>

        {/* Career Timeline */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Academic Career Timeline</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1976
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consulting Associate Professor</h3>
              <p className="text-gray-600 text-sm">Began academic appointment in Management Science & Engineering</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1988
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consulting Professor</h3>
              <p className="text-gray-600 text-sm">Promotion to full Consulting Professor status</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2009
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professor Emeritus</h3>
              <p className="text-gray-600 text-sm">Completion of 33 years of distinguished service</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">33</div>
            <div className="text-sm text-red-800">Years Service</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{courses.length}</div>
            <div className="text-sm text-red-800">Courses Taught</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">100+</div>
            <div className="text-sm text-red-800">Students Mentored</div>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">1966</div>
            <div className="text-sm text-red-800">First DA Course TA</div>
          </div>
        </div>

        {/* Course Offerings */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Offerings & Teaching</h2>
          <div className="grid gap-6">
            {/* Featured Courses */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    MS&E 453: Decision Analysis Applications
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Graduate/upper-level undergraduate seminar on applications of decision analysis to medicine, 
                    energy, and environmental protection (with Professor Burke Robinson)
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" /> 2006-2012
                    </span>
                    <span className="flex items-center">
                      <FaGraduationCap className="mr-1" /> Graduate/Undergraduate
                    </span>
                    <span className="flex items-center">
                      <FaUsers className="mr-1" /> Team-taught
                    </span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Featured Course
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    MS&E 290: Public Policy Analysis
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Graduate class on public policy analysis with applications in national security, health, 
                    energy, and environment (co-taught with William Perry, John Weyant, Ross Shachter)
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" /> 2003-2005
                    </span>
                    <span className="flex items-center">
                      <FaGraduationCap className="mr-1" /> Graduate
                    </span>
                    <span className="flex items-center">
                      <FaUsers className="mr-1" /> Multi-professor team
                    </span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Policy Focus
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Biology 155: Environmental Health Policy
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Graduate/upper-level undergraduate seminar on environmental health policy 
                    (co-taught with Donald Kennedy, President Emeritus)
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" /> 1995-1996
                    </span>
                    <span className="flex items-center">
                      <FaGraduationCap className="mr-1" /> Interdisciplinary
                    </span>
                    <span className="flex items-center">
                      <FaGlobe className="mr-1" /> Environmental Focus
                    </span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Environmental
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Research & Academic Contributions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Research Supervision</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Graduate student research supervision in decision analysis applications</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Forest and fishery resource management projects</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Communications satellite planning analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Medical treatment decision analysis applications</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Academic Service</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Guest lecturer for graduate-level decision analysis courses</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Summer executive seminar program participation</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Teaching assistant to Professor Ronald A. Howard (1966)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Curriculum development in decision science applications</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Historical Significance */}
        <div className="bg-red-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibent text-gray-900 mb-4">Historical Note</h2>
          <p className="text-gray-700 text-lg">
            Dr. North served as a teaching assistant to Professor Ronald A. Howard in 1966 for the 
            <strong> first course in decision analysis ever taught at Stanford University</strong>, 
            marking the beginning of what would become a foundational field in management science and engineering.
          </p>
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
                href="/warner/projects/government"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Government Projects →
              </Link>
              <Link 
                href="/warner/nrc-index"
                className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
              >
                National Academies →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
