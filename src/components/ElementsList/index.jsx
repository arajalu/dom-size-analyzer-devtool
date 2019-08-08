import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  getGreenRedGradientInHSL,
  generateNodeDescription,
  pluralizeWord,
} from 'utils/helpers';

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

function ElementsList({ node, onClickHandler }) {
  const childNodesArray = node ? node.childNodes : [];
  return childNodesArray
    .filter(childNode => childNode.tagName)
    .map(childNode => {
      const { descendantsCount } = childNode;
      const nodeDescription = generateNodeDescription(childNode);
      return (
        <ElementBar
          descendantsCount={descendantsCount}
          onClick={() => descendantsCount && onClickHandler(childNode)}
          // key={`${nodeDescription}${descendantsCount}`} NOTE:removed this key as it was causing duplicates TODO:find better key
        >
          {nodeDescription}{' '}
          {descendantsCount ? (
            <b>
              - {descendantsCount}{' '}
              {pluralizeWord('descendant', descendantsCount)}{' '}
            </b>
          ) : null}
        </ElementBar>
      );
    });
}

ElementsList.propTypes = {
  node: PropTypes.object,
  onClickHandler: PropTypes.func,
};

export default memo(ElementsList);
