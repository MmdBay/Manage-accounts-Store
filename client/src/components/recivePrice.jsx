import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import styled from "styled-components";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    border: "none",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#00000083",
    borderRadius: "4px",
    padding: "20px",
    width: "80%",
    maxWidth: "360px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const Form = styled.form`
  z-index: 1000;
  color: #fff;
`;

const FormGroup = styled.div`
  margin: 40px auto;
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #fff;
`;

const FormInput = styled.input`
  width: 95%;
  display: block;
  font-family: inherit;
  padding: 10px 12px;
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: #ffffffb3;
  color: #000000;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  &::placeholder {
    color: #455a64;
    font-size: 14px;
  }
  &:focus {
    border: none;
    background-color: #ffffff;
    &::placeholder {
      color: #000000;
    }
  }
`;

const FormError = styled.span`
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 12px;
  color: #ffffff;
`;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  margin: 15px auto;
`;

export const Btn = styled.button`
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  width: 75px;
  letter-spacing: 1px;
  padding: 6px 12px;
  margin: 12px 18px 16px 0;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ffffff;
  color: #455a64;
  border: none;
  outline: none;
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: #0e0d0d;
    color: #ffffff;
  }
`;

const RecivePrice = ({ user, onClose, refrshUsers }) => {
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [formError, setFormError] = useState("");

  const validatePrice = () => {
    if (!price || isNaN(price)) {
      setPriceError("قیمت الزامی است و باید عددی باشد");
      return false;
    }
    setPriceError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isPriceValid = validatePrice();

    if (!isPriceValid) {
    //   setFormError("لطفا خطاهای فرم را برطرف کنید");
      return;
    }

    try {
      // http://127.0.0.1:2086
      await axios.post(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/api/insert/recived_price/${user.name}/${user.family}` : `/api/insert/recived_price/${user.name}/${user.family}`}`, {
        user_id: user.id,
        price: parseFloat(price),
      });
      refrshUsers()
      onClose();
    } catch (error) {
      setFormError("خطا در ارسال فرم، لطفا دوباره تلاش کنید");
    }
  };

  return (
    <Modal isOpen onRequestClose={onClose} style={customStyles}>
      <Title>مبلغ دریافتی از {user.name}</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="price">مبلغ دریافتی</FormLabel>
          <FormInput
            type="text"
            id="price"
            placeholder="مبلغ دریافتی"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={validatePrice}
          />
          {priceError && <FormError>{priceError}</FormError>}
        </FormGroup>
        {formError && <FormError>{formError}</FormError>}
        <Btn type="submit">افزودن</Btn>
        <Btn onClick={onClose}>خروج</Btn>
      </Form>
    </Modal>
  );
};


export default RecivePrice;