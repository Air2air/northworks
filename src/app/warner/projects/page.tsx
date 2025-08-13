import { getContentBySlug, getContentByType } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Link from 'next/link';
import { Metadata } from 'next';

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

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Projects & Consulting
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Over 50 years of consulting experience in risk analysis, decision analysis, and nuclear safety 
            for government agencies, utilities, and private sector clients.
          </p>
        </div>

        {/* Main Projects Content */}
        {projectsData && (
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: projectsData.content }} />
          </div>
        )}

        {/* Project Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Government Projects */}
          {governmentProjects && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Government Projects
                </h3>
                <p className="text-gray-600 mb-4">
                  Federal agency consulting including EPA Science Advisory Board and Nuclear Waste Technical Review Board
                </p>
                <div className="prose prose-sm max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ 
                    __html: governmentProjects.content.substring(0, 300) + '...' 
                  }} />
                </div>
                <Link 
                  href="/warner/projects/government"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          )}

          {/* Stanford Projects */}
          {stanfordProjects && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Stanford University
                </h3>
                <p className="text-gray-600 mb-4">
                  Academic consulting and research projects through Stanford's Management Science and Engineering Department
                </p>
                <div className="prose prose-sm max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ 
                    __html: stanfordProjects.content.substring(0, 300) + '...' 
                  }} />
                </div>
                <Link 
                  href="/warner/projects/stanford"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          )}

          {/* NRC Projects */}
          {nrcProjects && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Nuclear Regulatory Commission
                </h3>
                <p className="text-gray-600 mb-4">
                  Nuclear safety and risk assessment projects for the U.S. Nuclear Regulatory Commission
                </p>
                <div className="prose prose-sm max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ 
                    __html: nrcProjects.content.substring(0, 300) + '...' 
                  }} />
                </div>
                <Link 
                  href="/warner/projects/nrc"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          )}
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
