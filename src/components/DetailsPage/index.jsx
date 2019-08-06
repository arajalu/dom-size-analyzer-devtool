import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div``;

const BackButton = styled.button`
  margin: 5px 0px;
  position: relative;
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
  background: gray;
  padding: 2px;
  margin-top: 2px;
  text-align: left;
  padding-left: 4px;
  border: none;
  border-radius: 4px;
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

  renderChildren(parent) {
    const { domData } = this.props;
    const childNodesArray = parent
      ? parent.childNodes || []
      : domData.childNodes || [];
    return childNodesArray.map(childNode => (
      <ElementBar
        onClick={() =>
          childNode.descendantsCount &&
          this.appendNewParentNodeToHistory(childNode)
        }
      >
        {`${childNode.tagName} - ${childNode.descendantsCount} descendants`}
      </ElementBar>
    ));
  }

  render() {
    const { parentNodeTransitionHistory } = this.state;
    return (
      <Wrapper>
        {parentNodeTransitionHistory.length > 1 ? (
          <BackButton onClick={this.removeLastParentNodeFromHistory}>
            back
          </BackButton>
        ) : null}
        {this.renderChildren(this.getCurrentParent())}
      </Wrapper>
    );
  }
}

DetailsPage.propTypes = {
  domData: PropTypes.object,
};

export default DetailsPage;
