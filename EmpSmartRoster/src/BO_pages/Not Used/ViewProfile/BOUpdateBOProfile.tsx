import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BOUpdateBOProfile.css";
import "./ViewProfile.css";
import "../../../public/styles/common.css";

function BOUpdateBOProfile() {
  // Initial default values; you might read these from localStorage if available.
  const defaultProfile = {
    boName: "John Yeo",
    address: "Bukit Batok Ave 3",
    email: "JohnYeo@MalaTang.com",
  };

  // Optionally, load stored data from localStorage if it exists
  const storedData = localStorage.getItem("boProfile");
  const initialProfile = storedData ? JSON.parse(storedData) : defaultProfile;

  const [boName, setBOProfile] = useState(initialProfile.boName);
  const [address, setAddress] = useState(initialProfile.address);
  const [email, setEmail] = useState(initialProfile.email);
  const navigate = useNavigate();

  // Handle submit: save data to localStorage then navigate to the view page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = { boName, address, email };
    localStorage.setItem("boProfile", JSON.stringify(updatedProfile));
    navigate("/view-bo-detail"); // Adjust route as needed
  };

  return (
    <div className="App-content">
      <div className="content">
        <h1 className="logo">EmpRoster</h1>
        <div className="main-contents">
          <div className="bo-profile">
            <h1 className="bo-profile_title">Edit My Profile</h1>
            <div className="bo-profile_layout">
              <div className="bo-profile_card">
                <div className="bo-profile_icon">
                  <FaUserCircle size={80} />
                </div>
                <form className="bo-profile_info" onSubmit={handleSubmit}>
                  <p className="bo-profile_label">Name</p>
                  <input
                    type="text"
                    value={boName}
                    onChange={(e) => setBOProfile(e.target.value)}
                    className="bo-profile_input"
                  />

                  <p className="bo-profile_label">Address</p>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bo-profile_input"
                  />

                  <p className="bo-profile_label">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bo-profile_input"
                  />
                  <button type="submit" className="bo_button_control">
                    <div className="primary-button">Confirm</div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BOUpdateBOProfile;
