import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime, formatTextForDisplay,
         TASK_STATUS } from '../../controller/Variables.js'
import { GrSchedules } from "react-icons/gr";
import TaskDetail from './components/TaskDetail';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton';
import SwapMgt from './components/SwapMgt';
import TimelineController from '../../controller/TimelineController';
import UserController from '../../controller/User/UserController';

import { FaCircle, FaClock, IoClose, FcGoogle,
         TbTarget, TbTargetArrow, CgProfile } from '../../../public/Icons.js'
import { RiSwap2Fill } from "react-icons/ri";
import './MySchedules.css'
import '../../../public/styles/common.css'

const { empGetUserProfile } = UserController
const { empGetAllTask, viewOtherTasksToSwap, submitSwapTime, 
        googleCalendarSyncEmployee, googleCalendarGetAuthEmployee} = TimelineController

const EmpViewSchedule = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const [ userProfile, setUserProfile ] = useState<any>([])
    const [ allTasks, setAllTasks ] = useState<any>([])
    const [ tasksAvailableForSwap, setTasksAvailableForSwap ] = useState<any>([])
    const [ taskSelectedForSwap, setTaskSelectedForSwap ] = useState<any>({})
    const [ taskTargetedForSwapRequest, setTaskTargetedForSwapRequest ] = useState<any>({})
    const [ reasonOfSwap, setReasonOfSwap ] = useState<string>('')
    const [ showPopupSwapReason, setShowPopupSwapReason ] = useState(false)
    const [ showTasksForSwap, setShowTasksForSwap ] = useState(false)
    const [ selectedTasks, setSelectedTasks ] = useState<any>({})
    const [ showTaskDetail, setShowTaskDetail ] = useState(false)

    const fetchAllTasks = async () => {
        try {
            let response = await empGetAllTask (user?.UID)
            // console.log(response)
            if(response.message === 'Task  successfully retrieved') {
                response = response.EmployeeTasks || []
                // console.log(response)
                setAllTasks(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    // Get employee informations
    const fetchMyProfile = async () => {
        try {
            let response = await empGetUserProfile (user?.UID)
            // console.log(response)
            if(response.message === 'Employee Profile successfully retrieved') {
                response = response || []
                // console.log(response)
                setUserProfile(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        fetchAllTasks()
        fetchMyProfile()
    }, [user])

    function toggleShowTaskDetail(task: any) {
        setSelectedTasks(task)
        setShowTaskDetail(!showTaskDetail)
    }
    // update task locally
    function handleUpdateTask(updatedTask: any) {
        const newTask = allTasks.map((task:any) => 
            task.taskID === updatedTask.taskID 
            ? updatedTask
            : task
        )
        setAllTasks(newTask)
    }

    // Fetch all other task for swap
    const triggerAvailableTasksForSwap = async(task: any) => {
        try {
            setTaskSelectedForSwap(task)
            const empData = userProfile.employeeProfile[0] || {}
            let response = await viewOtherTasksToSwap(empData.business_owner_id,
                empData.roleID, empData.skillSetID, empData.user_id
            )
            // console.log(response)
            if(response?.message === 'Employee Tasks with similar skillset and role required successfully retrieved'){
                response = response.EmployeeTaskListWithSameRequirements || []
                const filteredTaskAllocatedToSameEmp = response.filter((task: any) => {
                    return task.user_id !== user?.UID
                }) || []
                // console.log(filteredTaskAllocatedToSameEmp)
                setTasksAvailableForSwap(filteredTaskAllocatedToSameEmp)
                if(filteredTaskAllocatedToSameEmp.length > 0)
                    toggleShowTaskForSwap()
                else
                    showAlert(
                        'triggerAvailableTasksForSwap',
                        '',
                        `No other task(s) available for swap`,
                        { type: 'info' }
                    );
            }
        } catch (error) {
            showAlert(
                'triggerAvailableTasksForSwap',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    
    // Open or hide popup for other task for swap
    function toggleShowTaskForSwap() {
        setShowTasksForSwap(!showTasksForSwap)
    }

    const triggerCreateNewSwapRequest = async() => {
        try {
            const empData = userProfile.employeeProfile || {}
            // console.log(empData)
            let response = await submitSwapTime(empData[0].user_id,
                taskTargetedForSwapRequest.user_id, taskSelectedForSwap.taskID, 
                taskTargetedForSwapRequest.taskID, reasonOfSwap
            )
            // console.log(response)
            if(response.message === 'Swap Request successfully added') {
                toggleShowTaskSwapReason({})
                showAlert(
                    'Swap Time Request Submitted Successfully',
                    '',
                    `${taskSelectedForSwap.title} → ${taskTargetedForSwapRequest.title}`,
                    { type: 'info' }
                );
                toggleShowTaskForSwap()
                // setAllTasks(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    


    //check url everytime timeline-management is loaded for code 
    useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

        if (code) {
            // console.log("OAuth Code detected in URL:", code);

            const syncGoogleCalendar = async () => {
                try {
                    const result = await googleCalendarSyncEmployee({ code, user_id: user?.UID });
                    // console.log("Google Calendar Synced:", result);

                    showAlert(
                        "Google Calendar",
                        "Sync Successful",
                        "Your calendar has been connected!",
                        { type: 'success' }
                    );
                } catch (error) {
                    console.error("Google Calendar sync failed", error);
                    showAlert(
                        "Google Calendar",
                        "Sync Failed",
                        error instanceof Error ? error.message : "An unknown error occurred.",
                        { type: 'error' }
                    );
                } finally {
                    
                    const cleanUrl = window.location.origin + window.location.pathname;
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            };

            syncGoogleCalendar();
        }
    }, []);

    const handleConnectGoogleCalendar = async () => {
        try {
            const { authUrl } = await googleCalendarGetAuthEmployee();
            // console.log("authURL:",authUrl);
            window.location.href = authUrl;

        } catch (error) {
            showAlert(
                "Google Calendar Auth",
                "Failed to get auth URL",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    };

    function toggleShowTaskSwapReason(task: any) {
        setShowPopupSwapReason(!showPopupSwapReason)
        setTaskTargetedForSwapRequest(task)
    }

    if(showPopupSwapReason) return (
        <div className="App-popup" onClick={() => toggleShowTaskSwapReason({})}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm to Swap Request 
                </p>
                <div className="confirmation-detail">
                    <div className="swap-task-reason-popup-content">
                        <div className="leave-info-data leave-info-data-type-header-text">
                            <p className="title">Swapping Task</p>
                            <p className="main-data">{taskSelectedForSwap.title}&#8594;{taskTargetedForSwapRequest.title}</p>
                        </div>
                        <div className="orginal-start-end-vs-swapped-start-end">
                            <div className="swapped-start-end card">
                                <h4>Current Task Duration:</h4>
                                <div className="start-date-detail">
                                    <p className="title">Start Date:</p>
                                    <div className="start-date-detail-data">
                                        <div className="event-detail-date-display">
                                            <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                            <p className="main-data">{formatDisplayDateTime(taskSelectedForSwap.startDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="end-date-detail">
                                    <p className="title">End Date:</p>
                                    <div className="end-date-detail-data">
                                        <div className="event-detail-date-display">
                                            <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                            <p className="main-data">{formatDisplayDateTime(taskSelectedForSwap.endDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="swapped-start-end card">
                                <h4>Selected Swap Task Duration:</h4>
                                <div className="start-date-detail">
                                    <p className="title">Start Date:</p>
                                    <div className="start-date-detail-data">
                                        <div className="event-detail-date-display">
                                            <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                            <p className="main-data">{formatDisplayDateTime(taskTargetedForSwapRequest.startDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="end-date-detail">
                                    <p className="title">End Date:</p>
                                    <div className="end-date-detail-data">
                                        <div className="event-detail-date-display">
                                            <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                            <p className="main-data">{formatDisplayDateTime(taskTargetedForSwapRequest.endDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="App-filter-container uen-company-name">
                            <input type='text' 
                                className='reason-input'
                                placeholder='Description' 
                                onChange={(e) => setReasonOfSwap(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => triggerCreateNewSwapRequest()}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleShowTaskSwapReason({})}
                    />
                </div>
            </div>
        </div>
    )

    if(showTasksForSwap) return (
        <div className="App-popup" onClick={toggleShowTaskForSwap}>
            <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="App-header">
                    <h1>Other Available Tasks for Swap</h1>
                    <IoClose className='icons' onClick={toggleShowTaskForSwap}/>
                </div>
                <div className="other-tasks-for-swap-container">
                    <div className="App-timeline">
                        {/* Timeline Line (Vertical) */}
                        <div className="App-timeline-line"></div>
                        {tasksAvailableForSwap.map((task: any) => (
                            <div key={task.taskID} className="App-timeline-item">
                                {/* Timeline Point (Icon) */}
                                <div className="App-timeline-point">
                                    <GrSchedules className="App-timeline-icon" />
                                </div>

                                {/* Timeline Content */}
                                <div className="App-timeline-content">
                                    <div className='App-timeline-task-title-container'>
                                        <div className='App-timeline-task-title'>
                                            <FaCircle 
                                                className={`task-status
                                                            ${task.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                            ${task.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                                style={{ fontSize: '12px', minWidth: '12px', minHeight: '12px' }}
                                            />
                                            <h3 className="App-timeline-task-title">{task.title}</h3>
                                        </div>
                                        <div className="App-timeline-start-and-end">
                                            <p className="App-timeline-time">
                                                <strong>Start</strong><FaClock/>
                                                {formatDisplayDateTime(task.startDate)}
                                            </p>
                                            <p className="App-timeline-time">
                                                <strong>End</strong><FaClock/>
                                                {formatDisplayDateTime(task.endDate)}
                                            </p>
                                        </div>

                                    </div>
                                    <hr className="App-timeline-divider" />
                                    <p className="App-timeline-task-description task-for-swap-allocated-to">
                                        <CgProfile />{task.fullName}
                                    </p>
                                    <p
                                        className="App-timeline-task-description"
                                        dangerouslySetInnerHTML={{ __html: formatTextForDisplay(task.taskDescription) }}
                                    />
                                    <div 
                                        className='emp-timeline-button-container'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        
                                        <button 
                                            className="primary-button"
                                            onClick={() => toggleShowTaskSwapReason(task)}
                                        >
                                            <RiSwap2Fill className='primary-button-icon'/>
                                            Swap
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    return(
        <>
        <div className="App-content">
            <div className="content">
                <div className="my-schedule-page-header">
                    <h1>My Schedules</h1>
                    <button 
                        className='sync-google-calendar-button primary-button'
                        onClick={handleConnectGoogleCalendar} 
                        style={{ marginRight: '1rem' }}
                    >
                        <FcGoogle className='google-calenar-icon'/>Sync My Schedule 
                    </button>
                </div>
                <div className="App-timeline">
                    {/* Timeline Line (Vertical) */}
                    <div className="App-timeline-line"></div>
                    {/* Timeline Items */}
                    {allTasks.length > 0 && allTasks.map((task: any) => (
                        <div key={task.taskID} className="App-timeline-item">
                            {/* Timeline Point (Icon) */}
                            <div className="App-timeline-point">
                                <GrSchedules className="App-timeline-icon" />
                            </div>

                            {/* Timeline Content */}
                            <div 
                                className="App-timeline-content"
                                onClick={() => toggleShowTaskDetail(task)}
                            >
                                <div className='App-timeline-task-title-container'>
                                    <div className='App-timeline-task-title'>
                                        <FaCircle 
                                            className={`task-status
                                                        ${task.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                        ${task.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                            style={{ fontSize: '12px', minWidth: '12px', minHeight: '12px' }}
                                        />
                                        <h3 className="App-timeline-task-title">{task.title}</h3>
                                    </div>
                                    <div className="App-timeline-start-and-end">
                                        <p className="App-timeline-time">
                                            <strong>Start</strong><FaClock/>
                                            {formatDisplayDateTime(task.startDate)}
                                        </p>
                                        <p className="App-timeline-time">
                                            <strong>End</strong><FaClock/>
                                            {formatDisplayDateTime(task.endDate)}
                                        </p>
                                    </div>
                                </div>
                                <hr className="App-timeline-divider" />
                                <p
                                    className="App-timeline-task-description"
                                    dangerouslySetInnerHTML={{ __html: formatTextForDisplay(task.taskDescription) }}
                                />
                                <div 
                                    className='emp-timeline-button-container'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {!task.timelineID && (
                                        <button 
                                            className="primary-button"
                                            onClick={() => triggerAvailableTasksForSwap(task)}
                                        >
                                            <RiSwap2Fill className='primary-button-icon'/>
                                            Request Swap
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <SwapMgt />
        </div>
        {showTaskDetail && selectedTasks && (
            <TaskDetail 
                task={selectedTasks}
                onClose={() => toggleShowTaskDetail({})}
                onUpdate={handleUpdateTask}
            />
        )}
        </>
    )
}

export default EmpViewSchedule