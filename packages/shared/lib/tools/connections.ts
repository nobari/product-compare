export const sidePanelConnectionName = 'sidePanelConnection';
export const pageContentConnectionName = 'pageContentConnection';
export enum ConnectionActions {
  SidePanelOpened = 'sidePanelOpened',
  SidePanelClosed = 'sidePanelClosed',
  PageContentOpened = 'pageContentOpened',
  PageContentClosed = 'pageContentClosed',
}

export const ports: {
  sidePanel?: chrome.runtime.Port;
  pageContent: Set<chrome.runtime.Port>;
} = {
  pageContent: new Set<chrome.runtime.Port>(),
};
export const backgroundConnectionListener = () => {
  chrome.runtime.onConnect.addListener(port => {
    console.log('port', port);
    if (port.name === sidePanelConnectionName) {
      ports.sidePanel = port;
      console.log('Side panel is opened, connection established.');
      port.postMessage({ action: ConnectionActions.PageContentOpened });
      port.onDisconnect.addListener(() => {
        console.log('Side panel is closed or disconnected.');
        // Trigger necessary logic when sidepanel is closed.
        for (const port of ports.pageContent) {
          port.postMessage({ action: ConnectionActions.SidePanelClosed });
        }
      });
    } else if (port.name === pageContentConnectionName) {
      ports.pageContent.add(port);
      port.postMessage({ action: ConnectionActions.SidePanelOpened });
      console.log('PageContent is opened, connection established.');
      port.onDisconnect.addListener(() => {
        console.log('PageContent is closed or disconnected.');
        // Trigger necessary logic when pageContent is closed.
        ports.pageContent.delete(port);
        port.postMessage({ action: ConnectionActions.PageContentClosed });
      });
    }
  });
};
