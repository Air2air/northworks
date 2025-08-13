import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import ProjectListComponent, { parseProjectsFromMarkdown } from '@/components/ProjectListComponent';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

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

  // Parse all projects
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

  const internationalProjects = allProjects.filter(p =>
    p.organization.includes('Mexico') ||
    p.organization.includes('Russian') ||
    p.organization.includes('Stuttgart') ||
    p.organization.includes('International')
  );

  return (
    <ContentLayout frontmatter={layoutFrontmatter}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Complete Projects Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive overview of 50+ years of consulting, government service, and academic work 
            in risk analysis, decision science, and environmental policy.
          </p>
        </div>

        {/* Career Timeline Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">50+</div>
            <div className="text-sm text-blue-600 font-medium">Years Experience</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">{governmentProjects.length}</div>
            <div className="text-sm text-green-600 font-medium">Government Projects</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">{academicProjects.length}</div>
            <div className="text-sm text-purple-600 font-medium">Academic Projects</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-700 mb-2">{industryProjects.length}</div>
            <div className="text-sm text-orange-600 font-medium">Industry Projects</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-700 mb-2">{internationalProjects.length}</div>
            <div className="text-sm text-red-600 font-medium">International Work</div>
          </div>
        </div>

        {/* Project Categories Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Government Projects */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Government Service</h2>
                  <p className="text-blue-100">Federal & state agency consulting</p>
                </div>
                <div className="text-4xl opacity-80">🏛️</div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{governmentProjects.filter(p => p.organization.includes('EPA')).length}</div>
                  <div className="text-xs text-gray-600">EPA Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{governmentProjects.filter(p => p.organization.includes('Nuclear')).length}</div>
                  <div className="text-xs text-gray-600">Nuclear Safety</div>
                </div>
              </div>
              <Link 
                href="/warner/projects/government"
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors text-center block"
              >
                View Government Projects →
              </Link>
            </div>
          </div>

          {/* Academic Projects */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Academic Work</h2>
                  <p className="text-purple-100">Stanford University & research</p>
                </div>
                <div className="text-4xl opacity-80">🎓</div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">35+</div>
                  <div className="text-xs text-gray-600">Years Stanford</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">25+</div>
                  <div className="text-xs text-gray-600">NRC Reports</div>
                </div>
              </div>
              <Link 
                href="/warner/stanford-index"
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors text-center block"
              >
                View Academic Work →
              </Link>
            </div>
          </div>
        </div>

        {/* Expertise Areas */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Core Expertise Areas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Analysis</h3>
              <p className="text-gray-600">Quantitative risk assessment, probabilistic analysis, and uncertainty modeling</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Policy</h3>
              <p className="text-gray-600">Environmental protection, regulatory policy, and public participation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚛️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Nuclear Safety</h3>
              <p className="text-gray-600">Nuclear waste management, reactor safety, and regulatory oversight</p>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link 
            href="/warner/projects"
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">All Projects</h3>
              <p className="text-sm text-gray-600">Complete project overview</p>
            </div>
          </Link>

          <Link 
            href="/warner/publications-index"
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all"
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Publications</h3>
              <p className="text-sm text-gray-600">Books, papers & reports</p>
            </div>
          </Link>

          <Link 
            href="/warner/nrc-index"
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all"
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏛️</div>
              <h3 className="font-semibold text-gray-900 mb-2">National Academies</h3>
              <p className="text-sm text-gray-600">NRC committee work</p>
            </div>
          </Link>

          <Link 
            href="/warner/background"
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all"
          >
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Background</h3>
              <p className="text-sm text-gray-600">Education & credentials</p>
            </div>
          </Link>
        </div>

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
