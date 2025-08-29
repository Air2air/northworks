import ContentDetailPage, { generateContentDetailMetadata, generateContentDetailStaticParams } from '@/components/pages/ContentDetailPage';
import type { Metadata } from 'next';

interface PublicationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicationPageProps): Promise<Metadata> {
  return generateContentDetailMetadata(params, 'publication');
}

export default async function PublicationPage({ params }: PublicationPageProps) {
  return <ContentDetailPage params={params} contentType="publication" />;
}

export async function generateStaticParams() {
  return generateContentDetailStaticParams('publication');
}
