import { getContentBySlug } from '@/lib/content';
import { HomepageFrontmatter } from '@/types/content';
import HomepageSimple from '@/components/HomepageSimple';

export default function Home() {
  // Get the homepage content
  const homepageData = getContentBySlug('index');
  
  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NorthWorks</h1>
          <p className="text-gray-600">Content not found</p>
        </div>
      </div>
    );
  }

  return (
    <HomepageSimple 
      frontmatter={homepageData.frontmatter as HomepageFrontmatter}
      content={homepageData.content}
    />
  );
}
