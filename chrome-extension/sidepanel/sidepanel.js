// utm.one Chrome Extension - Side Panel

const API_BASE = 'https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1';

// Smart context detection mapping
const DOMAIN_SOURCE_MAP = {
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'linkedin.com': 'linkedin',
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'instagram.com': 'instagram',
  'reddit.com': 'reddit',
  'tiktok.com': 'tiktok',
  'pinterest.com': 'pinterest',
  'threads.net': 'threads',
  'medium.com': 'medium',
  'substack.com': 'substack',
  'github.com': 'github',
  'producthunt.com': 'producthunt',
  'news.ycombinator.com': 'hackernews',
  'slack.com': 'slack',
  'discord.com': 'discord',
  'whatsapp.com': 'whatsapp',
  'telegram.org': 'telegram',
  't.me': 'telegram'
};

const DOMAIN_MEDIUM_MAP = {
  'twitter.com': 'social',
  'x.com': 'social',
  'linkedin.com': 'social',
  'facebook.com': 'social',
  'instagram.com': 'social',
  'youtube.com': 'video',
  'tiktok.com': 'video',
  'reddit.com': 'community',
  'medium.com': 'content',
  'substack.com': 'newsletter',
  'github.com': 'referral',
  'producthunt.com': 'referral',
  'slack.com': 'messaging',
  'discord.com': 'community'
};

// State
let state = {
  apiKey: null,
  currentTab: null,
  isLoading: false,
  result: null,
  toast: null,
  utmExpanded: false
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load API key from storage
  const stored = await chrome.storage.local.get(['apiKey']);
  state.apiKey = stored.apiKey || null;
  
  // Get current tab info
  chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
    if (response && !response.error) {
      state.currentTab = response;
    }
    render();
  });
  
  // Check for pending URL from context menu
  const pending = await chrome.storage.local.get(['pendingUrl']);
  if (pending.pendingUrl) {
    await chrome.storage.local.remove(['pendingUrl']);
    // Could pre-fill if needed
  }
});

// Detect source from URL
function detectSource(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const [domain, source] of Object.entries(DOMAIN_SOURCE_MAP)) {
      if (hostname.includes(domain)) return source;
    }
  } catch {}
  return '';
}

// Detect medium from URL
function detectMedium(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const [domain, medium] of Object.entries(DOMAIN_MEDIUM_MAP)) {
      if (hostname.includes(domain)) return medium;
    }
  } catch {}
  return '';
}

