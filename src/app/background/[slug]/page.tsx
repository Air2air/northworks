import ContentDetailPage, { generateContentDetailMetadata, generateContentDetailStaticParams } from '@/components/pages/ContentDetailPage';
import type { Metadata } from 'next';

interface BackgroundPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BackgroundPageProps): Promise<Metadata> {
  return generateContentDetailMetadata(params, 'background');
}

export default async function BackgroundPage({ params }: BackgroundPageProps) {
  return <ContentDetailPage params={params} contentType="background" />;
}

export async function generateStaticParams() {
  return generateContentDetailStaticParams('background');
}
