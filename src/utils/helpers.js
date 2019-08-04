/**
 * serializes DOM nodes attributes to an object
 * @param {DOMnode} node
 * @returns {object}
 */
function serializeDOMnode(node) {
  const obj = {
    nodeType: node.nodeType,
  };
  obj.tagName = node.tagName;
  obj.nodeName = node.nodeName;
  obj.nodeValue = node.nodeValue;
  obj.descendantsCount =
    typeof node.getElementsByTagName === 'function'
      ? node.getElementsByTagName('*').length
      : 0;
  const { attributes } = node;
  if (attributes) {
    const { length } = attributes;
    obj.attributes = new Array(length);
    const arr = obj.attributes;
    for (let i = 0; i < length; i += 1) {
      const attribute = attributes[i];
      arr[i] = [attribute.nodeName, attribute.nodeValue];
    }
  }
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
  const obj = serializeDOMnode(node);
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
 * @returns {void}
 */
export function sendEvent({ type = null, src, data }) {
  const cmdEvent = new CustomEvent('commandEvent', {
    detail: { type, src, data },
  });
  window.dispatchEvent(cmdEvent);
}
