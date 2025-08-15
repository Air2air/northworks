/**
 * UnifiedWarnerIndexPage - Reusable Warner index page component
 * Consolidates publications-index, nrc-index, stanford-index pages
 */

import React from 'react';
import { getContentBySlug } from '@/lib/content';
import { ContentFrontmatter } from '@/types/content';
import ContentLayout from '@/components/layouts/ContentLayout';
import PageTitle from '@/components/ui/PageTitle';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  FaTrophy, 
  FaBook, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaUsers, 
  FaUniversity,
  FaGraduationCap,
  FaGlobe,
  FaChartBar,
  FaAtom
} from 'react-icons/fa';

type WarnerIndexType = 'publications' | 'nrc' | 'stanford';

interface WarnerIndexConfig {
  slug: string;
  title: string;
  description: string;
  metadata: Metadata;
  logoPattern: RegExp;
  parseFunction: (content: string, images?: any[]) => any[];
  stats: Array<{
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
  }>;
  quickAccess?: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
  }>;
}

const warnerIndexConfigs: Record<WarnerIndexType, WarnerIndexConfig> = {
  publications: {
    slug: 'warner_bio_pub',
    title: 'D. Warner North - Publications & Research',
    description: 'Comprehensive archive of publications, research papers, reports, and academic contributions spanning decision analysis, risk assessment, and environmental policy.',
    metadata: {
      title: 'D. Warner North - Publications & Research | NorthWorks',
      description: 'Complete archive of Dr. D. Warner North\'s publications, research papers, and reports spanning 50+ years of expertise in decision analysis and risk assessment.',
      keywords: ['Warner North publications', 'decision analysis papers', 'risk assessment research', 'environmental policy reports', 'academic publications']
    },
    logoPattern: /!\[.*?\]\(images\/.*?\.gif\)/,
    parseFunction: parsePublicationsFromMarkdown,
    stats: [
      { icon: <FaBook className="text-2xl" />, value: "200+", label: "Publications", color: "blue" },
      { icon: <FaCalendarAlt className="text-2xl" />, value: "50+", label: "Years Active", color: "green" },
      { icon: <FaFileAlt className="text-2xl" />, value: "100+", label: "Reports", color: "purple" },
      { icon: <FaChartBar className="text-2xl" />, value: "25+", label: "Journal Articles", color: "orange" }
    ],
    quickAccess: [
      {
        title: "Recent Publications",
        description: "Latest research and publications",
        href: "#recent",
        icon: <FaFileAlt />,
        color: "blue"
      },
      {
        title: "Journal Articles",
        description: "Peer-reviewed academic articles",
        href: "#journal",
        icon: <FaBook />,
        color: "green"
      }
    ]
  },
  nrc: {
    slug: 'warner_bio_nrc',
    title: 'D. Warner North - National Academies Work',
    description: 'Complete overview of extensive work with the National Research Council, National Academy of Sciences, and related organizations.',
    metadata: {
      title: 'D. Warner North - National Academies Work | NorthWorks',
      description: 'Complete overview of Dr. D. Warner North\'s extensive work with the National Research Council, National Academy of Sciences, and related organizations.',
      keywords: ['Warner North National Academies', 'National Research Council', 'NAS', 'NAE', 'risk assessment reports', 'National Associate']
    },
    logoPattern: /!\[.*?\]\(images\/logo_nrc\.gif\)/,
    parseFunction: parseNRCActivities,
    stats: [
      { icon: <FaTrophy className="text-2xl" />, value: "15+", label: "Major Reports", color: "gold" },
      { icon: <FaUsers className="text-2xl" />, value: "50+", label: "Committee Members", color: "blue" },
      { icon: <FaCalendarAlt className="text-2xl" />, value: "30+", label: "Years Service", color: "green" },
      { icon: <FaUniversity className="text-2xl" />, value: "5", label: "Academies", color: "purple" }
    ]
  },
  stanford: {
    slug: 'warner_bio_stan',
    title: 'D. Warner North - Stanford University Work',
    description: 'Complete overview of 35+ years at Stanford University including teaching, research, and academic contributions.',
    metadata: {
      title: 'D. Warner North - Stanford University Work | NorthWorks',
      description: 'Complete overview of Dr. D. Warner North\'s 35+ years at Stanford University including teaching, research, and academic contributions.',
      keywords: ['Warner North Stanford', 'Stanford University', 'Management Science Engineering', 'decision analysis teaching', 'academic research']
    },
    logoPattern: /!\[.*?\]\(images\/logo_stan\.gif\)/,
    parseFunction: parseStanfordActivities,
    stats: [
      { icon: <FaGraduationCap className="text-2xl" />, value: "35+", label: "Years Teaching", color: "red" },
      { icon: <FaUsers className="text-2xl" />, value: "100+", label: "Students Mentored", color: "blue" },
      { icon: <FaBook className="text-2xl" />, value: "50+", label: "Research Projects", color: "green" },
      { icon: <FaGlobe className="text-2xl" />, value: "Global", label: "Impact", color: "purple" }
    ]
  }
};

