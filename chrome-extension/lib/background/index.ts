import 'webextension-polyfill';
import { backgroundConnectionListener, ports } from '@chrome-extension-boilerplate/shared/lib/tools/connections';
import { SidePanelActions } from '@chrome-extension-boilerplate/shared/lib/tools/actions';
const storageKeys = { productList: 'product-list-storage-key' };
console.log('background loaded');
console.log("Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload 4.");
function onInstalled() {
  chrome.storage.local.get(storageKeys.productList, data => {
    const title = 'Open to Compare';
    console.log('data:', data);
    if (data[storageKeys.productList]?.length) {
      setBadgeText(data[storageKeys.productList].length);
    }
    chrome.contextMenus.create({
      id: 'compareContextButton',
      title,
      contexts: ['all'],
    });
  });
}
chrome.runtime.onInstalled.addListener(() => {
  onInstalled();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'compareContextButton') {
    console.log('service Button clicked!', info, tab);
    // updateBadgeText();
    // Add any action you want to perform on button click
    chrome.tabs.sendMessage(tab!.id!, { action: 'addProduct' }, response => {
      console.log(response.result);
    });
    chrome.sidePanel.open({ windowId: tab!.windowId });
    // chrome.windows.create({
    //   url: 'popup.html',
    //   type: 'popup',
    //   height: 600,
    //   width: 400,
    // });
  }
});

function setBadgeText(count?: number) {
  try {
    chrome.action.setBadgeText({ text: count?.toString() || '' });
  } catch (error) {
    console.error('Failed to set badge text:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message', message);
  if (message.action === 'setBadge') {
    setBadgeText(message.count);
    sendResponse({ result: 'Badge updated' });
  } else if (message.action === 'getTabId') {
    sendResponse({ tabId: sender.tab?.id, windowId: sender.tab?.windowId });
  } else if (message.action === SidePanelActions.Open) {
    console.log('openSidePanel:', message, sender);
    const windowId = message.windowId || sender.tab?.windowId;
    if (windowId) chrome.sidePanel.open({ windowId });
    const productId = message.productId;
    if (productId) {
      //inform side panel to open product
      ports.sidePanel?.postMessage({ action: SidePanelActions.OpenProduct, productId });
    }
  }
});

// Listen for connection events
backgroundConnectionListener();
