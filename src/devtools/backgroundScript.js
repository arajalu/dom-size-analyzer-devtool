chrome.runtime.onConnect.addListener(devToolsConnection => {
  chrome.runtime.onMessage.addListener((
    request /* , sender, sendResponse */,
  ) => {
    console.log('from bg', request);
    devToolsConnection.postMessage(request);
  });
});

/**
 * injecting contentscript(s) for existing tabs
 */
chrome.manifest = chrome.app.getDetails();

const injectIntoTab = tab => {
  if (tab) {
    const scripts = chrome.manifest.content_scripts[0].js;
    const s = scripts.length;
    for (let i = 0; i < s; i += 1) {
      chrome.tabs.executeScript(tab.id, {
        file: scripts[i],
      });
    }
  }
};
chrome.windows.getCurrent(
  {
    populate: true,
  },
  window => {
    for (let j = 0; j < window.tabs.length; j += 1) {
      const currentTab = window.tabs[j];
      injectIntoTab(currentTab);
    }
  },
);
