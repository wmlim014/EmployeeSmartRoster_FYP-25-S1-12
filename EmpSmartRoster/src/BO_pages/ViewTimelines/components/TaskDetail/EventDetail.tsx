import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert  } from '../../../../components/PromptAlert/AlertContext';
import { useAuth } from '../../../../AuthContext';
import PrimaryButton from '../../../../components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../../components/SecondaryButton/SecondaryButton';
import MoreDetail from './MoreDetail';
import AllocatedStaffDetail from './AlloctedStaffDetail';
import CreateOEditTask from '../CreateOEdit/CreateOEdit';
import { TASK_STATUS,formatDateTime, formatDisplayDateTime,
         formatTextForDisplay } from '../../../../controller/Variables.js';
import TimelineController from '../../../../controller/TimelineController.js';

import { IoClose, CgProfile, FaCircle, TbTarget, FaClipboardList,
         TbTargetArrow, TiTime } from '../../../../../public/Icons.js';
import './EventDetail.css'
import '../../../../../public/styles/common.css'

interface EventDetailProps {
    task: any;
    allTasks?: any
    onTaskUpdate?: (updatedData: any) => void;
    onDelete?: (deletedTaskId: number) => void;
    onClose?: () => void;
}

const { boGetTaskDetail, deleteTaskDetail, getTimelines, getTimelineSelected } = TimelineController;

