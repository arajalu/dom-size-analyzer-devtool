import React, { Component } from 'react';
import { render } from 'react-dom';
import { Global, css } from '@emotion/core';
import StartPage from './StartPage';
import DetailsPage from './DetailsPage';

import {
  GET_DOM_DETAILS,
  HIGHLIGHT_ELEMENT,
  REMOVE_HIGHLIGHT,
} from '../constants/events';

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
      contentScriptInjected: null,
      tabID: undefined,
    };
    this.getDOMdetails = this.getDOMdetails.bind(this);
    this.sendHighlightElementEvent = this.sendHighlightElementEvent.bind(this);
    this.sendRemoveHighlightEvent = this.sendRemoveHighlightEvent.bind(this);
  }

  componentDidMount() {
    this.setupBackgroundPageEventListener();
    /**
     * sending 'ping' event immediately after add listener,
     * if contentscript is injected, it should send back a pong event immediately
     */
    this.sendEventToActiveTab('ping');
    /**
     * if no event (including 'pong') is not received within 500ms
     */
    setTimeout(() => {
      if (this.state.contentScriptInjected === null)
        this.setState({ contentScriptInjected: false });
    }, 500);
  }

  setupBackgroundPageEventListener() {
    const backgroundPageConnection = chrome.runtime.connect({
      name: 'devtools-page',
    });
    backgroundPageConnection.onMessage.addListener(message => {
      console.log('event recvd!!!', message);
      /**
       * received an event from bg script, scripts must have been injected!
       */
      this.setState({ contentScriptInjected: true });
      if (
        message.type === GET_DOM_DETAILS &&
        this.state.tabID &&
        message.tabID === this.state.tabID
      ) {
        const { data: domData } = message || {};
        this.setState({
          domInfoLoadingState: domInfoLoadingStates.SUCCESS,
          domData,
        });
      }
    });
  }

  sendEventToActiveTab(type, data) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      console.log('sending event to active tab');
      const tabID = tabs[0].id;
      this.setState({ tabID });
      chrome.tabs.sendMessage(tabID, {
        type,
        data,
        tabID,
      });
    });
  }

  getDOMdetails() {
    this.setState({ domInfoLoadingState: domInfoLoadingStates.LOADING }, () =>
      this.sendEventToActiveTab(GET_DOM_DETAILS),
    );
  }

  sendHighlightElementEvent(uniqueElementIndex) {
    this.sendEventToActiveTab(HIGHLIGHT_ELEMENT, { uniqueElementIndex });
  }

  sendRemoveHighlightEvent() {
    this.sendEventToActiveTab(REMOVE_HIGHLIGHT);
  }

  renderView() {
    const { domData, domInfoLoadingState } = this.state;
    switch (domInfoLoadingState) {
      case domInfoLoadingStates.LOADING:
        return 'loading...';
      case domInfoLoadingStates.INIT:
        return <StartPage getDOMdetails={this.getDOMdetails} />;
      case domInfoLoadingStates.SUCCESS:
        return (
          domData && (
            <DetailsPage
              domData={domData}
              sendHighlightElementEvent={this.sendHighlightElementEvent}
              sendRemoveHighlightEvent={this.sendRemoveHighlightEvent}
              getDOMdetails={this.getDOMdetails}
            />
          )
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          <Global
            styles={css`
              body {
                margin: 0px;
              }
            `}
          />
        }
        {this.renderView()}
      </React.Fragment>
    );
  }
}

render(<App />, document.getElementById('app'));
