import {
  GET_DOM_DETAILS,
  HIGHLIGHT_ELEMENT,
  REMOVE_HIGHLIGHT,
} from '../constants/events';
import { GLOBAL_INFO_OBJECT } from '../constants/common';
import { getDOMdetails, sendEvent } from '../utils/helpers';

function createHighlighterOverlay() {
  const overlay = document.createElement('div');
  document.body.appendChild(overlay);
  overlay.setAttribute('id', 'domCountAnalyzerOverlay');
  overlay.style.zIndex = '9999999';
  overlay.style.background = 'rgba(112, 163, 255, 0.46)';
  overlay.style.display = `none`;
  overlay.style.position = `absolute`;
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
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

/**
 * scrolls element into view and highlights the element
 */
function highlightElementHandler({ uniqueElementIndex }) {
  const element = window[GLOBAL_INFO_OBJECT].elementsArray[uniqueElementIndex];
  if (typeof element.scrollIntoView === 'function') {
    element.scrollIntoView();
  }
  highlightElement(element);
}

function handleEvent(event) {
  const { detail } = event;
  const { src, type, data } = detail || {};
  if (src !== 'injected-script' && type in eventHandlerMapping) {
    const result = eventHandlerMapping[type](data);
    console.log('inj', result);
    sendEvent({ src: 'injected-script', type, data: result });
  }
}

function initializeElementsArrayAndReturnDOMdetails() {
  window[GLOBAL_INFO_OBJECT] = {
    ...window[GLOBAL_INFO_OBJECT],
    elementsArray: [],
    insertIntoElementsArray: element =>
      window[GLOBAL_INFO_OBJECT].elementsArray.push(element) - 1,
  };
  return getDOMdetails();
}

const eventHandlerMapping = {
  [GET_DOM_DETAILS]: initializeElementsArrayAndReturnDOMdetails,
  [HIGHLIGHT_ELEMENT]: highlightElementHandler,
  [REMOVE_HIGHLIGHT]: hideHighlighter,
};

/**
 * init
 */
createHighlighterOverlay();
window.addEventListener('commandEvent', event => {
  handleEvent(event);
});
