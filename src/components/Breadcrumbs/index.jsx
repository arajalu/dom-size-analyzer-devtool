import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { generateNodeDescription } from 'utils/helpers';

const BreadcrumbsContainer = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
  padding: 5px 2px;
  overflow-x: auto;
  overflow-y: hidden;
  border-style: solid;
  border-width: 1px;
  border-color: gray;
  background-color: white;
`;
const BreadCrumb = styled.span`
  display: inline;
  min-width: 10px;
  height: 20px;
  padding: 2px;
  text-align: center;
  padding-left: 4px;
  margin-left: 2px;
  border-radius: 2px;
  background-color: lightgray;
  :hover {
    border: black;
    border-style: solid;
    border-width: 1px;
  }
`;

function Breadcrumbs({ parentNodeTransitionHistory, setNthNodeAsCurrentNode }) {
  return (
    <BreadcrumbsContainer>
      {parentNodeTransitionHistory.map((node, index) => (
        <BreadCrumb onClick={() => setNthNodeAsCurrentNode(index + 1)}>
          {generateNodeDescription(node)}
        </BreadCrumb>
      ))}
    </BreadcrumbsContainer>
  );
}

Breadcrumbs.propTypes = {
  parentNodeTransitionHistory: PropTypes.array,
  setNthNodeAsCurrentNode: PropTypes.func,
};

export default memo(Breadcrumbs);
