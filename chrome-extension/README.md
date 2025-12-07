# utm.one Chrome Extension

Create branded short links and QR codes without leaving your tab.

## Features

- **One-Click Creation**: Shorten any URL with a single click
- **Smart Context Detection**: Auto-detects source/medium from current site (Twitter, LinkedIn, YouTube, etc.)
- **UTM Parameters**: Optional UTM tagging with smart defaults
- **QR Codes**: Copy QR code directly to clipboard
- **Keyboard Shortcuts**: Fast workflow for power users

## Installation

### From Chrome Web Store (Coming Soon)
Search for "utm.one" in the Chrome Web Store.

### Manual Installation (Developer Mode)
1. Download or clone this folder
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select this `chrome-extension` folder

## Setup

1. Click the utm.one extension icon to open the sidebar
2. Get your API key from [utm.one/settings/api](https://utm.one/settings/api)
3. Paste your API key and click "Connect"

## Usage

1. Navigate to any webpage you want to shorten
2. Click the utm.one icon in your browser toolbar
3. The sidebar opens with the current URL pre-filled
4. (Optional) Expand "UTM Parameters" to add tracking
5. Click "Create Short Link"
6. Copy the short link or QR code!

## Smart Context Detection

The extension automatically detects the platform you're sharing FROM:

| Platform | utm_source | utm_medium |
|----------|------------|------------|
| Twitter/X | twitter | social |
| LinkedIn | linkedin | social |
| Facebook | facebook | social |
| YouTube | youtube | video |
| Reddit | reddit | community |
| Medium | medium | content |
| Substack | substack | newsletter |
| GitHub | github | referral |
| And more... | | |

## Context Menu

Right-click any link on a webpage and select "Shorten with utm.one" to quickly create a short link.

## Privacy

- Your API key is stored locally in Chrome's secure storage
- We only access the current tab's URL and title
- No browsing data is collected or transmitted

## Support

Need help? Contact support@utm.one
