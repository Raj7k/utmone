# Dashboard Enhancement Implementation Plan

## Overview
This document outlines the complete implementation plan for enhancing the link management dashboard with comprehensive list views, search, filtering, detail views, and folder/tag organization.

---

## Phase 1: Enhanced Table & Connected Filters (Foundation)

### 1.1 Database Changes
**Migration Required**: None - all fields exist in schema

### 1.2 New Components to Create

#### `src/components/links/EnhancedLinksTable.tsx`
- Replace current `LinksTable` with comprehensive column set
- Columns:
  - Title (with edit inline capability)
  - Short URL (copy button + open in new tab)
  - Destination URL (truncated to 40 chars, hover tooltip shows full URL)
  - UTM Summary (format: `source / medium / campaign`)
  - Domain (badge component)
  - Owner/Creator (fetch from profiles via created_by)
  - Created Date (relative: "2 days ago")
  - Updated Date (relative)
  - Clicks: Lifetime (total_clicks) + Last 30 days (calculated)
  - Status (badge: active/paused/archived/expired)
- Actions dropdown per row
- Sorting capability on all columns
- Pagination (20 per page default, configurable)

#### `src/components/links/AdvancedFilters.tsx`
- Replace current `LinkFilters` component
- Filter sections:
  - **Search**: Title, URL, campaign (current functionality)
  - **Status**: Active, Paused, Archived, Expired (multi-select)
  - **Date Range**: Created date picker range, Updated date picker range
  - **Domain**: Multi-select dropdown of workspace domains
  - **Owner**: Multi-select dropdown of workspace members
  - **UTM Filters**: 
    - Campaign (multi-select autocomplete)
    - Source (multi-select autocomplete)
    - Medium (multi-select autocomplete)
    - Term (text input)
    - Content (text input)
  - **Folder**: Tree-select dropdown
  - **Tags**: Multi-select with tag chips
- Filter pills showing active filters
- Clear all filters button
- Save filter preset functionality (stretch goal)

#### `src/components/links/FilterPills.tsx`
- Display active filters as removable pills
- Quick clear functionality per filter
- "Clear all" button

### 1.3 New Hooks to Create

#### `src/hooks/useEnhancedLinks.tsx`
- Extends current links fetching with:
  - Search query parameter
  - Status filter (array)
  - Date range filters (created_at, updated_at)
  - Domain filter (array)
  - Owner filter (array)
  - UTM filters (campaign, source, medium, term, content)
  - Folder filter
  - Tags filter (array)
  - Sorting (column, direction)
  - Pagination (page, pageSize)
- Returns paginated results with total count
- Calculates "last 30 days clicks" via joined query to link_clicks

#### `src/hooks/useLinkOwners.tsx`
- Fetches all link creators in workspace
- Returns: id, full_name, email for filter dropdown
- Uses profiles table joined with links via created_by

#### `src/hooks/useUTMOptions.tsx`
- Fetches unique UTM values for workspace
- Returns arrays: campaigns, sources, mediums, terms, contents
- Used for autocomplete in filters

### 1.4 Files to Modify

#### `src/pages/Links.tsx`
- Replace `<LinksTable>` with `<EnhancedLinksTable>`
- Replace `<LinkFilters>` with `<AdvancedFilters>`
- Add `<FilterPills>` display
- Wire up all filter state management
- Add URL query params for filter persistence

#### `src/components/LinksTable.tsx`
- Keep for backward compatibility initially
- Mark as deprecated
- Remove after Phase 1 complete

### 1.5 Key Implementation Details

**Last 30 Days Clicks Calculation**:
```sql
SELECT 
  l.*,
  COUNT(CASE WHEN lc.clicked_at >= NOW() - INTERVAL '30 days' THEN 1 END) as clicks_last_30_days
FROM links l
LEFT JOIN link_clicks lc ON l.id = lc.link_id
GROUP BY l.id
```

**Filter Query Building**:
- Use Supabase query builder chaining
- Apply `.or()` for multi-select filters within same category
- Apply `.and()` across different filter categories
- Use `.ilike()` for text search with wildcards

---

## Phase 2: Link Detail View & Edit Functionality

### 2.1 Database Changes
**Migration Required**: None - all fields exist

### 2.2 New Route to Create
- `/links/:linkId` - Detail/edit view for single link

