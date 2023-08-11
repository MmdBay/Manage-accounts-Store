import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  BsFillPlusCircleFill,
  BsFillFileEarmarkArrowDownFill
} from "react-icons/bs";
import BounceLoader from "react-spinners/ClipLoader";
import UpdateModal from "./UpdateModal";
import RecivePrice from "./recivePrice";
import PurchasedProducts from "./PurchasedProducts";
import Modal from "react-modal";
import moment from "jalali-moment";
import "moment-timezone";
import DeleteUserButton from "./DeleteUserButton";
import { Btn } from "./UpdateModal";

const customStyles = {
  content: {
    top: "7%",
    backgroundColor: "#00000083"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
};

const Container = styled.div`
  transform: translateY(120px);
  margin: 35px auto;
  margin-bottom: 200px;
  padding: 8px;
  width: 95%;
  background-color: #00000097;
  color: #fff;
  border-radius: 4px;
  .main {
    display: flex;
    align-content: center;
    background-color: #000000ba;
    margin: 15px auto;
    padding: 12px;
    width: 95%;
    border-radius: 4px;
    span {
      padding: 6px 12px;
      cursor: pointer;
      transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
        color: #d1d1d1;
      }
    }
    .left {
      margin-right: auto;
      button {
        transform: translateY(4px);
        font-family: inherit;
        margin-right: 10px;
        font-size: 18px;
        background-color: transparent;
        cursor: pointer;
        color: #fff;
        border: none;
        outline: none;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        &:hover {
          color: #999999;
        }
      }
    }
  }
`;
const Searchs = styled.input`
  display: flex;
  align-items: center;
  margin: 5px auto;
  text-align: center;
  width: 120px;
  font-family: inherit;
  padding: 8px 8px;
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.384);
  backdrop-filter: blur(2px);
  color: #000000;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  &::placeholder {
    color: #000000;
    font-size: 14px;
  }
  &:focus {
    text-align: right;
    width: 320px;
    padding: 14px;
    background-color: rgba(0, 0, 0, 0.74);
    color: #ffffff;
    font-size: 16px;
    &::placeholder {
      color: #ffffff;
      font-size: 15px;
      letter-spacing: 2px;
    }
  }
`;

const CoustomerDate = styled.span`
  font-size: 14px;
  color: goldenrod;
  background-color: #000000df;
  padding: 8px;
  border-radius: 4px;
  margin: 0 5px 0 0;
`;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);
  const [showRecivePriceModal, setShowRecivePriceModal] = useState(false);
  const [selectedUserForPrice, setSelectedUserForPrice] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // http://127.0.0.1:2086
    const response = await axios.get(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? "http://127.0.0.1:2086/v1/customers" : "/v1/customers"}`);
    setUsers(response.data);
    setLoading(false);
  }

  const handleSaveButtonClick = () => {
    fetchUsers();
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users.slice(0, 5));
    } else {
      const filtered = users.filter((user) => {
        const fullName = `${user.id}${user.name}${user.family}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleUpdateClick1 = (user) => {
    setShowRecivePriceModal(true);
    setSelectedUserForPrice(user);
  };

  const handleUpdateClick = (user) => {
    setShowUpdateModal(true);
    setSelectedUserForUpdate(user);
  };

  const openModal = (userId) => {
    setSelectedUserProfile(userId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleUserDeleted = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container>
      {loading ? (
        <div className="loader-container">
          <BounceLoader color="#36d7b7" />
        </div>
      ) : null}
      <div>
        {users.length > 0 ? (
          <Searchs
            type="text"
            placeholder="جستجو..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        ) : null}
      </div>
      {filteredUsers.slice(0, filteredUsers.length).map((user) => (
        <div className="main" key={user.id}>
          <span onClick={() => openModal(user.id)}>
            {user.id}. {user.name} {user.family}{" "}
            <CoustomerDate>
              آخرین آپدیت :{" "}
              {user.created_at && typeof user.created_at === "number"
                ? moment(user.created_at)
                    .locale("fa")
                    .tz("Asia/Tehran")
                    .format("dddd D MMMM YYYY h:mm a")
                : "پخ"}
            </CoustomerDate>
          </span>
          <div className="left">
            <button className="btn1" onClick={() => handleUpdateClick(user)}>
              <BsFillPlusCircleFill />
            </button>
            <button className="btn1" onClick={() => handleUpdateClick1(user)}>
              <BsFillFileEarmarkArrowDownFill />
            </button>
            <DeleteUserButton
              userId={user.id}
              userName={user.name}
              userFamily={user.family}
              onUserDeleted={handleUserDeleted}
            />
          </div>
        </div>
      ))}
      {showUpdateModal && (
        <UpdateModal
          user={selectedUserForUpdate}
          refrshUsers={handleSaveButtonClick}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
      {showRecivePriceModal && (
        <RecivePrice
          user={selectedUserForPrice}
          refrshUsers={handleSaveButtonClick}
          onClose={() => setShowRecivePriceModal(false)}
        />
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Profile"
        style={customStyles}
      >
        <PurchasedProducts
          userId={selectedUserProfile}
          refrshUsers={handleSaveButtonClick}
        />
        <Btn onClick={closeModal}>خروج</Btn>
      </Modal>
    </Container>
  );
};

export default UserList;
