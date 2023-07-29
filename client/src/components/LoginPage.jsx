import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import DOMPurify from "dompurify";
import useAuth from "../hooks/useAuth";

const Section = styled.div`
  width: 340px;
  position: absolute;
  direction: rtl;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #000000dc;
  padding: 1rem;
  border-radius: 4px;
  color: goldenrod;
  border: 1px solid goldenrod;
  h2 {
    text-align: center;
    border-bottom: 1px solid goldenrod;
    padding: 28px 18px 28px 18px;
    margin: 0 0 26px 0;
    font-size: 22px;
  }
  form {
    margin: 8px 0;
    input {
      width: 95%;
      display: block;
      font-family: inherit;
      margin: 20px 0;
      background-color: #000000;
      color: goldenrod;
      padding: 16px 6px;
      outline: none;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      &::placeholder {
        color: goldenrod;
      }
      &:focus {
        border: 1px solid gray;
        color: #000000;
        background-color: #ffffff;
        font-weight: bold;
        letter-spacing: 1px;
        &::placeholder {
          color: #000000;
        }
      }
    }
    button {
      font-family: inherit;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 1px;
      padding: 6px 12px;
      margin: 12px 0 16px 0;
      cursor: pointer;
      background-color: #000000;
      color: goldenrod;
      border: none;
      outline: none;
      border-radius: 4px;
      transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
        background-color: #000000c3;
        color: #ffffff;
      }
    }
  }
`;
const Error = styled.div`
  width: 100%;
  padding: 5px 5px 5px 0;
  color: #ffffff;
  border-right: 2px solid #ff6969;
  font-size: 12px;
  text-align: right;
`;

export default function LoginPage({ onLogin }) {
  const { login, error, resetError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      setIsLoading(false);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    resetError();
    let isValid = true;

    if (!email) {
      setEmailError("وارد کردن نام الزامی است!");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("وارد کردن پسورد الزامی است!");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      setIsLoading(true);
      onLogin(DOMPurify.sanitize(email), DOMPurify.sanitize(password));
      login(DOMPurify.sanitize(email), DOMPurify.sanitize(password)).then(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Section>
        <h2>صفحه ورود مدیریت</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="نام کاربری"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="current-email"
          />
          {emailError && <Error>{emailError}</Error>}
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {passwordError && <Error>{passwordError}</Error>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Oval
                height={18}
                width={30}
                color="#ffffff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#000000"
                strokeWidth={6}
                strokeWidthSecondary={6}
              />
            ) : (
              "ورود"
            )}
          </button>
        </form>
      </Section>
    </>
  );
}
