import { GLOBAL_INFO_OBJECT } from '../constants/common';

/**
 * serializes DOM nodes attributes to an object
 * @param {DOMnode} node
 * @param {object} additionalData
 * @returns {object}
 */
function serializeDOMnode(node = {}, additionalData) {
  const { attributes = {} } = node;
  const obj = {
    nodeType: node.nodeType,
    tagName: node.tagName,
    nodeName: node.nodeName,
    nodeValue: node.nodeValue,
    id: attributes.id ? attributes.id.value : undefined,
    class: attributes.class ? attributes.class.value : undefined,
    descendantsCount:
      typeof node.getElementsByTagName === 'function'
        ? node.getElementsByTagName('*').length
        : 0,
    attributes:
      typeof attributes.entries === 'function' ? attributes.entries() : [],
    ...additionalData,
  };

  return obj;
}

/**
 * fetches the required DOM details as an object
 * @param {DOMnode} node
 * @returns {object}
 */
export function getDOMdetails(node) {
  // eslint-disable-next-line no-param-reassign
  node = node || document.body;
  const uniqueIndex = window[GLOBAL_INFO_OBJECT].insertIntoElementsArray(node);
  const obj = serializeDOMnode(node, { uniqueIndex });
  const { childNodes } = node;
  if (childNodes) {
    const { length } = childNodes;
    obj.childNodes = new Array(length);
    const arr = obj.childNodes;
    for (let i = 0; i < length; i += 1) {
      arr[i] = getDOMdetails(childNodes[i]);
    }
  }
  return obj;
}

/**
 * Sends custom window event for communication between devtool,contentscript and backgroundscript
 * @param {Object} options
 * @param {String} options.type - To perform action based on the specified event type
 * @param {String} options.src
 * @param {any} options.data
 * @param {number} [options.tabID]
 * @returns {void}
 */
export function sendEvent({ type = null, src, data, tabID }) {
  const cmdEvent = new CustomEvent('commandEvent', {
    detail: { type, src, data, tabID },
  });
  window.dispatchEvent(cmdEvent);
}

/**
 * Returns a color (HSL model) gradient between red and green. Example: 0 -> green, 1 -> red
 * @param {Number} value a number between 0-1500
 */
export function getGreenRedGradientInHSL(value) {
  const MAX = 1500;
  // eslint-disable-next-line no-param-reassign
  if (value > MAX) value = MAX;
  const hue = ((1 - value / MAX) * 120).toString(10);
  return ['hsl(', hue, ',70%,50%)'].join('');
}

/**
 * returns node description in 'Tagname#id.class' format
 * @param {DOMnode} node
 */
export function generateNodeDescription(node = {}) {
  const { class: className, id } = node;
  return `${node.tagName}${id ? `#${id}` : ``}${
    className ? `.${className}` : ``
  }`;
}

/**
 *
 * @param {String} word
 * @param {Number} count
 * @param {String} [suffix='s']
 */
export function pluralizeWord(word, count, suffix = 's') {
  return `${word}${count !== 1 ? suffix : ``}`;
}
