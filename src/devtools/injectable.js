import { GET_DOM_DETAILS } from '../constants/events';
import { getDOMdetails, sendEvent } from '../utils/helpers';

window.addEventListener('commandEvent', event => {
  handleEvent(event);
});

const eventHandlerMapping = {
  [GET_DOM_DETAILS]: getDOMdetails,
};

function handleEvent(event) {
  const { detail } = event;
  const { src, type } = detail || {};
  if (src !== 'injected-script' && type in eventHandlerMapping) {
    const result = eventHandlerMapping[type]();
    console.log('inj', result);
    sendEvent({ src: 'injected-script', data: result });
  }
}
