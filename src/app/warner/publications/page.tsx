import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Publications & Reports | NorthWorks',
  description: 'Academic publications and research reports by Dr. D. Warner North including National Academy of Sciences reports and risk analysis papers.',
  keywords: ['Warner North publications', 'risk analysis papers', 'National Academy reports', 'academic research', 'nuclear safety publications']
};

export default function WarnerPublicationsPage() {
  // Get main publications content and individual publication files
  const publicationsData = getContentBySlug('w_pub');
  const stuttgartPub = getContentBySlug('w_pub_stuttgart');
  const vniigasGazPub = getContentBySlug('w_pub_vniigaz');
  const seifPub = getContentBySlug('w_pub_seif-iv');

  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Publications', href: '/warner/publications', active: true }
  ];

  // Create navigation
  const navigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: true },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const frontmatter = publicationsData?.frontmatter as ContentFrontmatter || {};
  
  const layoutFrontmatter = {
    ...frontmatter,
    title: 'Publications & Reports',
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
            Publications & Reports
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Academic papers, research reports, and contributions to National Academy of Sciences 
            publications on risk analysis and environmental protection.
          </p>
        </div>

        {/* Main Publications Content */}
        {publicationsData && (
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: publicationsData.content }} />
          </div>
        )}

        {/* Featured Publications */}
        <div className="grid gap-8 mb-12">
          {/* Stuttgart Publication */}
          {stuttgartPub && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                International Risk Analysis
              </h3>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: stuttgartPub.content }} />
              </div>
            </div>
          )}

          {/* VNIIGaz Publication */}
          {vniigasGazPub && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Natural Gas Industry Analysis
              </h3>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: vniigasGazPub.content }} />
              </div>
            </div>
          )}

          {/* SEIF Publication */}
          {seifPub && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Safety Engineering & Risk Assessment
              </h3>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: seifPub.content }} />
              </div>
            </div>
          )}
        </div>

        {/* Key National Academy Reports */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            National Research Council Reports
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Assessment Reports</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <em>Risk Assessment in the Federal Government: Managing the Process</em> (1983)</li>
                <li>• <em>Science and Judgment in Risk Assessment</em> (1994)</li>
                <li>• <em>Understanding Risk: Informing Decisions in a Democratic Society</em> (1996)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Communication & Policy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <em>Improving Risk Communication</em> (1989)</li>
                <li>• <em>Public Participation in Environmental Assessment and Decision Making</em> (2008)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Focus Areas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Analysis</h3>
              <p className="text-gray-600 text-sm">
                Quantitative methods for assessing and managing technological and environmental risks
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Decision Science</h3>
              <p className="text-gray-600 text-sm">
                Application of decision analysis to complex policy and management problems
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Nuclear Safety</h3>
              <p className="text-gray-600 text-sm">
                Nuclear waste management, reactor safety, and regulatory policy analysis
              </p>
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
              Academic Publications & Research
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