### 2.3 New Pages to Create

#### `src/pages/LinkDetail.tsx`
- Full page layout with tabs:
  - **Overview Tab**: Link info + quick actions
  - **Analytics Tab**: Embedded analytics for this link
  - **QR Codes Tab**: List of QR codes for this link
  - **Activity Tab**: Audit log of changes (future)

### 2.4 New Components to Create

#### `src/components/links/LinkDetailOverview.tsx`
- Display sections:
  - **URLs Section**:
    - Short URL (large, copy button, open button, QR button)
    - Destination URL (full, editable)
    - Final URL with UTMs (computed, copyable)
  - **UTM Parameters Section**:
    - All 5 fields displayed with edit capability
    - Template selector to apply UTM template
    - "Clear all UTMs" button
  - **Settings Section**:
    - Domain selector (dropdown of verified domains)
    - Path selector
    - Slug (editable with validation)
    - Status toggle (active/paused/archived)
    - Expiry settings (date picker + max clicks)
    - Custom expiry message (textarea)
    - Fallback URL (input)
    - Redirect type (301/302)
  - **Organization Section**:
    - Folder selector (tree dropdown)
    - Tags (multi-select with create new)
  - **Metadata Section**:
    - Created by + date
    - Last updated + date
    - Total clicks + unique clicks
    - Last clicked date

#### `src/components/links/LinkDetailAnalytics.tsx`
- Embedded version of analytics dashboard
- Scoped to single link
- Shows: clicks over time, device breakdown, geo map, top referrers

#### `src/components/links/LinkDetailQRCodes.tsx`
- Grid of QR code cards for this link
- Each card shows: preview, name, variant name, download buttons
- "Generate New QR" button
- Edit/delete actions per QR

#### `src/components/links/LinkEditForm.tsx`
- Reusable form component for editing link properties
- Handles validation
- Real-time preview of final URL with UTMs
- Save/Cancel buttons
- Success/error toast notifications

#### `src/components/links/LinkActions.tsx`
- Action buttons for link:
  - Duplicate link (with dialog to modify before creating)
  - Archive link (with confirmation)
  - Delete link (with double confirmation + safety check)
  - Share link (copy, email, QR)
  - Export analytics (CSV)

### 2.5 New Hooks to Create

#### `src/hooks/useLinkDetail.tsx`
- Fetch single link by ID with all relations:
  - Join with profiles for creator info
  - Join with folders for folder path
  - Join with link_tags for tags
  - Join with qr_codes for QR list
- Returns comprehensive link object

#### `src/hooks/useUpdateLink.tsx`
- Mutation to update link properties
- Validation logic for slug uniqueness
- Updates updated_at timestamp
- Invalidates relevant queries

#### `src/hooks/useDuplicateLink.tsx`
- Mutation to clone existing link
- Generates new slug (appends "-copy" or increment)
- Preserves UTMs and settings
- Creates new DB record

#### `src/hooks/useDeleteLink.tsx`
- Mutation to soft or hard delete link
- Soft delete: sets status to archived
- Hard delete: removes from DB (with cascade)
- Safety checks: warns if link has many clicks

### 2.6 Files to Modify

#### `src/App.tsx` or routing file
- Add route: `<Route path="/links/:linkId" element={<LinkDetail />} />`

#### `src/components/links/EnhancedLinksTable.tsx`
- Make title clickable → navigate to `/links/:linkId`
- Add "View Details" to actions dropdown

---

## Phase 3: Folders & Tags Management

### 3.1 Database Changes

**Migration Required**: RLS policies for folders and link_tags tables

