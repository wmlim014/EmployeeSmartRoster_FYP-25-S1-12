// EmployeeMgntController.js
async function getEmployeeList(business_owner_id) {
    const body = {
      business_owner_id: business_owner_id
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
          console.error(`Network error for UID ${uid}: \n`, error);
          throw new Error(`Failed to fetch employee data: ${error.message}`);
    }
}

function handleFilterEmpAccStatus(allEmployees, accStatus) {
  // console.log(allEmployees)
  const filteredData = allEmployees.filter((employee) => {
    const dataAccStatus = employee.activeOrInactive
    // If accStatus is 'Activated'
    if (accStatus === 'Activated'){
        const IS_ACTIVATE = 1  // The account is not suspended
        return dataAccStatus === IS_ACTIVATE  
    }
    else {
        const IS_ACTIVATE = 0  // The account is suspended
        return dataAccStatus === IS_ACTIVATE  
    }
  })
  return filteredData;
}

function handleFilterRole (employees, roleID) {
  // console.log(roleID)
  const filteredData = employees.filter((employee) => {
      const roleMacth = employee.roleID || '';
      return roleMacth === '' || roleMacth === roleID;
  })
  return filteredData;
}

function handleFilterSkill (employees, skillID) {
  // console.log(skillID)
  const filteredData = employees.filter((employee) => {
      const skillMatch = employee.skillSetID || '';
      return skillMatch === '' || skillMatch === skillID;
  })
  return filteredData;
}

function handleFilterPassType (employees, passType) {
  // console.log(passType)
  const filteredData = employees.filter((employee) => {
      const passMatch = employee.resStatusPassType || '';
      return passMatch === '' || passMatch === passType;
  })
  return filteredData;
}

function handleFilterNricOName (employees, filterString){
  const filteredData = employees.filter((employee) => {
      const search = filterString.trim().toLowerCase();
      if (!search) return true;

      const nricMatch = employee.nric.toLowerCase().includes(search);
      const nameMatch = employee.fullName.toLowerCase().includes(search);

      return nricMatch || nameMatch;
      // return nameMatch;
  })
  return filteredData
}

export default {
  getEmployeeList,
  handleFilterEmpAccStatus,
  handleFilterRole,
  handleFilterSkill,
  handleFilterPassType,
  handleFilterNricOName,
};
