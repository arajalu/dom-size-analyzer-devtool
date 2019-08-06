import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div``;

const Heading = styled.h1`
  margin: 20px auto;
  width: 300px;
  font-weight: 300;
  text-align: center;
`;

const GetStarted = styled.button`
  margin: 10px auto;
  position: relative;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: block;
  background: #fff;
  border-radius: 100px;
  border: 0px solid #444;
  border-width: 0px 0px 0px 0px;
  padding: 10px 13px 10px 13px;
  box-shadow: 0px 1px 3px rgba(0%, 0%, 0%, 0.3);
  color: #000;
`;

const Triangle = styled.div`
  margin-left: 4px;
  border: 100px 100px;
  border-color: transparent transparent transparent green;
  border-style: solid;
  border-width: 8px 8px 8px 15px;
  height: 0px;
  width: 0px;
`;

function StartPage({ getDOMdetails }) {
  return (
    <Wrapper>
      <Heading>Retrieve DOM details</Heading>
      <GetStarted onClick={getDOMdetails}>
        <Triangle />
      </GetStarted>
    </Wrapper>
  );
}

StartPage.propTypes = {
  getDOMdetails: PropTypes.func,
};

export default StartPage;