```sql
-- Enable RLS on folders table
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view folders in their workspaces"
ON public.folders FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Editors can create folders"
ON public.folders FOR INSERT
WITH CHECK (
  is_workspace_owner(auth.uid(), workspace_id) OR
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = folders.workspace_id
    AND user_id = auth.uid()
    AND role IN ('workspace_admin', 'editor')
  )
);

CREATE POLICY "Editors can update folders"
ON public.folders FOR UPDATE
USING (
  is_workspace_owner(auth.uid(), workspace_id) OR
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = folders.workspace_id
    AND user_id = auth.uid()
    AND role IN ('workspace_admin', 'editor')
  )
);

CREATE POLICY "Editors can delete folders"
ON public.folders FOR DELETE
USING (
  is_workspace_owner(auth.uid(), workspace_id) OR
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = folders.workspace_id
    AND user_id = auth.uid()
    AND role IN ('workspace_admin', 'editor')
  )
);

-- Enable RLS on link_tags table
ALTER TABLE public.link_tags ENABLE ROW LEVEL SECURITY;

-- Link tags policies
CREATE POLICY "Users can view tags for links in their workspaces"
ON public.link_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = link_tags.link_id
    AND has_workspace_access(auth.uid(), links.workspace_id)
  )
);

CREATE POLICY "Editors can create tags"
ON public.link_tags FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = link_tags.link_id
    AND (
      is_workspace_owner(auth.uid(), links.workspace_id) OR
      EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = links.workspace_id
        AND user_id = auth.uid()
        AND role IN ('workspace_admin', 'editor')
      )
    )
  )
);

CREATE POLICY "Editors can delete tags"
ON public.link_tags FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = link_tags.link_id
    AND (
      is_workspace_owner(auth.uid(), links.workspace_id) OR
      EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = links.workspace_id
        AND user_id = auth.uid()
        AND role IN ('workspace_admin', 'editor')
      )
    )
  )
);
```

### 3.2 New Pages to Create

#### `src/pages/Folders.tsx`
- Dedicated folder management page
- Tree view of folder hierarchy
- Breadcrumb navigation
- Create/rename/delete folder actions
- Drag-and-drop to reorganize (stretch)
- Shows link count per folder

### 3.3 New Components to Create

#### `src/components/folders/FolderTree.tsx`
- Recursive tree component
- Displays folder hierarchy
- Expandable/collapsible nodes
- Context menu per folder (rename, delete, add subfolder)
- Shows link count badge
- Drag-and-drop reordering

#### `src/components/folders/FolderSelector.tsx`
- Reusable dropdown for selecting folder
- Tree structure in dropdown
- Used in: link creation, link edit, bulk actions
- "Create new folder" option in dropdown

#### `src/components/folders/CreateFolderDialog.tsx`
- Dialog for creating new folder
- Fields: name, description, parent folder
- Validation: name required, unique within parent

#### `src/components/tags/TagManager.tsx`
- Component for managing workspace tags
- Tag list with usage count
- Create/rename/delete tag actions
- Merge tags functionality
- Color coding per tag (optional)

#### `src/components/tags/TagInput.tsx`
- Reusable multi-select tag input
- Create new tags inline
- Autocomplete from existing tags
- Used in: link creation, link edit, bulk actions

#### `src/components/tags/TagChip.tsx`
- Visual chip component for displaying tag
- Removable (X button)
- Color coded (optional)

### 3.4 New Hooks to Create

#### `src/hooks/useFolders.tsx`
- `useFolders()`: Fetch all folders for workspace (tree structure)
- `useCreateFolder()`: Create new folder mutation
- `useUpdateFolder()`: Update folder (rename, move) mutation
- `useDeleteFolder()`: Delete folder mutation (with safety check if has links)
- `useMoveLinkToFolder()`: Assign link to folder mutation

#### `src/hooks/useTags.tsx`
- `useTags()`: Fetch all unique tags for workspace with usage count
- `useCreateTag()`: Create new tag mutation (via link_tags insert)
- `useDeleteTag()`: Delete tag mutation (removes from all links)
- `useRenameMergeTag()`: Rename tag across all links or merge into another
- `useLinkTags(linkId)`: Fetch tags for specific link
- `useUpdateLinkTags(linkId)`: Update tags for specific link

### 3.5 Files to Modify

#### `src/components/links/EnhancedLinksTable.tsx`
- Add folder column (clickable → filter by folder)
- Add tags column (chip display, clickable → filter by tag)

#### `src/components/links/AdvancedFilters.tsx`
- Connect folder filter to `<FolderSelector>`
- Connect tags filter to `<TagInput>` (multi-select mode)

#### `src/components/links/LinkDetailOverview.tsx`
- Add Organization section with `<FolderSelector>` and `<TagInput>`

#### `src/components/CreateLinkDialog.tsx`
- Add folder selector (optional)
- Add tag input (optional)

