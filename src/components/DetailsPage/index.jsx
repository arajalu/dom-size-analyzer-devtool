import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { generateNodeDescription, pluralizeWord } from 'utils/helpers';

import ElementsList from '../ElementsList';

const Wrapper = styled.div``;

const Heading = styled.h1`
  margin: 20px auto;
  width: 100%;
  font-weight: 300;
  text-align: center;
`;

const BackButton = styled.button`
  position: absolute;
  top: 34px;
  margin: 5px 0px;
  cursor: pointer;
  display: block;
  background: #fff;
  border: 0px solid #444;
  border-width: 0px 0px 0px 0px;
  box-shadow: 0px 1px 3px rgba(0%, 0%, 0%, 0.3);
  color: #000;
  border-radius: 4px;
  height: auto;
  width: 40px;
  padding: 4px;
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
            {/* Current parents descendants count */}
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
    return (
      <Wrapper>
        <Heading>{this.headingText()}</Heading>
        {this.renderBackButton()}
        <ElementsList
          node={currentParent}
          onClickHandler={this.appendNewParentNodeToHistory}
        />
      </Wrapper>
    );
  }
}

DetailsPage.propTypes = {
  domData: PropTypes.object,
};

export default DetailsPage;
