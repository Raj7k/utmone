-- Setup test data for load testing
-- Run this script before executing k6 tests

-- Create test workspace if not exists
INSERT INTO workspaces (id, name, slug, owner_id, primary_domain, default_domain, default_path)
VALUES (
  'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0',
  'Load Test Workspace',
  'loadtest',
  (SELECT id FROM profiles LIMIT 1), -- Use first available user
  'utm.one',
  'utm.one',
  'go'
)
ON CONFLICT (id) DO NOTHING;

-- Create 100 test links for load testing
-- Top 20 "popular" links (will be cached frequently)
INSERT INTO links (
  workspace_id,
  domain,
  path,
  slug,
  title,
  destination_url,
  final_url,
  created_by,
  status
)
SELECT 
  'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0',
  'utm.one',
  'go',
  'popular-' || i,
  'Popular Test Link ' || i,
  'https://example.com/popular/' || i,
  'https://example.com/popular/' || i,
  (SELECT id FROM profiles LIMIT 1),
  'active'
FROM generate_series(0, 19) AS i
ON CONFLICT (domain, path, slug) DO NOTHING;

-- Remaining 80 "long tail" links
INSERT INTO links (
  workspace_id,
  domain,
  path,
  slug,
  title,
  destination_url,
  final_url,
  created_by,
  status
)
SELECT 
  'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0',
  'utm.one',
  'go',
  'link-' || i,
  'Test Link ' || i,
  'https://example.com/test/' || i,
  'https://example.com/test/' || i,
  (SELECT id FROM profiles LIMIT 1),
  'active'
FROM generate_series(0, 79) AS i
ON CONFLICT (domain, path, slug) DO NOTHING;

-- Create batch test links
INSERT INTO links (
  workspace_id,
  domain,
  path,
  slug,
  title,
  destination_url,
  final_url,
  created_by,
  status
)
SELECT 
  'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0',
  'utm.one',
  'go',
  'batch-test-' || i,
  'Batch Test Link ' || i,
  'https://example.com/batch/' || i,
  'https://example.com/batch/' || i,
  (SELECT id FROM profiles LIMIT 1),
  'active'
FROM generate_series(0, 49) AS i
ON CONFLICT (domain, path, slug) DO NOTHING;

-- Verify setup
SELECT 
  COUNT(*) as total_test_links,
  COUNT(*) FILTER (WHERE slug LIKE 'popular-%') as popular_links,
  COUNT(*) FILTER (WHERE slug LIKE 'link-%') as longtail_links,
  COUNT(*) FILTER (WHERE slug LIKE 'batch-test-%') as batch_test_links
FROM links
WHERE workspace_id = 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0';

-- Expected output:
-- total_test_links: 150
-- popular_links: 20
-- longtail_links: 80
-- batch_test_links: 50
