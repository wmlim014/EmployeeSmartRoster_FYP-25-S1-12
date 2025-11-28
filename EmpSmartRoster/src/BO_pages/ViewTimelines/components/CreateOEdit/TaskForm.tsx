import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../../../components/PromptAlert/AlertContext";
import { formatDisplayDateTime, formatTextForDisplay, generateSGDateTimeForDateTimeInput } from "../../../../controller/Variables";
import TimelineForm from "./TimelineForm";
import PrimaryButton from "../../../../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../../components/SecondaryButton/SecondaryButton";
import CompanyController from "../../../../controller/CompanyController";
import BOEmployeeController from "../../../../controller/BOEmployeeController";
import TimelineController from "../../../../controller/TimelineController";

import { IoArrowBack, FaPlusCircle, FaMinusCircle,
         FaChevronCircleDown, FaChevronCircleUp,
         FaChevronCircleLeft, FaChevronCircleRight,
         GoAlertFill } from '../../../../../public/Icons.js'
import "./CreateNEditTask.css"
import "../../../../../public/styles/common.css"

interface CreateOEditTaskProps {
    isCreate: boolean;
    bo_UID: any;
    defaultTaskValues: any;
    defaultTimelineValues?: any;
    allRoles: any;
    allSkillsets: any;
}

const { getRoleIdForEmp, getSkillIdForEmp } = BOEmployeeController;
const { createTask, handleTaskAutoAllocation, handleManualUpdateTaskAllocation,
        editTask, getAvailableEmployees } = TimelineController;
const { getSkillsetsForARole } = CompanyController

