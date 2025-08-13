import { getContentBySlug } from '@/lib/content';
import { BiographyFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import { PageHeader, Sidebar } from '@/components/ui';
import type { NavigationCardProps } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  FaClipboardList, 
  FaGraduationCap, 
  FaUniversity, 
  FaStar, 
  FaBook,
  FaSchool
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'D. Warner North - Risk Analysis Consultant | NorthWorks',
  description: 'Dr. D. Warner North is principal scientist of NorthWorks, a leading expert in risk analysis and nuclear waste issues with over 50 years of experience.',
  keywords: ['risk analysis', 'nuclear waste', 'consulting', 'Stanford University', 'EPA Science Advisory Board', 'decision analysis']
};

export default function WarnerPage() {
  const warnerData = getContentBySlug('w_main');
  
  if (!warnerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">D. Warner North</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = warnerData.frontmatter as BiographyFrontmatter;
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true }
  ];

  // Create navigation with Warner active
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'D. Warner North',
    breadcrumbs,
    navigation
  };

  // Define navigation cards for the sidebar
  const portfolioCards: Omit<NavigationCardProps, 'className'>[] = [
    {
      title: 'Complete Projects Index',
      description: '50+ years of consulting work',
      href: '/warner/projects-index',
      icon: <FaClipboardList className="text-blue-600" />,
      color: 'blue',
      size: 'small'
    },
    {
      title: 'Background & Education', 
      description: 'Academic credentials & training',
      href: '/warner/background',
      icon: <FaGraduationCap className="text-blue-600" />,
      color: 'blue',
      size: 'small'
    },
    {
      title: 'Government Service',
      description: 'Federal & state agency work',
      href: '/warner/projects/government', 
      icon: <FaUniversity className="text-blue-600" />,
      color: 'blue',
      size: 'small'
    },
    {
      title: 'Stanford University',
      description: '35 years of academic service',
      href: '/warner/stanford-index',
      icon: <FaSchool className="text-red-600" />, 
      color: 'red',
      size: 'small'
    },
    {
      title: 'National Academies',
      description: 'NRC National Associate',
      href: '/warner/nrc-index',
      icon: <FaStar className="text-purple-600" />,
      color: 'purple',
      size: 'small'
    },
    {
      title: 'Publications Index',
      description: 'Books, papers & reports',
      href: '/warner/publications-index',
      icon: <FaBook className="text-green-600" />,
      color: 'green',
      size: 'small'
    }
  ];

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <PageHeader
          title="D. Warner North"
          description="Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues"
          gradientFrom="blue-500"
          gradientTo="purple-600"
        />

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Professional Image */}
            {frontmatter.images && frontmatter.images.length > 1 && (
              <div className="float-right ml-6 mb-6">
                <Image
                  src={frontmatter.images[1].src}
                  alt="D. Warner North"
                  width={frontmatter.images[1].width || 200}
                  height={frontmatter.images[1].height || 200}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Biography Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: warnerData.content }} />
            </div>

            {/* Speaking Image */}
            {frontmatter.images && frontmatter.images.length > 2 && (
              <div className="mt-8">
                <Image
                  src={frontmatter.images[2].src}
                  alt="Dr. North speaking at Belgian Senate"
                  width={frontmatter.images[2].width || 400}
                  height={frontmatter.images[2].height || 300}
                  className="rounded-lg shadow-md mx-auto"
                />
                <p className="text-sm text-gray-600 text-center mt-2 italic">
                  Dr. North speaking at the Belgian Senate
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar
            title="Professional Portfolio"
            cards={portfolioCards}
            image={frontmatter.images && frontmatter.images.length > 3 ? {
              src: frontmatter.images[3].src,
              alt: "Advisory Boards",
              width: frontmatter.images[3].width || 220,
              height: frontmatter.images[3].height || 45
            } : undefined}
            skills={['Risk Analysis', 'Decision Analysis', 'Nuclear Safety', 'Environmental Policy', 'Waste Management']}
          />
        </div>
      </div>
    </ContentLayout>
  );
}
