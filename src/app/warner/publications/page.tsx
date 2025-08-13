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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Publications & Reports
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Academic papers, research reports, and contributions to National Academy of Sciences 
            publications on risk analysis and environmental protection.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <div className="text-sm text-gray-600">Major NRC Reports</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Research Papers</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
            <div className="text-sm text-gray-600">Years Contributing</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Core Research Areas</div>
          </div>
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 mb-8 border border-blue-200">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">📊</span>
            <h2 className="text-2xl font-semibold text-gray-900">
              Major National Research Council Reports
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Risk Assessment & Analysis
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <div>
                    <strong>Risk Assessment in the Federal Government</strong> (1983)<br/>
                    <span className="text-sm text-gray-600">Managing the Process - Foundational report</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <div>
                    <strong>Science and Judgment in Risk Assessment</strong> (1994)<br/>
                    <span className="text-sm text-gray-600">Methodological advances</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <div>
                    <strong>Understanding Risk</strong> (1996)<br/>
                    <span className="text-sm text-gray-600">Informing Decisions in a Democratic Society</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Communication & Policy
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <div>
                    <strong>Improving Risk Communication</strong> (1989)<br/>
                    <span className="text-sm text-gray-600">Public understanding and dialogue</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <div>
                    <strong>Public Participation in Environmental Assessment</strong> (2008)<br/>
                    <span className="text-sm text-gray-600">Decision Making frameworks</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Research Areas */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Focus Areas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🔬</span>
                <h3 className="text-lg font-medium text-gray-900">Risk Analysis</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Quantitative methods for assessing and managing technological and environmental risks
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-lg font-medium text-gray-900">Decision Science</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Application of decision analysis to complex policy and management problems
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">⚛️</span>
                <h3 className="text-lg font-medium text-gray-900">Nuclear Safety</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Nuclear waste management, reactor safety, and regulatory policy analysis
              </p>
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
              href="/warner/publications-index"
              className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">📚</span>
                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-green-600">
                  Publications Index
                </h4>
                <p className="text-sm text-gray-600">
                  Complete bibliography and reports
                </p>
              </div>
            </Link>

            <Link 
              href="/warner/nrc-index"
              className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">⭐</span>
                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600">
                  National Academies Service
                </h4>
                <p className="text-sm text-gray-600">
                  NRC committees and reports
                </p>
              </div>
            </Link>

            <Link 
              href="/warner/stanford-index"
              className="group p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">🏫</span>
                <h4 className="font-medium text-gray-900 mb-1 group-hover:text-red-600">
                  Academic Work
                </h4>
                <p className="text-sm text-gray-600">
                  Stanford University research
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
              Academic Publications & Research
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