const CreateEditTask = ({ 
    isCreate, bo_UID, defaultTaskValues, defaultTimelineValues,
    allRoles, allSkillsets
} : CreateOEditTaskProps) => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const isMobile = window.innerWidth <= 768;
    const duplicateTaskError = 'Task title contain in a timeline must be unique or not space after.'
    const duplicateRoleSkillError = 'Same role and skillset are assigned to multiple tasks.'
    const [ currentTask, setCurrentTask ] = useState(0);
    const [ error, setError ] = useState<string>('');
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ isHavingTimeline, setIsHavingTimeline ] = useState(false);
    const [ isTaskAssigned, setIsTaskAssigned ] = useState(false);
    const [ originalTasks, setOriginalTasks ] = useState<any>([])
    const [ tasksNAllocationValues, setTasksNAllocationValues ] = useState<any>([]);
    const [ tasksValues, setTasksValues ] = useState([
        {
            taskID: new Date (), // temporary id (update when task created)
            title: '',
            taskDescription: '',
            roleID: '',
            skillSetID: '',
            startDate: '',
            endDate: '',
            noOfEmp: '',
            isExpended: true,
            availableEmp: 0,
            skillsetForSelect: [],
        }
    ]);
    const [ timelineValues, setTimelineValues ] = useState({
        timeLineID: '',
        title: '',
        timeLineDescription: '',
    })
    // Initialize default values
    useEffect(() => {
        if(allRoles.length > 0 && allSkillsets.length > 0) {
            // console.log(location.state.defaultTaskValues)
            const role = getRoleIdForEmp(allRoles, defaultTaskValues.roleID)
            const skillsetsForRole = getSkillsetsForARole(role[0].roleID, allSkillsets)
            // console.log(role)
            // Find number of available employee for default value
            findNoOfEmpAvailable(0, role[0].roleID, skillsetsForRole[0].skillSetID)
            // Set default task value and skiset for select with default value
            let values = [{
                ...defaultTaskValues,
                isExpended: true,
                skillsetForSelect: skillsetsForRole,
                availableEmp: tasksValues[0].availableEmp
            }]
            setTasksValues(values)
            // Set default timeline value
            setTimelineValues(defaultTimelineValues)
            // console.log(defaultTimelineValues)
            
            // If is edit task
            if(!isCreate){
                // console.log(defaultTimelineValues)
                setOriginalTasks(values) // Store original value
                if(defaultTimelineValues)
                    setIsHavingTimeline(true)
            }
        }
    }, [defaultTaskValues, defaultTimelineValues, allRoles, allSkillsets])
    // useEffect(() => {console.log(timelineValues)}, [defaultTimelineValues])

    // Handle add more task
    const handleAddMoreTask = () => {
        // console.log(defaultTaskValues)
        const role = getRoleIdForEmp(allRoles, defaultTaskValues.roleID)
        const skillsetsForRole = getSkillsetsForARole(role[0].roleID, allSkillsets)
        
        setTasksValues([...tasksValues, {
            ...defaultTaskValues,
            isExpended: true,
            skillsetForSelect: skillsetsForRole
        }]);
        validateInput('skillSetID', skillsetsForRole[0].skillSetName)
    }
    // Handle remove more task
    const handleRemoveTask = (index: number) => {
        const updatedTasks = tasksValues.filter((_, i) => i !== index)
        setTasksValues(updatedTasks)
        // Check if duplicate task with same title after remove the task
        const titles = updatedTasks.map((task) => task.title.toUpperCase().trim());
        const isTaskDuplicated = titles.some((title, index) => 
            titles.indexOf(title) !== index
        )
        if(isTaskDuplicated)
            setError(duplicateTaskError)
        else
            setError('')

        const skillsets = updatedTasks.map((task) => task.skillSetID);
        const isSkillsetsDuplicated = skillsets.some((skillset, index) => 
            skillsets.indexOf(skillset) !== index
        )
        if(isSkillsetsDuplicated)
            setError(duplicateRoleSkillError)
        else
            setError('')
    }

    const handleInputChange = (
        index: number,
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = event.target;
        // If current input changes is role or skillset
        if(name === 'roleID' || name === 'skillSetID') {
            if (name === 'roleID') {
                const role = getRoleIdForEmp(allRoles, value)
                const skillsetsForRole = getSkillsetsForARole(role[0].roleID, allSkillsets)
                tasksValues[index].skillsetForSelect = skillsetsForRole
                // Update the number of available employee base on 
                // selected role and default skillset
                findNoOfEmpAvailable(index, role[0].roleID, skillsetsForRole[0].skillSetID)
                tasksValues[index].skillSetID = skillsetsForRole[0].skillSetName
            }
            if(name === 'skillSetID') {
                const skillset = getSkillIdForEmp(allSkillsets, value)
                const role = getRoleIdForEmp(allRoles, tasksValues[index].roleID)
                // Update the number of available employee base on selected role and skillset
                findNoOfEmpAvailable(index, role[0].roleID, skillset[0].skillSetID)
            }
        }
        validateInput(name, value)
        setTasksValues((prevData) => 
            prevData.map((task, i) => 
                i === index 
                ? { ...task, [name]: value } 
                : task
        ));
    };
    // Get the number of available employee
    const findNoOfEmpAvailable = async(index: number, roleID: number, skillSetID: number) => {
        try{
            let availableEmp = await getAvailableEmployees(roleID, skillSetID, bo_UID)
            availableEmp = availableEmp.availableEmployees || []
            availableEmp = availableEmp.length
            // Update number of available employee
            // If is in edit
            if(!isCreate) {
                setTasksValues((prevData) => 
                    prevData.map((task, i) => 
                        i === index 
                        ? { ...task, 
                            availableEmp: availableEmp,
                        } 
                        : task
                ));
            } else {
                setTasksValues((prevData) => 
                    prevData.map((task, i) => 
                        i === index 
                        ? { ...task, 
                            availableEmp: availableEmp,
                            noOfEmp: availableEmp
                        } 
                        : task
                ));
            }
            
            return availableEmp
        } catch(error) {
            showAlert(
                "findNoOfEmpAvailable",
                `Failed to Get No.Of Employee available for ${tasksValues[index].title}`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        if(tasksValues.length > 1) {
            const index = tasksValues.length - 1
            const role = getRoleIdForEmp(allRoles, tasksValues[index].roleID)
            const skillset = getSkillIdForEmp(allSkillsets, tasksValues[index].skillSetID)
            findNoOfEmpAvailable(index, role[0].roleID, skillset[0].skillSetID)
        }
    }, [tasksValues.length])

    // Validate user input for the tasks
    const validateInput = (name: string, value: string) => {
        let isSameCreated = false
        if(name === 'title') {
            isSameCreated = tasksValues.some((task: any) => 
                task.title.toUpperCase().trim() === value.toUpperCase().trim()
            )
            if(isSameCreated)
                setError(duplicateTaskError)
            else
                setError('')
        } 
        else if (name === 'skillSetID') {
            // console.log(tasksValues)
            isSameCreated = tasksValues.some((task: any) => 
                task.skillSetID === value
            )
            if(isSameCreated)
                setError(duplicateRoleSkillError)
            else 
                setError('')
        } else {
            if(error === '')
                setError('') // Clear error for other fields
        }
    }

    // Check if create/edit form all filled
    const isTaskIncomplete = () => {
        // Validate all tasks in tasksValues array
        return tasksValues.some((task) => {
            const requiredFields: (keyof typeof task)[] = [
                'title',
                'taskDescription',
                'roleID',
                'skillSetID',
                'startDate',
                'endDate',
                'noOfEmp'
            ];

            // Check if any required field is empty
            const hasEmptyField = requiredFields.some(
                (field) => !task[field] || task[field].toString().trim() === ""
            );
            // Additional validation for start and end date
            const isDateInvalid = new Date(task.startDate) >= new Date(task.endDate);
            // Ensure number of employees is a positive integer
            const isNoOfEmpInvalid = Number(task.noOfEmp) < 1;
            return hasEmptyField || isDateInvalid || isNoOfEmpInvalid;
        });
    };

    // Prompt user confirmation for update
    function toggleConfirmation () {
        setShowConfirmation(!showConfirmation)
    }

    // Expend / Collpose Task
    function toggleExpendTask (index: number) {
        setTasksValues((prevData) => 
            prevData.map((task, i) => 
                i === index 
                ? { ...task, isExpended: !task.isExpended } 
                : task
        ));
    }

    // Toggle go next page in multi-tasks comfirmation popup
    function goToNextTask() {
        if (currentTask < tasksValues.length - 1) {
            setCurrentTask(currentTask + 1);
        }
    }
    // Toggle to go previous page in multi-tasks comfirmation popup
    function goToPreviousTask() {
        if (currentTask > 0) {
            setCurrentTask(currentTask - 1);
        }
    }

    // Create Task
    const triggerCreateTask = async() => {
        for (const task of tasksValues) {
            const roleID = getRoleIdForEmp(allRoles, task.roleID)
            task.roleID = roleID[0].roleID

            const skillSetID = getSkillIdForEmp(allSkillsets, task.skillSetID)
            task.skillSetID = skillSetID[0].skillSetID

            const timelineID = timelineValues.timeLineID
            try {
                // Create Task
                let response = await createTask (bo_UID, task, timelineID)
                // response = JSON.parse(response.body)
                // console.log("Create Task: ", response)

                if(response.message === "Task successfully created"){
                    task.taskID = response.TaskIDCreated
                    showAlert(
                        "Task Created Successfully",
                        `${task.title}`,
                        `Auto Task Allocation is In Progress`,
                        { type: 'success' }
                    );
                    
                    toggleConfirmation()
                    // Start task allocation
                    let allocationRes = await handleTaskAutoAllocation(bo_UID);
                    allocationRes = JSON.parse(allocationRes.body)
                    // console.log("Tasks Allocation: ", allocationRes)
                    if(allocationRes.message === "Auto-allocation process completed."){
                        let allAllocatedTasks = allocationRes.assignedTasks || [];
                        if(allAllocatedTasks) {
                            allAllocatedTasks = allAllocatedTasks.filter((task: any) => {
                                return task.taskID === response.TaskIDCreated
                            })
                            // console.log("Filtered task allocation: ", allAllocatedTasks)
                            setTasksNAllocationValues({
                                ...task,
                                assignedEmployees: allAllocatedTasks.map((allocation: any) => ({
                                    ...allocation,
                                    fullName: allocation.fullName,
                                    user_id: allocation.assignedTo,
                                    roleID: allocation.roleID,
                                    skillSetID: allocation.skillSetID
                                }))
                            })
                            setIsTaskAssigned(true) // Set assignation completed
                        }
                        else {
                            setIsTaskAssigned(true) // Set assignation completed
                            showAlert(
                                "Task Allocation Failed",
                                `No Employee Available Matched to The Need`,
                                ``,
                                { type: 'info' }
                            )
                        } 
                    }
                }
                if(isMobile) {
                    setTasksValues((prev: any) => 
                        prev.map((task: any) => ({
                            ...task,
                            isExpended: false
                        }))
                    )
                }
            } catch (error) {
                showAlert(
                    "triggerCreateTask",
                    `Failed to Create Task for "${task.title}"`,
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
    }

    // Update Task
    const triggerEditTask = async() => {
        // Reset not relevant input to default setup
        const updatedValue = {
            ...tasksValues[0],
            skillsetForSelect: {},
            isExpended: true,
            availableEmp: 0
        }
        const originalValues = {
            ...originalTasks[0],
            skillsetForSelect: {},
            isExpended: true,
            availableEmp: 0
        }
        // console.log("Changed Input: ", updatedValue)
        // console.log("Original Input: ", originalValues)
        // Check if the User change the input
        const isInputChange = (JSON.stringify(updatedValue) !== JSON.stringify(originalValues))
        // console.log(isInputChange)
        if(isInputChange) {
            const roleID = getRoleIdForEmp(allRoles, tasksValues[0].roleID)
            tasksValues[0].roleID = roleID[0].roleID

            const skillSetID = getSkillIdForEmp(allSkillsets, tasksValues[0].skillSetID)
            tasksValues[0].skillSetID = skillSetID[0].skillSetID

            try {
                const response = await editTask (tasksValues[0])
                // console.log(response)
                if(response?.message === 'Task details successfully updated') {
                    showAlert(
                        "Task Update Successfully",
                        `You have make changed on: `,
                        `"${tasksValues[0].title}"`,
                        { type: 'success' }
                    );
                    toggleConfirmation()

                    if(originalTasks.noOfEmp !== tasksValues[0].noOfEmp
                        || originalTasks.rolesNeeded !== roleID[0].roleName
                        || originalTasks.skillSetNeeded !== skillSetID[0].skillSetName
                    ){
                        // Start task allocation
                        let allocationRes = await handleTaskAutoAllocation(bo_UID);
                        allocationRes = JSON.parse(allocationRes.body)
                        // console.log("Tasks Allocation: ", allocationRes)
                        if(allocationRes.message === "Auto-allocation process completed."){
                            let allAllocatedTasks = allocationRes.assignedTasks || [];
                            if(allAllocatedTasks.length > 0) {
                                allAllocatedTasks = allAllocatedTasks.filter((task: any) => {
                                    return task.taskID === tasksValues[0].taskID
                                })
                                // console.log("Filtered task allocation: ", allAllocatedTasks)
                                setTasksNAllocationValues({
                                    ...tasksValues[0],
                                    assignedEmployees: allAllocatedTasks.map((allocation: any) => ({
                                        ...allocation,
                                        fullName: allocation.fullName,
                                        user_id: allocation.assignedTo,
                                        roleID: allocation.roleID,
                                        skillSetID: allocation.skillSetID
                                    }))
                                })
                                setIsTaskAssigned(true) // Set assignation completed
                                
                                if(isMobile) {
                                    setTasksValues((prev: any) => 
                                        prev.map((task: any) => ({
                                            ...task,
                                            isExpended: false
                                        }))
                                    )
                                }
                            }
                            else {
                                // setIsTaskAssigned(true) // Set assignation completed
                                showAlert(
                                    "Task Allocation Updated",
                                    `You have make changed on: `,
                                    `"${tasksValues[0].title}"`,
                                    { type: 'info' }
                                )
                                navigate(-1)

                            } 
                        }
                    }
                }
            } catch(error) {
                showAlert(
                    "triggerEditTask",
                    `Failed to Update Task for "${tasksValues[0].title}"`,
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        } else {
            showAlert(
                "No Value Update On Task",
                `You have no changed any value for: `,
                `"${tasksValues[0].title}"`,
                { type: 'info' }
            );
            toggleConfirmation();
            // navigate(-1);
        }
    }

    function handleTimelineValueChange (timelineValue: any) {
        // console.log(timelineValue)
        setTimelineValues(timelineValue)
    }
    // console.log(timelineValues)

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-create-edit-emp-completion" onClick={(e) => e.stopPropagation()}>
                <h3>
                    {isCreate ? (
                        "Confirm The Task Information"
                    ):("Confirm The Updated Task Information")}  
                </h3>
                <div className="all-create-task-confirmation">
                    <div className="all-create-task-confirmation-header">
                        <div className="task-creation-n-edit-confirmation-title">
                            <h4>Task: {tasksValues[currentTask].title}</h4>
                            {tasksValues.length > 1 && (
                                <div className="create-task-confirmation-change-task-btns-grp">
                                    <FaChevronCircleLeft 
                                        className="go-prev-icon"
                                        onClick={goToPreviousTask}
                                    />
                                    {currentTask + 1}
                                    <FaChevronCircleRight 
                                        className="go-next-icon"
                                        onClick={goToNextTask}
                                    />
                                </div>
                            )}
                        </div>
                        {timelineValues && isHavingTimeline && (
                            <p className="main-data">{timelineValues.title}</p>
                        )}
                    </div>

                    <div className="all-create-employee-data all-create-o-edit-task-data">
                        <div className="create-employee-confirmation-detail">
                            <div className="create-employee-confirmation-detail odd-row">
                                <p className="title">Task Description</p>
                                <p dangerouslySetInnerHTML={{ __html: formatTextForDisplay(tasksValues[currentTask].taskDescription) }}
                                    className="main-data"
                                />
                            </div>
                        </div>
                        <div className="create-employee-confirmation-detail">
                            <div className="create-employee-confirmation-detail">
                                <p className="title">Role</p>
                                <p className="main-data">{tasksValues[currentTask].roleID}</p>
                            </div>
                        </div>
                        <div className="create-employee-confirmation-detail">
                            <div className="create-employee-confirmation-detail odd-row">
                                <p className="title">Skillset</p>
                                <p className="main-data">{tasksValues[currentTask].skillSetID}</p>
                            </div>
                        </div>
                        <div className="create-employee-confirmation-detail">
                            <div className="create-employee-confirmation-detail">
                                <p className="title">Start Date</p>
                                <p className="main-data">
                                    {formatDisplayDateTime(tasksValues[currentTask].startDate)}
                                </p>
                            </div>
                        </div>
                        <div className="create-employee-confirmation-detail">
                            <div className="create-employee-confirmation-detail odd-row">
                                <p className="title">End Date</p>
                                <p className="main-data">
                                    {formatDisplayDateTime(tasksValues[currentTask].endDate)}
                                </p>
                            </div>
                        </div>
                        <div className="create-employee-confirmation-detail">
                            <div className="create-employee-confirmation-detail">
                                <p className="title">No Of Employees</p>
                                <p className="main-data">{tasksValues[currentTask].noOfEmp}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="btns-grp">
                    {isCreate ? ( // Create new task
                        <PrimaryButton 
                            text="Confirm" 
                            disabled={isTaskAssigned}
                            onClick={() => triggerCreateTask()}
                        />
                    ):( // Update task
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => triggerEditTask()}
                        />
                    )}
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleConfirmation()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="content create-n-edit-task-page">
            <div className="App-header create-n-edit-task-header">
                <IoArrowBack 
                    className="icons"
                    onClick={() => navigate(-1)}    
                />
                <h2>{isCreate ? "Create New " : "Edit "}Task</h2>
            </div>
            <div className="create-n-edit-task-form-container">
                <div className="create-n-edit-task-form-content">
                    {(timelineValues.timeLineID || isCreate) && (
                        <div className="create-or-view-timeline-info">
                            <label className="checkbox-container">
                                Include in project timeline
                                <input 
                                    type="checkbox" 
                                    checked={isHavingTimeline} 
                                    disabled={isTaskAssigned || !isCreate}
                                    onChange={(e) => setIsHavingTimeline(e.target.checked)}/>
                                <span className="checkmark"></span>
                            </label>
                            {isHavingTimeline && (
                                <TimelineForm 
                                    isCreateTask={isCreate}
                                    isTaskCreated={isTaskAssigned}
                                    defaultValues={timelineValues}
                                    bo_UID={bo_UID}
                                    newTimelineValue={handleTimelineValueChange}
                                />
                            )}
                        </div>
                    )}

                    {tasksValues.map((task, index) => (
                        <div key={index}>
                            <h4 className="tasks-creation-n-edition-header">
                                {task.title 
                                    ? <>{task.title}</> 
                                    : <>Task {index + 1}</>
                                } 
                                <div className="btns-grp">
                                    {task.isExpended 
                                        ? (<FaChevronCircleUp 
                                                onClick={() => toggleExpendTask(index)}
                                                className="tasks-creation-n-edition-header-icon"
                                            />)
                                        : (<FaChevronCircleDown 
                                                onClick={() => toggleExpendTask(index)}
                                                className="tasks-creation-n-edition-header-icon"
                                            />)
                                    }
                                    {tasksValues.length > 1 && 
                                        <FaMinusCircle 
                                            onClick={() => handleRemoveTask(index)}
                                            className="tasks-creation-n-edition-header-icon"
                                        />
                                    }
                                </div>
                            </h4>
                            {task.isExpended && (
                                <div className="tasks-creation-n-edition-form">
                                    {/* Input Task Title */}
                                    <div className='forms-input'>
                                        <strong>
                                            Task Title <span style={{ color: 'red' }}>*</span>
                                        </strong>
                                        <input type='text' 
                                            name='title'
                                            placeholder='Task Title' 
                                            value={task.title}
                                            onChange={(e) => handleInputChange(index, e)}
                                            disabled={isTaskAssigned}
                                            required
                                        />
                                    </div>
                                    {/* Input Task Description */}
                                    <div className='forms-input'>
                                        <strong>
                                            Task Description <span style={{ color: 'red' }}>*</span>
                                        </strong>
                                        <textarea name='taskDescription'
                                            maxLength={500}
                                            rows={4}
                                            placeholder='Task Description' 
                                            value={task.taskDescription}
                                            onChange={(e) => handleInputChange(index, e)}
                                            disabled={isTaskAssigned}
                                            required
                                        />
                                    </div>
                                    {/* Role Needed */}
                                    <div className='forms-input'>
                                        <strong>
                                            Required Role <span style={{ color: 'red' }}>*</span>
                                        </strong>
                                        <div className="fields">
                                            {/* Role dropdown */}
                                            <select 
                                                name="roleID"
                                                value={task.roleID}
                                                onChange={(e) => handleInputChange(index, e)}
                                                disabled={isTaskAssigned}
                                            >
                                                {allRoles.map((role:any) => (
                                                <option key={role.roleID} value={role.roleName}>
                                                    {role.roleName}
                                                </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Skillsets Needed */}
                                    <div className='forms-input'>
                                        <strong>
                                            Required Skillsets <span style={{ color: 'red' }}>*</span>
                                        </strong>
                                        {/* Skillsets dropdown */}
                                        <select 
                                            name="skillSetID"
                                            value={task.skillSetID}
                                            onChange={(e) => handleInputChange(index, e)}
                                            disabled={isTaskAssigned}
                                        >
                                            {task.skillsetForSelect.map((skill:any) => (
                                            <option key={skill.skillSetID} value={skill.skillSetName}>
                                                {skill.skillSetName}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Task Start */}
                                    <div className='forms-input'>
                                        <strong>
                                            Start Date Time <span style={{ color: 'red' }}>*</span>
                                        </strong>
                                        <input type='datetime-local' 
                                            name='startDate'
                                            placeholder='Task Description' 
                                            value={task.startDate}
                                            onChange={(e) => handleInputChange(index, e)}
                                            min={generateSGDateTimeForDateTimeInput(new Date()) || ''}
                                            max={task.endDate}
                                            disabled={isTaskAssigned}
                                            required
                                        />
                                    </div>
                                    {/* Task End */}
                                    <div className='forms-input'>
                                        <strong>
                                            End Date Time <span style={{ color: 'red' }}>*</span>
                                        </strong>
                                        <input type='datetime-local' 
                                            name='endDate'
                                            placeholder='Task Description' 
                                            value={task.endDate}
                                            onChange={(e) => handleInputChange(index, e)}
                                            min={task.startDate}
                                            disabled={isTaskAssigned}
                                            required
                                        />
                                    </div>
                                    <div className="create-task-button">
                                        {/* Number of Employee */}
                                        <div className='forms-input'>
                                            <strong>
                                                No.of Employee <span style={{ color: 'red' }}>*</span>
                                            </strong>
                                            <input type='number' 
                                                name='noOfEmp'
                                                placeholder='No of employee needed' 
                                                value={task.noOfEmp}
                                                onChange={(e) => handleInputChange(index, e)}
                                                min={0}
                                                max={task.availableEmp}
                                                className="no-of-emp-input"
                                                disabled={isTaskAssigned}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {isCreate 
                                     && index + 1 === tasksValues.length // If current task is last task
                                     // If current having a timeline (a timeline value selected)
                                     && timelineValues 
                                     && isHavingTimeline
                                     && (
                                        <div 
                                            className="tasks-creation-add-more-task"
                                            onClick={handleAddMoreTask}
                                        >
                                            <p>Add More Task ...</p>
                                            <FaPlusCircle
                                                className="tasks-creation-add-more-task-icon" 
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="create-n-edit-task-btns-grp">
                        {error && (
                            <span className='error-message'>
                                <GoAlertFill className="error-message-icon"/> 
                                <span className='error-message-text'>{error}&nbsp;</span>
                            </span>
                        )}
                        {isCreate ? (
                            <PrimaryButton 
                                text="Create Task"
                                onClick={() => toggleConfirmation()}
                                disabled={isTaskIncomplete() || error !== ''}
                            />
                        ):(
                            <PrimaryButton 
                                text="Update Task"
                                onClick={() => toggleConfirmation()}
                                disabled={isTaskIncomplete() || error !== ''}
                            />
                        )}
                    </div>
                </div>
                {isTaskAssigned && tasksNAllocationValues && (
                    <div className="task-assignation-detail-container">
                        <TaskAssignationInfo 
                            bo_UID={bo_UID} 
                            tasksNAllocationValues={tasksNAllocationValues}
                            isCreate={isCreate}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
////////////////////////////////////////////////////////////////////////////////////////////
interface TaskAssignationInfoProps {
    bo_UID: number;
    tasksNAllocationValues: any;
    isCreate: boolean;
}
const TaskAssignationInfo = ({
    bo_UID, tasksNAllocationValues, isCreate
} : TaskAssignationInfoProps) => {
    // console.log(tasksNAllocationValues)
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const [ allTaskWithAvailableEmps, setAllTaskWithAvailableEmps ] = useState<any>([])
    const [ originalTasksWithAvailableEmps, setOriginalTasksWithAvailableEmps ] = useState<any>([])
    useEffect(() => {
        setOriginalTasksWithAvailableEmps(allTaskWithAvailableEmps)
    }, [allTaskWithAvailableEmps])
    const fetchAllEmployee = async() => {
        // Force task become array for single task created
        const arrayTasks = [tasksNAllocationValues]
        // console.log('fetchAllEmployee')
        for(const task of arrayTasks) {
            // console.log(task)
            try {
                let employees = await getAvailableEmployees(task.roleID, task.skillSetID, bo_UID)
                employees = employees.availableEmployees || []
                // console.log(employees)

                if(task.assignedEmployees.length > 0){
                    // Set allocated task detail to same data returned in employees
                    let initialSelection = task.assignedEmployees.map((emp:any) => ({
                        fullName: emp.fullName,
                        user_id: emp.assignedTo,
                        roleID: emp.roleID,
                        skillSetID: emp.skillSetID
                    }))

                    // console.log("Initial selection: ", initialSelection)
                    // Merging if available employees are not empty
                    employees = [
                        ...initialSelection,
                        ...employees
                    ]
                    // console.log("With initial selection: ", employees) 
                    employees = employees.filter((employee: any, index: number, self: any[]) => 
                        index === self.findIndex((e: any) => (
                            e.user_id === employee.user_id
                        ))
                    );
                    // console.log("Removed duplicate: ", employees) 

                    setAllTaskWithAvailableEmps((prevData: any) => [
                        ...prevData,
                        {
                            ...tasksNAllocationValues,
                            selectedEmp: initialSelection,
                            availableEmps: employees
                        }
                    ])
                }
            } catch(error) {
                showAlert(
                    "fetchAllEmployee",
                    `Failed to Fetch Employee Detail`,
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
        
    }
    useEffect(() => { fetchAllEmployee() }, [bo_UID, tasksNAllocationValues])
    // useEffect(() => { console.log(allTaskWithAvailableEmps) }, [allTaskWithAvailableEmps])

    const toggleEmployeeSelection = (index: number, employee: any) => {
        // console.log(index, employee)
        setAllTaskWithAvailableEmps((prev: any) => 
            prev.map((task: any, i: number) => {
                if (i === index) {
                    // Check if employee is already selected
                    const isSelected = task.selectedEmp.some((emp: any) => 
                        emp.user_id === employee.user_id
                    );
                    // console.log("Is the employee selected: ", isSelected)
                    // console.log("initial selection: ", task.selectedEmp)

                    // Toggle selection
                    let updatedSelectedEmp = []
                    if(isSelected) {
                        updatedSelectedEmp = task.selectedEmp.filter((emp: any) => emp.user_id !== employee.user_id)
                        // console.log("Remove employee selected: ", updatedSelectedEmp)
                    }
                    else {
                        // If the selected emp is more than no of emp required for a task
                        if(task.selectedEmp.length >= task.noOfEmp) {
                            updatedSelectedEmp = [...task.selectedEmp] // keep original selection only
                            showAlert(
                                "Task Assignment Limit",
                                `"${task.title}" requires ${task.noOfEmp} employee(s)`,
                                `You selected ${task.selectedEmp.length}. Please adjust your selection.`,
                                { type: 'warning' }
                            );
                        } else {
                            // Update employee selection
                            updatedSelectedEmp = [...task.selectedEmp, employee];
                            // console.log([...task.selectedEmp, employee])
                        }
                    }

                    // Return updated task with modified selectedEmp
                    return {
                        ...task,
                        selectedEmp: updatedSelectedEmp
                    };
                }
                return task; // Return the other task that is not changed
            })
        )
    };
    // Select all available employees for a task
    const selectAllMatched = (index: number) => {
        // console.log(index)
        setAllTaskWithAvailableEmps((prev: any) => 
            prev.map((task: any, i: number) => {
                // console.log(task)
                if(i === index) {
                    // Limit the select all from 1st available employees to x number of employees
                    const limitedSelection = task.availableEmps.slice(0, task.noOfEmp)
                    return {
                        ...task,
                        selectedEmp: limitedSelection
                    }
                }
                // return original task if current task is not index
                return task
            })
        )
    };
    // Clear all selected employee for a task
    const clearAllSelections = (index: number) => {
        setAllTaskWithAvailableEmps((prev: any) => 
            prev.map((task: any, i: number) => {
                if(i === index) {
                    return {
                        ...task,
                        selectedEmp: []
                    }
                }
                // return original task if current task is not index
                return task
            })
        )
    };
    // Check if all the task selected correct number of employee
    function isAllTaskSelectedTrueNoOfEmp() {
        if(isCreate)
            return allTaskWithAvailableEmps.some((task: any) => 
                task.selectedEmp.length < task.noOfEmp
            );
        return allTaskWithAvailableEmps.some((task: any) => 
            task.selectedEmp.length < task.noOfEmp - 1
        );
    }

    const triggerSubmitConfirmAllocation = async() => {
        for (const task of allTaskWithAvailableEmps) {
            try {
                task.selectedEmp.map(async(allocation: any, index: number) => {
                    let response = await handleManualUpdateTaskAllocation(
                        allocation.user_id, task.assignedEmployees[index].taskAllocationID, 
                        task.title
                    )
                    // console.log(response)
                    if(response.message === 'Employee has been reassigned successfully')
                        showAlert(
                            "Task Created Created",
                            `${task.title} was created and allocated`,
                            ``,
                            { type: 'success' }
                        );
                    else
                        showAlert(
                            "Task Created Created",
                            `${task.title} was created and allocated base on system allocation`,
                            ``,
                            { type: 'success' }
                        );
                })
            } catch(error) {
                showAlert(
                    "triggerSubmitConfirmAllocation",
                    `Failed to Update Allocation Confirmation`,
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
        navigate(-1)
    }

    return (
        <>
        {allTaskWithAvailableEmps.length > 0 ? (
            <>
            {allTaskWithAvailableEmps.map((task: any, index: number) => (
                <div className="task-assignation-container" key={index}>
                    <h4 className="tasks-creation-n-edition-header">
                        {task.title} is Allocated To: 
                    </h4>
                    <div className="task-assignation-detail-content">
                        {/* Multi-select dropdown container */}
                        <div className="multiselect-dropdown-container">
                            {/* Dropdown header with search and buttons */}
                            <div className="dropdown-header">
                                <input 
                                    type="text" 
                                    placeholder="Search employees..."
                                />
                                <div className="dropdown-buttons">
                                    <PrimaryButton
                                        text="Select All Matched"
                                        onClick={() => selectAllMatched(index)}
                                    />
                                    <SecondaryButton 
                                        text="Clear All"
                                        onClick={() => clearAllSelections(index)}
                                    />
                                </div>
                            </div>

                            {/* Selected employee display */}
                            <div className="selected-items">
                                {task.selectedEmp.map((employee:any) => (
                                    <span key={employee.user_id} className="selected-tag">
                                        {employee.fullName}
                                        <span 
                                            className="remove-tag"
                                            onClick={() => toggleEmployeeSelection(index, employee)}
                                        >
                                            ×
                                        </span>
                                    </span>
                                ))}
                                <span className="no-of-selected-emp">{task.selectedEmp.length}</span>
                            </div>

                            {/* Dropdown options */}
                            <div className="dropdown-options">
                                {task.availableEmps.map((employee:any) => {
                                    const isSelected = task.selectedEmp.some(
                                        (emp:any) => emp.user_id === employee.user_id
                                    );
                                    
                                    return (
                                        <div 
                                            key={employee.user_id}
                                            className={`option matched ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleEmployeeSelection(index, employee)}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                readOnly
                                            />
                                            <span className="employee-name">
                                                {employee.fullName}
                                                {/* {isMatched && <span className="matched-badge">Matched</span>} */}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="btn-grp">
                <span>The auto allocation is auto saved even you exit this page</span>
                {isCreate ? (
                    <PrimaryButton 
                        text="Confirm Allocation"
                        disabled={isAllTaskSelectedTrueNoOfEmp()}
                        onClick={() => triggerSubmitConfirmAllocation()}
                    />
                ) : (
                    <PrimaryButton 
                        text="Confirm Allocation"
                        disabled={isAllTaskSelectedTrueNoOfEmp()}
                        onClick={() => triggerSubmitConfirmAllocation()}
                    />
                )}
                
            </div>
            </>
        ) : (
            <p>No task's allocations available.</p>
        )}
        </>
    )
}

export default CreateEditTask