import { GetStaticProps } from 'next';
import { ArticleList } from '@/components/dynamic/ArticleList';
import { loadArticles, ArticlesData } from '@/lib/jsonData';
import PageTitle from '@/components/ui/PageTitle';

interface ArticlesPageProps {
  articlesData: ArticlesData;
}

export default function ArticlesPage({ articlesData }: ArticlesPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="Classical Music Articles"
        description="Explore our collection of classical music articles, features, and special pieces from various publications"
      />
      
      <ArticleList 
        data={articlesData}
        searchable={true}
        filterable={true}
        pageSize={10}
        layout="list"
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps<ArticlesPageProps> = async () => {
  try {
    const articlesData = loadArticles();
    
    return {
      props: {
        articlesData,
      },
      // Revalidate every hour in production
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error loading articles data:', error);
    
    // Return a fallback structure if data loading fails
    return {
      props: {
        articlesData: {
          metadata: {
            id: "articles_collection",
            type: "index",
            category: "classical-music",
            subcategory: "article-directory",
            status: "published",
            featured: true
          },
          content: {
            title: Articles",
            summary: "Article collection temporarily unavailable",
            body: ""
          },
          publication: {
            created: new Date().toISOString(),
            updated: new Date().toISOString()
          },
          legacy: {
            originalFile: "c_articles.md",
            totalEntries: 0
          },
          articles: []
        }
      },
    };
  }
};
