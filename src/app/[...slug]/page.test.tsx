import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockGetAllContentSlugs = vi.fn();
const mockLoadNormalizedContent = vi.fn();
const mockGenerateNormalizedMetadata = vi.fn();
const mockShouldUseDirectRouting = vi.fn();
const mockNotFound = vi.fn();

vi.mock('next/navigation', () => ({
  notFound: mockNotFound,
}));

vi.mock('@/lib/content', () => ({
  getAllContentSlugs: mockGetAllContentSlugs,
}));

vi.mock('@/lib/page-templates', () => ({
  loadNormalizedContent: mockLoadNormalizedContent,
  generateNormalizedMetadata: mockGenerateNormalizedMetadata,
  shouldUseDirectRouting: mockShouldUseDirectRouting,
  CONTENT_TYPE_CONFIG: {
    interview: {
      routeLabel: 'Interviews',
      routePath: '/interviews',
    },
    publication: {
      routeLabel: 'Publications',
      routePath: '/publications',
    },
  },
}));

vi.mock('@/components/pages/UnifiedContentPage', () => ({
  default: ({ data, backLinkOverride }: { data: any; backLinkOverride?: any }) => ({
    component: 'UnifiedContentPage',
    data,
    backLinkOverride,
  }),
}));

describe('Catch-all route page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('generateStaticParams includes direct and categorized routes', async () => {
    const { generateStaticParams } = await import('./page');

    mockGetAllContentSlugs.mockReturnValue(['w-pub-seif-iv', 'c-aikin']);
    mockLoadNormalizedContent.mockImplementation(async (slug: string) => {
      if (slug === 'w-pub-seif-iv') {
        return { contentType: 'publication' };
      }

      if (slug === 'c-aikin') {
        return { contentType: 'interview' };
      }

      return null;
    });
    mockShouldUseDirectRouting.mockImplementation((slug: string) => slug.startsWith('w-'));

    const params = await generateStaticParams();

    expect(params).toEqual([
      { slug: ['w-pub-seif-iv'] },
      { slug: ['interviews', 'c-aikin'] },
    ]);
  });

  test('passes mailto-containing content through to UnifiedContentPage', async () => {
    const module = await import('./page');
    const UniversalContentPage = module.default;

    const normalizedData = {
      slug: 'w-pub-seif-iv',
      contentType: 'publication',
      content: 'Contact [NorthWorks](mailto:northworks@mindspring.com)',
      frontmatter: { title: 'SEIF Paper' },
      collection: 'warner',
      breadcrumbs: [],
      useSectionCards: true,
      isWarnerContent: true,
    };

    mockShouldUseDirectRouting.mockReturnValue(true);
    mockLoadNormalizedContent.mockResolvedValue(normalizedData);

    const rendered = await UniversalContentPage({
      params: Promise.resolve({ slug: ['w-pub-seif-iv'] }),
    });

    expect(mockLoadNormalizedContent).toHaveBeenCalledWith('w-pub-seif-iv', undefined);
    expect(rendered.props.data.content).toContain('mailto:northworks@mindspring.com');
  });
});
