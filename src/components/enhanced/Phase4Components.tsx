/**
 * Phase 4: Ultimate Integration Components
 * The final consolidated components that bring together all phases
 */

import React from 'react';
import { Phase3EnhancedFrontmatter } from '@/types/phase3Enhanced';
import { EnhancedContentPage } from '@/components/enhanced/Phase1Components';
import { MediaGalleryComponent, AdvancedTaxonomyDisplay, RelatedContentComponent } from '@/components/enhanced/Phase2Components';
import { AnalyticsDashboard, AccessibilityFeatures, EnhancedSEOHead } from '@/components/enhanced/Phase3Components';
import { ContentData } from '@/types/content';

// Ultimate Unified Page Component - Handles ALL content types with full enhancement
interface UltimateEnhancedPageProps {
  contentData: ContentData;
  children: React.ReactNode;
  adminMode?: boolean;
  showAnalytics?: boolean;
}

export function UltimateEnhancedPage({ 
  contentData, 
  children, 
  adminMode = false,
  showAnalytics = false 
}: UltimateEnhancedPageProps) {
  const frontmatter = contentData.frontmatter as Phase3EnhancedFrontmatter;
  
  return (
    <>
      {/* Enhanced SEO Head */}
      {frontmatter.advanced_seo && (
        <EnhancedSEOHead frontmatter={frontmatter} />
      )}

      {/* Main Content */}
      <EnhancedContentPage contentData={contentData}>
        {children}
      </EnhancedContentPage>

      {/* Phase 2: Rich Media Gallery */}
      {frontmatter.media && (
        <MediaGalleryComponent media={frontmatter.media} />
      )}

      {/* Phase 2: Advanced Taxonomy */}
      {frontmatter.advanced_taxonomy && (
        <AdvancedTaxonomyDisplay taxonomy={frontmatter.advanced_taxonomy} />
      )}

      {/* Phase 2: Related Content */}
      {frontmatter.content_relationships && (
        <RelatedContentComponent 
          relationships={frontmatter.content_relationships}
          currentTitle={frontmatter.title}
        />
      )}

      {/* Phase 3: Analytics (Admin Only) */}
      {adminMode && showAnalytics && frontmatter.analytics && (
        <div className="mt-8">
          <AnalyticsDashboard 
            analytics={frontmatter.analytics}
            contentId={frontmatter.id}
          />
        </div>
      )}

      {/* Phase 3: Accessibility Features */}
      {frontmatter.advanced_accessibility && (
        <AccessibilityFeatures 
          accessibility={frontmatter.advanced_accessibility}
          content={children as string}
        />
      )}
    </>
  );
}

// Content Enhancement Score Component
interface ContentScoreProps {
  frontmatter: Phase3EnhancedFrontmatter;
  showDetails?: boolean;
}

