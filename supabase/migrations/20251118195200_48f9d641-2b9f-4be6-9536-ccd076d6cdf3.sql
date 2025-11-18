-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE link_status AS ENUM ('active', 'paused', 'archived');
CREATE TYPE user_role AS ENUM ('super_admin', 'workspace_admin', 'editor', 'viewer');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  default_domain TEXT DEFAULT 'keka.com',
  default_path TEXT DEFAULT 'go',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace members table
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Folders table
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UTM templates table
CREATE TABLE utm_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  destination_url TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'keka.com',
  path TEXT NOT NULL DEFAULT 'go',
  slug TEXT NOT NULL,
  short_url TEXT GENERATED ALWAYS AS (domain || '/' || path || '/' || slug) STORED,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  final_url TEXT NOT NULL,
  status link_status DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  max_clicks INTEGER,
  fallback_url TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMPTZ,
  UNIQUE(domain, path, slug)
);

-- QR codes table
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variant_name TEXT,
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#06b6d4',
  logo_url TEXT,
  has_logo BOOLEAN DEFAULT FALSE,
  corner_style TEXT DEFAULT 'square',
  frame_text TEXT,
  png_url TEXT,
  svg_url TEXT,
  pdf_url TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link clicks table (for analytics)
CREATE TABLE link_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  is_unique BOOLEAN DEFAULT TRUE
);

-- Link tags table
CREATE TABLE link_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(link_id, tag)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for workspaces
CREATE POLICY "Users can view workspaces they belong to" ON workspaces FOR SELECT USING (
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = id AND user_id = auth.uid())
);
CREATE POLICY "Workspace owners can update their workspaces" ON workspaces FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can create workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for workspace_members
CREATE POLICY "Users can view workspace memberships" ON workspace_members FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_id AND owner_id = auth.uid())
);

-- RLS Policies for utm_templates
CREATE POLICY "Users can view utm templates in their workspaces" ON utm_templates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND (
      w.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
    )
  )
);

-- RLS Policies for folders
CREATE POLICY "Users can view folders in their workspaces" ON folders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND (
      w.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
    )
  )
);

-- RLS Policies for links
CREATE POLICY "Users can view links in their workspaces" ON links FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND (
      w.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
    )
  )
);

CREATE POLICY "Editors can create links" ON links FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces w
    LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.user_id = auth.uid()
    WHERE w.id = workspace_id AND (
      w.owner_id = auth.uid() OR
      wm.role IN ('workspace_admin', 'editor')
    )
  )
);

CREATE POLICY "Editors can update links" ON links FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM workspaces w
    LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.user_id = auth.uid()
    WHERE w.id = workspace_id AND (
      w.owner_id = auth.uid() OR
      wm.role IN ('workspace_admin', 'editor')
    )
  )
);

-- RLS Policies for qr_codes
CREATE POLICY "Users can view qr codes for links in their workspaces" ON qr_codes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM links l JOIN workspaces w ON l.workspace_id = w.id
    WHERE l.id = link_id AND (
      w.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
    )
  )
);

-- RLS Policies for link_clicks
CREATE POLICY "Users can view clicks for links in their workspaces" ON link_clicks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM links l JOIN workspaces w ON l.workspace_id = w.id
    WHERE l.id = link_id AND (
      w.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
    )
  )
);

-- RLS Policies for link_tags
CREATE POLICY "Users can view tags for links in their workspaces" ON link_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM links l JOIN workspaces w ON l.workspace_id = w.id
    WHERE l.id = link_id AND (
      w.owner_id = auth.uid() OR
      EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = w.id AND user_id = auth.uid())
    )
  )
);

-- Create indexes for performance
CREATE INDEX idx_links_workspace ON links(workspace_id);
CREATE INDEX idx_links_slug ON links(slug);
CREATE INDEX idx_links_status ON links(status);
CREATE INDEX idx_link_clicks_link ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_date ON link_clicks(clicked_at);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_utm_templates_updated_at BEFORE UPDATE ON utm_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();