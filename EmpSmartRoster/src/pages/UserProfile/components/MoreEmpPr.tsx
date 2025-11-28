import { useState, useEffect } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import CompanyController from '../../../controller/CompanyController.js'
import UserController from '../../../controller/User/UserController.js'
import BOEmployeeController from '../../../controller/BOEmployeeController'

import { TiTime } from '../../../../public/Icons.js'
import './styles.css'
import '../../../../public/styles/common.css'

interface EmpMoreUserProfileDetailProps {
    userData: any
}

const { getCompanyRoles, getCompanySkillsets } =  CompanyController
const { getRoleNameForEmp, getSkillNameForEmp } = BOEmployeeController

const EMP_MoreUserPrDetail = ({ userData }: EmpMoreUserProfileDetailProps) => {
    // console.log(userData)
    const { showAlert } = useAlert();
    const [ role, setRole ] = useState<any>([]);
    const [ skillset, setSkillset ] = useState<any>([]);
    const fetchAllocatedRoleNSkillset = async() => {
        try {
            let allRoles = await getCompanyRoles(Number(userData.business_owner_id));
            allRoles = allRoles.roleName || []
            // console.log(allRoles)
            if(allRoles.length > 0){
                const allocatedRole = getRoleNameForEmp(allRoles, userData.roleID);
                // console.log("Allocated Role: ", allocatedRole)
                setRole(allocatedRole[0])
            }
            

            let allSkillsets = await getCompanySkillsets(Number(userData.business_owner_id));
            allSkillsets = allSkillsets.skillSets || []
            // console.log(allSkillsets)
            if(allSkillsets.length > 0){
                const allocatedSkillsets = getSkillNameForEmp(allSkillsets, userData.skillSetID);
                // console.log("Allocated Skillset: ", allocatedSkillsets)
                setSkillset(allocatedSkillsets[0])
            }
            

        } catch (error) {
            showAlert(
                "fetchAllocatedRoleNSkillset",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    useEffect(() => {fetchAllocatedRoleNSkillset()}, [userData])

    return(
        <>
        {role && skillset && userData && (
            <>
            <h3>Job Detail</h3>
            <div className="user-profile-data job-title even-row">
                <p className="title">JOB TITLE</p>
                <p className="main-data">{userData.jobTitle}</p>
            </div>
            <div className="user-profile-data working-time">
                <div className="title user-profile-title-icon">
                    <TiTime />
                    <p className="title-with-icon">{userData.standardWrkHrs} hrs/day</p>
                </div>
                <p className="main-data">
                    {String(userData.startWorkTime).split(":")[0]}:{String(userData.startWorkTime).split(":")[1]}&nbsp;
                    to&nbsp;
                    {String(userData.endWorkTime).split(":")[0]}:{String(userData.endWorkTime).split(":")[1]}
                    <br />
                    {userData.daysOfWork} days per week
                </p>
            </div>
            <div className="user-profile-data role even-row">
                <p className="title">ROLE</p>
                <p className="main-data">{role.roleName}</p>
            </div>
            <div className="user-profile-data skillset">
                <p className="title">SKILLSET</p>
                <p className="main-data">{skillset.skillSetName}</p>
            </div>
            </>
        )}
        </>
    )
}

export default EMP_MoreUserPrDetail