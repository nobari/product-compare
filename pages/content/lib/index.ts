import { toggleTheme } from '@lib/toggleTheme';
import { addProduct } from '@chrome-extension-boilerplate/shared/lib/tools/addProduct';
import { getProductListItem } from '@chrome-extension-boilerplate/shared/lib/tools/parser';
// import { ProductListItem } from '@chrome-extension-boilerplate/shared';

console.log('content script loaded');

void toggleTheme();

function highlightText() {
  document.body.style.backgroundColor = 'yellow';
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'highlight') {
    highlightText();
    sendResponse({ result: 'Text highlighted' });
  }
  if (message.action === 'addProduct') {
    const product = getProductListItem(document);
    if (product) {
      const newProductAdded = await addProduct(product);
      sendResponse({ result: newProductAdded });
    }
  }
});
/*
function createAddProductButton(product: ProductListItem): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerText = 'Add to List';
  button.style.padding = '10px 20px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.backgroundColor = '#ff9900';
  button.style.color = 'white';
  button.style.fontSize = '16px';
  button.style.cursor = 'pointer';
  button.style.marginTop = '10px';

  button.addEventListener('click', () => {
    addProduct(product);
  });

  return button;
}

chrome.runtime.sendMessage({ action: 'getTabId' }, (response: { tabId: number; windowId: number }) => {
  console.log('Tab ID is:', response.tabId, response.windowId);
  const product = getProductListItem(document);

  if (product) {
    const button = createAddProductButton(product);
    const productTitleSection = document.getElementById('titleSection')!;
    productTitleSection.appendChild(button);
  }
});

*/