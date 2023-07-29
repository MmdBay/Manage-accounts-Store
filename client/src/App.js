import "./assets/css/index.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import BarLoader from "react-spinners/BarLoader";
import styled from "styled-components";
import NavBar from "./components/NavBar";
import Section from "./components/Status";
import LoginPage from "./components/LoginPage";
// import backGround from "./services/backGround";
import useAuth from "./hooks/useAuth";
import UserList from "./components/ShowCustomer";

const MainContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

function App() {
  const [loading, setIsLoading] = useState(true);
  const { loggedIn, login, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const response = await axios.get(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? 'http://127.0.0.1:2086/v1/count' : '/v1/count'}`);
    setUsers(response.data);
  };

  const handleFormSubmit = () => {
    fetchUsers()
  };

  useEffect(() => {
    setIsLoading(false);
  }, [users]);

  const MainContent = () => (
    <>
      <NavBar
        loggedIn={loggedIn}
        logout={logout}
        onFormSubmit={handleFormSubmit}
      />
      <MainContainer>
        <Section />
        <UserList />
      </MainContainer>
    </>
  );

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <BarLoader color="#36d7b7" />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                loggedIn ? <MainContent /> : <LoginPage onLogin={login} />
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
