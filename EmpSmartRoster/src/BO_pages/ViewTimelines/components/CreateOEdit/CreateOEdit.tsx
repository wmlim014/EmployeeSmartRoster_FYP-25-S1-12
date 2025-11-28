import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../../../components/PromptAlert/AlertContext";
import { useAuth } from "../../../../AuthContext";
import { generateSGDateTimeForDateTimeInput, formatDateArrToDisplayInDateTimeInput } from "../../../../controller/Variables";
import PrimaryButton from "../../../../components/PrimaryButton/PrimaryButton";
import CreateEditTask from "./TaskForm";
import CompanyController from "../../../../controller/CompanyController";
import BOEmployeeController from "../../../../controller/BOEmployeeController";

import { FaRegEdit } from '../../../../../public/Icons.js'
import "./CreateNEditTask.css"
import "../../../../../public/styles/common.css"

interface TaskProps {
    isCreate: boolean;
    allTasksAllocation?: any;
    selectedTaskTimeline?: any;
    onTaskUpdate?: (updateTask: any) => void;
}

const { getCompanyRoles, getCompanySkillsets, getSkillsetsForARole  } = CompanyController;
const { getRoleNameForEmp, getSkillNameForEmp } = BOEmployeeController;

const CreateOEditTask = ({
    isCreate, allTasksAllocation, selectedTaskTimeline, onTaskUpdate
} : TaskProps) => {
    // console.log(allTasksAllocation)
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [ allRoles, setAllRoles ] = useState<any>([]);
    const [ allSkillsets, setAllSkillsets ] = useState<any>([]);
    const location = useLocation();
    const isInTimeline = location.pathname.includes('timeline-tasks-list')
    
    const navState = location.state as {
        defaultValues?: any;
        defaultTimelineValues?: any;
        allRoles?: any;
        allSkillsets?: any;
    };
    const initialStartDate = new Date();
    const initialEndDate = new Date();
    initialEndDate.setDate(initialEndDate.getDate() + 14); // Add 14 days (2 weeks)
    const [ createTaskValues, setCreateTaskValues ] = useState({
        title: '',
        taskDescription: '',
        roleID: '',
        skillSetID: '',
        startDate: generateSGDateTimeForDateTimeInput(initialStartDate),
        endDate: generateSGDateTimeForDateTimeInput(initialEndDate),
        noOfEmp: 1
    });
    const [ createTimelineValues, setCreateTimelineValues ] = useState({
        timelineID: '',
        title: '',
        timeLineDescription: '',
    })

    const fetchRolesNSkillsets = async() => {
        try {
            // Fetch Roles
            let roles = await getCompanyRoles(user?.UID);
            roles = roles.roleName || []
            // console.log(roles)
            setAllRoles(roles)

            // Fetch Skillsets
            let skillsets = await getCompanySkillsets(user?.UID);
            skillsets = skillsets.skillSets || []
            // console.log(skillsets)
            setAllSkillsets(skillsets)
        } catch (error) {
            showAlert(
                "fetchRolesNSkillsets",
                "Fetch Roles or Skillsets error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    // Auto trigger when the user's UID changed
    useEffect(() => { fetchRolesNSkillsets() }, [user?.UID])

    useEffect(() => {
        if (allRoles.length > 0 && allSkillsets.length > 0) {
            const skillsetsForRole = getSkillsetsForARole(allRoles[0].roleID, allSkillsets)
            // console.log(skillsetsForRole)
            setCreateTaskValues((prev) => ({
                ...prev,
                roleID: allRoles[0].roleName,
                skillSetID: skillsetsForRole[0].skillSetName
            }));
        }
    }, [allRoles, allSkillsets]);

    function toggleShowTaskForm (){
        if(isCreate)
            navigate('/create-new-task', {
                state: {
                    defaultValues: createTaskValues,
                    defaultTimelineValues: createTimelineValues,
                    allRoles,
                    allSkillsets
                }
            })

        if(!isCreate) {
            // console.log(selectedTaskTimeline, allTasksAllocation)
            // Pre-processing for the task allocated to multiple employees
            const formattedTasksAllocation = allTasksAllocation.map((task: any) => {
                const role = getRoleNameForEmp(allRoles, task.rolesNeeded);
                const roleID = role[0].roleName
                const skillset = getSkillNameForEmp(allSkillsets, task.skillSetNeeded);
                const skillSetID = skillset[0].skillSetName
                const startDate = formatDateArrToDisplayInDateTimeInput(task.startDate);
                const endDate = formatDateArrToDisplayInDateTimeInput(task.endDate);

                return {
                    ...task,
                    roleID: roleID,
                    skillSetID: skillSetID,
                    startDate: startDate,
                    endDate: endDate,
                }
            })
            // console.log(formattedTasksAllocation)
            navigate('/edit-task', {
                state: {
                    defaultValues: formattedTasksAllocation[0],
                    defaultTimelineValues: selectedTaskTimeline,
                    allRoles,
                    allSkillsets
                }
            })
        }
    }

    // Direct Form Rendering when Creating or Editing
    if (!isInTimeline && navState && allRoles.length > 0 && allSkillsets.length > 0) {
        return (
            <CreateEditTask
                isCreate={isCreate}
                bo_UID={user?.UID}
                defaultTaskValues={navState.defaultValues || {}}
                defaultTimelineValues={navState.defaultTimelineValues || {}}
                allRoles={navState.allRoles || []}
                allSkillsets={navState.allSkillsets || []}
            />
        );
    }

    return (
        <>
        {allRoles.length > 0  && allSkillsets.length > 0 && (
            <>
            {isCreate ? (
                <PrimaryButton 
                    text='Create New Task'
                    onClick={() => toggleShowTaskForm()}
                />
            ):(
                <FaRegEdit
                    className="edit-task-icon icons"
                    onClick={() => toggleShowTaskForm()}
                />
            )}
            </>
        )}
        
        </>
    )
}

export default CreateOEditTask