#### Navigation
- Add "Folders" link to main navigation menu

---

## Phase 4: Advanced Filtering & Search

### 4.1 Database Changes
**Migration Required**: Add indexes for performance

```sql
-- Indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_links_workspace_status ON links(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_links_workspace_created_at ON links(workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_workspace_domain ON links(workspace_id, domain);
CREATE INDEX IF NOT EXISTS idx_links_folder_id ON links(folder_id);
CREATE INDEX IF NOT EXISTS idx_links_created_by ON links(created_by);
CREATE INDEX IF NOT EXISTS idx_links_utm_campaign ON links(workspace_id, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_links_utm_source ON links(workspace_id, utm_source);
CREATE INDEX IF NOT EXISTS idx_links_utm_medium ON links(workspace_id, utm_medium);
CREATE INDEX IF NOT EXISTS idx_link_tags_tag ON link_tags(tag);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_clicked_at ON link_clicks(link_id, clicked_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_links_search ON links 
USING gin(to_tsvector('english', title || ' ' || destination_url || ' ' || COALESCE(utm_campaign, '')));
```

### 4.2 New Components to Create

#### `src/components/links/SavedFilters.tsx`
- Save current filter configuration with name
- Quick load saved filter presets
- Manage saved filters (rename, delete)
- Share filter presets with team (workspace-level)

#### `src/components/links/BulkActions.tsx`
- Checkbox selection in table (select all, select page)
- Bulk action dropdown:
  - Change status (active/paused/archived)
  - Move to folder
  - Add/remove tags
  - Export selected
  - Delete selected (with confirmation)
- Selected count display
- Clear selection button

#### `src/components/links/ColumnCustomizer.tsx`
- Dialog to show/hide table columns
- Reorder columns (drag-and-drop)
- Reset to default columns
- Save column preferences per user

### 4.3 New Hooks to Create

#### `src/hooks/useSavedFilters.tsx`
- Store filter presets in local storage or DB (user_settings table)
- CRUD operations for filter presets
- Share presets at workspace level

#### `src/hooks/useBulkLinkActions.tsx`
- Mutations for bulk operations
- Transaction handling
- Progress tracking for large bulk operations
- Error handling with partial success reporting

#### `src/hooks/useColumnPreferences.tsx`
- Store column visibility and order preferences
- Persist in local storage or user_settings table
- Load on component mount

### 4.4 Files to Modify

#### `src/components/links/EnhancedLinksTable.tsx`
- Add checkbox column for row selection
- Add bulk action bar when items selected
- Implement column customization
- Add export button (CSV/XLSX)

#### `src/components/links/AdvancedFilters.tsx`
- Add "Save Filter" button
- Add "Saved Filters" dropdown
- Show saved filter indicator when active

---

## Phase 5: Analytics Integration

### 5.1 Database Changes
**Migration Required**: None - use existing link_clicks table

### 5.2 New Components to Create

#### `src/components/analytics/FolderAnalytics.tsx`
- Analytics aggregated by folder
- Shows: total clicks, unique visitors, top links per folder
- Compare folders side-by-side

#### `src/components/analytics/TagAnalytics.tsx`
- Analytics aggregated by tag
- Shows: total clicks, unique visitors, top links per tag
- Tag performance comparison

#### `src/components/analytics/CampaignAnalytics.tsx`
- Enhanced UTM campaign rollup view
- Shows all 5 UTM dimensions
- Filter by date range
- Pivot table view: campaigns × sources/mediums
- Export to CSV

### 5.3 New Hooks to Create

#### `src/hooks/useAnalyticsByFolder.tsx`
- Aggregate click data grouped by folder
- Date range filtering
- Returns: folder name, total clicks, unique visitors, click rate

#### `src/hooks/useAnalyticsByTag.tsx`
- Aggregate click data grouped by tag
- Date range filtering
- Returns: tag name, total clicks, unique visitors, click rate

#### `src/hooks/useCampaignRollup.tsx`
- Complex query joining links and link_clicks
- Group by UTM dimensions (campaign, source, medium, term, content)
- Calculate metrics: clicks, unique visitors, conversion rate
- Support drill-down (campaign → source → medium → links)

### 5.4 Files to Modify

#### `src/pages/Analytics.tsx`
- Add "Folders" tab
- Add "Tags" tab
- Enhance "Campaigns" tab with drill-down

