import { getContentBySlug } from '@/lib/content';
import { BiographyFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import NavigationCard, { type NavigationCardProps } from '@/components/ui/NavigationCard';
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
          <PageTitle 
            title="D. Warner North"
            description="Content not found"
            size="medium"
            align="center"
          />
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
        <PageTitle
          title="D. Warner North"
          description="Principal Scientist of NorthWorks and leading expert in risk analysis and nuclear waste issues"
          align="center"
          size="large"
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

          {/* Navigation Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Portfolio</h3>
            
            {frontmatter.images && frontmatter.images.length > 3 && (
              <div className="mb-6">
                <Image
                  src={frontmatter.images[3].src}
                  alt="Advisory Boards"
                  width={frontmatter.images[3].width || 220}
                  height={frontmatter.images[3].height || 45}
                  className="w-full h-auto rounded"
                />
              </div>
            )}
            
            <div className="space-y-3">
              {portfolioCards.map((card, index) => (
                <NavigationCard key={index} {...card} className="w-full" />
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Expertise Areas</h4>
              <div className="flex flex-wrap gap-2">
                {['Risk Analysis', 'Decision Analysis', 'Nuclear Safety', 'Environmental Policy', 'Waste Management'].map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
