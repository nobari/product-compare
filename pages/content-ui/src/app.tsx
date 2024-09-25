import { useEffect, useState } from 'react';
import { getProductListItem } from '@chrome-extension-boilerplate/shared/lib/tools/parser';
import { addProduct } from '@chrome-extension-boilerplate/shared/lib/tools/addProduct';
import { ProductListItem, productListStorage, useStorageSuspense } from '@chrome-extension-boilerplate/shared';
import { ProductList } from '@chrome-extension-boilerplate/shared/lib/storages';
import {
  pageContentConnectionName,
  ConnectionActions,
} from '@chrome-extension-boilerplate/shared/lib/tools/connections';

export default function App() {
  const productList: ProductList = useStorageSuspense(productListStorage);
  const [isProductInList, setIsProductInList] = useState(false);
  const [product, setProduct] = useState<ProductListItem>();
  const [hidden, setHidden] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  useEffect(() => {
    console.log('content ui mounted');
    // Establish a connection in the sidepanel.js
    const port = chrome.runtime.connect({ name: pageContentConnectionName });

    // Handle messages from the background script (Optional).
    port.onMessage.addListener(msg => {
      console.log('content ui Message from background:', msg);
      if (msg.action === ConnectionActions.SidePanelOpened) {
        setIsSidePanelOpen(true);
      } else if (msg.action === ConnectionActions.SidePanelClosed) {
        setIsSidePanelOpen(false);
      }
    });

    // Optionally, clean up when explicitly closing the side panel or unloading the page.
    return () => {
      port.disconnect();
    };
  }, []);
  useEffect(() => {
    console.log('content ui loaded');
    try {
      const product = getProductListItem(document);
      setProduct(product);
      console.log('product', product);
      const isInList = product && productList.some(p => p.id === product.id);
      setIsProductInList(isInList!);
    } catch (error) {
      console.error('error', error);
    }
  }, [productList]);
  return (
    <div className="tw-fixed tw-bottom-4 tw-right-4 tw-z-10" hidden={hidden}>
      <button
        id="gpt-shopper-fab"
        className="btn tw-container tw-justify-between tw-bg-primary tw-rounded-2xl tw-shadow-[inset_0px_0px_4px_0px_black] tw-flex-row tw-items-center tw-inline-flex tw-font-bold hover:tw-bg-primary-500"
        onClick={() => {
          console.log('fab clicked');
          const product = getProductListItem(document);
          if (product) {
            addProduct(product);
          } else {
            window.alert('visit a single product page to add it for comparison');
          }
        }}>
        <div className="tw-flex tw-items-center tw-gap-2 tw-mx-2 tw-my-1">
          <img
            src={chrome.runtime.getURL('content-ui/logo.png')}
            alt="Logo"
            className="tw-rounded-full tw-w-10 tw-h-10"
          />
          <span>{product ? (isProductInList ? 'already added' : 'Add to Compare') : 'Compare Products'}</span>
        </div>
      </button>
      <button
        className="tw-absolute tw-top-[-8px] tw-right-[-8px] tw-w-4 tw-h-4 tw-bg-gray-300 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-gray-700 hover:tw-bg-gray-400"
        onClick={() => {
          // Add logic to hide the button
          console.log('Close button clicked');
          setHidden(true);
          // You might want to set some state or call a function to hide the component
        }}>
        ×
      </button>
    </div>
  );
}
