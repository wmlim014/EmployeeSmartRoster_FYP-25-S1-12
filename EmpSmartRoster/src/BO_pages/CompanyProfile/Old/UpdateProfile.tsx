// import React, { useState, useEffect } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import CompanyProfileController from "../../../controller/BOEmpMgntProfile/CompanyProfileController";
// import { useAuth } from "../../../AuthContext";
// import "./UpdateProfile.css";
// import "./CompanyProfile.css";
// import "../../../public/styles/common.css";

// function UpdateProfile() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const companyUID = user?.UID || "123"; 
//   console.log("UpdateProfile - companyUID from auth:", companyUID);

//   const [companyProfile, setCompanyProfile] = useState({
//     companyName: "",
//     address: "",
//     contactNo: "",
//     uen: "",
//   });

//   const [originalProfile, setOriginalProfile] = useState({
//     companyName: "",
//     address: "",
//     contactNo: "",
//     uen: "",
//   });

//   useEffect(() => {
//     if (companyUID) {
//       CompanyProfileController.getCompanyProfile(companyUID)
//         .then((profile) => {
//           console.log("Fetched profile:", profile);

//           const newProfile = {
//             companyName: profile.bizName,
//             address: profile.address,
//             contactNo: profile.contactNo,
//             uen: profile.UEN,
//           };
//           setCompanyProfile(newProfile);
//           setOriginalProfile(newProfile);
//         })
//         .catch((err) => {
//           console.error("Error fetching company profile:", err);
//         });
//     } else {
//       console.error("No companyUID available from auth.");
//     }
//   }, [companyUID]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const updatePayload = {
//         newEmail: companyProfile.contactNo, 
//         originalEmail: originalProfile.contactNo,
//         originalBizName: originalProfile.companyName,
//         newBizName: companyProfile.companyName,
//         originalAddress: originalProfile.address,
//         newAddress: companyProfile.address,
//       };

//       const updatedProfile = await CompanyProfileController.updateCompanyProfile(updatePayload);
//       console.log("Profile updated:", updatedProfile);
//       navigate("/company-detail");
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   };

//   return (
//     <div className="App-content">
//       <div className="content">
//         <h1 className="logo">EmpRoster</h1>
//         <div className="main-contents">
//           <div className="company-profile">
//             <h1 className="company-profile_title">Edit Company Profile</h1>
//             <div className="company-profile_layout">
//               <div className="company-profile_card">
//                 <div className="company-profile_icon">
//                   <FaUserCircle size={80} />
//                 </div>
//                 <form className="company-profile_info" onSubmit={handleSubmit}>
//                   <p className="company-profile_label">Company Name</p>
//                   <input
//                     className="company-profile_inputfields"
//                     type="text"
//                     value={companyProfile.companyName}
//                     onChange={(e) =>
//                       setCompanyProfile({ ...companyProfile, companyName: e.target.value })
//                     }
//                   />

//                   <p className="company-profile_label">Address</p>
//                   <input
//                     className="company-profile_inputfields"
//                     type="text"
//                     value={companyProfile.address}
//                     onChange={(e) =>
//                       setCompanyProfile({ ...companyProfile, address: e.target.value })
//                     }
//                   />

//                   <p className="company-profile_label">Contact Number</p>
//                   <input
//                     className="company-profile_inputfields"
//                     type="text"
//                     value={companyProfile.contactNo}
//                     onChange={(e) =>
//                       setCompanyProfile({ ...companyProfile, contactNo: e.target.value })
//                     }
//                   />

//                   <p className="company-profile_label">UEN</p>
//                   <input className="company-profile_inputfields" type="text" value={companyProfile.uen} readOnly />

//                   <button type="submit" className="button_control">
//                     <div className="primary-button">Submit</div>
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UpdateProfile;
