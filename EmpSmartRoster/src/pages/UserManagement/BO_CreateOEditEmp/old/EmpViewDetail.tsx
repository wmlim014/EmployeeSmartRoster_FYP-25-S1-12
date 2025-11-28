import { useState, useEffect } from "react";
import "../../../public/styles/common.css";
import EditButton from "../../components/PrimaryButton/PrimaryButton";
import SubmitButton from "../../components/SecondaryButton/SecondaryButton";
import { useAlert } from "../../components/PromptAlert/AlertContext";
import EmpViewDetailController from "../../controller/EmpViewDetailController";
import { EditEmployee } from "../../controller/EmpEditDetailController";
import "./EmpViewDetail.css";
import { useAuth } from "../../AuthContext";

type Employee = {
  user_id: number;
  fullName: string;
  email: string;
  hpNo: string;
  resStatusPassType: string;
  jobTitle: string;
  roleID: string;
  standardWrkHrs: string;
  skillSetID: string;
  noOfLeave: string;
  noOfLeaveAvailable: string;
  noOfMC: string;
  noOfMCAvailable: string;
  startWorkTime: string;
  endWorkTime: string;
  daysOfWork: string;
  activeOrInactive: string;
};

const ViewEmployeeDetail = () => {
  const [editMode, setEditMode] = useState(false);
  const [employee, setEmployee] = useState<Employee>({
    user_id: 0,
    fullName: "",
    email: "",
    hpNo: "",
    resStatusPassType: "",
    jobTitle: "",
    roleID: "",
    standardWrkHrs: "",
    skillSetID: "",
    noOfLeave: "",
    noOfLeaveAvailable: "",
    noOfMC: "",
    noOfMCAvailable: "",
    startWorkTime: "",
    endWorkTime: "",
    daysOfWork: "",
    activeOrInactive: "",
  });

  const { showAlert } = useAlert();
  const { user } = useAuth();
  const employee_user_id = user?.UID;

  useEffect(() => {
    if (!employee_user_id) return;

    const fetchProfile = async () => {
      try {
        const data = await EmpViewDetailController(employee_user_id);
        if (data.length > 0) {
          const p = data[0];
          setEmployee({
            user_id: p.user_id,
            fullName: p.fullName,
            email: p.email,
            hpNo: p.hpNo.toString(),
            resStatusPassType: p.resStatusPassType,
            jobTitle: p.jobTitle,
            roleID: p.roleID.toString(),
            standardWrkHrs: p.standardWrkHrs?.toString() || "",
            skillSetID: p.skillSetID.toString(),
            noOfLeave: p.noOfLeave?.toString() || "",
            noOfLeaveAvailable: p.noOfLeaveAvailable?.toString() || "",
            noOfMC: p.noOfMC?.toString() || "",
            noOfMCAvailable: p.noOfMCAvailable?.toString() || "",
            startWorkTime: p.startWorkTime,
            endWorkTime: p.endWorkTime,
            daysOfWork: p.daysOfWork.toString(),
            activeOrInactive: p.activeOrInactive.toString(),
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [employee_user_id]);

  const handleChange = (field: keyof Employee, value: string) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => setEditMode(true);

  const handleSubmitClick = async () => {
    const updated = {
      business_owner_id: 2,
      employee_user_id: employee.user_id,
      // ← newly added:
      fullName: employee.fullName,
      email: employee.email,
      hpNo: parseInt(employee.hpNo),
    };

    const res = await EditEmployee(updated);
    if (res && res.message === "Employee updated successfully") {
      showAlert("Profile updated", "Your profile was updated successfully.", "Success", { type: "success" });
      setEditMode(false);
    } else {
      showAlert("Update failed", "Could not update your profile.", "Error", { type: "error" });
    }
  };

  const headerMap: { [k in keyof Employee]?: string } = {
    fullName: "Name",
    email: "Email",
    hpNo: "Phone Number",
    resStatusPassType: "Pass Type",
    jobTitle: "Job Title",
    roleID: "Role ID",
    standardWrkHrs: "Standard Working Hours",
    skillSetID: "Skill Set ID",
    noOfLeave: "Total Leave",
    noOfLeaveAvailable: "Available Leave",
    noOfMC: "Total MC",
    noOfMCAvailable: "Available MC",
    startWorkTime: "Start Work Time",
    endWorkTime: "End Work Time",
    daysOfWork: "Days of Work",
    activeOrInactive: "Status",
  };

  const editableKeys = new Set<keyof Employee>(["fullName", "hpNo", "email"]);

  return (
    <div>
      <h2>My Profile</h2>
      <table className="employeeDetailTable">
        <tbody>
          {Object.entries(employee).map(([key, value]) => {
            if (key === "user_id") return null;
            const k = key as keyof Employee;
            const label = headerMap[k] || key;
            const isEditable = editMode && editableKeys.has(k);

            return (
              <tr key={key}>
                <th>{label}</th>
                <td>
                  {isEditable ? (
                    <input
                      type={k === "email" ? "email" : "text"}
                      value={value}
                      onChange={(e) => handleChange(k, e.target.value)}
                    />
                  ) : (
                    value
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="buttonRow">
        {!editMode ? (
          <EditButton onClick={handleEditClick} text="Edit" />
        ) : (
          <SubmitButton onClick={handleSubmitClick} text="Confirm" />
        )}
      </div>
    </div>
  );
};

export default ViewEmployeeDetail;
