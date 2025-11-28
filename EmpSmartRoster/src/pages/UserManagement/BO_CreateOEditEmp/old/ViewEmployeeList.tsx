import { useEffect, useState } from "react";
import "../../../../public/styles/common.css";
import "./ViewEmployeeList.css";

const ViewProfile = () => {
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const business_owner_id = 4; // Replace with dynamic value if needed

  // useEffect(() => {
  //   const getEmployees = async () => {
  //     const data = await fetchEmployeeList(business_owner_id);
      
  //     setEmployeeList(data);
  //   };
  

  //   getEmployees();
  // }, []);

  useEffect(() => {
    const dummyEmployees = [
      {
        email: "employee1@example.com",
        hpNo: 90001111,
        resStatusPassType: "S Pass",
        jobTitle: "Software Engineer",
        roles: "Frontend Developer",
        skillsets: "React, TypeScript",
        standardWrkHrs: 8,
        startWorkTime: "09:00:00",
        endWorkTime: "18:00:00",
        daysOfWork: 5,
        noOfLeave: 14,
        noOfLeaveAvailable: 10,
        noOfMC: 7,
        noOfMCAvailable: 6,
        activeOrInactive: 1,
      },
      {
        email: "employee2@example.com",
        hpNo: 90002222,
        resStatusPassType: "Work Permit",
        jobTitle: "Backend Engineer",
        roles: "Developer",
        skillsets: "Node.js, PostgreSQL",
        standardWrkHrs: 8,
        startWorkTime: "10:00:00",
        endWorkTime: "19:00:00",
        daysOfWork: 6,
        noOfLeave: 10,
        noOfLeaveAvailable: 8,
        noOfMC: 5,
        noOfMCAvailable: 3,
        activeOrInactive: 1,
      },
      {
        email: "employee3@example.com",
        hpNo: 90003333,
        resStatusPassType: "EP",
        jobTitle: "Product Manager",
        roles: "Manager",
        skillsets: "Agile, Scrum, UX",
        standardWrkHrs: 9,
        startWorkTime: "08:30:00",
        endWorkTime: "17:30:00",
        daysOfWork: 5,
        noOfLeave: 12,
        noOfLeaveAvailable: 12,
        noOfMC: 6,
        noOfMCAvailable: 6,
        activeOrInactive: 1,
      },
      {
        email: "employee4@example.com",
        hpNo: 90004444,
        resStatusPassType: "Work Permit",
        jobTitle: "HR Executive",
        roles: "Support Staff",
        skillsets: "Recruitment, Payroll",
        standardWrkHrs: 7,
        startWorkTime: "09:30:00",
        endWorkTime: "17:00:00",
        daysOfWork: 5,
        noOfLeave: 10,
        noOfLeaveAvailable: 7,
        noOfMC: 4,
        noOfMCAvailable: 2,
        activeOrInactive: 0,
      },
    ];
  
    setEmployeeList(dummyEmployees);
  }, []);
  

  return (
    <div className="viewProfileContainer">
      <Nav />
      <SideMenu />
      <div className="viewProfileContent">
        <h2>Employee List</h2>
        <table className="employeeTable">
          <thead>
            <tr>
              <th>Email</th>
              <th>HP No</th>
              <th>Pass Type</th>
              <th>Job Title</th>
              <th>Role</th>
              <th>Skillsets</th>
              <th>Working Hours</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Days of Work</th>
              <th>Leave (Avail/Total)</th>
              <th>MC (Avail/Total)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((emp, index) => (
              <tr key={index}>
                <td>{emp.email}</td>
                <td>{emp.hpNo}</td>
                <td>{emp.resStatusPassType}</td>
                <td>{emp.jobTitle}</td>
                <td>{emp.roles}</td>
                <td>{emp.skillsets}</td>
                <td>{emp.standardWrkHrs} hrs</td>
                <td>{emp.startWorkTime}</td>
                <td>{emp.endWorkTime}</td>
                <td>{emp.daysOfWork} days</td>
                <td>{emp.noOfLeaveAvailable}/{emp.noOfLeave}</td>
                <td>{emp.noOfMCAvailable}/{emp.noOfMC}</td>
                <td>{emp.activeOrInactive === 1 ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProfile;
