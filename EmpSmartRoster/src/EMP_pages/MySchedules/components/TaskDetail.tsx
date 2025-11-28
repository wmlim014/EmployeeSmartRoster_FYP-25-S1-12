import { useAuth } from '../../../AuthContext'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton.js';
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton.js';
import { formatDateTime, formatDisplayDateTime, formatTextForDisplay,
         TASK_STATUS } from '../../../controller/Variables.js'
import TimelineController from '../../../controller/TimelineController.js';

import { IoClose, HiMiniViewfinderCircle, TbTarget, FaClipboardList,
         TbTargetArrow, TiTime, FaCircle } from '../../../../public/Icons.js';
import '../MySchedules.css'
import '../../../../public/styles/common.css'
import { useState } from 'react';

interface TaskDetailProps {
    task: any;
    onUpdate?: (updatedTask: any) => void;
    onClose?: () => void;
}

const { empUpdateTaskProgress } = TimelineController

const TaskDetail = ({task, onClose, onUpdate}: TaskDetailProps) => {
    // console.log(task)
    const { showAlert } = useAlert()
    const { user } = useAuth()
    // Pre-set datime
    const taskDetail = {
        ...task,
        createdOn: formatDateTime(task.createdOn).split(' '),
        startDate: formatDisplayDateTime(task.startDate).split(' '),
        endDate: formatDisplayDateTime(task.endDate).split(' '),
        lastModifiedAt: formatDateTime(task.lastModifiedAt).split(' ')
    }
    // console.log(taskDetail)
    const [ showUpdate, seShowUpdate ] = useState(false)
    const [ status, setStatus ] = useState<string>(task.status)

    const triggereUpdateTaskProgress = async () => {
        try {
            let response = await empUpdateTaskProgress (user?.UID, taskDetail.taskID, status)
            // console.log(response)
            if(response.message === 'Task status successfully updated') {
                const updatedTask = {
                    ...task,
                    status: status
                }
                if(onUpdate)
                    onUpdate(updatedTask)

                toggleShowUpdate()

                if(onClose)
                    onClose()
            }
        } catch (error) {
            showAlert(
                'triggereUpdateTaskProgress',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function toggleShowUpdate() {
        // console.log('toggle show')
        seShowUpdate(!showUpdate)
    } 

    if(showUpdate) return (
        <div className="App-popup" onClick={toggleShowUpdate}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm to Update Task Progress
                </p>
                <div className="confirmation-detail">
                    <div className="App-filter-container">
                        <p className='App-filter-title'>Reg.Request Status</p>
                        <select 
                            value={status}
                            onChange={(e) => {
                                // console.log("Target value: ", e.target.value)
                                setStatus(e.target.value);
                            }}
                        >
                            {TASK_STATUS.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => triggereUpdateTaskProgress()}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleShowUpdate()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="App-popup" onClick={onClose}>
            <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                <div className="App-header">
                    <h1>{task.title}</h1>
                    <IoClose className='icons' onClick={onClose}/>
                </div>
                <div className="emp-task-detail-content">
                    <div className="task-detail-description">
                        <FaClipboardList className='App-popup-content-icon task-detail-description-icon'/>
                        <p 
                            className="main-data"
                            dangerouslySetInnerHTML={{ __html: formatTextForDisplay(task.taskDescription) }}
                        />
                    </div>
                    <div className="allocation-date-detail-container">
                        <div className="event-detail-date-display">
                            <FaCircle 
                                className={`task-status
                                            ${task.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                            ${task.status === TASK_STATUS[2] ? 'completed' : ''}`}
                            />
                            <p className="title">Allocated Date:</p>
                        </div>
                        <div className="start-date-detail-data">    
                            <div className="event-detail-date-display">
                                <HiMiniViewfinderCircle className='App-popup-content-icon task-detail-description-icon'/>
                                <p className="main-data">{taskDetail.createdOn[0]}</p>
                            </div>
                            <div className="event-detail-time-display">
                                <TiTime className='App-popup-content-icon task-detail-description-icon'/>
                                <p className="main-data">{taskDetail.createdOn[1]}</p>
                            </div>
                        </div>
                    </div>
                    <div className="emp-view-task-detail-start-n-end">
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.startDate[0]}</p>
                                </div>
                                <div className="event-detail-time-display">
                                    <TiTime className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.startDate[1]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.endDate[0]}</p>
                                </div>
                                <div className="event-detail-time-display">
                                    <TiTime className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{taskDetail.endDate[1]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {task.status !== TASK_STATUS[2] && (
                    <div className="btns-grp">
                        <PrimaryButton 
                            text='Update Progress'
                            onClick={() => toggleShowUpdate()}
                        />
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default TaskDetail