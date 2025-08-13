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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Projects & Consulting
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Over 50 years of consulting experience in risk analysis, decision analysis, and nuclear safety 
            for government agencies, utilities, and private sector clients.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Years of Consulting</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
            <div className="text-sm text-gray-600">Major Projects</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
            <div className="text-sm text-gray-600">Government Agencies</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
            <div className="text-sm text-gray-600">Major Sectors</div>
          </div>
        </div>

        {/* Main Projects Content */}
        {projectsData && (
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: projectsData.content }} />
          </div>
        )}

        {/* Project Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Government Projects */}
          <Link 
            href="/warner/projects/government"
            className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-blue-200"
          >
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">🏛️</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                Government Projects
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              Federal agency consulting including EPA Science Advisory Board and Nuclear Waste Technical Review Board
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">EPA</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">NRC</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">DoE</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">State Agencies</span>
            </div>
            <div className="text-blue-600 font-medium group-hover:text-blue-700">
              View Government Projects →
            </div>
          </Link>

          {/* Stanford Projects */}
          <Link 
            href="/warner/stanford-index"
            className="group bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-red-200"
          >
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">🏫</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600">
                Stanford University
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              35 years of academic service including first Decision Analysis course and extensive research supervision
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">MS&E Department</span>
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">Research</span>
              <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">Teaching</span>
            </div>
            <div className="text-red-600 font-medium group-hover:text-red-700">
              View Stanford Overview →
            </div>
          </Link>

          {/* NRC/National Academies */}
          <Link 
            href="/warner/nrc-index"
            className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-200"
          >
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">⭐</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600">
                National Academies
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              National Associate designation and five decades of service on major committees and landmark reports
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">National Associate</span>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">Major Reports</span>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">50 Years Service</span>
            </div>
            <div className="text-purple-600 font-medium group-hover:text-purple-700">
              View National Academies Service →
            </div>
          </Link>

          {/* Industry Projects */}
          <Link 
            href="/warner/projects/industry"
            className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-green-200"
          >
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">🏭</span>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600">
                Industry & Private Sector
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              Strategic consulting with major corporations on risk assessment, environmental compliance, and decision frameworks
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">Electric Utilities</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">Energy Sector</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">Chemical Industry</span>
            </div>
            <div className="text-green-600 font-medium group-hover:text-green-700">
              View Industry Projects →
            </div>
          </Link>
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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/warner/projects-index"
              className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">📋</span>
                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                  Complete Projects Index
                </h4>
                <p className="text-sm text-gray-600">
                  Comprehensive listing of all projects
                </p>
              </div>
            </Link>

            <Link 
              href="/warner/publications-index"
              className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">📚</span>
                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-green-600">
                  Related Publications
                </h4>
                <p className="text-sm text-gray-600">
                  Books, papers and reports
                </p>
              </div>
            </Link>

            <Link 
              href="/warner/background"
              className="group p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">👨‍🎓</span>
                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-orange-600">
                  Professional Background
                </h4>
                <p className="text-sm text-gray-600">
                  Education and credentials
                </p>
              </div>
            </Link>
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
