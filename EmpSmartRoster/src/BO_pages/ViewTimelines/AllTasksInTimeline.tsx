import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime, formatTextForDisplay, TASK_STATUS } from '../../controller/Variables.js'
import EventDetail from './components/TaskDetail/EventDetail'
import TimelineController from '../../controller/TimelineController.js'

import { GrSchedules } from "react-icons/gr";
import { FaCircle, IoArrowBack, FaClock } from '../../../public/Icons.js'
import './TimelinesPage.css'
import '../../../public/styles/common.css'

const { getAllTasksInATimeline } = TimelineController

const AllTasksInTimeline = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate()
    const location = useLocation();
    const { state } = location;
    // console.log(state)
    const [ allTasks, setAllTasks ] = useState<any>([])
    const [ showTaskDetail, setShowTaskDetail ] = useState(false)
    const [ taskAllocationDetail, setTaskAllocationDetail ] = useState<any>([])
    const [ selectedTask, setSelectedTask ] = useState({})
    // console.log(state.allTasks)

    const fetchTasksInTimeline = async () => {
        try {
            let tasks = await getAllTasksInATimeline(user?.UID, state?.timeline.timeLineID);
            if(tasks.message === 'Tasks retrieved successfully.') {
                tasks = tasks.timelineTasks || []
                // console.log(tasks)
                // console.log(mergedTasks)
                setAllTasks(tasks)
            }
        } catch (error) {
            showAlert(
                "fetchTasksInTimeline",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    useEffect(() => { fetchTasksInTimeline() }, [state?.timeline])

    function triggerSelectedTask(task: any) {
        setSelectedTask(task);
        setShowTaskDetail(true);
    }

    function triggerCloseSelectedTask() {
        setSelectedTask({});
        setShowTaskDetail(false);
    }

    // If no timeline
    if(!state?.timeline || !state?.allTasks) return (
        <div>
            No Timeline Data Provided
        </div>
    )

    return(
        <div className="App-content">
            <div className="content">
            {allTasks.length > 0 ? (
                <>
                <div className='App-header timeline-header'>
                    <IoArrowBack 
                        onClick={() => navigate(-1)}
                        className="icons"
                    />
                    <h1>Timeline: {state.timeline.timelineTitle}</h1>
                </div>
                <div className="App-timeline">
                    {/* Timeline Line (Vertical) */}
                    <div className="App-timeline-line"></div>

                    {/* Timeline Items */}
                    {allTasks.length > 0 && allTasks.map((task: any) => (
                        <div 
                            key={task.taskID} 
                            className="App-timeline-item"
                            onClick={() => triggerSelectedTask(task)}
                        >
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
                                <p
                                    className="App-timeline-task-description"
                                    dangerouslySetInnerHTML={{ __html: formatTextForDisplay(task.taskDescription) }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {showTaskDetail && selectedTask && (
                    <EventDetail 
                        task={selectedTask}
                        onClose={triggerCloseSelectedTask}
                    />
                )}
                </>  
            ):(
                <p>No Tasks Created for {state.timeline.timelineTitle}</p>
            )}
            </div>
        </div>
    )
}

export default AllTasksInTimeline;