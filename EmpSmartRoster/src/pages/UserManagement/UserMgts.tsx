import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import { USER_ROLE } from '../../controller/Variables.js';
import EmpList from './BO_EmpMgt/EmpList'
import BOUserList from './SA_BOMgt/UserList'
import UserController from '../../controller/User/UserController'
import CompanyController from '../../controller/CompanyController'
import EmployeeMgntController from '../../controller/BOEmpMgntProfile/EmployeeMgntController.js'
import CreateOEditEmp from './BO_CreateOEditEmp/CreateOEdit'

import './UserMgts.css'
import "../../../public/styles/common.css"

// Import functions needed from UserController
const { getBOUsers } = UserController
const { getEmployeeList } = EmployeeMgntController
const { getCompanyRoles, getCompanySkillsets } = CompanyController

const UserMgts = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth();
    const [ bizOwners, setBizOwners ] = useState<any>([]);
    const [ employees, setEmployees ] = useState<any>([]);
    const [ roles, setRoles ] = useState<any>([]);
    const [ skills, setSkillsets ] = useState<any>([]);
    const [ activatedEmp, setActivatedEmp ] = useState<number>(0);

    const fetchBoUsersData = async () => {
        try{
            let data = await getBOUsers();
            data = data || [];
            // console.log(data)
            setBizOwners(Array.isArray(data) ? data : []);
        } catch(error) {
            showAlert(
                "fetchBoUsersData",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    const fetchEmpUsersData = async () => {
        try{
            let data = await getEmployeeList(user?.UID);
            data = data.employeeList || [];
            setEmployees(data);
            // console.log(data)
            if (data.length > 0){
                const empLength = data.filter((data: any) => {
                    return data.activeOrInactive === 1
                })
                // console.log(empLength.length)
                setActivatedEmp(empLength.length)
                // setActivatedEmp(5)
            }

            let roles = await getCompanyRoles(user?.UID);
            roles = roles.roleName || [];
            setRoles(roles)

            let skillsets = await getCompanySkillsets(user?.UID);
            skillsets = skillsets.skillSets || [];
            // console.log(skillsets)
            setSkillsets(skillsets)

        } catch(error) {
            showAlert(
                "fetchEmpUsersData",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    useEffect(() => {
        if(user?.role === USER_ROLE[0])
            fetchBoUsersData();

        else if(user?.role === USER_ROLE[1])
            fetchEmpUsersData();

        else return;
    }, [user?.role])

    function handleNewEmpAdd(newEmp: any) {
        const updated = [...employees, newEmp]
        setEmployees(updated);
    }

    return (
        <div className='App-content'>
            {/* Display side menu base on user role */}
            {user?.role === USER_ROLE[0] && (
            <>
              <div className="content">
                <h1>Business Owner Management</h1>
                {bizOwners.length === 0 ? (
                    <div>No User Registered...</div>
                ) : (
                    <BOUserList boUsers={bizOwners} />
                )}
              </div>
            </>
            )}

            {user?.role === USER_ROLE[1] && (
            <>
              <div className="content">
                <div className="bo-employee-list-page-title">
                    <h1>My Employee</h1>
                    <CreateOEditEmp 
                        isCreate={true}
                        onEmpAdd={handleNewEmpAdd}
                        empLength={activatedEmp}
                    />
                </div>
                {employees.length === 0 ? (
                    <div>No Employee Added...</div>
                ) : (
                    <EmpList 
                        empUsers={employees} 
                        roles={roles}
                        skillsets={skills}
                    />
                )}
              </div>
            </>
            )}
        </div>
    );
    
}

export default UserMgts