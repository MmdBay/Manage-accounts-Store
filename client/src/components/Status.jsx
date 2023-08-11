import styled from "styled-components";
import React, { useState, useEffect } from "react";
import Title from "./CustomerStatistics";
import {
  BsDiagram3Fill,
  BsFillCalculatorFill,
  BsArrowClockwise,
} from "react-icons/bs";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  transform: translateY(90px);
  @media (max-width: 820px) {
    grid-template-columns: auto;
  }
`;

const Section = styled.section`
  position: relative;
  background-color: rgba(0, 0, 0, 0.705);
  backdrop-filter: blur(2px);
  padding: 10px;
  margin: 0 10px;
  color: #ffffff;
  border-radius: 20px;
`;

const Icons = styled.i`
  font-size: 28px;
  position: absolute;
  left: 10px;
  top: 10px;
`;

const Refresh = styled.span`
  position: absolute;
  display: inline-block;
  margin-right: 8px;
  top: 18px;
  vertical-align: middle;
  cursor: pointer;
  svg {
    position: absolute;
  }
`;

const UserCount = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 32px auto;
  font-size: 148px;
`;
const UserCount1 = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 72px auto;
  font-size: 58px;
`;

function Status(props) {
  const [count, setCount] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function fetchdata() {
// http://127.0.0.1:2086
    fetch(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/v1/count` : '/v1/count'}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error(err));
    fetch(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/v1/sum` : '/v1/sum'}`)
      .then((res) => res.json())
      .then((data) => setPrice(data.sum_price.toLocaleString("fa-IR")))
      .catch((err) => console.error(err));
    }
    fetchdata()
  }, []);

  const refreshUserCount = () => {
    fetch(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/v1/count` : '/v1/count'}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error(err));
  };

  const refreshPriceSum = () => {
    fetch(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/v1/sum` : '/v1/sum'}`)
      .then((res) => res.json())
      .then((data) => setPrice(data.sum_price.toLocaleString("fa-IR")))
      .catch((err) => console.error(err));
      
  };

  return (
    <>
      <Container>
        <Section>
          <Icons>
            <BsDiagram3Fill />
          </Icons>
          <Title title="تعداد حساب ها">
            <Refresh>
              <BsArrowClockwise onClick={refreshUserCount} />
            </Refresh>
          </Title>
          <UserCount>{count}</UserCount>
        </Section>
        <Section>
          <Icons>
            <BsFillCalculatorFill />
          </Icons>
          <Title title="جمع کل مبلغ حساب ها">
            <Refresh>
              <BsArrowClockwise onClick={refreshPriceSum} />
            </Refresh>
          </Title>
          <UserCount1>{!price ? 0 : price} تومان</UserCount1>
        </Section>
      </Container>
    </>
  );
}

export default Status;
