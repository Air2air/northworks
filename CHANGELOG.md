# Changelog

All notable changes to the Northworks project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- **Increased card thumbnail image heights** for better visual impact (2025-10-06)
  - **UnifiedCard** (content pages):
    - Mobile viewport: 160px → 208px (`h-40` → `h-52`, +30% increase)
    - Small screens: 192px → 240px (`sm:h-48` → `sm:h-60`, +25% increase)
    - Desktop: Remains full height stretch (`md:h-full`)
    - Location: `src/components/ui/UnifiedCard.tsx` `getImageClasses()` function
  - **LandingCard** (homepage):
    - Mobile: 192px → 256px (`h-48` → `h-64`, +33% increase)
    - Small screens: Added responsive sizing (`sm:h-72` = 288px)
    - Desktop: Added responsive sizing (`md:h-80` = 320px)
    - Location: `src/components/ui/LandingCard.tsx` `getImageClasses()` function

### Removed
- **Dead code removal** - 7 unused files (2025-10-06)
  - 4 unused components: `CardMetadata.tsx`, `HomeNavCard.tsx`, `LandingGrid.tsx`, `PublicationInfo.tsx`
  - 3 unused libraries: `content-processing.ts`, `markdownLoader.ts`, `unifiedSearch.ts`
  - See `docs/DEAD_CODE_REMOVAL_REPORT.md` for full details

### Added
- **Documentation improvements** (2025-10-06)
  - Added `docs/DEAD_CODE_REMOVAL_REPORT.md` with comprehensive dead code analysis
  - Updated `CODEBASE_MAP.md` with recent changes section
  - Updated `AI_ASSISTANT_GUIDE.md` with current image sizing specifications
  - Created this `CHANGELOG.md` file

---

## [1.0.0] - 2025-01 (Previous Major Milestones)

### Added
- Unified component architecture (UnifiedCard, UnifiedList, UnifiedLayout)
- Centralized type system in `src/types/index.ts`
- Comprehensive test suite (308 tests, 100% passing)
- AI assistant documentation (`CODEBASE_MAP.md`, `AI_ASSISTANT_GUIDE.md`)

### Changed
- Migrated to Next.js 15.4.6 with App Router
- Consolidated content loading into unified-data.ts
- Standardized all components to use centralized types

### Removed
- Phase 1 cleanup: 135 files removed (duplicates, empty scripts, unused code)
  - See `docs/CODEBASE_CLEANUP_REPORT.md` for details

---

## Notes

**Total Cleanup Impact Across All Phases:**
- 142 files removed (135 in Phase 1 + 7 in Phase 2)
- 26% reduction in total tracked files
- Zero breaking changes (all tests passing)
- Zero TypeScript errors

**Testing:**
- All 308 tests passing after every change
- Full build verification completed
- No runtime errors or warnings

**Documentation:**
- All major changes documented in detail
- AI assistant guides kept up-to-date
- Technical specifications preserved
