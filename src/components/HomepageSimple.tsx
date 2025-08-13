import { HomepageFrontmatter, Profile, RecentContentItem } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import Image from 'next/image';
import Link from 'next/link';

interface HomepageProps {
  frontmatter: HomepageFrontmatter;
  content: string;
}

function ProfileCard({ profile, align = 'left' }: { profile: Profile; align?: 'left' | 'right' }) {
  return (
    <div className={`flex ${align === 'right' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-6 mb-12`}>
      <div className="flex-shrink-0">
        <Image
          src={`/${profile.image}`}
          alt={profile.name}
          width={100}
          height={130}
          className="rounded-lg shadow-md"
        />
      </div>
      <div className={`flex-1 ${align === 'right' ? 'text-right pr-6' : 'pl-6'}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <Link href={profile.link} className="hover:text-blue-600 transition-colors">
            {profile.name}
          </Link>
        </h2>
        <p className="text-lg text-gray-600 mb-3">{profile.title}</p>
        <p className="text-gray-700 leading-relaxed">{profile.description}</p>
      </div>
    </div>
  );
}

function RecentContentSection({ 
  title, 
  items, 
  person 
}: { 
  title: string; 
  items: RecentContentItem[]; 
  person: 'cheryl' | 'warner';
}) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h4>
            <p className="text-gray-700 mb-2">{item.description}</p>
            {item.link && (
              <Link 
                href={item.link} 
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Read more →
              </Link>
            )}
            <div className="mt-1">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                item.type === 'interview' ? 'bg-purple-100 text-purple-800' :
                item.type === 'review' ? 'bg-green-100 text-green-800' :
                item.type === 'preview' ? 'bg-blue-100 text-blue-800' :
                item.type === 'publication' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Homepage({ frontmatter, content }: HomepageProps) {
  return (
    <ContentLayout frontmatter={frontmatter} showBreadcrumbs={false}>
      {/* Hero Section */}
      {/* <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          {frontmatter.header_logo && (
            <Image
              src={`/${frontmatter.header_logo}`}
              alt="NorthWorks Logo"
              width={280}
              height={80}
              className="max-w-full h-auto"
            />
          )}
        </div>
        {frontmatter.header_tagline && (
          <Image
            src={`/${frontmatter.header_tagline}`}
            alt="Risk Analysis Consultants"
            width={250}
            height={80}
            className="mx-auto"
          />
        )} 
      </div>*/}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2">
          {/* Profile Sections */}
          {frontmatter.profiles && (
            <>
              <ProfileCard profile={frontmatter.profiles.warner} align="left" />
              <ProfileCard profile={frontmatter.profiles.cheryl} align="left" />
            </>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          {frontmatter.recent_content && (
            <>
              {frontmatter.recent_content.cheryl && (
                <RecentContentSection
                  title="New from Cheryl North"
                  items={frontmatter.recent_content.cheryl}
                  person="cheryl"
                />
              )}
              
              {frontmatter.recent_content.warner && (
                <RecentContentSection
                  title="New from Warner North"
                  items={frontmatter.recent_content.warner}
                  person="warner"
                />
              )}
            </>
          )}

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/interviews" className="block text-blue-600 hover:text-blue-800 transition-colors">
                Classical Music Interviews
              </Link>
              <Link href="/reviews" className="block text-blue-600 hover:text-blue-800 transition-colors">
                Performance Reviews
              </Link>
              <Link href="/articles" className="block text-blue-600 hover:text-blue-800 transition-colors">
                Music Articles
              </Link>
              <Link href="/warner" className="block text-blue-600 hover:text-blue-800 transition-colors">
                Risk Analysis Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
