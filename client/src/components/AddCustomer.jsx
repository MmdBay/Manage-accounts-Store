import styled from "styled-components";
import { useState } from "react";
import { BsXLg } from "react-icons/bs";
import DOMPurify from "dompurify";


const Container = styled.section`
  width: 400px;
  position: absolute;
  top: 400%;
  background-color: rgba(0, 0, 0, 0.877);
  backdrop-filter: blur(5px);
  color: #ffffff;
  overflow: hidden;
  text-align: right;
  border-radius: 8px;
  h2 {
    font-size: 1rem;
    padding: 15px 15px 5px 15px;
    margin: 15px auto 10px auto;
  }
  span {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #f53f3f;
    font-size: 18px;
    cursor: pointer;
  }
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  input {
    width: 85%;
    font-family: inherit;
    padding: 10px 12px;
    margin: 12px auto;
    outline: none;
    border: none;
    border-radius: 4px;
    border: 1px solid #55575e;
    background-color: #ffffffb3;
    backdrop-filter: blur(5px);
    color: #000000;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    &::placeholder {
      color: #455a64;
      font-size: 12px;
    }
    &:focus {
      border: 1px solid #000000;
      background-color: #ffffff;
      &::placeholder {
        color: #000000;
      }
    }
  }
`;

const Btn = styled.button`
  float: right;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 6px 12px;
  margin: 12px 18px 16px 0;
  cursor: pointer;
  background-color: #ffffff;
  color: #455a64;
  border: none;
  outline: none;
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    box-shadow: -55px 0 0 0 #000000 inset;
    color: #ffffff;
  }
`;
const Error = styled.div`
  width: 90%;
  color: #ffffff;
  font-size: 12px;
  margin-top: 4px;
`;

function Popup(props) {
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [familyError, setFamilyError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      setNameError("نام را وارد کنید");
    } else {
      setNameError("");
    }

    if (!family) {
      setFamilyError("نام خانوادگی را وارد کنید");
    } else {
      setFamilyError("");
    }

    if (!phone) {
      setPhoneError("شماره تماس را وارد کنید");
    } else if (
      !/^(?:\+?\d{1,3}\s*(?:\d{2,3})?|\(?0\d{2,3}\)?)\s*[1-9]\d{2,7}(?:\s*\d{1,4})?$/.test(
        phone
      )
    ) {
      setPhoneError("شماره تماس معتبر نیست");
      return;
    } else {
      setPhoneError("");
    }

    if (name && family && phone) {
      const formData = {
        name: DOMPurify.sanitize(name),
        family: DOMPurify.sanitize(family),
        phone: DOMPurify.sanitize(phone),
      };
      props.onSubmit(formData);
    }
  };

  const togglePopup = () => {
    props.closePopup();
  }

  return (
    <Container>
      <h2>افزودن حساب جدید اطلاعات رو وارد کنید :</h2>
      <span onClick={togglePopup}><BsXLg/></span>
      <form onSubmit={handleSubmit}>
        <Div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {nameError && <Error>{nameError}</Error>}
        </Div>
        <Div>
          <input
            type="text"
            id="family"
            name="family"
            placeholder="نام خانوادگی"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          />
          {familyError && <Error>{familyError}</Error>}
        </Div>
        <Div>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="شماره تماس (11 رقمی)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {phoneError && <Error>{phoneError}</Error>}
        </Div>
        <Btn type="submit">ثبت</Btn>
      </form>
    </Container>
  );
}

export default Popup;