---

## Implementation Order & Timeline

### Sprint 1 (Week 1-2): Phase 1
- Enhanced table with all columns
- Basic filtering connected
- Pagination and sorting
- **Deliverable**: Improved list view with working filters

### Sprint 2 (Week 3-4): Phase 2
- Link detail page and routing
- Edit functionality
- Duplicate/delete actions
- **Deliverable**: Full CRUD on individual links

### Sprint 3 (Week 5-6): Phase 3
- Folder management
- Tag management
- Organization features in link creation/edit
- **Deliverable**: Links organized by folders and tags

### Sprint 4 (Week 7-8): Phase 4
- Saved filters
- Bulk actions
- Column customization
- Export functionality
- **Deliverable**: Power user features for managing many links

### Sprint 5 (Week 9-10): Phase 5
- Analytics by folder/tag
- Campaign rollup enhancements
- Performance optimizations
- **Deliverable**: Complete analytics integration

---

## Technical Considerations

### Performance
- Implement virtual scrolling for large tables (react-window)
- Debounce search input (300ms)
- Paginate all lists (20-50 items per page)
- Add database indexes for filtered columns
- Cache filter options (UTM values, domains, owners)

### Security
- All filters must respect RLS policies
- Validate user permissions before bulk actions
- Audit log for sensitive operations (delete, archive)
- Rate limiting on API endpoints

### UX Principles
- Filter state persists in URL query params (shareable links)
- Show loading skeletons during data fetch
- Optimistic updates for quick actions (status change)
- Undo functionality for destructive actions (toast with undo button)
- Empty states with helpful CTAs
- Mobile-responsive design for all views

### Testing
- Unit tests for all hooks
- Integration tests for filter combinations
- E2E tests for critical flows (create link, filter, edit)
- Performance testing with 10k+ links

---

## Database Schema Reference

### Existing Tables Used
- `links`: Primary data
- `link_clicks`: Analytics data
- `folders`: Organization hierarchy
- `link_tags`: Many-to-many link-tag relationship
- `profiles`: User information (via created_by)
- `domains`: Custom domains
- `workspaces`: Multi-tenancy

### New Tables Needed
- `user_filter_presets`: Store saved filters (optional, can use local storage)
- `user_preferences`: Store column visibility and order (optional, can use local storage)

---

## API Endpoints Required

All operations use Supabase client queries. No custom REST endpoints needed.

### Key Queries

**Enhanced Links List with Filters**:
```typescript
let query = supabase
  .from('links')
  .select(`
    *,
    profiles!created_by(full_name, email),
    folders(name, parent_id),
    link_tags(tag),
    link_clicks!inner(clicked_at)
  `)
  .eq('workspace_id', workspaceId);

// Apply filters
if (search) query = query.or(`title.ilike.%${search}%,destination_url.ilike.%${search}%`);
if (status.length) query = query.in('status', status);
if (dateFrom) query = query.gte('created_at', dateFrom);
if (dateTo) query = query.lte('created_at', dateTo);
if (domains.length) query = query.in('domain', domains);
if (owners.length) query = query.in('created_by', owners);
if (utmCampaigns.length) query = query.in('utm_campaign', utmCampaigns);
if (folderId) query = query.eq('folder_id', folderId);

// Pagination and sorting
query = query
  .order(sortColumn, { ascending: sortDirection === 'asc' })
  .range((page - 1) * pageSize, page * pageSize - 1);

const { data, error, count } = await query;
```

**Folder Tree**:
```typescript
const { data: folders } = await supabase
  .from('folders')
  .select('*, links(count)')
  .eq('workspace_id', workspaceId)
  .order('name');

// Transform flat list to tree structure in client
const tree = buildTree(folders);
```

**Campaign Rollup**:
```typescript
const { data } = await supabase
  .from('links')
  .select(`
    utm_campaign,
    utm_source,
    utm_medium,
    link_clicks(count, is_unique)
  `)
  .eq('workspace_id', workspaceId)
  .not('utm_campaign', 'is', null);

// Aggregate in client or use Postgres aggregation
```

---

## Component Architecture

