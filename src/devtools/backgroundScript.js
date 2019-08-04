chrome.runtime.onConnect.addListener(devToolsConnection => {
  chrome.runtime.onMessage.addListener((
    request /* , sender, sendResponse */,
  ) => {
    console.log('from bg', request);
    devToolsConnection.postMessage(request);
  });
});
