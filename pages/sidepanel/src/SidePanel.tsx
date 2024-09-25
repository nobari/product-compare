import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';

import ChatDialog from '@chrome-extension-boilerplate/shared/lib/components/ChatDialog';
import { useEffect, useState } from 'react';
import { sidePanelConnectionName } from '@chrome-extension-boilerplate/shared/lib/tools/connections';
import { SidePanelActions } from '@chrome-extension-boilerplate/shared/lib/tools/actions';
import { useTheme } from '@chrome-extension-boilerplate/shared/lib/hooks';

const SidePanel = () => {
  useTheme();
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    console.log('SidePanel mounted');
    const port = chrome.runtime.connect({ name: sidePanelConnectionName });

    port.onMessage.addListener(msg => {
      console.log('SidePanel Message from background:', msg);
      if (msg.action === SidePanelActions.OpenProduct) {
        const productId = msg.productId;
        console.log('SidePanel Got open product:', productId);
        setForceOpen(true);
        window.dispatchEvent(new CustomEvent('open-product', { detail: productId }));
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <ChatDialog toOpen={forceOpen} />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
