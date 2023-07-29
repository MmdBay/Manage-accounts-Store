import styled from "styled-components";
import { useState, useEffect } from "react";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { CSSTransition } from "react-transition-group";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/index.css";
import axios from "axios";
import "../assets/css/popup.css";
import moment from "jalali-moment";
import "moment-timezone";
import Popup from "./AddCustomer";

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: fixed;
  background-color: #000000a6;
  backdrop-filter: blur(5px);
  width: 100vw;
  height: 50px;
  z-index: 1;
  font-family: inherit;
`;
const Time = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
`;

const Icons = styled.i`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  font-size: 28px;
`;
const LogoutButton = styled.button`
  font-family: inherit;
  background-color: transparent;
  color: #ffffff;
  font-weight: bold;
  border: none;
  left: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
`;

function NavBar(props) {
  const [time, setTime] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const {loggedIn, logout, onFormSubmit } = props;

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

//http://127.0.0.1:2086/
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? "http://127.0.0.1:2086/api/insert/adduser" : '/api/insert/adduser'}`, formData);
      console.log(response.data);
      setShowPopup(false);
      toast.success("مشتری با موفقیت اضافه شد", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      onFormSubmit();
    } catch (error) {
      console.error(error);

      toast.error("مشکلی پیش اومده لطفا مجددا تلاش کنید", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleLogout = () => {
    logout();
  };
  useEffect(() => {
    let frameId;
    const updateTime = () => {
      setTime(
        moment()
          .locale("fa")
          .tz("Asia/Tehran")
          .format("dddd D MMMM YYYY h:mm a")
      );

      frameId = requestAnimationFrame(updateTime);
    };

    frameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(frameId);
  }, []);
  return (
    <>
      <Nav>
        {loggedIn && <LogoutButton onClick={handleLogout}>خروج</LogoutButton>}
        <Time>{time}</Time>
        <Icons>
          <BsDatabaseFillAdd onClick={togglePopup} />
        </Icons>
        <CSSTransition
          in={showPopup}
          timeout={300}
          classNames="popup"
          unmountOnExit
        >
          <Popup onSubmit={handleSubmit} closePopup={togglePopup} />
        </CSSTransition>
      </Nav>
      <ToastContainer />
    </>
  );
}

export default NavBar;
