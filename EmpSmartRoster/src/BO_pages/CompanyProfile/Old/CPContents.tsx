// import React, { useState, useEffect } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import CompanyProfileController from "../../controller/BOEmpMgntProfile/CompanyProfileController";
// import CompanyController from "../../controller/CompanyController";
// import { useAuth } from "../../AuthContext"; // Import the AuthContext hook
// import "./CPContents.css";

// // Define interfaces for type safety
// interface CompanyProfile {
//   companyName: string;
//   address: string;
//   contactNo: string;
//   uen: string;
// }

// interface Role {
//   uen: string;
//   role: string;
// }

// interface Skillset {
//   uen: string;
//   skill: string;
// }

// function CPContents() {
//   const navigate = useNavigate();
//   const { user } = useAuth(); // Get the logged-in user

//   const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
//     companyName: "",
//     address: "",
//     contactNo: "",
//     uen: "",
//   });

//   const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
//   const [isSkillsetModalOpen, setIsSkillsetModalOpen] = useState(false);

//   const [roles, setRoles] = useState<Role[]>([]);
//   const [skillsets, setSkillsets] = useState<Skillset[]>([]);
//   const [newRole, setNewRole] = useState("");
//   const [newSkillset, setNewSkillset] = useState("");

//   // Fetch companyProfile directly from the database using CompanyProfileController.
//   // Company UID is taken from the auth context (user.UID).
//   useEffect(() => {
//     if (user && user.UID) {
//       CompanyProfileController.getCompanyProfile(user.UID)
//         .then((profile) => {
//           // Expected fetched JSON: { UID, bizName, UEN, address, contactNo }
//           const newProfile: CompanyProfile = {
//             companyName: profile.bizName,
//             address: profile.address,
//             contactNo: profile.contactNo,
//             uen: profile.UEN,
//           };
//           setCompanyProfile(newProfile);
//         })
//         .catch((err) => {
//           console.error("Error fetching company profile:", err);
//         });
//     } else {
//       console.error("User is not logged in or UID is missing");
//     }
//   }, [user]);

//   // Load roles when the Role modal opens.
//   useEffect(() => {
//     console.log("Role modal effect triggered.");
//     console.log("isRoleModalOpen:", isRoleModalOpen);
//     console.log(
//       "companyProfile.uen:",
//       companyProfile.uen ? JSON.stringify(companyProfile.uen) : "undefined",
//       "length:",
//       companyProfile.uen ? companyProfile.uen.length : "N/A"
//     );
//     if (isRoleModalOpen && companyProfile.uen) {
//       const allRoles: Role[] = CompanyController.GetCompanyRoles();
//       console.log("All roles from controller:", allRoles);
//       allRoles.forEach((item: Role, index: number) => {
//         console.log(
//           `Role ${index} uen:`,
//           item.uen ? JSON.stringify(item.uen) : "undefined",
//           "length:",
//           item.uen ? item.uen.length : "N/A"
//         );
//       });
//       const filteredRoles = allRoles.filter((item: Role) =>
//         item.uen === companyProfile.uen &&
//         item.uen.trim() === companyProfile.uen.trim()
//       );
//       console.log("Filtered roles:", filteredRoles);
//       setRoles(filteredRoles);
//     }
//   }, [isRoleModalOpen, companyProfile.uen]);

//   // Load skillsets when the Skillset modal opens.
//   useEffect(() => {
//     if (isSkillsetModalOpen && companyProfile.uen) {
//       const allSkillsets: Skillset[] = CompanyController.GetCompanySkillsets();
//       const filteredSkillsets = allSkillsets.filter((item: Skillset) =>
//         item.uen === companyProfile.uen
//       );
//       setSkillsets(filteredSkillsets);
//     }
//   }, [isSkillsetModalOpen, companyProfile.uen]);

//   // Handlers for Role Modal
//   const handleAddRole = () => {
//     if (newRole.trim()) {
//       const roleObj: Role = { uen: companyProfile.uen, role: newRole.trim() };
//       setRoles([...roles, roleObj]);
//       setNewRole("");
//     }
//   };

//   const handleRemoveRole = (index: number) => {
//     setRoles(roles.filter((_, i: number) => i !== index));
//   };

//   // Handlers for Skillset Modal
//   const handleAddSkillset = () => {
//     if (newSkillset.trim()) {
//       const skillObj: Skillset = { uen: companyProfile.uen, skill: newSkillset.trim() };
//       setSkillsets([...skillsets, skillObj]);
//       setNewSkillset("");
//     }
//   };

//   const handleRemoveSkillset = (index: number) => {
//     setSkillsets(skillsets.filter((_, i: number) => i !== index));
//   };

//   return (
//     <div className="company-profile">
//       <h1 className="company-profile__title">View Company Profile</h1>
//       <div className="company-profile__layout">
//         <div className="company-profile__card">
//           <div className="company-profile__icon">
//             <FaUserCircle size={80} />
//           </div>
//           <div className="company-profile__info">
//             <p className="company-profile__label">Company Name</p>
//             <p>{companyProfile.companyName}</p>
//             <p className="company-profile__label">Address</p>
//             <p>{companyProfile.address}</p>
//             <p className="company-profile__label">Contact Number</p>
//             <p>{companyProfile.contactNo}</p>
//           </div>
//           <div className="button_update">
//             <div
//               className="primary-button"
//               onClick={() =>
//                 navigate("/update-company-detail", {
//                   state: { companyUID: companyProfile.uen || "2" },
//                 })
//               }
//             >
//               Update Company Profile
//             </div>
//           </div>
//         </div>
//         <div className="company-profile__side-buttons">
//           <div
//             className="primary-button"
//             onClick={() => {
//               console.log("Role button clicked, setting isRoleModalOpen to true");
//               setIsRoleModalOpen(true);
//             }}
//           >
//             View Role List
//           </div>
//           <div
//             className="primary-button"
//             onClick={() => {
//               console.log("Skillset button clicked, setting isSkillsetModalOpen to true");
//               setIsSkillsetModalOpen(true);
//             }}
//           >
//             View Skillset List
//           </div>
//         </div>
//       </div>

//       {/* Role List Modal */}
//       {isRoleModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={() => setIsRoleModalOpen(false)}>
//               &times;
//             </span>
//             <h2 className="skillsetrole-title">Role List</h2>
//             <ul>
//               {roles.map((item: Role, index: number) => (
//                 <li key={index} className="skillrole-list-item">
//                   {item.role}
//                   <div className="secondary-button">
//                     <button onClick={() => handleRemoveRole(index)}>Remove</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <div className="skillsetrole-input-container">
//               <input
//                 type="text"
//                 placeholder="New Role"
//                 value={newRole}
//                 onChange={(e) => setNewRole(e.target.value)}
//               />
//               <div className="secondary-button">
//                 <button onClick={handleAddRole}>Create Role</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Skillset List Modal */}
//       {isSkillsetModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={() => setIsSkillsetModalOpen(false)}>
//               &times;
//             </span>
//             <h2 className="skillsetrole-title">Skillset List</h2>
//             <ul>
//               {skillsets.map((item: Skillset, index: number) => (
//                 <li key={index} className="skillrole-list-item">
//                   {item.skill}
//                   <div className="secondary-button">
//                     <button onClick={() => handleRemoveSkillset(index)}>Remove</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <div className="skillsetrole-input-container">
//               <input
//                 type="text"
//                 placeholder="New Skillset"
//                 value={newSkillset}
//                 onChange={(e) => setNewSkillset(e.target.value)}
//               />
//               <div className="secondary-button">
//                 <button onClick={handleAddSkillset}>Create Skillset</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CPContents;
