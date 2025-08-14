import { GetStaticProps } from 'next';
import { InterviewGrid } from '@/components/dynamic/InterviewGrid';
import { loadInterviews, InterviewsData } from '@/lib/jsonData';
import PageTitle from '@/components/ui/PageTitle';

interface InterviewsPageProps {
  interviewsData: InterviewsData;
}

export default function InterviewsPage({ interviewsData }: InterviewsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle 
        title="Classical Music Interviews"
        description="Browse our comprehensive collection of interviews with classical music artists, conductors, and composers from leading publications"
      />
      
      <InterviewGrid 
        data={interviewsData}
        searchable={true}
        filterable={true}
        pageSize={12}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps<InterviewsPageProps> = async () => {
  try {
    const interviewsData = loadInterviews();
    
    return {
      props: {
        interviewsData,
      },
      // Revalidate every hour in production
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error loading interviews data:', error);
    
    // Return a fallback structure if data loading fails
    return {
      props: {
        interviewsData: {
          metadata: {
            id: "interviews_collection",
            type: "index",
            category: "classical-music",
            subcategory: "interview-directory",
            status: "published",
            featured: true
          },
          content: {
            title: Interviews",
            summary: "Interview collection temporarily unavailable",
            body: ""
          },
          publication: {
            created: new Date().toISOString(),
            updated: new Date().toISOString()
          },
          legacy: {
            originalFile: "c_interviews.md",
            totalEntries: 0,
            thumbnailImages: 0
          },
          interviews: []
        }
      },
    };
  }
};