// Get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Create short link
async function createLink(data) {
  const response = await fetch(`${API_BASE}/extension-create-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.apiKey}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create link');
  }
  
  return response.json();
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
}

// Show toast
function showToast(message, type = 'success') {
  state.toast = { message, type };
  render();
  setTimeout(() => {
    state.toast = null;
    render();
  }, 3000);
}

// Save API key
async function saveApiKey(key) {
  await chrome.storage.local.set({ apiKey: key });
  state.apiKey = key;
  render();
}

// Handle form submit
async function handleSubmit(e) {
  e.preventDefault();
  if (state.isLoading) return;
  
  const form = e.target;
  const formData = new FormData(form);
  
  const data = {
    original_url: state.currentTab?.url || '',
    title: formData.get('title') || state.currentTab?.title || '',
    utm_source: formData.get('utm_source') || '',
    utm_medium: formData.get('utm_medium') || '',
    utm_campaign: formData.get('utm_campaign') || '',
    utm_term: formData.get('utm_term') || '',
    utm_content: formData.get('utm_content') || ''
  };
  
  state.isLoading = true;
  render();
  
  try {
    const result = await createLink(data);
    state.result = result;
    showToast('Link created!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    state.isLoading = false;
    render();
  }
}

// Render
function render() {
  const root = document.getElementById('root');
  
  // Setup screen if no API key
  if (!state.apiKey) {
    root.innerHTML = `
      <div class="setup-screen">
        <div class="setup-icon">🔗</div>
        <h1 class="setup-title">welcome to utm.one</h1>
        <p class="setup-description">
          Enter your API key to start creating short links instantly from any tab.
        </p>
        <div class="setup-input-group">
          <input 
            type="password" 
            class="form-input" 
            id="api-key-input"
            placeholder="paste your api key"
          />
        </div>
        <button class="btn btn-primary" id="save-key-btn">
          connect
        </button>
        <p style="margin-top: 16px; font-size: 11px; color: var(--muted-foreground);">
          Get your API key from <a href="https://utm.one/settings/api" target="_blank" style="color: var(--foreground);">utm.one/settings</a>
        </p>
      </div>
    `;
    
    document.getElementById('save-key-btn').addEventListener('click', () => {
      const key = document.getElementById('api-key-input').value.trim();
      if (key) saveApiKey(key);
    });
    
    document.getElementById('api-key-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const key = e.target.value.trim();
        if (key) saveApiKey(key);
      }
    });
    
    return;
  }
  
  // Result screen
  if (state.result) {
    root.innerHTML = `
      <header class="header">
        <div class="logo">
          <div class="logo-icon">⚡</div>
          <span>utm.one</span>
        </div>
        <button class="settings-btn" id="new-link-btn" title="Create new link">
          ✕
        </button>
      </header>
      <main class="main">
        <div class="result-card success">
          <div class="short-url">${state.result.short_url}</div>
          <div class="btn-group">
            <button class="btn btn-primary" id="copy-url-btn">
              📋 copy link
            </button>
            <button class="btn btn-secondary" id="copy-qr-btn">
              📱 copy qr
            </button>
          </div>
        </div>
        
        <div class="url-preview">
          <div class="favicon">
            ${state.currentTab?.favIconUrl ? `<img src="${state.currentTab.favIconUrl}" alt="">` : '🌐'}
          </div>
          <div class="url-info">
            <div class="url-title">${state.result.title || state.currentTab?.title || 'Untitled'}</div>
            <div class="url-domain">${getDomain(state.result.original_url)}</div>
          </div>
        </div>
        
        <a href="https://utm.one/dashboard/links/${state.result.id}" target="_blank" class="btn btn-secondary">
          open in dashboard →
        </a>
      </main>
      <footer class="footer">
        <span>powered by utm.one</span>
        <a href="https://utm.one" target="_blank">open app</a>
      </footer>
      ${state.toast ? `
        <div class="toast ${state.toast.type}">
          ${state.toast.type === 'success' ? '✓' : '✕'} ${state.toast.message}
        </div>
      ` : ''}
    `;
    
    document.getElementById('new-link-btn').addEventListener('click', () => {
      state.result = null;
      render();
    });
    
    document.getElementById('copy-url-btn').addEventListener('click', () => {
      copyToClipboard(state.result.short_url);
    });
    
    document.getElementById('copy-qr-btn').addEventListener('click', async () => {
      try {
        // Generate QR using an external service or copy the QR URL
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(state.result.short_url)}`;
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('QR copied!', 'success');
      } catch {
        // Fallback: copy QR URL
        copyToClipboard(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(state.result.short_url)}`);
      }
    });
    
    return;
  }
  
  // Main form
  const detectedSource = detectSource(state.currentTab?.url || '');
  const detectedMedium = detectMedium(state.currentTab?.url || '');
  
  root.innerHTML = `
    <header class="header">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <span>utm.one</span>
      </div>
      <button class="settings-btn" id="settings-btn" title="Settings">
        ⚙️
      </button>
    </header>
    <main class="main">
      <div class="url-preview">
        <div class="favicon">
          ${state.currentTab?.favIconUrl ? `<img src="${state.currentTab.favIconUrl}" alt="">` : '🌐'}
        </div>
        <div class="url-info">
          <div class="url-title">${state.currentTab?.title || 'Loading...'}</div>
          <div class="url-domain">${getDomain(state.currentTab?.url || '')}</div>
          ${detectedSource ? `
            <div class="context-badge detected">
              ✨ auto-detected: ${detectedSource}
            </div>
          ` : ''}
        </div>
      </div>
      
      <form id="link-form">
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label">title</label>
          <input 
            type="text" 
            name="title" 
            class="form-input" 
            placeholder="optional custom title"
            value="${state.currentTab?.title || ''}"
          />
        </div>
        
        <div class="collapsible-header" id="utm-toggle">
          <span>utm parameters</span>
          <span class="collapsible-arrow ${state.utmExpanded ? 'open' : ''}">▼</span>
        </div>
        
        <div class="collapsible-content" style="max-height: ${state.utmExpanded ? '400px' : '0'};">
          <div class="utm-grid" style="padding-top: 8px;">
            <div class="form-group">
              <label class="form-label">source</label>
              <input 
                type="text" 
                name="utm_source" 
                class="form-input" 
                placeholder="e.g. linkedin"
                value="${detectedSource}"
              />
            </div>
            <div class="form-group">
              <label class="form-label">medium</label>
              <input 
                type="text" 
                name="utm_medium" 
                class="form-input" 
                placeholder="e.g. social"
                value="${detectedMedium}"
              />
            </div>
            <div class="form-group">
              <label class="form-label">campaign</label>
              <input 
                type="text" 
                name="utm_campaign" 
                class="form-input" 
                placeholder="e.g. summer_sale"
              />
            </div>
            <div class="form-group">
              <label class="form-label">term</label>
              <input 
                type="text" 
                name="utm_term" 
                class="form-input" 
                placeholder="optional"
              />
            </div>
            <div class="form-group">
              <label class="form-label">content</label>
              <input 
                type="text" 
                name="utm_content" 
                class="form-input" 
                placeholder="optional"
              />
            </div>
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary" style="margin-top: 16px;" ${state.isLoading ? 'disabled' : ''}>
          ${state.isLoading ? '<span class="spinner"></span> creating...' : '⚡ create short link'}
        </button>
      </form>
    </main>
    <footer class="footer">
      <span>powered by utm.one</span>
      <a href="https://utm.one" target="_blank">open app</a>
    </footer>
    ${state.toast ? `
      <div class="toast ${state.toast.type}">
        ${state.toast.type === 'success' ? '✓' : '✕'} ${state.toast.message}
      </div>
    ` : ''}
  `;
  
  // Event listeners
  document.getElementById('link-form').addEventListener('submit', handleSubmit);
  
  document.getElementById('utm-toggle').addEventListener('click', () => {
    state.utmExpanded = !state.utmExpanded;
    render();
  });
  
  document.getElementById('settings-btn').addEventListener('click', () => {
    if (confirm('Disconnect API key?')) {
      chrome.storage.local.remove(['apiKey']);
      state.apiKey = null;
      render();
    }
  });
}
