import ContentDetailPage, { generateContentDetailMetadata, generateContentDetailStaticParams } from '@/components/pages/ContentDetailPage';
import type { Metadata } from 'next';

interface ProfessionalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProfessionalPageProps): Promise<Metadata> {
  return generateContentDetailMetadata(params, 'professional');
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  return <ContentDetailPage params={params} contentType="professional" />;
}

export async function generateStaticParams() {
  return generateContentDetailStaticParams('professional');
}
