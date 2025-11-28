import { useEffect, useState } from 'react';
import { useAlert } from '../../../components/PromptAlert/AlertContext';
import { IS_ACC_SUSPENDED, PASS_TYPE } from '../../../controller/Variables';
import EmployeeMgntController from '../../../controller/BOEmpMgntProfile/EmployeeMgntController';
import BOUserList_t from './EmpTableList_t';
import BOUserList_m from './EmpTableList_m';

import '../UserMgts.css';
import "../../../../public/styles/common.css";

interface EMPListProps {
    empUsers: any;
    roles: any;
    skillsets: any;
}

const { handleFilterEmpAccStatus, 
        handleFilterRole, 
        handleFilterSkill,
        handleFilterPassType,
        handleFilterNricOName } = EmployeeMgntController

const EmpList = ({empUsers, roles, skillsets}: EMPListProps) => {
  // console.log(empUsers)
  const { showAlert } = useAlert();

  // Explicitly type state as an array of User objects.
  const [ allUsers, setAllUsers ] = useState<any>(empUsers);
  const [ skillsetForSelectedRole, setSkillsetForSelectedRole ] = useState<any>([]);
  const [ filteredUsers, setFilteredUsers ] = useState<any>([]);
  const [ filterAccStatus, setFilterAccStatus ] = useState<string>('Activated');
  const [ filterRole, setFilterRole ] = useState<any>("All");
  const [ filterSkill, setFilterSkill ] = useState<any>("All");
  const [ filterNameOnric, setFilterNameOnric ] = useState<string>("");
  const [ filterPassType, setFilterPassType ] = useState<any>(PASS_TYPE[0]);

  // Update filtering logic (this filters based on fullName).
  const triggerFilterUsers = () => {
    try {
      let filtered = handleFilterEmpAccStatus(allUsers, filterAccStatus);
      // console.log(filtered)

      if(filterRole !== 'All') {
        const skillsets = handleFindSkillToSelectedRole(filterRole)
        setSkillsetForSelectedRole(skillsets)
        filtered = handleFilterRole(filtered, Number(filterRole))

        if(filterSkill !== 'All') {
          filtered = handleFilterSkill(filtered, Number(filterSkill))
          // console.log("Filtered role", skillsets)
        }
        filtered = handleFilterPassType(filtered, filterPassType)
        filtered = handleFilterNricOName(filtered, filterNameOnric)

        // console.log("Filtered role", filtered)
      } else {
        // filtered = handleFilterEmpAccStatus(allUsers, filterAccStatus);
        // console.log(filterPassType)
        filtered = handleFilterPassType(filtered, filterPassType)
        filtered = handleFilterNricOName(filtered, filterNameOnric)
        setSkillsetForSelectedRole([]); // Clear skillsets if all roles selected
      }
      // console.log("Filtered User: ", filtered)
      setFilteredUsers(filtered);
    } catch (err) {
      setFilteredUsers([]);
      showAlert("Filtering Users", "Filter error", `${err}`, { type: 'error' });
    }
  };
  
  // Re-run the employee lists when employee data updated
  useEffect(() => {
    setAllUsers(empUsers);
    triggerFilterUsers();
  }, [empUsers]);

  // Auto trigger when role filter dropdown changes 
  // to update skillset contained in the selected role
  useEffect(() => {
      if (filterRole === 'All') {
          setSkillsetForSelectedRole([]);
      } else {
          const skillsets = handleFindSkillToSelectedRole(filterRole);
          // console.log(skillsets)
          setSkillsetForSelectedRole(skillsets);
      }
  }, [filterRole, skillsets]);
  
  // Re-run filtering when source data or filter values change.
  useEffect(() => {
    triggerFilterUsers();
  }, [
      allUsers, 
      filterAccStatus, 
      filterRole, 
      filterSkill, 
      filterPassType,
      filterNameOnric
    ]);

  function handleFindSkillToSelectedRole(value: string) {
      // console.log(value)
      const filteredSkillsets = skillsets.filter((skillset: any) => {
          return skillset.roleID === Number(value)
      })
      // console.log(filteredSkillsets)
      setSkillsetForSelectedRole(filteredSkillsets)
      return filteredSkillsets
  }

  // Callback to update a single user in state after an update (e.g., suspension).
  const handleUserUpdate = (updatedUser: any) => {
    // console.log(updatedUser)
    const updatedItem = allUsers.map((data:any) => 
      data.user_id === updatedUser.user_id
      ? updatedUser
      : data
    )
    setAllUsers(updatedItem);
  };

  return (
    <>
      <div className="App-filter-search-component">
          <div className="App-filter-container subscription-status">
              <p className='App-filter-title'>Role</p>
              {/* Role dropdown */}
              <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="All">ALL</option>
                {roles.map((role:any) => (
                  <option key={role.roleID} value={role.roleID}>
                    {role.roleName}
                  </option>
                ))}
              </select>
          </div>
          <div className="App-filter-container subscription-status">
              <p className='App-filter-title'>Skillset</p>
              {/* Skillset dropdown */}
              <select 
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  disabled = {skillsetForSelectedRole.length === 0}
              >
                {skillsetForSelectedRole.map((skill:any) => (
                  <option key={skill.skillSetID} value={skill.skillSetID}>
                    {skill.skillSetName}
                  </option>
                ))}
              </select>
          </div>
          <div className="App-filter-container subscription-status">
              <p className='App-filter-title'>Reg. Pass Type</p>
              {/* Pass Type dropdown */}
              <select 
                  value={filterPassType}
                  onChange={(e) => setFilterPassType(e.target.value)}
              >
                {PASS_TYPE.map((pass:any) => (
                  <option key={pass} value={pass}>
                    {pass}
                  </option>
                ))}
              </select>
          </div>
          <div className="App-filter-container uen-company-name">
              <p className='App-filter-title'>Pass ID/Employee Name</p>
              <input type='text' 
                  className='search-input'
                  placeholder='Search Pass ID/Name' 
                  onChange={(e) => setFilterNameOnric(e.target.value)}
              />
          </div>
          <div className="App-filter-container account-status">
              <p className='App-filter-title'>Account Status</p>
              {/* Account Status dropdown */}
              <select 
                  value={filterAccStatus}
                  onChange={(e) => setFilterAccStatus(e.target.value)}
              >
              {IS_ACC_SUSPENDED.map(accStatus => (
                  <option key={accStatus} value={accStatus}>
                      {accStatus}
                  </option>
              ))}
              </select>
          </div>
      </div>
      {(filteredUsers.length > 0 
        && roles.length > 0 
        && skillsets.length > 0) 
        ? (<>
          {/* Desktop Table */}
          <BOUserList_t 
            users={filteredUsers}
            roles={roles} 
            skillsets={skillsets}
            onEmpUpdate={handleUserUpdate} 
          />

          {/* Tablet and Mobile Table */}
          <BOUserList_m 
            users={filteredUsers} 
            roles={roles} 
            skillsets={skillsets}
            onEmpUpdate={handleUserUpdate} 
          />
        </>
      ):(<>No Data Matched with Filter</>)}
    </>
  );
};

export default EmpList;
