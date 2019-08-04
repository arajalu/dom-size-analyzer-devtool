import React, { Component } from 'react';
import { render } from 'react-dom';

import { GET_DOM_DETAILS } from '../constants/events';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domData: null,
    };
  }

  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      console.log('sending event');
      chrome.tabs.sendMessage(tabs[0].id, {
        type: GET_DOM_DETAILS,
      });
    });
    const backgroundPageConnection = chrome.runtime.connect({
      name: 'devtools-page',
    });
    backgroundPageConnection.onMessage.addListener(message => {
      // Data has arrived in devtools page!!
      console.log('event recvd!!!', message);
      const { data: domData } = message || {};
      this.setState({ domData });
    });
  }

  render() {
    const { domData } = this.state;

    return domData ? JSON.stringify(domData) : <div>TESTs</div>;
  }
}

render(<App />, document.getElementById('app'));
