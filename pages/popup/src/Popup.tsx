import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { openSidePanel } from '@chrome-extension-boilerplate/shared/lib/tools/actions';
import { useProductList } from '@chrome-extension-boilerplate/shared/lib/hooks/useProductList';
import { ThemeToggleButton } from '@chrome-extension-boilerplate/shared/lib/components/ThemeToggleButton';
import { useTheme } from '@chrome-extension-boilerplate/shared/lib/hooks';
import { useEffect } from 'react';

const Popup = () => {
  const { ProductListComponent } = useProductList();
  useTheme();

  return (
    <div className="App">
      <div className="tw-flex tw-flex-row tw-justify-end tw-items-center tw-w-full tw-gap-2">
        <button
          className="tw-mb-2 tw-sticky tw-top-0 tw-z-50 tw-w-full tw-bg-primary tw-px-4 tw-h-10 tw-rounded-2xl tw-shadow-primary-500 tw-shadow tw-flex-row tw-justify-center tw-items-center tw-inline-flex tw-font-bold hover:tw-bg-primary-5000"
          onClick={() => {
            console.log('openSidePanel...');
            openSidePanel();
            //close popup
            setTimeout(() => {
              window.close();
            }, 300);
          }}>
          <img
            src={chrome.runtime.getURL('content-ui/logo.png')}
            alt="Logo"
            className="tw-rounded-full tw-w-6 tw-h-6"
          />
          <span>Open panel to Compare</span>
        </button>
        <ThemeToggleButton />
      </div>
      <ProductListComponent />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
