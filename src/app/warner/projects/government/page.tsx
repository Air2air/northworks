import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import ProjectListComponent, { parseProjectsFromMarkdown } from '@/components/ProjectListComponent';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Government Projects | NorthWorks',
  description: 'Federal and state government consulting projects including EPA Science Advisory Board, Nuclear Waste Technical Review Board, and California agencies.',
  keywords: ['Warner North government projects', 'EPA Science Advisory Board', 'Nuclear Waste Technical Review Board', 'federal consulting']
};

export default function GovernmentProjectsPage() {
  const governmentData = getContentBySlug('w_projects_government');
  
  if (!governmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Projects</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  const frontmatter = governmentData.frontmatter as ContentFrontmatter;
  
  // Parse projects from the content
  const projects = parseProjectsFromMarkdown(
    governmentData.content, 
    (frontmatter as any).images || []
  );

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Projects', href: '/warner/projects', active: false },
    { label: 'Government', href: '/warner/projects/government', active: true }
  ];

  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Government Projects',
    breadcrumbs,
    navigation,
    seo: {
      title: metadata.title as string,
      description: metadata.description as string,
      keywords: metadata.keywords as string[]
    }
  };

  // Filter projects by category
  const epaProjects = projects.filter(p => p.organization.includes('EPA') || p.organization.includes('Environmental'));
  const nuclearProjects = projects.filter(p => p.organization.includes('Nuclear') || p.organization.includes('NRC'));
  const stateProjects = projects.filter(p => p.organization.includes('California') || p.organization.includes('State'));
  const otherFederal = projects.filter(p => 
    !p.organization.includes('EPA') && 
    !p.organization.includes('Nuclear') && 
    !p.organization.includes('California') && 
    !p.organization.includes('State')
  );

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Projects</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Federal and state government consulting assignments including long-term advisory board service 
            and specialized consulting projects in risk analysis and environmental policy.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{epaProjects.length}</div>
            <div className="text-sm text-blue-800">EPA Projects</div>
          </div>
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{nuclearProjects.length}</div>
            <div className="text-sm text-red-800">Nuclear Safety</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stateProjects.length}</div>
            <div className="text-sm text-green-800">State Projects</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">{projects.length}</div>
            <div className="text-sm text-gray-800">Total Projects</div>
          </div>
        </div>

        {/* EPA Projects */}
        {epaProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              EPA Science Advisory Board
            </h2>
            <ProjectListComponent 
              items={epaProjects}
              title=""
              category="Environmental"
            />
          </div>
        )}

        {/* Nuclear Safety Projects */}
        {nuclearProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Nuclear Safety & Waste Management
            </h2>
            <ProjectListComponent 
              items={nuclearProjects}
              title=""
              category="Nuclear Safety"
            />
          </div>
        )}

        {/* State Projects */}
        {stateProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              State Government Projects
            </h2>
            <ProjectListComponent 
              items={stateProjects}
              title=""
              category="State"
            />
          </div>
        )}

        {/* Other Federal Projects */}
        {otherFederal.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibent text-gray-900 mb-6">
              Other Federal Agencies
            </h2>
            <ProjectListComponent 
              items={otherFederal}
              title=""
              category="Federal"
            />
          </div>
        )}

        {/* Key Achievements */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Government Roles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Long-term Advisory Positions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• EPA Science Advisory Board Member (1978-present)</li>
                <li>• Nuclear Waste Technical Review Board (1989-1994)</li>
                <li>• California Proposition 65 Scientific Advisory Panel</li>
                <li>• California Bay-Delta Authority Independent Science Board</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Specialized Consulting</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Federal Energy Administration petroleum pricing</li>
                <li>• DOE national energy policy analysis</li>
                <li>• Multi-agency environmental impact assessment</li>
                <li>• Regulatory policy development</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <Link 
              href="/warner/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Projects
            </Link>
            
            <div className="flex space-x-4">
              <Link 
                href="/warner/projects/stanford"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Stanford Projects →
              </Link>
              <Link 
                href="/warner/projects/nrc"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
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