```
src/
├── pages/
│   ├── Links.tsx (list view)
│   ├── LinkDetail.tsx (detail view)
│   └── Folders.tsx (folder management)
├── components/
│   ├── links/
│   │   ├── EnhancedLinksTable.tsx
│   │   ├── AdvancedFilters.tsx
│   │   ├── FilterPills.tsx
│   │   ├── LinkDetailOverview.tsx
│   │   ├── LinkDetailAnalytics.tsx
│   │   ├── LinkDetailQRCodes.tsx
│   │   ├── LinkEditForm.tsx
│   │   ├── LinkActions.tsx
│   │   ├── BulkActions.tsx
│   │   ├── ColumnCustomizer.tsx
│   │   └── SavedFilters.tsx
│   ├── folders/
│   │   ├── FolderTree.tsx
│   │   ├── FolderSelector.tsx
│   │   └── CreateFolderDialog.tsx
│   ├── tags/
│   │   ├── TagManager.tsx
│   │   ├── TagInput.tsx
│   │   └── TagChip.tsx
│   └── analytics/
│       ├── FolderAnalytics.tsx
│       ├── TagAnalytics.tsx
│       └── CampaignAnalytics.tsx (enhanced)
└── hooks/
    ├── useEnhancedLinks.tsx
    ├── useLinkDetail.tsx
    ├── useUpdateLink.tsx
    ├── useDuplicateLink.tsx
    ├── useDeleteLink.tsx
    ├── useLinkOwners.tsx
    ├── useUTMOptions.tsx
    ├── useFolders.tsx
    ├── useTags.tsx
    ├── useSavedFilters.tsx
    ├── useBulkLinkActions.tsx
    ├── useColumnPreferences.tsx
    ├── useAnalyticsByFolder.tsx
    ├── useAnalyticsByTag.tsx
    └── useCampaignRollup.tsx
```

---

## Dependencies to Add

```bash
# For virtual scrolling (large tables)
npm install react-window react-window-infinite-loader

# For date range picker
npm install react-day-picker (already installed)

# For drag-and-drop (folder tree, column reorder)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# For CSV export
npm install papaparse
npm install -D @types/papaparse

# For Excel export (optional)
npm install xlsx
```

---

## Success Metrics

### Phase 1
- Table loads with all columns in <2s
- Filters apply in <500ms
- All existing links visible and filterable

### Phase 2
- Detail page loads in <1s
- Edit saves successfully with validation
- Duplicate creates new link with modified slug

### Phase 3
- Folder hierarchy displays correctly
- Links can be organized into folders
- Tags applied and displayed on links

### Phase 4
- Bulk actions work on 100+ links without timeout
- Saved filters persist across sessions
- Export generates CSV with all filtered data

### Phase 5
- Analytics grouped by folder/tag accurately
- Campaign rollup matches raw click data
- All views load in <3s with 10k+ links

---

## Risks & Mitigations

### Risk: Performance with Large Datasets
- **Mitigation**: Implement pagination, virtual scrolling, database indexes, query optimization

### Risk: Complex Filter Combinations
- **Mitigation**: Thorough testing of filter logic, query builder abstraction, unit tests

### Risk: RLS Policy Gaps
- **Mitigation**: Security audit before Phase 3 deployment, test with different user roles

### Risk: UX Complexity
- **Mitigation**: User testing after each phase, iterative refinement, helpful empty states and tooltips

---

## Future Enhancements (Post-Phase 5)

- Link preview cards (og:image, og:title) in table
- Keyboard shortcuts (Cmd+K for search, etc.)
- Advanced analytics: funnel tracking, cohort analysis
- Link versioning and history
- Scheduled link activation/deactivation
- Link approval workflow for editors
- Public link gallery (for events)
- Mobile app for QR scanning and link management

---

## Questions for Stakeholder Review

1. Should folder hierarchy be unlimited depth or limited (e.g., 3 levels)?
2. Are there specific UTM naming conventions to enforce (validation rules)?
3. What should happen to links when parent folder is deleted? (Move to root or prevent deletion)
4. Should tags be workspace-level or global across workspaces?
5. What bulk operation batch size is acceptable? (100, 500, 1000+ links at once)
6. Should we support regex search or only plain text/wildcards?
7. Export format preference: CSV only or also Excel/JSON?
8. Should saved filters be user-private or team-shared?

---

*End of Implementation Plan*
