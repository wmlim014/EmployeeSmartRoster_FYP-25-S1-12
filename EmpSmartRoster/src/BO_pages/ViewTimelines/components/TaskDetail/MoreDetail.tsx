import { useState, useEffect } from 'react';
import { useAuth } from '../../../../AuthContext.js';
import { useAlert } from '../../../../components/PromptAlert/AlertContext.js';

import CompanyController from '../../../../controller/CompanyController.js';
import TimelineController from '../../../../controller/TimelineController.js';

import { VscDebugBreakpointData, } from '../../../../../public/Icons.js'
import './EventDetail.css'
import './MoreInfor.css'
import '../../../../../public/styles/common.css'

interface MoreDetailProps {
    roleID: number;
    skillID: number;
}

const { getCompanyRoles, getCompanySkillsets } = CompanyController
const { getRoleNeededForTask, getSkillNeededForTask } = TimelineController

const MoreDetail = ({ roleID, skillID }: MoreDetailProps) => {
    // console.log(roleID, skillID)
    const { user } = useAuth();
    // console.log(user)
    const { showAlert } = useAlert();
    const [ roleNeeded, setRoleNeeded ] = useState<any>([]);
    const [ skillNeeded, setSkillNeeded ] = useState<any>([]);

    const fetchRoleNSkillNeeded = async () => {
        try {
            // Fetch all roles attached to this company
            let allRoles = await getCompanyRoles(user?.UID);
            allRoles = allRoles.roleName;
            // Get role needed
            const role = getRoleNeededForTask(allRoles, roleID);
            // console.log(role)
            setRoleNeeded(role)

            // Fetch all skillsets attached to this company
            let allSkills = await getCompanySkillsets(user?.UID);
            allSkills = allSkills.skillSets;
            // Get skill needed
            const skill = getSkillNeededForTask(allSkills, skillID);
            // console.log(skill)
            setSkillNeeded(skill)
        } catch (error) {
            showAlert(
                "fetchRoleNSkillNeeded",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    useEffect(() => {fetchRoleNSkillNeeded()}, [roleID, skillID])
    // useEffect(() => {console.log(roleNeeded[0], skillNeeded[0])}, [roleID, skillID])

    return (
        <div className='role-and-skill-needed-content'>
            {roleNeeded?.length === 1 && (
            <div className="role-needed">
                <p className="role-skill-title">Role Needed</p>
                <div className="role-needed-data">
                    <VscDebugBreakpointData className='App-popup-content-icon'/>
                    <p className='main-data'>{roleNeeded[0].roleName}</p>
                </div>
            </div>
            )}
            {skillNeeded?.length === 1 && (
            <div className="skill-needed">
                <p className="role-skill-title">Skill Needed</p>
                <div className="skill-needed-data">
                    <VscDebugBreakpointData className='App-popup-content-icon'/>
                    <p className='main-data'>{skillNeeded[0].skillSetName}</p>
                </div>
            </div>
            )}
        </div>
    )
}

export default MoreDetail;