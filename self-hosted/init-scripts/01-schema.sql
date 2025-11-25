-- utm.one Self-Hosted Database Schema
-- This script initializes the core database schema for the redirect service

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    onboarding_completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain TEXT UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    verification_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL
);

CREATE INDEX idx_domains_workspace ON domains(workspace_id);
CREATE INDEX idx_domains_lookup ON domains(domain) WHERE is_verified = TRUE;

-- Links table
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL,
    domain TEXT NOT NULL,
    path TEXT DEFAULT '',
    slug TEXT NOT NULL,
    destination_url TEXT NOT NULL,
    final_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    last_clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- UTM parameters
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    
    UNIQUE(domain, path, slug)
);

CREATE INDEX idx_links_workspace ON links(workspace_id);
CREATE INDEX idx_links_lookup ON links(domain, slug) WHERE status = 'active';
CREATE INDEX idx_links_created_by ON links(created_by);

-- Analytics: Link clicks
CREATE TABLE IF NOT EXISTS link_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    is_unique BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_clicks_link ON link_clicks(link_id);
CREATE INDEX idx_clicks_timestamp ON link_clicks(clicked_at DESC);

-- QR Codes table
CREATE TABLE IF NOT EXISTS qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variant TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qr_codes_link ON qr_codes(link_id);
