import { getArticleContent } from '@/lib/unified-data';
import ContentListingPage, { generateContentListingMetadata } from '@/components/pages/ContentListingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = generateContentListingMetadata('articles');

export default function ArticlesPage() {
  const articleContent = getArticleContent();
  return <ContentListingPage contentType="articles" items={articleContent} />;
}