export function ContentEnhancementScore({ frontmatter, showDetails = false }: ContentScoreProps) {
  const calculateScore = (frontmatter: Phase3EnhancedFrontmatter): number => {
    let score = 0;
    let maxScore = 100;

    // Phase 1 scoring (25 points)
    if (frontmatter.content_classification) score += 10;
    if (frontmatter.enhanced_publication) score += 8;
    if (frontmatter.enhanced_subjects) score += 7;

    // Phase 2 scoring (35 points)
    if (frontmatter.media?.hero_image) score += 10;
    if (frontmatter.media?.gallery?.length) score += 8;
    if (frontmatter.advanced_taxonomy?.people?.length) score += 5;
    if (frontmatter.advanced_taxonomy?.organizations?.length) score += 4;
    if (frontmatter.advanced_taxonomy?.works?.length) score += 4;
    if (frontmatter.content_relationships?.related_content?.length) score += 4;

    // Phase 3 scoring (40 points)
    if (frontmatter.advanced_seo) score += 15;
    if (frontmatter.advanced_accessibility) score += 12;
    if (frontmatter.analytics) score += 8;
    if (frontmatter.content_management) score += 5;

    return Math.round((score / maxScore) * 100);
  };

  const score = calculateScore(frontmatter);
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Enhancement Score</h3>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </div>
          <div className="text-sm text-gray-600">
            {getScoreLabel(score)}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Basic Enhancement (Phase 1)</span>
              <span className="font-mono">
                {frontmatter.content_classification ? '✓' : '✗'} Classification
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rich Media (Phase 2)</span>
              <span className="font-mono">
                {frontmatter.media?.hero_image ? '✓' : '✗'} Hero Image
              </span>
            </div>
            <div className="flex justify-between">
              <span>Analytics & SEO (Phase 3)</span>
              <span className="font-mono">
                {frontmatter.advanced_seo ? '✓' : '✗'} SEO Optimization
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Performance Monitoring Component
interface PerformanceMonitorProps {
  contentId: string;
  frontmatter: Phase3EnhancedFrontmatter;
}

export function PerformanceMonitor({ contentId, frontmatter }: PerformanceMonitorProps) {
  const [performanceData, setPerformanceData] = React.useState<any>(null);

  React.useEffect(() => {
    // Simulate performance monitoring
    const metrics = {
      loadTime: Math.random() * 2000 + 500, // 0.5-2.5s
      lcp: Math.random() * 3000 + 1000, // 1-4s
      fid: Math.random() * 100 + 50, // 50-150ms
      cls: Math.random() * 0.2, // 0-0.2
      score: Math.random() * 40 + 60 // 60-100
    };
    setPerformanceData(metrics);
  }, [contentId]);

  if (!performanceData) {
    return <div className="animate-pulse">Loading performance data...</div>;
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {performanceData.loadTime.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600">Load Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {performanceData.lcp.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600">LCP</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {performanceData.fid.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600">FID</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {performanceData.cls.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">CLS</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Overall Score</span>
          <span className={`text-xl font-bold ${getScoreColor(performanceData.score)}`}>
            {performanceData.score.toFixed(0)}/100
          </span>
        </div>
      </div>
    </div>
  );
}

// Content Optimization Suggestions Component
interface OptimizationSuggestionsProps {
  frontmatter: Phase3EnhancedFrontmatter;
  content: string;
}

export function OptimizationSuggestions({ frontmatter, content }: OptimizationSuggestionsProps) {
  const suggestions = React.useMemo(() => {
    const suggestions: Array<{
      type: 'seo' | 'accessibility' | 'performance' | 'content';
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      action?: string;
    }> = [];

    // SEO Suggestions
    if (!frontmatter.advanced_seo?.meta_description) {
      suggestions.push({
        type: 'seo',
        priority: 'high',
        title: 'Missing Meta Description',
        description: 'Add a compelling meta description to improve search visibility.',
        action: 'Add meta description'
      });
    }

    if (!frontmatter.media?.hero_image) {
      suggestions.push({
        type: 'seo',
        priority: 'medium',
        title: 'No Hero Image',
        description: 'Hero images improve social sharing and engagement.',
        action: 'Add hero image'
      });
    }

    // Accessibility Suggestions
    if (frontmatter.advanced_accessibility?.alt_text_quality === 'needs_improvement') {
      suggestions.push({
        type: 'accessibility',
        priority: 'high',
        title: 'Improve Alt Text',
        description: 'Some images need better alternative text descriptions.',
        action: 'Review alt text'
      });
    }

    // Content Suggestions
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      suggestions.push({
        type: 'content',
        priority: 'medium',
        title: 'Content Length',
        description: 'Content might be too short for optimal SEO performance.',
        action: 'Expand content'
      });
    }

    // Performance Suggestions
    if (frontmatter.media?.gallery && frontmatter.media.gallery.length > 10) {
      suggestions.push({
        type: 'performance',
        priority: 'medium',
        title: 'Large Image Gallery',
        description: 'Consider implementing lazy loading for better performance.',
        action: 'Optimize images'
      });
    }

    return suggestions;
  }, [frontmatter, content]);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'seo': return '🔍';
      case 'accessibility': return '♿';
      case 'performance': return '⚡';
      case 'content': return '📝';
      default: return '💡';
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">✅</span>
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              Excellent Optimization!
            </h3>
            <p className="text-green-700">
              This content is well-optimized across all areas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="border rounded-lg p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <span className="text-xl mr-2">
                  {getTypeIcon(suggestion.type)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              {suggestion.action && (
                <button className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  {suggestion.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Migration Progress Component
interface MigrationProgressProps {
  totalFiles: number;
  processedFiles: number;
  errors: number;
  warnings: number;
}

export function MigrationProgress({ 
  totalFiles, 
  processedFiles, 
  errors, 
  warnings 
}: MigrationProgressProps) {
  const percentage = totalFiles > 0 ? (processedFiles / totalFiles) * 100 : 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Migration Progress</h3>
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{processedFiles} of {totalFiles} files</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{processedFiles}</div>
            <div className="text-sm text-gray-600">Processed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{warnings}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{errors}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t">
          <div className="text-sm">
            <strong>Status:</strong> {
              processedFiles === totalFiles 
                ? errors > 0 
                  ? 'Completed with errors' 
                  : 'Migration completed successfully'
                : 'Migration in progress...'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component for Phase 4
interface AdminDashboardProps {
  contentData: ContentData[];
  migrationStatus?: {
    inProgress: boolean;
    progress: MigrationProgressProps;
  };
}

export function AdminDashboard({ contentData, migrationStatus }: AdminDashboardProps) {
  const stats = React.useMemo(() => {
    const enhanced = contentData.filter(item => 
      (item.frontmatter as any).content_classification
    );
    const withMedia = contentData.filter(item => 
      (item.frontmatter as any).media?.hero_image
    );
    const optimized = contentData.filter(item => 
      (item.frontmatter as any).advanced_seo
    );

    return {
      total: contentData.length,
      enhanced: enhanced.length,
      withMedia: withMedia.length,
      optimized: optimized.length,
      enhancementRate: contentData.length > 0 ? (enhanced.length / contentData.length) * 100 : 0
    };
  }, [contentData]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Content Enhancement Dashboard</h2>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Content</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.enhanced}</div>
            <div className="text-sm text-gray-600">Enhanced</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.withMedia}</div>
            <div className="text-sm text-gray-600">With Media</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.optimized}</div>
            <div className="text-sm text-gray-600">SEO Optimized</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {stats.enhancementRate.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Enhancement Rate</div>
          </div>
        </div>

        {/* Enhancement Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Enhancement Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.enhancementRate}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {stats.enhanced} of {stats.total} content items enhanced
          </div>
        </div>
      </div>

      {/* Migration Status */}
      {migrationStatus?.inProgress && (
        <MigrationProgress {...migrationStatus.progress} />
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Start Migration
          </button>
          <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Validate Content
          </button>
          <button className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Generate Report
          </button>
          <button className="p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
