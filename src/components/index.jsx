import React, { Component } from 'react';
import { render } from 'react-dom';

import { GET_DOM_DETAILS } from '../constants/events';

class App extends Component {
  componentDidMount() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      console.log('sending event');
      chrome.tabs.sendMessage(tabs[0].id, {
        type: GET_DOM_DETAILS,
      });
    });
  }

  render() {
    return <div>TEST</div>;
  }
}

render(<App />, document.getElementById('app'));
