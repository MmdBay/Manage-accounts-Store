import { useState, useEffect } from "react";
import axios from "axios";


function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLoggedIn = async () => {
      // http://127.0.0.1:2086
      const response = await axios(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? "http://127.0.0.1:2086/api/auth/check" : '/api/auth/check'}`);
      if (response.data.isLogin === 200) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false)
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (username, password) => {

    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_NODE_ENV === 'DEV' ? "http://127.0.0.1:2086/api/auth/login" : '/api/auth/login'}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { username, password },
      });

      const data = response.data;
      if (data.success) {
        setLoggedIn(true);
        setError("شما با موفقیت وارد شدین");
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setError("Too Many Requests, Your Baned!");
      } else {
        setError("خطا در برقراری ارتباط با سرور");
      }
    }
  };
  const logout = () => {
    setLoggedIn(false);
  };

  const resetError = () => {
    setError(null);
  };

  return { loggedIn, login, error, resetError, logout };
}

export default useAuth;
