import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { generateNodeDescription, pluralizeWord } from 'utils/helpers';

import Breadcrumbs from '../Breadcrumbs';
import ElementsList from '../ElementsList';

const Wrapper = styled.div`
  margin: 2px 2px 20px 2px;
`;

const Heading = styled.p`
  margin: 20px auto;
  width: 100%;
  font-size: 15px;
  font-weight: 300;
  text-align: center;
`;

const Button = styled.button`
  cursor: pointer;
  display: block;
  background: #fff;
  border: 0px solid #444;
  border-width: 0px 0px 0px 0px;
  box-shadow: 0px 1px 3px rgba(0%, 0%, 0%, 0.3);
  color: #000;
  border-radius: 4px;
  padding: 4px;
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 10px;
  margin: 5px 0px;
  height: auto;
  width: 40px;
`;

const RefreshButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 10px;
  margin: 5px 0px;
  height: auto;
  width: 40px;
`;

class DetailsPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      parentNodeTransitionHistory: [props.domData],
    };
    this.appendNewParentNodeToHistory = this.appendNewParentNodeToHistory.bind(
      this,
    );
    this.removeLastParentNodeFromHistory = this.removeLastParentNodeFromHistory.bind(
      this,
    );
    this.setNthNodeAsCurrentNode = this.setNthNodeAsCurrentNode.bind(this);
  }

  appendNewParentNodeToHistory(node) {
    this.setState(state => ({
      parentNodeTransitionHistory: [...state.parentNodeTransitionHistory, node],
    }));
  }

  removeLastParentNodeFromHistory() {
    if (this.state.parentNodeTransitionHistory.length > 1)
      this.setState(state => ({
        parentNodeTransitionHistory: [
          ...state.parentNodeTransitionHistory,
        ].slice(0, state.parentNodeTransitionHistory.length - 1),
      }));
  }

  setNthNodeAsCurrentNode(n) {
    const { parentNodeTransitionHistory } = this.state;
    if (parentNodeTransitionHistory.length > n)
      this.setState(state => ({
        parentNodeTransitionHistory: [
          ...state.parentNodeTransitionHistory,
        ].slice(0, n),
      }));
  }

  getCurrentParent() {
    const { parentNodeTransitionHistory } = this.state;
    return parentNodeTransitionHistory[parentNodeTransitionHistory.length - 1];
  }

  headingText() {
    const { domData } = this.props;
    const { parentNodeTransitionHistory } = this.state;
    const currentParent = this.getCurrentParent();
    return (
      <React.Fragment>
        {/* Total count text */}
        <b>Total:</b> {domData.descendantsCount}{' '}
        {pluralizeWord('element', domData.descendantsCount)}
        {parentNodeTransitionHistory.length > 1 ? (
          <React.Fragment>
            {/* Current parent's descendants count */}
            {',    '}
            <b>{generateNodeDescription(currentParent)}</b>:{' '}
            {currentParent.descendantsCount}{' '}
            {pluralizeWord('element', currentParent.descendantsCount)}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }

  renderBackButton() {
    const { parentNodeTransitionHistory } = this.state;
    return parentNodeTransitionHistory.length > 1 ? (
      <BackButton onClick={this.removeLastParentNodeFromHistory}>
        back
      </BackButton>
    ) : null;
  }

  render() {
    const currentParent = this.getCurrentParent();
    const { parentNodeTransitionHistory } = this.state;
    const { getDOMdetails, domData } = this.props;
    return (
      <React.Fragment>
        <Wrapper>
          <Heading>{this.headingText()}</Heading>
          {this.renderBackButton()}
          <RefreshButton
            onClick={() => {
              this.setState(
                { parentNodeTransitionHistory: [domData] },
                getDOMdetails,
              );
            }}
          >
            {'\u21BA'}
          </RefreshButton>
          <ElementsList
            node={currentParent}
            onClickHandler={this.appendNewParentNodeToHistory}
          />
        </Wrapper>
        <Breadcrumbs
          parentNodeTransitionHistory={parentNodeTransitionHistory}
          setNthNodeAsCurrentNode={this.setNthNodeAsCurrentNode}
        />
      </React.Fragment>
    );
  }
}

DetailsPage.propTypes = {
  domData: PropTypes.object,
  getDOMdetails: PropTypes.func,
};

export default DetailsPage;
