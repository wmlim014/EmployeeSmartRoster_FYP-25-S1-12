import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./VPBody.css";

function VPBody() {
  const [boProfile, setBOProfile] = useState({
    boName: "",
    address: "",
    email: "",
  });
  const navigate = useNavigate();

  // Read the stored profile from localStorage on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("boProfile");
    if (storedProfile) {
      setBOProfile(JSON.parse(storedProfile));
    } else {
      // Fallback defaults, if necessary
      setBOProfile({
        boName: "John Yeo",
        address: "Bukit Batok Ave 3",
        email: "JohnYeo@MalaTang.com",
      });
    }
  }, []);

  return (
    <div className="view-profile">
      <h1 className="view-profile__title">View My Profile</h1>
      <div className="view-profile__layout">
        <div className="view-profile__card">
          <div className="view-profile__icon">
            <FaUserCircle size={80} />
          </div>
          <div className="view-profile__info">
            <p className="view-profile__label">Name</p>
            <p>{boProfile.boName}</p>

            <p className="view-profile__label">Address</p>
            <p>{boProfile.address}</p>

            <p className="view-profile__label">Email</p>
            <p>{boProfile.email}</p>
          </div>
          <div className="bo_button_update">
            <div
            className="primary-button"
            onClick={() => navigate("/update-bo-detail")}
            >
            Update My Profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VPBody;
