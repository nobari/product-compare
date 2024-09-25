export enum SidePanelActions {
  Open = 'openSidePanel',
  Close = 'closeSidePanel',
  OpenProduct = 'openProduct',
}
export const openSidePanel = async (productId?: string) => {
  let windowId: number | undefined;
  if (chrome?.windows) {
    const window = await chrome.windows.getCurrent();
    windowId = window.id;
  }
  chrome.runtime.sendMessage({ action: SidePanelActions.Open, windowId, productId });
};
