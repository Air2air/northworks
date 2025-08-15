/**
 * Ultimate Enhanced Page Component
 * Consolidates all 4 phases of enhanced frontmatter into a single, comprehensive component
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { Phase3EnhancedFrontmatter } from '@/types/phase3Enhanced';
import { ContentData } from '@/types/content';

// Import all phase components
import { EnhancedContentPage } from '@/components/enhanced/Phase1Components';
import { MediaGalleryComponent, AdvancedTaxonomyDisplay, RelatedContentComponent } from '@/components/enhanced/Phase2Components';
import { AnalyticsDashboard, AccessibilityFeatures, EnhancedSEOHead } from '@/components/enhanced/Phase3Components';
import { 
  ContentEnhancementScore, 
  PerformanceMonitor, 
  OptimizationSuggestions 
} from '@/components/enhanced/Phase4Components';

interface UltimateEnhancedPageProps {
  contentData: ContentData;
  children: React.ReactNode;
  adminMode?: boolean;
  showAnalytics?: boolean;
  showOptimizations?: boolean;
}

export default function UltimateEnhancedPageComponent({ 
  contentData, 
  children, 
  adminMode = false,
  showAnalytics = false,
  showOptimizations = false
}: UltimateEnhancedPageProps) {
  if (!contentData || !contentData.frontmatter) {
    notFound();
  }

  const frontmatter = contentData.frontmatter as Phase3EnhancedFrontmatter;
  const hasEnhancedFeatures = Boolean(
    frontmatter.content_classification || 
    frontmatter.media || 
    frontmatter.advanced_seo ||
    frontmatter.analytics
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Phase 3: Enhanced SEO Head */}
      {frontmatter.advanced_seo && (
        <EnhancedSEOHead frontmatter={frontmatter} />
      )}

      {/* Phase 3: Accessibility Features - Global */}
      {frontmatter.advanced_accessibility && (
        <AccessibilityFeatures 
          accessibility={frontmatter.advanced_accessibility}
          content={typeof children === 'string' ? children : ''}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Controls */}
        {adminMode && (
          <div className="py-4 border-b border-gray-200 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Admin Mode</span>
                {hasEnhancedFeatures && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Enhanced Content
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  onClick={() => window.location.reload()}
                >
                  Refresh Analytics
                </button>
                <button 
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                  onClick={() => console.log('Edit mode toggle')}
                >
                  Edit Content
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Phase 1: Enhanced Content Page */}
            <EnhancedContentPage contentData={contentData}>
              {children}
            </EnhancedContentPage>

            {/* Phase 2: Rich Media Gallery */}
            {frontmatter.media && (
              <div className="mt-8">
                <MediaGalleryComponent media={frontmatter.media} />
              </div>
            )}

            {/* Phase 2: Related Content */}
            {frontmatter.content_relationships && (
              <div className="mt-8">
                <RelatedContentComponent 
                  relationships={frontmatter.content_relationships}
                  currentTitle={frontmatter.title}
                />
              </div>
            )}

            {/* Phase 4: Optimization Suggestions (Admin) */}
            {adminMode && showOptimizations && (
              <div className="mt-8">
                <OptimizationSuggestions 
                  frontmatter={frontmatter}
                  content={typeof children === 'string' ? children : ''}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase 4: Content Enhancement Score */}
            {hasEnhancedFeatures && (
              <ContentEnhancementScore 
                frontmatter={frontmatter}
                showDetails={adminMode}
              />
            )}

            {/* Phase 2: Advanced Taxonomy */}
            {frontmatter.advanced_taxonomy && (
              <AdvancedTaxonomyDisplay taxonomy={frontmatter.advanced_taxonomy} />
            )}

            {/* Phase 3: Analytics Dashboard (Admin Only) */}
            {adminMode && showAnalytics && frontmatter.analytics && (
              <AnalyticsDashboard 
                analytics={frontmatter.analytics}
                contentId={frontmatter.id}
              />
            )}

            {/* Phase 4: Performance Monitor (Admin Only) */}
            {adminMode && frontmatter.id && (
              <PerformanceMonitor 
                contentId={frontmatter.id}
                frontmatter={frontmatter}
              />
            )}
          </div>
        </div>

        {/* Bottom Section - Additional Admin Tools */}
        {adminMode && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content Insights */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Content Insights</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reading Time:</span>
                    <span className="font-mono">
                      {frontmatter.content_classification?.reading_time || 'Unknown'} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <span className="font-mono">
                      {frontmatter.enhanced_publication?.word_count || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-mono text-xs">
                      {frontmatter.enhanced_publication?.updated_date || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO Status */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">SEO Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Meta Description:</span>
                    <span className={`font-mono ${frontmatter.advanced_seo?.meta_description ? 'text-green-600' : 'text-red-600'}`}>
                      {frontmatter.advanced_seo?.meta_description ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Structured Data:</span>
                    <span className={`font-mono ${frontmatter.advanced_seo?.structured_data ? 'text-green-600' : 'text-red-600'}`}>
                      {frontmatter.advanced_seo?.structured_data ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Keywords:</span>
                    <span className="font-mono">
                      {frontmatter.advanced_seo?.keywords?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accessibility Status */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-3">Accessibility</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>WCAG AA:</span>
                    <span className={`font-mono ${frontmatter.advanced_accessibility?.wcag_aa_compliant ? 'text-green-600' : 'text-red-600'}`}>
                      {frontmatter.advanced_accessibility?.wcag_aa_compliant ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alt Text Quality:</span>
                    <span className="font-mono text-xs">
                      {frontmatter.advanced_accessibility?.alt_text_quality || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading Level:</span>
                    <span className="font-mono">
                      Grade {frontmatter.advanced_accessibility?.reading_level?.grade_level || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export for backward compatibility and specific use cases
export { UltimateEnhancedPageComponent };
