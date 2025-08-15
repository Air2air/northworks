/**
 * Phase 3 Components: Analytics, Accessibility, and Advanced Features
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Phase3EnhancedFrontmatter,
  AnalyticsData,
  AdvancedAccessibility,
  generateStructuredData 
} from '@/types/phase3Enhanced';

// Analytics Dashboard Component
interface AnalyticsDashboardProps {
  analytics: AnalyticsData;
  contentId: string;
}

export function AnalyticsDashboard({ analytics, contentId }: AnalyticsDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'engagement' | 'sources' | 'performance'>('overview');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Content Analytics</h3>
      
      {/* Metric Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'engagement', label: 'Engagement' },
          { key: 'sources', label: 'Traffic Sources' },
          { key: 'performance', label: 'Performance' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedMetric(tab.key as any)}
            className={`pb-2 px-1 ${
              selectedMetric === tab.key 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {selectedMetric === 'overview' && (
        <OverviewPanel analytics={analytics} />
      )}
      
      {selectedMetric === 'engagement' && (
        <EngagementPanel analytics={analytics} />
      )}
      
      {selectedMetric === 'sources' && (
        <SourcesPanel analytics={analytics} />
      )}
      
      {selectedMetric === 'performance' && (
        <PerformancePanel analytics={analytics} />
      )}
    </div>
  );
}

function OverviewPanel({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Page Views"
        value={analytics.page_views.toLocaleString()}
        icon="👁️"
      />
      <MetricCard
        title="Avg. Time"
        value={analytics.average_time_on_page}
        icon="⏱️"
      />
      <MetricCard
        title="Bounce Rate"
        value={`${(analytics.bounce_rate * 100).toFixed(1)}%`}
        icon="🏃"
      />
      <MetricCard
        title="Social Shares"
        value={analytics.social_shares.total.toString()}
        icon="📤"
      />
    </div>
  );
}

function EngagementPanel({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Social Shares Breakdown */}
      <div>
        <h4 className="font-medium mb-3">Social Media Shares</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(analytics.social_shares).map(([platform, count]) => {
            if (platform === 'total') return null;
            return (
              <div key={platform} className="text-center p-3 bg-gray-50 rounded">
                <div className="font-medium capitalize">{platform}</div>
                <div className="text-lg text-blue-600">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Sections */}
      {analytics.popular_sections && analytics.popular_sections.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Most Engaging Sections</h4>
          <div className="space-y-2">
            {analytics.popular_sections.map((section, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{section.section_title}</span>
                <div className="text-sm text-gray-600">
                  <span className="mr-4">Score: {(section.engagement_score * 100).toFixed(0)}%</span>
                  <span>Time: {section.time_spent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SourcesPanel({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Top Referral Sources</h4>
        <div className="space-y-2">
          {analytics.referral_sources.map((source, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">{source.source}</span>
              <div className="text-sm text-gray-600">
                <span className="mr-4">{source.visits} visits</span>
                <span>{source.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {analytics.search_keywords && analytics.search_keywords.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Search Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.search_keywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PerformancePanel({ analytics }: { analytics: AnalyticsData }) {
  const { performance_metrics } = analytics;
  
  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-600';
      case 'needs_improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Core Web Vitals</h4>
        <div className={`text-center p-4 rounded-lg ${
          performance_metrics.core_web_vitals_score === 'good' 
            ? 'bg-green-50 border border-green-200' 
            : performance_metrics.core_web_vitals_score === 'needs_improvement'
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`text-2xl font-bold ${getScoreColor(performance_metrics.core_web_vitals_score)}`}>
            {performance_metrics.core_web_vitals_score.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Load Time"
          value={`${performance_metrics.load_time}ms`}
          icon="⚡"
        />
        <MetricCard
          title="LCP"
          value={`${performance_metrics.largest_contentful_paint}ms`}
          icon="🎯"
        />
        <MetricCard
          title="FID"
          value={`${performance_metrics.first_input_delay}ms`}
          icon="👆"
        />
        <MetricCard
          title="CLS"
          value={performance_metrics.cumulative_layout_shift.toFixed(3)}
          icon="📐"
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

// Accessibility Features Component
interface AccessibilityFeaturesProps {
  accessibility: AdvancedAccessibility;
  content: string;
}

export function AccessibilityFeatures({ accessibility, content }: AccessibilityFeaturesProps) {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Apply accessibility preferences
    document.documentElement.style.fontSize = `${fontSize}px`;
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [fontSize, highContrast, reducedMotion]);

  return (
    <>
      {/* Accessibility Menu Button */}
      <button
        onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Accessibility options"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Accessibility Menu */}
      {showAccessibilityMenu && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50">
          <h3 className="font-semibold mb-4">Accessibility Options</h3>
          
          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 bg-gray-100 rounded"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <span className="flex-1 text-center">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-2 py-1 bg-gray-100 rounded"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">High Contrast</label>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-pressed={highContrast}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Reduced Motion</label>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-pressed={reducedMotion}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Skip Links */}
            <div className="pt-2 border-t border-gray-200">
              <h4 className="font-medium text-sm mb-2">Quick Navigation</h4>
              <div className="space-y-1">
                <a href="#main-content" className="block text-sm text-blue-600 hover:underline">
                  Skip to main content
                </a>
                <a href="#navigation" className="block text-sm text-blue-600 hover:underline">
                  Skip to navigation
                </a>
                <a href="#footer" className="block text-sm text-blue-600 hover:underline">
                  Skip to footer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Information Panel */}
      <AccessibilityInfoPanel accessibility={accessibility} />
    </>
  );
}

function AccessibilityInfoPanel({ accessibility }: { accessibility: AdvancedAccessibility }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-blue-900">Accessibility Information</h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showInfo ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {showInfo && (
        <div className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">WCAG AA Compliant:</span>
              <span className={`ml-2 ${accessibility.wcag_aa_compliant ? 'text-green-600' : 'text-red-600'}`}>
                {accessibility.wcag_aa_compliant ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Screen Reader Optimized:</span>
              <span className={`ml-2 ${accessibility.screen_reader_optimized ? 'text-green-600' : 'text-red-600'}`}>
                {accessibility.screen_reader_optimized ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Keyboard Navigation:</span>
              <span className={`ml-2 ${accessibility.keyboard_navigation ? 'text-green-600' : 'text-red-600'}`}>
                {accessibility.keyboard_navigation ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Transcript Available:</span>
              <span className={`ml-2 ${accessibility.transcript_available ? 'text-green-600' : 'text-red-600'}`}>
                {accessibility.transcript_available ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          </div>

          {accessibility.reading_level && (
            <div>
              <span className="font-medium">Reading Level:</span>
              <span className="ml-2">
                Grade {accessibility.reading_level.grade_level} ({accessibility.reading_level.recommended_age})
              </span>
            </div>
          )}

          {accessibility.accessibility_testing && (
            <div>
              <span className="font-medium">Accessibility Score:</span>
              <span className="ml-2">
                {accessibility.accessibility_testing.overall_score}/100
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced SEO Head Component
interface EnhancedSEOHeadProps {
  frontmatter: Phase3EnhancedFrontmatter;
}

export function EnhancedSEOHead({ frontmatter }: EnhancedSEOHeadProps) {
  const { advanced_seo } = frontmatter;
  const structuredData = generateStructuredData(frontmatter);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{advanced_seo.meta_title}</title>
      <meta name="description" content={advanced_seo.meta_description} />
      <meta name="keywords" content={advanced_seo.keywords.join(', ')} />
      <link rel="canonical" href={advanced_seo.canonical_url} />

      {/* Open Graph */}
      <meta property="og:title" content={advanced_seo.og_title || advanced_seo.meta_title} />
      <meta property="og:description" content={advanced_seo.og_description || advanced_seo.meta_description} />
      <meta property="og:type" content={advanced_seo.og_type || 'article'} />
      <meta property="og:url" content={advanced_seo.canonical_url} />
      {advanced_seo.og_image && <meta property="og:image" content={advanced_seo.og_image} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={advanced_seo.twitter_card || 'summary_large_image'} />
      <meta name="twitter:title" content={advanced_seo.twitter_title || advanced_seo.meta_title} />
      <meta name="twitter:description" content={advanced_seo.twitter_description || advanced_seo.meta_description} />
      {advanced_seo.twitter_image && <meta name="twitter:image" content={advanced_seo.twitter_image} />}
      {advanced_seo.twitter_creator && <meta name="twitter:creator" content={advanced_seo.twitter_creator} />}

      {/* Robots */}
      {advanced_seo.robots && (
        <meta name="robots" content={
          `${advanced_seo.robots.index ? 'index' : 'noindex'},${advanced_seo.robots.follow ? 'follow' : 'nofollow'}`
        } />
      )}

      {/* hreflang */}
      {advanced_seo.hreflang && advanced_seo.hreflang.map((lang, index) => (
        <link key={index} rel="alternate" hrefLang={lang.lang} href={lang.url} />
      ))}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb Structured Data */}
      {advanced_seo.breadcrumb_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': advanced_seo.breadcrumb_schema.map((crumb, index) => ({
                '@type': 'ListItem',
                'position': crumb.position,
                'name': crumb.name,
                'item': crumb.url
              }))
            })
          }}
        />
      )}
    </Head>
  );
}
