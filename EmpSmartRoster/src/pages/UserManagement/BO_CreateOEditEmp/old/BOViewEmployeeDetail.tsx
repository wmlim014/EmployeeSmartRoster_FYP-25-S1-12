import { useState, useEffect } from "react";

import Nav from "../../components/NavBar/NavBar";
import EditButton from "../../components/PrimaryButton/PrimaryButton"; 
import SubmitButton from "../../components/SecondaryButton/SecondaryButton";
import { useAlert } from "../../components/PromptAlert/AlertContext"; 
import ViewEmployeeList from "../../controller/ViewEmployeeListController";
import { EditEmployee } from "../../controller/EditEmployeeDetailController";

import "./ViewEmployeeDetail.css";
import "../../../public/styles/common.css";
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

type SimpleEmployee = {
  roleID: number;
  skillSetID: number;
  user_id: number;
  fullName: string;
  email: string;
  hpNo: number;
  resStatusPassType: string;
  jobTitle: string;
  roles: string;
  standardWrkHrs: number | null;
  skillsets: string;
  noOfLeave: number | null;
  noOfLeaveAvailable: number | null;
  noOfMC: number | null;
  noOfMCAvailable: number | null;
  startWorkTime: string;
  endWorkTime: string;
  daysOfWork: number;
  activeOrInactive: number;
};

const ViewEmployeeDetail = () => {
  const [editMode, setEditMode] = useState(false);
  const [employee, setEmployee] = useState<Employee>({
    user_id: 4,
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

  const [employeeList, setEmployeeList] = useState<SimpleEmployee[]>([]);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const business_owner_id = user?.UID;

    const fetchEmployees = async () => {
      try {
        const data = await ViewEmployeeList(business_owner_id);
        setEmployeeList(data);

        if (data.length > 0) {
          const first = data[0];
          setEmployee({
            user_id: first.user_id,
            fullName: first.fullName,
            email: first.email,
            hpNo: first.hpNo.toString(),
            resStatusPassType: first.resStatusPassType,
            jobTitle: first.jobTitle,
            roleID: first.roleID.toString(),
            standardWrkHrs: first.standardWrkHrs?.toString() || "",
            skillSetID: first.skillSetID.toString(),
            noOfLeave: first.noOfLeave?.toString() || "",
            noOfLeaveAvailable: first.noOfLeaveAvailable?.toString() || "",
            noOfMC: first.noOfMC?.toString() || "",
            noOfMCAvailable: first.noOfMCAvailable?.toString() || "",
            startWorkTime: first.startWorkTime,
            endWorkTime: first.endWorkTime,
            daysOfWork: first.daysOfWork.toString(),
            activeOrInactive: first.activeOrInactive.toString(),
          });
        }
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (field: keyof Employee, value: string) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const matched = employeeList.find((emp) => emp.fullName === selectedName);
    if (matched) {
      setEmployee({
        user_id: matched.user_id,
        fullName: matched.fullName,
        email: matched.email,
        hpNo: matched.hpNo.toString(),
        resStatusPassType: matched.resStatusPassType,
        jobTitle: matched.jobTitle,
        roleID: matched.roleID.toString(),
        standardWrkHrs: matched.standardWrkHrs?.toString() || "",
        skillSetID: matched.skillSetID.toString(),
        noOfLeave: matched.noOfLeave?.toString() || "",
        noOfLeaveAvailable: matched.noOfLeaveAvailable?.toString() || "",
        noOfMC: matched.noOfMC?.toString() || "",
        noOfMCAvailable: matched.noOfMCAvailable?.toString() || "",
        startWorkTime: matched.startWorkTime,
        endWorkTime: matched.endWorkTime,
        daysOfWork: matched.daysOfWork.toString(),
        activeOrInactive: matched.activeOrInactive.toString(),
      });
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSubmitClick = async () => {
    const updatedEmployee = {
      business_owner_id: 2,
      user_id: employee.user_id,
      email: employee.email,
      hpNo: parseInt(employee.hpNo),
      resStatusPassType: employee.resStatusPassType,
      jobTitle: employee.jobTitle,
      roleID: parseInt(employee.roleID),
      standardWrkHrs: parseInt(employee.standardWrkHrs),
      skillSetID: parseInt(employee.skillSetID),
      noOfLeave: parseInt(employee.noOfLeave),
      noOfLeaveAvailable: parseInt(employee.noOfLeaveAvailable),
      noOfMC: parseInt(employee.noOfMC),
      noOfMCAvailable: parseInt(employee.noOfMCAvailable),
      startWorkTime: employee.startWorkTime,
      endWorkTime: employee.endWorkTime,
      daysOfWork: parseInt(employee.daysOfWork),
      activeOrInactive: parseInt(employee.activeOrInactive),
    };

    const result = await EditEmployee(updatedEmployee);

    if (result && result.message === "Employee updated successfully") {
      showAlert(
        `Employee details for ${employee.fullName} have been updated`,
        "The employee information has been successfully updated.",
        "Update Success",
        { type: "success" }
      );
      setEditMode(false);
    } else {
      showAlert(
        "Failed to update employee",
        "There was an error updating the employee details. Please try again.",
        "Update Failed",
        { type: "error" }
      );
    }
  };

  const headerMap: { [key in keyof Employee]?: string } = {
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

  return (
    <div>
      
      <div>
        <h2>Employee Detail</h2>
        <table className="employeeDetailTable">
          <tbody>
            {Object.entries(employee).map(([key, value]) => {
              if (key === "user_id") return null;
              const typedKey = key as keyof Employee;
              return (
                <tr key={typedKey}>
                  <th>{headerMap[typedKey] || typedKey}</th>
                  <td>
                    {typedKey === "fullName" ? (
                      editMode ? (
                        // Render as plain text in edit mode
                        <span>{value}</span>
                      ) : (
                        <select
                          value={value}
                          onChange={handleNameChange}
                          className="full-width"
                        >
                          {employeeList.map((emp) => (
                            <option key={emp.user_id} value={emp.fullName}>
                              {emp.fullName}
                            </option>
                          ))}
                        </select>
                      )
                    ) : editMode ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(typedKey, e.target.value)}
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
    </div>
  );
};

export default ViewEmployeeDetail;
