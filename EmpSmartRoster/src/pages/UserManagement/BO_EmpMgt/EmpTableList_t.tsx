import { useState } from 'react';
import { useAlert } from '../../../components/PromptAlert/AlertContext';
import { formatPhoneNumber } from '../../../controller/Variables.js'
import Header from '../../../components/table/Header';
import Cell from '../../../components/table/Cell';
import { BiSolidUserDetail } from '../../../../public/Icons.js';
import UserDetail from './UserDetail';

import './EmpTableList_t.css';
import '../../../../public/styles/common.css';

// Define an interface for Employee.
export interface Employee {
    activeOrInactive: number;
    dateJoined: string;            // e.g. "2025-03-28T20:05:28.000Z"
    daysOfWork: number;
    email: string;
    endWorkTime: string;
    fullName: string;
    hpNo: number | string;
    jobTitle: string;
    noOfLeave: number;
    noOfLeaveAvailable: number;
    noOfMC: number;
    noOfMCAvailable: number;
    resStatusPassType: string;
    roleID: number;               
    skillSet: string;             
    standardWrkHrs: number | string; 
    startWorkTime: string;
    user_id: number;
  
    // Controller for filtering/identification:
    role: string; // e.g. "Employee"
}

interface BOListTableProps {
  users: any;
  roles: any;
  skillsets: any;
  onEmpUpdate?: (updatedData: any) => void

}

const EMPUserList_t = ({ users, roles, skillsets, onEmpUpdate }: BOListTableProps) => {
  const { showAlert } = useAlert();
  const [selectedEmployee, setSelectedEmployee] = useState<any>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [error, setError] = useState("");

  const handleDetailClick = (employee: Employee) => {
    try {
      setSelectedEmployee(employee);
      setShowDetail(true);
    } catch (err) {
      setError(`${err}`);
      setSelectedEmployee(null);
      setShowDetail(false);
    }
    if (error) {
      showAlert("handleDetailClick in BOUserList_t", '', error, { type: 'error' });
    }
  };

  const triggerCloseDetail = () => {
    setSelectedEmployee(null);
    setShowDetail(false);
  };
  
  function returnRoleName (roleID:number) {
    const role = roles.filter((role:any) => {
      return role.roleID === roleID
    })
    // console.log(role[0])
    return role[0].roleName
  }

  function returnSkillName (skillID:number) {
    const skill = skillsets.filter((skill:any) => {
      return skill.skillSetID === skillID
    })
    // console.log(skill[0])
    return skill[0].skillSetName
  }

  if (users.length === 0)
    return (
      <div className="App-desktop-responsive-table">
        <b>No Data Loaded...</b>
      </div>
    );

  return (
    <>
      <div className="App-desktop-responsive-table">
        <div className="App-desktop-table-row desktop-table-header">
          <Header className="header-employee-name" text="NAME" />
          <Header className="header-employee-email" text="EMAIL" />
          <Header className="header-employee-phone" text="PHONE" />
          <Header className="header-employee-role" text="ROLE" />
          <Header className="header-employee-skill" text="SKILL" />
          <Header className="App-header-icon-gap" text="" />
        </div>
        {users.map((employee:any) => (
          <div className="App-desktop-table-row table-body" key={employee.email}>
            <Cell className="body-employee-name" text={employee.fullName} />
            <Cell className="body-employee-email" text={employee.email} />
            <Cell className="body-employee-phone" text={formatPhoneNumber(String(employee.hpNo))} />
            <Cell className="body-employee-role" text={returnRoleName(employee.roleID)} />
            <Cell
              className="body-employee-skill"
              text={returnSkillName(employee.skillSetID)}
            />
            <div
              className="App-desktop-table-icon"
              onClick={() => handleDetailClick(employee)}
            >
              <BiSolidUserDetail />
            </div>
          </div>
        ))}
      </div>

      {showDetail && selectedEmployee && (
        <div className="App-popup" onClick={triggerCloseDetail}>
          <UserDetail
            user={selectedEmployee}
            role={returnRoleName(selectedEmployee.roleID)}
            skillset={returnSkillName(selectedEmployee.skillSetID)}
            onClose={triggerCloseDetail}
            onEmpUpdate={onEmpUpdate}
          />
        </div>
      )}
    </>
  );
};

export default EMPUserList_t;
