import { sendEvent } from '../utils/helpers';

// inject a script into the page
const injection = document.createElement('script');
injection.src = chrome.extension.getURL('injectable.js');
(document.head || document.documentElement).appendChild(injection);
injection.onload = () => {
  injection.parentNode.removeChild(injection);
};

window.addEventListener('commandEvent', event => {
  const { detail } = event;
  const { src } = detail || {};
  console.log('from cs', event);
  if (src !== 'content-script') {
    chrome.runtime.sendMessage(detail);
  }
});

/**
 * The content script does not have access to page's properties and functions.
 * That is why the injected script is needed.
 */
chrome.runtime.onMessage.addListener(message => {
  // Send the command to the page through a custom event
  sendEvent({ type: message.type, src: 'content-script' });
});
