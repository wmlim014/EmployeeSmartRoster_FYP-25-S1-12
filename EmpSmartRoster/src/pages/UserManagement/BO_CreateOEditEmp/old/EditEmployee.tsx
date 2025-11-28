import { useState } from "react";
import SubmitButton from "../../components/PrimaryButton/PrimaryButton";
import { IoClose } from "react-icons/io5"; 
import { useAlert } from "../../components/PromptAlert/AlertContext"; 
import "./CreateEmployee.css"
import "../../../public/styles/common.css";

const EditEmployee = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Initialize employeeData state (you may fetch this data from an API or prop)
    const [employeeData, setEmployeeData] = useState({
        name: "",
        profilePhoto: "",
        skillset: "",
        email: "",
        role: "",
        workingHours: "",
        status: "Subscribed",
    });

    // showAlert function from WenMi's useAlert component
    const { showAlert } = useAlert();

    // Handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission (Update the employee data instead of creating a new one)
    const handleSubmit = () => {
        console.log("Updated Employee Data:", employeeData);
        // Trigger the alert after form submission
        showAlert(
            `Employee Account Updated for ${employeeData.name}`, // Title
            "The employee account has been updated successfully.", // Message
            "Account Updated", // Alert type
            { type: "success" } // Type of alert (success)
        );
        setIsPopupOpen(false);
    };

    const buttonText = "Update"; // Change button text for editing

    return (
        <div>
            <SubmitButton onClick={() => setIsPopupOpen(true)} text="Edit Employee Details" /> {/* Update the button text here */}

            {/* Popup Section */}
            {isPopupOpen && (
                <div className="App-popup" onClick={() => setIsPopupOpen(false)}>
                    <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>

                        <div className='App-header'>
                            <h1>Edit Account</h1> {/* Change the header to 'Edit Account' */}
                            <button className='icons' onClick={() => setIsPopupOpen(false)}>
                                <IoClose />
                            </button>
                        </div>

                        <table className="createEmployeeTable">
                            <tbody>
                                {/* First row: Name, Email, and Working Hours */}
                                <tr>
                                    <td>
                                        <div className="form-field">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Employee Name"
                                                value={employeeData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-field">
                                            <label>Email</label>
                                            <input
                                                type="text"
                                                name="email"
                                                placeholder="Email"
                                                value={employeeData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-field">
                                            <label>Working Hours</label>
                                            <input
                                                type="text"
                                                name="workingHours"
                                                placeholder="Working Hours"
                                                value={employeeData.workingHours}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </td>
                                </tr>

                                {/* Second row: Skillset, Role, and Status */}
                                <tr>
                                    <td>
                                        <div className="form-field">
                                            <label>Skillset</label>
                                            <select name="skillset" value={employeeData.skillset} onChange={handleInputChange}>
                                                <option value="">Select a skillset</option>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Fullstack">Fullstack</option>
                                                <option value="DevOps">DevOps</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-field">
                                            <label>Role</label>
                                            <select name="role" value={employeeData.role} onChange={handleInputChange}>
                                                <option value="">Select a role</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Employee">Employee</option>
                                                <option value="Intern">Intern</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-field">
                                            <label>Status</label>
                                            <select name="status" value={employeeData.status} onChange={handleInputChange}>
                                                <option value="Subscribed">Subscribed</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>

                                {/* Submit button */}
                                <tr>
                                    <td colSpan={3}>
                                        <div className="buttonContainer">
                                            <SubmitButton onClick={handleSubmit} text={buttonText} /> {/* Change button text */}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditEmployee;
