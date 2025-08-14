import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import type { NavigationCardProps } from '@/components/ui/NavigationCard';
import ProjectListComponent, { parseProjectsFromMarkdown } from '@/components/ProjectListComponent';
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
  FaGraduationCap, 
  FaGlobe, 
  FaBook, 
  FaUserGraduate, 
  FaStar, 
  FaCrosshairs,
  FaIndustry
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'D. Warner North - All Projects Index | NorthWorks',
  description: 'Complete index of all consulting projects, government service, and academic work by Dr. D. Warner North across 50+ years.',
  keywords: ['Warner North projects', 'consulting portfolio', 'government service', 'academic projects', 'risk analysis work']
};

export default function ProjectsIndexPage() {
  // Get all project-related content
  const mainProjectsData = getContentBySlug('w_projects');
  const governmentData = getContentBySlug('w_projects_government');
  const stanfordData = getContentBySlug('w_projects_stanford');
  const nrcData = getContentBySlug('w_projects_nrc');

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Projects Index', href: '/warner/projects-index', active: true }
  ];

  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const frontmatter = mainProjectsData?.frontmatter as ContentFrontmatter || {};
  
  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Projects Index',
    breadcrumbs,
    navigation,
    seo: {
      title: metadata.title as string,
      description: metadata.description as string,
      keywords: metadata.keywords as string[]
    }
  };

  // Statistics data
  const careerStats: StatItem[] = [
    { value: '50+', label: 'Years Experience', color: 'blue' },
    { value: '100+', label: 'Major Projects', color: 'green' },
    { value: '25+', label: 'Organizations', color: 'purple' },
    { value: '4', label: 'Key Sectors', color: 'orange' },
    { value: '12', label: 'EPA Committees', color: 'red' }
  ];

  // Navigation cards for project categories
  const projectCategories: Omit<NavigationCardProps, 'className'>[] = [
    {
      title: 'Government Projects',
      description: 'Federal and state agency consulting work',
      href: '/warner/projects/government',
      icon: <FaUniversity className="text-blue-600" />,
      color: 'blue',
      tags: ['EPA', 'NRC', 'DOE', 'State Agencies']
    },
    {
      title: 'Academic Research',
      description: 'University collaborations and research projects',
      href: '/warner/stanford-index',
      icon: <FaGraduationCap className="text-red-600" />,
      color: 'red',
      tags: ['Stanford', 'Research', 'Teaching']
    },
    {
      title: 'Industry Consulting',
      description: 'Private sector risk analysis and consulting',
      href: '/warner/projects/industry',
      icon: <FaIndustry className="text-green-600" />,
      color: 'green',
      tags: ['Energy', 'Utilities', 'Chemical']
    },
    {
      title: 'International Work',
      description: 'Global consulting and advisory projects',
      href: '/warner/projects/international',
      icon: <FaGlobe className="text-purple-600" />,
      color: 'purple',
      tags: ['World Bank', 'International', 'Global']
    }
  ];

  // Quick access items
  const quickAccessItems: QuickAccessItem[] = [
    {
      title: 'Publications Index',
      description: 'Research papers and reports',
      href: '/warner/publications-index',
      icon: <FaBook className="text-green-600" />,
      color: 'green'
    },
    {
      title: 'Professional Background',
      description: 'Education and credentials', 
      href: '/warner/background',
      icon: <FaUserGraduate className="text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'National Academies',
      description: 'NRC service and reports',
      href: '/warner/nrc-index',
      icon: <FaStar className="text-purple-600" />,
      color: 'purple'
    }
  ];

  // Parse all projects for dynamic data
  const allProjects = [
    ...(mainProjectsData ? parseProjectsFromMarkdown(mainProjectsData.content, []) : []),
    ...(governmentData ? parseProjectsFromMarkdown(governmentData.content, []) : []),
    ...(stanfordData ? parseProjectsFromMarkdown(stanfordData.content, []) : []),
    ...(nrcData ? parseProjectsFromMarkdown(nrcData.content, []) : [])
  ];

  // Categorize projects
  const governmentProjects = allProjects.filter(p => 
    p.organization.includes('EPA') || 
    p.organization.includes('Nuclear') || 
    p.organization.includes('California') ||
    p.organization.includes('Federal') ||
    p.organization.includes('Department')
  );

  const academicProjects = allProjects.filter(p => 
    p.organization.includes('Stanford') || 
    p.organization.includes('University') ||
    p.organization.includes('Academy') ||
    p.organization.includes('Research')
  );

  const industryProjects = allProjects.filter(p => 
    !governmentProjects.includes(p) && 
    !academicProjects.includes(p) &&
    (p.organization.includes('Company') || 
     p.organization.includes('Corporation') ||
     p.organization.includes('Association') ||
     p.organization.includes('Institute'))
  );

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        

        {/* Career Statistics */}
        

        {/* Project Categories */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {projectCategories.map((category, index) => (
            <NavigationCard
              key={index}
              title={category.title}
              description={category.description}
              href={category.href}
              icon={category.icon}
              color={category.color}
              tags={category.tags}
              size="large"
            />
          ))}
        </div>

        {/* Expertise Areas */}
        

        {/* Quick Access Links */}
        

        {/* Navigation */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <Link 
              href="/warner"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to D. Warner North
            </Link>
            
            <div className="text-sm text-gray-500">
              Complete Project Portfolio
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
