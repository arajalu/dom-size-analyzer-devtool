import React, { Component } from 'react';
import { render } from 'react-dom';
import StartPage from './StartPage';
import DetailsPage from './DetailsPage';

import { GET_DOM_DETAILS } from '../constants/events';

const domInfoLoadingStates = {
  INIT: null,
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domData: null,
      domInfoLoadingState: domInfoLoadingStates.INIT,
    };
    this.getDOMdetails = this.getDOMdetails.bind(this);
  }

  componentDidMount() {
    const backgroundPageConnection = chrome.runtime.connect({
      name: 'devtools-page',
    });
    backgroundPageConnection.onMessage.addListener(message => {
      // Data has arrived in devtools page!!
      console.log('event recvd!!!', message);
      const { data: domData } = message || {};
      this.setState({
        domInfoLoadingState: domInfoLoadingStates.SUCCESS,
        domData,
      });
    });
  }

  getDOMdetails() {
    function sendGetDOMdetailsEvent() {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        console.log('sending get dom details event');
        chrome.tabs.sendMessage(tabs[0].id, {
          type: GET_DOM_DETAILS,
        });
      });
    }
    this.setState(
      { domInfoLoadingState: domInfoLoadingStates.LOADING },
      sendGetDOMdetailsEvent,
    );
  }

  renderView() {
    const { domData, domInfoLoadingState } = this.state;
    switch (domInfoLoadingState) {
      case domInfoLoadingStates.LOADING:
        return 'loading...';
      case domInfoLoadingStates.INIT:
        return <StartPage getDOMdetails={this.getDOMdetails} />;
      case domInfoLoadingStates.SUCCESS:
        return domData && <DetailsPage domData={domData} />;
      default:
        return null;
    }
  }

  render() {
    return this.renderView();
  }
}

render(<App />, document.getElementById('app'));