// Parsing functions
function parsePublicationsFromMarkdown(content: string, images: any[] = []) {
  const publications: any[] = [];
  const sections = content.split(/!\[.*?\]\(images\/.*?\.gif\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const title = lines[0]?.replace(/\*\*/g, '').trim();
      if (title) {
        publications.push({
          title,
          content: lines.slice(1).join('\n').trim(),
          type: 'publication',
          metadata: { index }
        });
      }
    }
  });
  
  return publications;
}

function parseNRCActivities(content: string) {
  const activities: any[] = [];
  const sections = content.split(/!\[.*?\]\(images\/logo_nrc\.gif\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const title = lines[0]?.replace(/\*\*/g, '').trim();
      if (title) {
        activities.push({
          title,
          content: lines.slice(1).join('\n').trim(),
          type: 'nrc-activity',
          metadata: { index }
        });
      }
    }
  });
  
  return activities;
}

function parseStanfordActivities(content: string) {
  const activities: any[] = [];
  const sections = content.split(/!\[.*?\]\(images\/logo_stan\.gif\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const title = lines[0]?.replace(/\*\*/g, '').trim();
      if (title) {
        activities.push({
          title,
          content: lines.slice(1).join('\n').trim(),
          type: 'stanford-activity',
          metadata: { index }
        });
      }
    }
  });
  
  return activities;
}

interface UnifiedWarnerIndexPageProps {
  indexType: WarnerIndexType;
}

export default function UnifiedWarnerIndexPage({ indexType }: UnifiedWarnerIndexPageProps) {
  const config = warnerIndexConfigs[indexType];
  const data = getContentBySlug(config.slug);

  const defaultNavigation = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: 'Cheryl North', href: '/cheryl', active: false },
    { label: 'Contact', href: '/contact', active: false }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/', active: false },
    { label: 'D. Warner North', href: '/warner', active: false },
    { label: config.title.split(' - ')[1], href: `/${indexType}-index`, active: true }
  ];

  if (!data) {
    const mockFrontmatter: any = {
      id: `${indexType}-index`,
      title: config.title,
      type: 'article' as const,
      seo: {
        title: config.title,
        description: config.description,
        keywords: []
      },
      navigation: defaultNavigation,
      breadcrumbs: breadcrumbs
    };

    return (
      <ContentLayout frontmatter={mockFrontmatter}>
        <div className="space-y-8">
          <PageTitle
            title={config.title}
            description={config.description}
            align="center"
            size="large"
          />

          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Content Not Available
            </h3>
            <p className="text-gray-600 mb-6">
              The {indexType} content is not currently available.
            </p>
            <Link 
              href="/warner"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to D. Warner North
            </Link>
          </div>
        </div>
      </ContentLayout>
    );
  }

  const frontmatter = data.frontmatter as ContentFrontmatter;
  const enhancedFrontmatter = {
    ...frontmatter,
    navigation: defaultNavigation,
    breadcrumbs: breadcrumbs
  };

  // Parse items from the markdown content
  const images = (frontmatter as any).images || [];
  const items = config.parseFunction(data.content, images);

  return (
    <ContentLayout frontmatter={enhancedFrontmatter}>
      <div className="max-w-6xl mx-auto">
        <PageTitle
          title={config.title}
          description={config.description}
          align="center"
          size="large"
        />

        <div className="mb-8 text-center">
          <Link 
            href="/warner"
            className="inline-flex items-center px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            ← Back to D. Warner North
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {config.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className={`text-${stat.color}-600 mb-3 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Access (if available) */}
        {config.quickAccess && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {config.quickAccess.map((item, index) => (
              <Link 
                key={index}
                href={item.href}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`text-${item.color}-600 mb-3 text-xl`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Content List */}
        {items && items.length > 0 ? (
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {item.content.split('\n').map((line: string, lineIndex: number) => (
                    <p key={lineIndex} className="mb-2">
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {indexType} content found
            </h3>
            <p className="text-gray-600">
              Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