const EventDetail = ({task, allTasks, onDelete, onClose}: EventDetailProps) => {
    // console.log(task)
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const isInTimeline = location.pathname.includes('timeline-tasks-list')
    const [ containedTimeline, setContainedTimeline ] = useState<any>([])
    const [ allTaskDetail, setAllTaskDetail ] = useState<any>([])
    const [ taskDetail, setTaskDetail ] = useState<any>([])
    const [ showDeleteTask, setShowDeleteTask ] = useState(false)
    const [ showSeeMoreDetail, setShowSeeMoreDetail ] = useState(false)
    const triggerCloseSeeMoreDetailOutsite = useRef<HTMLDivElement>(null);
    const [ showAllocatedDetail, setShowAllocatedDetail ] = useState(false)
    const triggerCloseAllocatedDetailOutsite = useRef<HTMLDivElement>(null);
    const [ allocatedStaff, setAllocatedStaff ] = useState<any>([])

    const fetchTaskDetail = async () => {
        try {
            let taskDetail = await boGetTaskDetail(task.taskID);
            // console.log(taskDetail)
            if(taskDetail.message === "Task details successfully retrieved"){
                taskDetail = taskDetail.taskDetails || []
                // console.log(taskDetail)
                
                if(taskDetail.length > 0) {
                    for(let i = 0; i < taskDetail.length; i++){
                        // Convert task start time to Singapore time
                        const startTime = taskDetail[i].startDate;
                        taskDetail[i].startDate = formatDisplayDateTime(startTime).split(' ')
                        
                        // Convert task start time to Singapore time
                        const endTime = taskDetail[i].endDate;
                        taskDetail[i].endDate = formatDisplayDateTime(endTime).split(' ')
                    }
                    setAllTaskDetail(taskDetail)
                    // console.log(taskDetail)
                    setTaskDetail(taskDetail[0]);
                }
            }
        } catch (error) {
            showAlert(
                "fetchTaskDetail",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    useEffect(() => { 
        if (task && task.taskID) {
            // console.log("Fetching Task Detail:", task.taskID);
            fetchTaskDetail();
        } else {
            console.log("Task not available:", task);
        }
    }, [task])

    const fetchAllTimelines = async() => {
        if(allTaskDetail[0]){
            try {
                let response = await getTimelines(user?.UID);
                if (response.message === 'Timeline retrieved successfully.'){
                    response = response.timeline || [];
                    // console.log(response)
                    const timeline = await getTimelineSelected(response, allTaskDetail[0].timelineID)
                    // console.log(timeline)
                    setContainedTimeline([timeline])
                }
            } catch(error) {
                showAlert(
                    "fetchAllTimelines",
                    "Fetch data error",
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                )
            }
        }
    }
    // Auto trigger if having 
    useEffect(() => {
        fetchAllTimelines()
    }, [allTaskDetail])

    // Close allocated staff detail when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (triggerCloseAllocatedDetailOutsite.current && !triggerCloseAllocatedDetailOutsite.current.contains(event.target as Node)) {
                setShowAllocatedDetail(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    function toggleShowAllocationDetail (
        email:string, allocatedTime: string, hpNo: number, jobTitle: string
    ) {
        // console.log(allocatedTime)
        setAllocatedStaff({
            jobTitle: jobTitle,
            email: email,
            hpNo: hpNo, 
            allocatedTime: formatDateTime(allocatedTime).split(' ')
        })
        setShowAllocatedDetail(!showAllocatedDetail)
    }
    // useEffect(() => {console.log(showAllocatedDetail)}, [showAllocatedDetail])


    // Close see more task detail when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (triggerCloseSeeMoreDetailOutsite.current && !triggerCloseSeeMoreDetailOutsite.current.contains(event.target as Node)) {
            setShowSeeMoreDetail(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function toggleShowMoreTaskDetail() {
        setShowSeeMoreDetail(!showSeeMoreDetail);
    }
    // useEffect(() => {console.log(showSeeMoreDetail)}, [showSeeMoreDetail])

    // Delete Task
    function toggleShowDelete () {
        if (showDeleteTask === false)
            setShowDeleteTask(true)
        else
            setShowDeleteTask(false)
    }

    const triggerDeleteTask = async() => {
        try {
            const response = await deleteTaskDetail(taskDetail.taskID);
            
            showAlert(
                `${taskDetail.title}`,
                "",
                `${response.message}`,
                { type: 'success' }
            )

            // Pass delete detail
            if(onDelete)
                onDelete(taskDetail.taskID)

            // Close task detail
            if(onClose)
                onClose()

        } catch(error) {
            showAlert(
                "confirmDeleteTask",
                `${taskDetail.title} Failed to Delete`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    if (showDeleteTask) return (
        <div className="App-popup" onClick={toggleShowDelete}>
            <div className='App-popup-prompt-content' onClick={(e) => e.stopPropagation()}>
                <p className='App-prompt-confirmation-title App-header'>Confirm to Delete the Task Detail for:</p>
                <p className="App-prompt-confirmation-title-highlighted-text">{taskDetail.title}</p>
                
                <div className="btns-grp">
                    <PrimaryButton 
                        text='Confirm'
                        onClick={() => triggerDeleteTask()}
                    />
                    <SecondaryButton 
                        text='Cancel'
                        onClick={() => toggleShowDelete()}
                    />
                </div>
            </div>
        </div>
    )

    function redirectToTimelineTasksDetail() {
        navigate('/timeline-tasks-list', {
            state: {
                timeline: containedTimeline[0], 
                allTasks: allTasks,
            }
        })
    }

    return(
        <>
        {allTaskDetail.length > 0 && (
            <div className="App-popup" onClick={onClose}>
                <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                    <div className="App-header">
                        <h1>{taskDetail.title}</h1>
                        <div className="event-detail-header-btns-grp">
                            {allTaskDetail.length > 0 && (
                                <CreateOEditTask 
                                    isCreate={false}
                                    selectedTaskTimeline={containedTimeline}
                                    allTasksAllocation={allTaskDetail}
                                />
                            )}
                            <IoClose className='icons' onClick={onClose}/>
                        </div>
                    </div>

                    {containedTimeline.length > 0 && (
                        <button 
                            className={`task-detail-contained-timeline
                                ${isInTimeline ? 'disabled' : ''}
                            `}
                            onClick={redirectToTimelineTasksDetail}
                            disabled={isInTimeline}
                        >
                            <p className='title'>Timeline: </p>
                            <p className='main-data'>{containedTimeline[0].timelineTitle}</p>
                        </button>
                    )}

                    <div className="task-allocation-detail">
                        <h3>Task Allocation's Detail</h3>
                        <div className={`allocated-staff-info ${showAllocatedDetail ? 'active' : ''}`}
                            ref={triggerCloseAllocatedDetailOutsite}
                        >
                            <div className="allocated-staff-detail-title">
                                <CgProfile className='App-popup-content-icon'/>
                                {allTaskDetail.length > 1 ? (
                                    <div className='allocated-staff-container'>
                                    {allTaskDetail.map((detail: any, index: number) => (
                                        <p key={index}
                                            onClick={() => toggleShowAllocationDetail(
                                                detail.email, detail.createdOn, 
                                                detail.hpNo, detail.jobTitle
                                            )}
                                            className='allocated-staff-container-title'
                                        >
                                            {detail.fullName}
                                            <FaCircle 
                                                className={`task-allocated-status
                                                            ${detail.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                            ${detail.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                            />
                                            {/* {index < allTaskDetail.length - 1 && ","} */}
                                        </p>
                                    ))}
                                    </div>
                                    ) : (
                                        <p onClick={() => toggleShowAllocationDetail(
                                                taskDetail.email, taskDetail.createdOn, 
                                                taskDetail.hpNo, taskDetail.jobTitle
                                            )}
                                            className='allocated-staff-container-title'
                                        >
                                            {taskDetail.fullName || "Unassigned"}
                                            <FaCircle 
                                                className={`task-allocated-status
                                                            ${taskDetail.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                            ${taskDetail.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                            />
                                        </p>
                                    )}
                                </div>
                                <div className="allocated-staff-detail-content">
                                    <AllocatedStaffDetail
                                        allocatedStaff = {allocatedStaff}
                                    />
                                </div>
                        </div>
                    </div>

                    <div className="task-detail-information">
                        <div className="task-detail-info-title">
                            <h3>Task's Detail</h3>
                            {/* See More Detail */}
                            <div className={`see-more-task-detail ${showSeeMoreDetail ? 'active' : ''}`}
                                    ref={triggerCloseSeeMoreDetailOutsite}
                            >
                                <SecondaryButton 
                                    text='See More'
                                    onClick={() => toggleShowMoreTaskDetail()}
                                />
                                <div className="see-more-task-detail-content">
                                    <MoreDetail
                                        roleID = {taskDetail.rolesNeeded}
                                        skillID = {taskDetail.skillSetNeeded}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Task description */}
                        <div className="task-detail-description">
                            <FaClipboardList className='App-popup-content-icon task-detail-description-icon'/>
                            <p className="main-data"
                                dangerouslySetInnerHTML={{ __html: formatTextForDisplay(taskDetail.taskDescription) }}
                            />
                        </div>
                        {taskDetail?.startDate?.length === 2 && (
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.startDate[0]}</p>
                                </div>
                                <div className="event-detail-time-display">
                                    <TiTime className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.startDate[1].split('.')[0]}</p>
                                </div>
                            </div>
                        </div>
                        )}
                        {taskDetail?.endDate?.length === 2 && (
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.endDate[0]}</p>
                                </div>
                                <div className="event-detail-time-display">
                                    <TiTime className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.endDate[1].split('.')[0]}</p>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                    
                    <div className="event-button-group">
                        <SecondaryButton 
                            text='Delete Task'
                            onClick={() => toggleShowDelete()}
                        />
                    </div>
                </div>
            </div>
        )}
        </>
        
    )
}

export default EventDetail