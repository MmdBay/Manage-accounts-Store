import React, { useState } from "react";
import axios from "axios";
import { BsTrash3Fill, BsUiChecks } from "react-icons/bs";


const DeleteUserButton = ({ userId, onUserDeleted, userName, userFamily }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteClick = async () => {
    const confirmed = window.confirm('شما برای حذف این حساب اقدام کردین، آیا از این روند مطمعن هستین؟');
    if (!confirmed) {
      return;
    }
  //http://127.0.0.1:2086/
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/api/del/users/${userId}/${userName}/${userFamily}` : `/api/del/users/${userId}/${userName}/${userFamily}`}`);
      onUserDeleted(userId);
      setError("");
    } catch (error) {
      setError("An error occurred while deleting the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleDeleteClick} disabled={loading}>
      {loading ? <BsUiChecks /> : <BsTrash3Fill /> }
      {error && <div>{error}</div>}
    </button>
  );
};

export default DeleteUserButton;