import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  getGreenRedGradientInHSL,
  generateNodeDescription,
  pluralizeWord,
} from 'utils/helpers';

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

const ElementBar = styled.button`
  display: block;
  width: 100%;
  height: 20px;
  padding: 2px;
  margin-top: 2px;
  text-align: left;
  padding-left: 4px;
  border: none;
  border-radius: 4px;
  background: ${props =>
    props.descendantsCount
      ? getGreenRedGradientInHSL(props.descendantsCount)
      : `lightgray`};
  ${props =>
    props.descendantsCount
      ? `:hover {
            border: black;
            border-style: solid;
            border-width: 1px;
          }`
      : ``}
  ${props =>
    props.descendantsCount
      ? `::after {
      content: '>';
      color: black;
      float: right;
      margin-right: 2px;
    }`
      : ``}
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

  renderElementBars(parent) {
    const { domData } = this.props;
    const childNodesArray = parent
      ? parent.childNodes || []
      : domData.childNodes || [];
    return childNodesArray
      .filter(childNode => childNode.tagName && childNode.tagName !== 'SCRIPT')
      .map(childNode => (
        <ElementBar
          descendantsCount={childNode.descendantsCount}
          onClick={() =>
            childNode.descendantsCount &&
            this.appendNewParentNodeToHistory(childNode)
          }
        >
          {`${generateNodeDescription(childNode)}  `}
          {childNode.descendantsCount ? (
            <b>
              - {childNode.descendantsCount}{' '}
              {pluralizeWord('descendant', childNode.descendantsCount)}{' '}
            </b>
          ) : null}
        </ElementBar>
      ));
  }

  render() {
    const { parentNodeTransitionHistory } = this.state;
    const { domData } = this.props;
    const currentParent = this.getCurrentParent();
    return (
      <Wrapper>
        <Heading>
          <b>Total:</b> {domData.descendantsCount}{' '}
          {pluralizeWord('element', domData.descendantsCount)}
          {',    '}
          <b>{generateNodeDescription(currentParent)}</b>:{' '}
          {currentParent.descendantsCount}{' '}
          {pluralizeWord('element', currentParent.descendantsCount)}
        </Heading>
        <Heading />
        {parentNodeTransitionHistory.length > 1 ? (
          <BackButton onClick={this.removeLastParentNodeFromHistory}>
            back
          </BackButton>
        ) : null}
        {this.renderElementBars(currentParent)}
      </Wrapper>
    );
  }
}

DetailsPage.propTypes = {
  domData: PropTypes.object,
};

export default DetailsPage;
