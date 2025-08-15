import PageTitle from '@/components/ui/PageTitle';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D. Warner North - Projects & Consulting | NorthWorks',
  description: 'Government and industry consulting projects by Dr. D. Warner North including work with EPA, NRC, Stanford University and private sector.',
  keywords: ['Warner North projects', 'risk analysis consulting', 'EPA projects', 'NRC consulting', 'Stanford projects']
};

export default function WarnerProjectsPage() {
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Projects', href: '/warner/projects', active: true }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <Breadcrumbs items={breadcrumbs} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageTitle
            title="Projects & Consulting"
            description="Dr. Warner North's professional projects and consulting experience"
            align="center"
            size="large"
          />

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Government Projects</h3>
              <p className="text-gray-600 mb-4">
                Federal agency consulting including EPA Science Advisory Board and Nuclear Waste Technical Review Board
              </p>
              <Link href="/warner/projects/government" className="text-blue-600 hover:text-blue-800">
                View Government Projects →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Stanford University</h3>
              <p className="text-gray-600 mb-4">
                35 years of academic service including teaching and research supervision
              </p>
              <Link href="/warner/stanford-index" className="text-blue-600 hover:text-blue-800">
                View Stanford Experience →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">National Academies</h3>
              <p className="text-gray-600 mb-4">
                National Associate designation and decades of service on major committees
              </p>
              <Link href="/warner/nrc-index" className="text-blue-600 hover:text-blue-800">
                View National Academies Work →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Complete Projects Index</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive listing of all professional projects and consulting work
              </p>
              <Link href="/warner/projects-index" className="text-blue-600 hover:text-blue-800">
                View Complete Index →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/warner"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to D. Warner North
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
