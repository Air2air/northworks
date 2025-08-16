import { getContentBySlug } from '@/lib/content';
import PageLayout from '@/components/layouts/PageLayout';
import PageTitle from '@/components/ui/PageTitle';
import SimpleNavigationCard from '@/components/ui/SimpleNavigationCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NorthWorks - Cross-Domain Content Platform',
  description: 'Unified platform for classical music content and professional portfolio data with cross-domain search capabilities',
  keywords: ['NorthWorks', 'classical music', 'risk analysis', 'Warner North', 'Cheryl North', 'journalism', 'consulting']
};

export default function HomePage() {
  const homeData = getContentBySlug('index');
  
  if (!homeData) {
    return (
      <PageLayout>
        <div className="text-center">
          <PageTitle 
            title="NorthWorks"
            description="Cross-Domain Content Platform"
            size="medium"
            align="left"
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle
        title="NorthWorks"
        description="Classical Music and Risk Analysis"
        align="left"
        size="medium"
      />

      {/* Main Content */}
      <div className="mt-12">
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: homeData.content }} />
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* D. Warner North Card */}
          <SimpleNavigationCard
            title="D. Warner North"
            description="Risk analysis consultant with 50+ years of experience in decision analysis, environmental protection, and government consulting."
            href="/warner"
            buttonText="Explore Professional Work"
            variant="primary"
            icon={
              <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Cheryl North Card */}
          <SimpleNavigationCard
            title="Cheryl North"
            description="Classical music journalist and critic specializing in opera, symphony, and chamber music with extensive interview collection."
            href="/cheryl"
            buttonText="Explore Music Journalism"
            variant="secondary"
            icon={
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            }
          />
        </div>
    </PageLayout>
  );
}
