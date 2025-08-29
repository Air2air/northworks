import { getArticleContent } from '@/lib/unified-data';
import ContentListingPage from '@/components/pages/ContentListingPage';
import { generateListingMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

export const metadata: Metadata = generateListingMetadata('articles', 'cheryl');

export default function ArticlesPage() {
  const articleContent = getArticleContent();
  return <ContentListingPage contentType="articles" items={articleContent} />;
}