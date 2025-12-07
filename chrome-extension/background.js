// utm.one Chrome Extension - Background Service Worker

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Set side panel behavior - open on action click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          url: tabs[0].url,
          title: tabs[0].title,
          favIconUrl: tabs[0].favIconUrl
        });
      } else {
        sendResponse({ error: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'copyToClipboard') {
    // Use the offscreen document API for clipboard in MV3
    navigator.clipboard.writeText(request.text).then(() => {
      sendResponse({ success: true });
    }).catch((err) => {
      sendResponse({ error: err.message });
    });
    return true;
  }
});

// Context menu for quick link creation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'shorten-link',
    title: 'Shorten with utm.one',
    contexts: ['link', 'page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'shorten-link') {
    const url = info.linkUrl || info.pageUrl;
    // Open side panel and pass the URL
    chrome.sidePanel.open({ tabId: tab.id });
    // Store URL temporarily for the side panel to pick up
    chrome.storage.local.set({ pendingUrl: url });
  }
});
