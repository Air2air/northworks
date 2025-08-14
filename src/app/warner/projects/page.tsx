import { getContentBySlug, getContentByType } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import type { NavigationCardProps } from '@/components/ui/NavigationCard';
import Link from 'next/link';
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
  FaUniversity, 
  FaStar, 
  FaClipboardList, 
  FaBook, 
  FaUserGraduate,
  FaSchool,
  FaIndustry
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'D. Warner North - Projects & Consulting | NorthWorks',
  description: 'Government and industry consulting projects by Dr. D. Warner North including work with EPA, NRC, Stanford University and private sector.',
  keywords: ['Warner North projects', 'risk analysis consulting', 'EPA projects', 'NRC consulting', 'Stanford projects']
};

export default function WarnerProjectsPage() {
  // Get main projects content and individual project files
  const projectsData = getContentBySlug('w_projects');
  const governmentProjects = getContentBySlug('w_projects_government');
  const stanfordProjects = getContentBySlug('w_projects_stanford');
  const nrcProjects = getContentBySlug('w_projects_nrc');

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Projects', href: '/warner/projects', active: true }
  ];

  // Create navigation
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const frontmatter = projectsData?.frontmatter as ContentFrontmatter || {};
  
  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Projects & Consulting',
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
    { value: '50+', label: 'Years of Consulting', color: 'blue' },
    { value: '100+', label: 'Major Projects', color: 'green' },
    { value: '25+', label: 'Government Agencies', color: 'purple' },
    { value: '4', label: 'Major Sectors', color: 'orange' }
  ];

  // Define navigation cards
  const navigationCards = [
    {
      title: 'Government Projects',
      description: 'Federal agency consulting including EPA Science Advisory Board and Nuclear Waste Technical Review Board',
      href: '/warner/projects/government',
      icon: <FaUniversity className="text-blue-600" />,
      color: 'blue' as const,
      tags: ['EPA', 'NRC', 'DoE', 'State Agencies']
    },
    {
      title: 'Stanford University',
      description: '35 years of academic service including first Decision Analysis course and extensive research supervision',
      href: '/warner/stanford-index',
      icon: <FaSchool className="text-red-600" />,
      color: 'red' as const,
      tags: ['MS&E Department', 'Research', 'Teaching']
    },
    {
      title: 'National Academies',
      description: 'National Associate designation and five decades of service on major committees and landmark reports',
      href: '/warner/nrc-index',
      icon: <FaStar className="text-purple-600" />,
      color: 'purple' as const,
      tags: ['National Associate', 'Major Reports', '50 Years Service']
    },
    {
      title: 'Industry & Private Sector',
      description: 'Strategic consulting with major corporations on risk assessment, environmental compliance, and decision frameworks',
      href: '/warner/projects/industry',
      icon: <FaIndustry className="text-green-600" />,
      color: 'green' as const,
      tags: ['Electric Utilities', 'Energy Sector', 'Chemical Industry']
    }
  ];

  // Define quick access items
  const quickAccessItems: QuickAccessItem[] = [
    {
      title: 'Complete Projects Index',
      description: 'Comprehensive listing of all projects',
      href: '/warner/projects-index',
      icon: <FaClipboardList className="text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Related Publications',
      description: 'Books, papers and reports',
      href: '/warner/publications-index',
      icon: <FaBook className="text-green-600" />,
      color: 'green'
    },
    {
      title: 'Professional Background',
      description: 'Education and credentials',
      href: '/warner/background',
      icon: <FaUserGraduate className="text-orange-600" />,
      color: 'orange'
    }
  ];

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        

        {/* Statistics */}
        

        {/* Main Projects Content */}
        {projectsData && (
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: projectsData.content }} />
          </div>
        )}

        {/* Project Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {navigationCards.map((card, index) => (
            <NavigationCard
              key={index}
              title={card.title}
              description={card.description}
              href={card.href}
              icon={card.icon}
              color={card.color}
              tags={card.tags}
            />
          ))}
        </div>

        {/* Expertise Areas */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Technical Specializations</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Risk Assessment & Analysis</li>
                <li>• Decision Analysis</li>
                <li>• Nuclear Safety & Waste Management</li>
                <li>• Environmental Risk Assessment</li>
                <li>• Probabilistic Risk Assessment (PRA)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Industry Sectors</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Electric Utilities (US & Mexico)</li>
                <li>• Petroleum & Chemical Industries</li>
                <li>• Government Agencies</li>
                <li>• Environmental Protection</li>
                <li>• Energy Sector</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        

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
              Consulting Projects & Experience
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
