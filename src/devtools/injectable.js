import {
  GET_DOM_DETAILS,
  HIGHLIGHT_ELEMENT,
  REMOVE_HIGHLIGHT,
} from '../constants/events';
import { getDOMdetails, sendEvent } from '../utils/helpers';

function createHighlighterOverlay() {
  const overlay = document.createElement('div');
  document.body.appendChild(overlay);
  overlay.setAttribute('id', 'domCountAnalyzerOverlay');
  overlay.style.zIndex = '9999999';
  overlay.style.background = 'rgba(112, 163, 255, 0.46)';
  overlay.style.display = `none`;
}

function hideHighlighter() {
  const overlay = document.querySelector('#domCountAnalyzerOverlay');
  overlay.style.display = `none`;
}

/**
 * places highlighter overlay over the target DOM element
 * @param {DOMElement} targetElement
 */
function highlightElement(targetElement) {
  const overlay = document.querySelector('#domCountAnalyzerOverlay');
  const rect = targetElement.getBoundingClientRect();
  overlay.style.display = `block`;
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

function handleEvent(event) {
  const { detail } = event;
  const { src, type } = detail || {};
  if (src !== 'injected-script' && type in eventHandlerMapping) {
    const result = eventHandlerMapping[type]();
    console.log('inj', result);
    sendEvent({ src: 'injected-script', data: result });
  }
}

const eventHandlerMapping = {
  [GET_DOM_DETAILS]: getDOMdetails,
  [HIGHLIGHT_ELEMENT]: highlightElement,
  [REMOVE_HIGHLIGHT]: hideHighlighter,
};

/**
 * init
 */
createHighlighterOverlay();
window.addEventListener('commandEvent', event => {
  handleEvent(event);
});
